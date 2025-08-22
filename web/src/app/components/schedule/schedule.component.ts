import { Component, computed, inject, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AppointmentService } from '../../services/common/appointment.service';
import { v4 as uuid } from 'uuid';
import { CommonModule } from '@angular/common';
import { Appointment } from '../../models/appointment.model';
import { toSignal } from '@angular/core/rxjs-interop';
import { map, startWith } from 'rxjs/operators';
import {
  SERVICES,
  ServiceItem,
  ServiceCategory,
} from '../../models/services.model';
import { AuthService } from '../../services/common/auth.service';
import { User } from '../../models/auth.model';
import { Subscription } from 'rxjs';

const SLOT_MIN = 10;
const BUFFER_MIN = 10;
const WORK_START = 10 * 60; // 10:00 → 600
const WORK_END = 18 * 60; // 18:00 → 1080

function toMinutes(t: string): number {
  const [h, m] = t.split(':').map(Number);
  return h * 60 + m;
}
function toHHMM(min: number): string {
  const h = Math.floor(min / 60),
    m = min % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}
function overlaps(a1: number, a2: number, b1: number, b2: number) {
  return a1 < b2 && b1 < a2;
}

@Component({
  selector: 'app-schedule',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './schedule.component.html',
  styleUrl: './schedule.component.scss',
})
export class ScheduleComponent implements OnInit, OnDestroy {
  private fb = inject(FormBuilder);
  private store = inject(AppointmentService);
  private auth = inject(AuthService);

  // currentUser: User | null = null;
  // private userSubscription?: Subscription;
  client$: string | null = null;
  services: ServiceItem[] = SERVICES;
  categories = Array.from(new Set(this.services.map((s) => s.category)));

  private userSubscription?: Subscription;

  form = this.fb.group({
    service: this.fb.control<ServiceItem | null>(null, Validators.required),
    serviceText: ['', [Validators.required, Validators.minLength(2)]],
    duration: [60, [Validators.required, Validators.min(10)]],
    date: ['', Validators.required],
    time: [''],
    name: ['', [Validators.required, Validators.minLength(2)]],
    notes: [''],
  });

  ngOnInit() {
    // Handle user data here - this is the right place
    this.setupUserData();
  }

  ngOnDestroy() {
    this.userSubscription?.unsubscribe();
  }

  private setupFormSubscriptions() {
    this.form.controls.date.valueChanges.subscribe(() =>
      this.form.controls.time.setValue('')
    );
    this.form.controls.duration.valueChanges.subscribe(() =>
      this.form.controls.time.setValue('')
    );
    this.form.controls.service.valueChanges.subscribe((svc) => {
      if (svc) {
        this.form.controls.duration.setValue(svc.time, { emitEvent: true });
        this.form.controls.serviceText.setValue(svc.name, { emitEvent: false });
      } else {
        this.form.controls.serviceText.setValue('', { emitEvent: false });
      }
      this.form.controls.time.setValue('');
    });
  }
  private setupUserData() {
    // Check if user is already logged in (synchronous check)
    if (this.auth.isLoggedIn()) {
      // Synchronously get the current user value if available
      let user: User | null = null;
      this.auth.getUser().subscribe(u => user = u).unsubscribe();
      this.updateUserNameField(user);
    }

    // Subscribe to user changes (for login/logout during component lifetime)
    this.userSubscription = this.auth.getUser().subscribe((user) => {
      this.updateUserNameField(user);
    });
  }

  // sygnały z daty i czasu trwania (dla przeliczeń slotów)
  private dateSig = toSignal(
    this.form.controls.date.valueChanges.pipe(
      startWith(this.form.controls.date.value)
    ),
    { initialValue: this.form.controls.date.value as string | null }
  );

  private durationSig = toSignal(
    this.form.controls.duration.valueChanges.pipe(
      startWith(this.form.controls.duration.value)
    ),
    { initialValue: Number(this.form.controls.duration.value ?? 0) }
  );

  // reagujemy na zmianę usługi: ustawiamy duration + serviceText, czyścimy time
  constructor() {
    this.setupFormSubscriptions();
    this.form.controls.date.valueChanges.subscribe(() =>
      this.form.controls.time.setValue('')
    );
    this.form.controls.duration.valueChanges.subscribe(() =>
      this.form.controls.time.setValue('')
    );
    this.form.controls.service.valueChanges.subscribe((svc) => {
      // auto-uzupełnij pola powiązane z usługą
      if (svc) {
        this.form.controls.duration.setValue(svc.time, { emitEvent: true });
        this.form.controls.serviceText.setValue(svc.name, { emitEvent: false });
      } else {
        this.form.controls.serviceText.setValue('', { emitEvent: false });
      }
      this.form.controls.time.setValue('');
    });

    if (this.auth.isLoggedIn()) {
      this.auth.getUser().pipe(
        map((user) => {
          this.client$ = user ? `${user.firstName} ${user.lastName}` : null;
        })
      );
      this.form.controls.name.setValue(this.client$ || '');
    }
  }

  // dostępne sloty – jak w poprzedniej poprawionej wersji
  readonly availableSlots = computed(() => {
    const date = this.dateSig();
    const duration = Number(this.durationSig() ?? 0);
    if (!date || !duration) return [];

    const dayAppts = this.store.byDate(date);
    const busy: Array<[number, number]> = dayAppts.map((a) => {
      const s = toMinutes(a.time);
      return [s, s + a.duration + BUFFER_MIN];
    });

    const slots: string[] = [];
    for (let t = WORK_START; t <= WORK_END; t += SLOT_MIN) {
      const endWithBuffer = t + duration + BUFFER_MIN;
      const collides = busy.some(([b1, b2]) =>
        overlaps(t, endWithBuffer, b1, b2)
      );
      if (!collides) slots.push(toHHMM(t));
    }
    return slots;
  });

  pickSlot(t: string) {
    this.form.controls.time.setValue(t);
  }

  hasErr(ctrl: string, err?: string) {
    const c = this.form.get(ctrl);
    return err
      ? !!(c?.touched && c.hasError(err))
      : !!(c?.touched && c.invalid);
  }

  submit() {
    this.successMsg = '';
    this.errorMsg = '';
    if (this.form.invalid || !this.form.value.time) {
      this.form.markAllAsTouched();
      if (!this.form.value.time) this.errorMsg = 'Wybierz godzinę z listy.';
      return;
    }

    const v = this.form.value;
    const appt: Appointment = {
      id: uuid(),
      serviceText: v.serviceText!, // nazwa usługi zapisujemy jako tekst
      duration: Number(v.duration!),
      date: v.date!,
      time: v.time!,
      name: v.name!,
      notes: v.notes || undefined,
    };

    this.submitting = true;
    try {
      this.store.add(appt);
      this.successMsg = 'Rezerwacja zapisana! 💅';
      this.form.reset({ duration: 60, service: null });
    } catch (e: any) {
      this.errorMsg = e?.message || 'Nie udało się zapisać terminu.';
    } finally {
      this.submitting = false;
    }
  }

  byCategory(cat: ServiceCategory) {
    return this.services.filter((s) => s.category === cat);
  }

  isLoggedIn() {
    return this.auth.isLoggedIn();
  }

  submitting = false;
  successMsg = '';
  errorMsg = '';

  get todays() {
    const d = this.form.controls.date.value as string | null;
    return d ? this.store.byDate(d) : [];
  }

  private updateUserNameField(user: User | null) {
    if (user && user.firstName && user.lastName) {
      this.form.controls.name.setValue(`${user.firstName} ${user.lastName}`);
      this.form.controls.name.disable();
    } else {
      this.form.controls.name.enable();
      this.form.controls.name.setValue('');
    }
  }
}

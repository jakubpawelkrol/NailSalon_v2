import { Component, computed, inject, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AppointmentService } from '../../services/common/appointment.service';
import { CommonModule } from '@angular/common';
import { Appointment, AppointmentToSend } from '../../models/appointment.model';
import { toSignal } from '@angular/core/rxjs-interop';
import { map, startWith } from 'rxjs/operators';
import { ServiceItem, ServiceCategory } from '../../models/services.model';
import { AuthService } from '../../services/common/auth.service';
import { User } from '../../models/auth.model';
import { firstValueFrom, Subscription } from 'rxjs';
import { ServicesService } from '../../services/common/services.service';

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
  private appointmentService = inject(AppointmentService);
  private auth = inject(AuthService);
  private servicesService = inject(ServicesService);

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
    this.servicesService.loadServicesIfNeeded();
  }

  ngOnDestroy() {
    this.userSubscription?.unsubscribe();
  }

  // currentUser: User | null = null;
  // private userSubscription?: Subscription;
  client$: string | null = null;
  services = this.servicesService.services;
  //categories = this.servicesService.servicesByCategory;
  categories = computed<ServiceCategory[]>(() => {
    const servicesList = this.services();
    return Array.from(
      new Set(
        servicesList.map((s: { category: ServiceCategory }) => s.category)
      )
    );
  });

  private setupFormSubscriptions() {
    this.form.controls.date.valueChanges.subscribe(() =>
      this.form.controls.time.setValue('')
    );
    this.form.controls.duration.valueChanges.subscribe(() =>
      this.form.controls.time.setValue('')
    );
    this.form.controls.service.valueChanges.subscribe((svc) => {
      if (svc) {
        this.form.controls.duration.setValue(svc.duration, { emitEvent: true });
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
      this.auth
        .getUser()
        .subscribe((u) => (user = u))
        .unsubscribe();
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
        this.form.controls.duration.setValue(svc.duration, { emitEvent: true });
        this.form.controls.serviceText.setValue(svc.name, { emitEvent: false });
      } else {
        this.form.controls.serviceText.setValue('', { emitEvent: false });
      }
      this.form.controls.time.setValue('');
    });

    if (this.auth.isLoggedIn()) {
      this.auth
        .getUser()
        .pipe(
          map((user) => {
            this.client$ = user ? `${user.firstName} ${user.lastName}` : null;
          })
        )
        .subscribe();
      this.form.controls.name.setValue(this.client$ || '');
    }
  }

  // dostępne sloty – jak w poprzedniej poprawionej wersji
  readonly availableSlots = computed(() => {
    const date = this.dateSig();
    const duration = Number(this.durationSig() ?? 0);
    if (!date || !duration) return [];

    const dayAppts = this.appointmentService
      .selectedDateAppointments()
      .filter((a) => a.date === date);
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

  async submit() {
    console.log('submitting');
    this.successMsg = '';
    this.errorMsg = '';
    if (this.form.invalid || !this.form.value.time) {
      this.form.markAllAsTouched();
      if (!this.form.value.time) this.errorMsg = 'Wybierz godzinę z listy.';
      return;
    }

    try {
      this.submitting = true;

      const user = await firstValueFrom(this.auth.getUser());
      const userEmail = user?.email || '';

      const v = this.form.value;
      const appt: AppointmentToSend = {
        serviceName: v.service?.name!,
        userEmail: userEmail,
        appointmentDate: v.date!,
        time: v.time!,
        notes: v.notes || undefined,
      };

      console.log('sending appointment: ', appt);
      this.appointmentService.createAppointment(appt).subscribe({
        next: (result) => {
          console.log('appointment creation result: ', result);
          if (result.success) {
            this.successMsg = 'Rezerwacja zapisana! 💅';
            console.log('success');
            this.form.reset({ duration: 60, service: null });
          } else if (result.error) {
            this.errorMsg = result.error;
          }
        },
        error: (e) => {
          console.log('Error:', e);
          this.errorMsg = 'Wystąpił nieoczekiwany błąd.';
        },
      });
    } catch (e: any) {
      console.log('Error:', e);
      this.errorMsg = e?.message || 'Nie udało się zapisać terminu.';
    } finally {
      console.log('finally');
      this.submitting = false;
    }
  }

  byCategory(cat: ServiceCategory) {
    return this.servicesService.getServicesByCategory(cat);
  }

  isLoggedIn() {
    return this.auth.isLoggedIn();
  }

  submitting = false;
  successMsg = '';
  errorMsg = '';

  get todays() {
    const d = this.form.controls.date.value as string | null;
    return d
      ? this.appointmentService
          .selectedDateAppointments()
          .filter((a) => a.date === d)
      : [];
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

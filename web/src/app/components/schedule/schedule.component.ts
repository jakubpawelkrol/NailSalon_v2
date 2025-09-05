import {
  Component,
  computed,
  inject,
  OnInit,
  signal,
  OnDestroy,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AppointmentService } from '../../services/common/appointment.service';
import { CommonModule } from '@angular/common';
import { AppointmentToSend } from '../../models/appointment.model';
import { toSignal } from '@angular/core/rxjs-interop';
import { map, startWith, take } from 'rxjs/operators';
import { ServiceItem, ServiceCategory } from '../../models/services.model';
import { AuthService } from '../../services/common/auth.service';
import { User } from '../../models/auth.model';
import { firstValueFrom, Subscription } from 'rxjs';
import { ServicesService } from '../../services/common/services.service';
import { GenericButtonComponent } from "../generic-button/generic-button.component";

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
  imports: [CommonModule, ReactiveFormsModule, GenericButtonComponent],
  templateUrl: './schedule.component.html',
  styleUrl: './schedule.component.scss',
})
export class ScheduleComponent implements OnInit, OnDestroy {
  private fb = inject(FormBuilder);
  private appointmentService = inject(AppointmentService);
  private auth = inject(AuthService);
  private servicesService = inject(ServicesService);

  form = this.fb.group({
    service: this.fb.control<ServiceItem | null>(null, Validators.required),
    serviceText: ['', [Validators.required, Validators.minLength(2)]],
    duration: [60, [Validators.required, Validators.min(10)]],
    date: ['', Validators.required],
    time: [''],
    name: ['', [Validators.required, Validators.minLength(2)]],
    notes: [''],
  });

  private userSubscription?: Subscription;

  ngOnInit() {
    this.setupUserData();
    this.servicesService.loadServicesIfNeeded();
  }

  constructor() {
    this.setupFormSubscriptions();
  }

  currentUser = this.auth.getUser();
  client$: string | null = null;
  services = this.servicesService.services;
  categories = computed<ServiceCategory[]>(() => {
    const servicesList = this.services();
    return Array.from(
      new Set(
        servicesList.map((s: { category: ServiceCategory }) => s.category)
      )
    );
  });
  private _availableSlots = signal<string[]>([]);
  readonly availableSlots = this._availableSlots.asReadonly();

  private updateAvailableSlots() {
    const date = this.dateSig();
    const duration = Number(this.durationSig() ?? 0);

    if (!date || !duration) {
      this._availableSlots.set([]);
      return;
    }

    this.appointmentService.loadAppointmentsForDate(date).subscribe({
      next: (appointments) => {
        const dayAppts = appointments.filter((a) => a.date === date);
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
        this._availableSlots.set(slots);
      },
      error: (err) => {
        console.error('Error loading appointments:', err);
      },
    });
  }

  private setupFormSubscriptions() {
    this.form.controls.date.valueChanges.subscribe((date) => {
      if (date) {
        this.appointmentService.setSelectedDate(date);
      }
      this.form.controls.time.setValue('');
      this.updateAvailableSlots();
    });
    this.form.controls.duration.valueChanges.subscribe(() => {
      this.form.controls.time.setValue('');
      this.updateAvailableSlots();
    });
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
    console.log('Setting up user data...');
    console.log('Is logged in:', this.auth.isLoggedIn());

    this.userSubscription = this.auth.getUser().subscribe({
      next: (user) => {
        console.log('User changed:', user);
        if (user && this.auth.isLoggedIn()) {
          const fullName = `${user.firstName} ${user.lastName}`.trim();
          console.log('Setting name to:', fullName);
          this.form.controls.name.setValue(fullName);
          this.client$ = fullName;
        } else {
          // Clear the name if user is logged out
          this.form.controls.name.setValue('');
          this.client$ = null;
        }
      },
      error: (error) => {
        console.error('Error in user subscription:', error);
      },
    });
  }

  ngOnDestroy() {
    this.userSubscription?.unsubscribe();
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
      this.setupUserData();
      this.appointmentService.clearCaches();
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

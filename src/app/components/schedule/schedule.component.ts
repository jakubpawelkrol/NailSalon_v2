import { Component, computed, inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { AppointmentService } from '../../services/common/appointment.service';
import { v4 as uuid } from 'uuid';
import { CommonModule } from '@angular/common';
import { Appointment } from '../../models/appointment.model';


@Component({
  selector: 'app-schedule',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './schedule.component.html',
  styleUrl: './schedule.component.scss'
})
export class ScheduleComponent {
  private fb = inject(FormBuilder);
  private store = inject(AppointmentService);

  form = this.fb.group({
    serviceText: ['', [Validators.required, Validators.minLength(2)]],
    date: ['', Validators.required],      // <input type="date">
    time: ['', Validators.required],      // <input type="time">
    name: ['', [Validators.required, Validators.minLength(2)]],
    notes: ['']
  });

  submitting = false;
  successMsg = '';
  errorMsg = '';

  submit() {
    this.successMsg = '';
    this.errorMsg = '';

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const values = this.form.value;
    const appt: Appointment = {
      id: uuid(),
      serviceText: values.serviceText!,
      date: values.date!,
      time: values.time!,
      name: values.name!,
      notes: values.notes || undefined,
    };

    this.submitting = true;
    try {
      this.store.add(appt);
      this.successMsg = 'Rezerwacja zapisana! 💅';
      // reset but keep today’s date if you like:
      this.form.reset();
    } catch (e: any) {
      this.errorMsg = e?.message || 'Nie udało się zapisać terminu.';
    } finally {
      this.submitting = false;
    }
  }

  hasErr(ctrl: string, err?: string) {
    const c = this.form.get(ctrl);
    if (!c) return false;
    return err ? !!(c.touched && c.hasError(err)) : !!(c.touched && c.invalid);
  }

  // helper for preview below (optional)
  get todays() {
    const d = this.form.get('date')?.value as string | null;
    return d ? this.store.byDate(d) : [];
  }
}

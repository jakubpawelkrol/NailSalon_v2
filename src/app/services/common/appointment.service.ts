import { Injectable, signal } from '@angular/core';
import { Appointment } from '../../models/appointment.model';

@Injectable({ providedIn: 'root' })
export class AppointmentService {
  private readonly _appointments = signal<Appointment[]>([]);
  readonly appointments = this._appointments.asReadonly();

  add(appt: Appointment) {
    // Simple duplication guard: same date+time+name
    const exists = this._appointments().some(a =>
      a.date === appt.date && a.time === appt.time && a.name.trim().toLowerCase() === appt.name.trim().toLowerCase()
    );
    if (exists) throw new Error('Ten termin jest już zajęty dla tej osoby.');

    this._appointments.update(list => [...list, appt]);
  }

  remove(id: string) {
    this._appointments.update(list => list.filter(a => a.id !== id));
  }

  byDate(dateISO: string) {
    return this._appointments().filter(a => a.date === dateISO);
  }
}
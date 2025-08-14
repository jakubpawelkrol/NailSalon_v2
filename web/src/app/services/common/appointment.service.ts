import { Injectable, signal } from '@angular/core';
import { Appointment } from '../../models/appointment.model';

const BUFFER_MIN = 10;

function toMinutes(time: string): number {
  const [hh, mm] = time.split(':').map(Number);
  return hh * 60 + mm;
}

function overlaps(aStart: number, aEnd: number, bStart: number, bEnd: number) {
  return aStart < bEnd && bStart < aEnd;
}

@Injectable({ providedIn: 'root' })
export class AppointmentService {
  private readonly _appointments = signal<Appointment[]>([]);
  readonly appointments = this._appointments.asReadonly();

  add(appt: Appointment) {
    const dateAppts = this.byDate(appt.date);
    const start = toMinutes(appt.time);
    const endWithBuffer = start + appt.duration + BUFFER_MIN;

    const clash = dateAppts.some(a => {
      const s = toMinutes(a.time);
      const e = s + a.duration + BUFFER_MIN;
      return overlaps(start, endWithBuffer, s, e);
    });
    if (clash) throw new Error('Ten termin koliduje z inną wizytą.');

    this._appointments.update(list => [...list, appt]);
  }

  remove(id: string) {
    this._appointments.update(list => list.filter(a => a.id !== id));
  }

  byDate(dateISO: string) {
    return this._appointments().filter(a => a.date === dateISO);
  }
}
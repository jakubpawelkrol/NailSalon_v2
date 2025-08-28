import { computed, inject, Injectable, signal } from '@angular/core';
import { Appointment, AppointmentToSend } from '../../models/appointment.model';
import { RestService } from './rest.service';
import { catchError, map, Observable, of, tap } from 'rxjs';

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
private restService = inject(RestService);

  private readonly _appointments = signal<Appointment[]>([]);
  readonly appointments = this._appointments.asReadonly();

  private readonly _submitting = signal<boolean>(false);
  readonly submitting = this._submitting.asReadonly();
  
  private readonly _error = signal<string | null>(null);
  readonly error = this._error.asReadonly();

  readonly byDate = computed(() => {
    return (dateISO: string) => {
      return this._appointments().filter(a => a.date === dateISO);
    }
  });

  createAppointment(appointmentData: AppointmentToSend): Observable<{ success: boolean; appointment?: Appointment; error?: string }> {
    this._submitting.set(true);
    this._error.set(null);

    return this.restService.postAppointment(appointmentData).pipe(
      tap((response) => {
        console.log('Appointment creation response: ', response);

        const appointment: Appointment = {
          id: response.id,
          serviceText: response.serviceText,
          date: response.date,
          time: response.time,
          duration: response.duration,
          name: response.name,
          notes: response.notes
        };
        this._appointments.update(list => [...list, appointment]);
      }),
      map((response) => ({ success: true, appointment: response as Appointment})),
      catchError((error) => {
        console.error('Error creating appointment:', error);

        let errorMessage = 'Nie udało się zapisać terminu. Spróbuj ponownie.';
        if (error.status === 400) {
          errorMessage = 'Błędne dane formularza. Sprawdź wprowadzone informacje.';
        } else if (error.status === 409) {
          errorMessage = 'Ten termin jest już zajęty. Wybierz inną godzinę.';
        } else if (error.status === 401) {
          errorMessage = 'Sesja wygasła. Zaloguj się ponownie.';
        } else if (error?.error?.message) {
          errorMessage = error.error.message;
        }
        this._error.set(errorMessage);
        return of({ success: false, error: errorMessage });
      }),
      tap(() => this._submitting.set(false))
    );
  }

  loadAppointments(date?: string): void {
    // You can implement this when you have a GET endpoint
    // For now, we'll just clear local state
    this._appointments.set([]);
  }

  isSlotTaken(date: string, time: string, duration: number): boolean {
    const dateAppts = this.byDate()(date);
    const start = toMinutes(time);
    const endwithBuffer = start + duration + BUFFER_MIN;

    return dateAppts.some(a => {
      const s = toMinutes(a.time);
      const e = s + a.duration + BUFFER_MIN;
      return overlaps(start, endwithBuffer, s, e);
    });
  }

  remove(id: string) {
    this._appointments.update(list => list.filter(a => a.id !== id));
  }
}
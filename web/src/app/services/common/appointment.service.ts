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

  private _selectedDateAppointments = signal<Appointment[]>([]);
  readonly selectedDateAppointments =
    this._selectedDateAppointments.asReadonly();

  private _appointmentExistence = signal<string[]>([]);
  readonly appointmentExistence = this._appointmentExistence.asReadonly();

  private _selectedDate = signal<string | null>(null);
  readonly selectedDate = this._selectedDate.asReadonly();

  private _currentMonth = signal<{ year: number; month: number } | null>(null);
  readonly currentMonth = this._currentMonth.asReadonly();

  private _submitting = signal<boolean>(false);
  readonly submitting = this._submitting.asReadonly();

  private _error = signal<string | null>(null);
  readonly error = this._error.asReadonly();

  readonly hasAppointments = computed(() => {
    return (dateISO: string) => {
      return this._appointmentExistence().includes(dateISO);
    };
  });

  createAppointment(appointmentData: AppointmentToSend): Observable<{
    success: boolean;
    appointment?: Appointment;
    error?: string;
  }> {
    console.log('Creating appointment with data: ', appointmentData);
    this._submitting.set(true);
    this._error.set(null);

    return this.restService.postAppointment(appointmentData).pipe(
      tap((response) => {
        console.log('Appointment creation response: ', response);
      }),
      map((response) => ({
        success: true,
        appointment: response as Appointment,
      })),
      catchError((error) => {
        console.error('Error creating appointment:', error);

        let errorMessage = 'Nie udało się zapisać terminu. Spróbuj ponownie.';
        if (error.status === 400) {
          errorMessage =
            'Błędne dane formularza. Sprawdź wprowadzone informacje.';
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

  loadAppointmentsForDate(dateISO: string): Observable<Appointment[]> {
    console.log('Loading appointments for date: ', dateISO);
    this._selectedDate.set(dateISO);

    return this.restService.getAppointmentByDate(dateISO).pipe(
      tap((appointments) => {
        console.log('Loaded appointments: ' + appointments);
        this._selectedDateAppointments.set(appointments);
      }),
      catchError((error) => {
        console.error('Error loading appointments: ', error);
        this._selectedDateAppointments.set([]);
        return of([]);
      })
    );
  }

  loadAppointmentsExistenceForMonth(
    year: number,
    month: number
  ): Observable<string[]> {
    console.log(`Loading appointment existence for ${month}/${year}`);
    this._currentMonth.set({ year, month });

    return this.restService.getAppointmentExistenceByMonth(year, month).pipe(
      tap((existence) => {
        console.log(
          'Loaded appointment existence: ' + JSON.stringify(existence)
        );
        this._appointmentExistence.set(existence);
      }),
      catchError((error) => {
        console.error('Error loading appointment existence: ', error);
        this._appointmentExistence.set([]);
        return of([]);
      })
    );
  }

  loadAppointments(date?: string) {
    // You can implement this when you have a GET endpoint
    // For now, we'll just clear local state
    return 'eh';
  }

  isSlotTaken(date: string, time: string, duration: number): boolean {
    const dateAppts = this._selectedDateAppointments();
    const start = toMinutes(time);
    const endwithBuffer = start + duration + BUFFER_MIN;

    return dateAppts.some((checkedAppt) => {
      const checkedStartTime = toMinutes(checkedAppt.time);
      const checkedEndWithBuffer =
        checkedStartTime + checkedAppt.duration + BUFFER_MIN;
      return overlaps(
        start,
        endwithBuffer,
        checkedStartTime,
        checkedEndWithBuffer
      );
    });
  }

  clearSelectedDate() {
    this._selectedDate.set(null);
    this._selectedDateAppointments.set([]);
  }

  remove(id: string) {
    this._selectedDateAppointments.update((list) =>
      list.filter((a) => a.id !== id)
    );

    if (this._selectedDateAppointments().length === 0 && this._selectedDate()) {
      this._appointmentExistence.update((existence) => ({
        ...existence,
        [this.selectedDate()!]: false,
      }));
    }
  }
}

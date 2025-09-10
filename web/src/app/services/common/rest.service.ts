import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable, tap } from 'rxjs';
import { PhotoModel } from '../../models/gallery.model';
import { ServiceItem } from '../../models/services.model';
import { Appointment, AppointmentToSend } from '../../models/appointment.model';

@Injectable({
  providedIn: 'root',
})
export class RestService {
  private helloText = 'aaa';
  private http = inject(HttpClient);
  private baseUrl = '/api';

  // Only HTTP calls - no state management
  getGalleryPhotos(): Observable<PhotoModel[]> {
    return this.http.get<PhotoModel[]>(`${this.baseUrl}/images/get`);
  }

  getServices(): Observable<ServiceItem[]> {
    return this.http.get<ServiceItem[]>(`${this.baseUrl}/services/getAll`);
  }

  postAppointment(appointment: AppointmentToSend): Observable<Appointment> {
    console.log('Posting appointment to backend: ', appointment);
    return this.http.post<Appointment>(
      `${this.baseUrl}/appointments/schedule`,
      appointment
    );
  }

  getNumberOfAppointmentsOnDate(date: string): Observable<Number> {
    console.log("getting number of appts for date: ", date);
    return this.http.get<Number>(
      `${this.baseUrl}/appointments/getCount/${date}`
    );
  }

  getAppointmentByDate(date: string): Observable<Appointment[]> {
    console.log("getting appts for date: ", date);
    return this.http.get<Appointment[]>(
      `${this.baseUrl}/appointments/getDate/${date}`
    );
  }

  getAppointmentExistenceByMonth(
    year: number,
    month: number
  ): Observable<string[]> {
    return this.http.get<string[]>(
      `${this.baseUrl}/appointments/exists/${year}/${month}`
    );
  }
}

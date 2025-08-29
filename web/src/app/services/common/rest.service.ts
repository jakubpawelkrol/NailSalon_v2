import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
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
    console.log("Posting appointment to backend: ", appointment);
    return this.http.post<Appointment>(`${this.baseUrl}/appointments/schedule`, appointment);
  }

  getHello(): Observable<string> {
    return this.http.get(`${this.baseUrl}/auth/hello`, {
      responseType: 'text',
    });
  }

  hello() {
    this.getHello().subscribe({
      next: (data) => {
        this.helloText = data;
        console.log('Hello text: ', this.helloText);
      },
      error: (err) => {
        console.error('Failed to load hello text:', err);
      },
    });
  }
}

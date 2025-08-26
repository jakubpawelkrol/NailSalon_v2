import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { PhotoModel } from '../../models/gallery.model';
import { ServiceItem } from '../../models/services.model';

@Injectable({
  providedIn: 'root',
})
export class RestService {
  // private _photos = signal<PhotoModel[]>([]);
  // readonly photos = this._photos.asReadonly();

  // private _services = signal<ServiceItem[]>([]);
  // readonly services = this._services.asReadonly();

  // private baseUrl = '/api';
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

  // getGalleryPhotos(): void {
  //   this.http.get<PhotoModel[]>(`${this.baseUrl}/images/get`).subscribe({
  //     next: (data) => {
  //       this._photos.set(data);
  //       console.log('Loaded images:', data);
  //     },
  //     error: (err) => {
  //       console.error('Failed to load images:', err);
  //     },
  //   });
  // }

  // getServices(): void {
  //   this.http.get<ServiceItem[]>(`${this.baseUrl}/services/getAll`).subscribe({
  //     next: (data) => {
  //       this._services.set(data);
  //       console.log('Loaded services:', data);
  //     },
  //     error: (err) => {
  //       console.error('Failed to load services:', err);
  //     },
  //   });
  // }

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

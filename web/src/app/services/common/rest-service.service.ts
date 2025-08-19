import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { PhotoModel } from '../../models/gallery.model';

@Injectable({
  providedIn: 'root',
})
export class RestService {
  http = inject(HttpClient);
  private _photos = signal<PhotoModel[]>([]);
  readonly photos = this._photos.asReadonly();

  private baseUrl = '/api';
  private helloText = 'aaa';

  getGalleryPhotos(): void {
    this.http.get<PhotoModel[]>(`${this.baseUrl}/images/get`).subscribe({
      next: (data) => {
        this._photos.set(data);
        console.log('Loaded images:', data);
      },
      error: (err) => {
        console.error('Failed to load images:', err);
      },
    });
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

import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RestService {
  http = inject(HttpClient);
  private _photos = signal<string[]>([]);
  readonly photos = this._photos.asReadonly();

  getGalleryPhotos(): void {
    this.http.get<string[]>('http://localhost:3000/api/gallery').subscribe({
      next: (data) => {
        this._photos.set(data);
      },
      error: (err) => {
        console.error('Failed to load images:', err);
      },
    });
  }
}

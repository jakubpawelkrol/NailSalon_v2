import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RestService {
  http = inject(HttpClient);

  getGalleryPhotos(): Observable<string[]> {
    return this.http.get<string[]>('http://localhost:3000/api/gallery');
  }
}

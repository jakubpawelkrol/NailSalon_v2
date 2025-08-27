import { inject, Injectable, signal } from '@angular/core';
import { PhotoModel } from '../../models/gallery.model';
import { RestService } from './rest.service';

@Injectable({
  providedIn: 'root',
})
export class GalleryStateService {
  private rest = inject(RestService);
  // Gallery state
  private _images = signal<PhotoModel[]>([]);
  readonly images = this._images.asReadonly();
  
  private _selectedImage = signal<PhotoModel | null>(null);
  readonly selectedImage = this._selectedImage.asReadonly();
  
  private _loading = signal<boolean>(false);
  readonly loading = this._loading.asReadonly();

  // Load images from API
  loadImages(): void {
    this._loading.set(true);
    this.rest.getGalleryPhotos().subscribe({
      next: (data) => {
        this._images.set(data);
        this._loading.set(false);
        console.log('Loaded images:', data);
      },
      error: (err) => {
        console.error('Failed to load images:', err);
        this._loading.set(false);
      },
    });
  }

  setImages(imgs: PhotoModel[]) {
    this._images.set(imgs);
  }

  getImages() {
    return this._images();
  }

  getSelectedImage() {
    return this.selectedImage();
  }

  open(img: PhotoModel) {
    this._selectedImage.set(img);
  }

  close() {
    this._selectedImage.set(null);
  }

  prev() {
    const curr = this._selectedImage();
    const index = this._images().indexOf(curr!);
    if (index > 0) {
      this._selectedImage.set(this._images()[index - 1]);
    }
  }

  next() {
    const curr = this._selectedImage();
    const index = this._images().indexOf(curr!);
    if (index < this._images().length - 1) {
      this._selectedImage.set(this._images()[index + 1]);
    }
  }
}

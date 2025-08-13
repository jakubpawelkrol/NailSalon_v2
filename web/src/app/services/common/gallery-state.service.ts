import { Injectable, signal } from '@angular/core';
import { PhotoModel } from '../../models/gallery.model';

@Injectable({
  providedIn: 'root',
})
export class GalleryStateService {
  private images = signal<PhotoModel[]>([]);
  private selectedImage = signal<PhotoModel | null>(null);

  setImages(imgs: PhotoModel[]) {
    this.images.set(imgs);
  }

  getImages() {
    return this.images();
  }

  getSelectedImage() {
    return this.selectedImage();
  }

  open(img: PhotoModel) {
    this.selectedImage.set(img);
  }

  close() {
    this.selectedImage.set(null);
  }

  prev() {
    const curr = this.selectedImage();
    const index = this.images().indexOf(curr!);
    if (index > 0) {
      this.selectedImage.set(this.images()[index - 1]);
    }
  }

  next() {
    const curr = this.selectedImage();
    const index = this.images().indexOf(curr!);
    if (index < this.images().length - 1) {
      this.selectedImage.set(this.images()[index + 1]);
    }
  }
}

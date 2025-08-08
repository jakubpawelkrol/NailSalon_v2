import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class GalleryStateService {
  private images = signal<string[]>([]);
  private selectedImage = signal<string | null>(null);

  setImages(imgs: string[]) {
    this.images.set(imgs);
  }

  getImages() {
    return this.images();
  }

  getSelectedImage() {
    return this.selectedImage();
  }

  open(img: string) {
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
      this.selectedImage.set(this.images()[index - 1]);
    }
  }
}

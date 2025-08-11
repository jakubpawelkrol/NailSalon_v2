import { Component, effect, HostListener, inject } from '@angular/core';
import { RestService } from '../../services/common/rest-service.service';
import { GalleryStateService } from '../../services/common/gallery-state.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-gallery',
  imports: [CommonModule],
  templateUrl: './gallery.component.html',
  styleUrl: './gallery.component.scss',
})
export class GalleryComponent {
  galleryService = inject(GalleryStateService);
  restService = inject(RestService);

  constructor() {
    this.restService.getGalleryPhotos();
    effect(() => { this.galleryService.setImages(this.restService.photos()); });
  }

  openImage(img: string) {
    this.galleryService.open(img);
  }

  closeImage() {
    this.galleryService.close();
  }

  prevImage() {
    this.galleryService.prev();
  }

  nextImage() {
    this.galleryService.next();
  }

  @HostListener('document:keydown', ['$event'])
  handleKey(event: KeyboardEvent) {
    if (!this.galleryService.getSelectedImage()) return;

    switch (event.key) {
      case 'Escape':
        this.galleryService.close();
        break;
      case 'ArrowLeft':
        this.galleryService.prev();
        break;
      case 'ArrowRight':
        this.galleryService.next();
        break;
    }
  }
}

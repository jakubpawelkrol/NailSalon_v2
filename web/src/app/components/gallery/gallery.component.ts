import { Component, effect, HostListener, inject } from '@angular/core';
import { RestService } from '../../services/common/rest.service';
import { GalleryStateService } from '../../services/common/gallery-state.service';
import { CommonModule } from '@angular/common';
import { PhotoModel } from '../../models/gallery.model';
import { GenericButtonComponent } from "../generic-button/generic-button.component";

@Component({
  selector: 'app-gallery',
  imports: [CommonModule, GenericButtonComponent],
  templateUrl: './gallery.component.html',
  styleUrl: './gallery.component.scss',
})
export class GalleryComponent {
  galleryService = inject(GalleryStateService);

  constructor() {
    this.galleryService.loadImages();
  }

  openImage(img: PhotoModel) {
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

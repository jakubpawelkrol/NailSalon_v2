import { Component, inject } from '@angular/core';
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
  private restService = inject(RestService);

  ngOnInit() {
    this.restService.getGalleryPhotos().subscribe({
      next: (data) => {
        console.log('Images read:', data);
        this.galleryService.setImages(data);
      },
      error: (err) => {
        console.error('Failed to load images:', err);
      },
    });
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
}

import { Component, HostListener, inject, model, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-gallery',
  imports: [],
  templateUrl: './gallery.component.html',
  styleUrl: './gallery.component.scss'
})
export class GalleryComponent {
  http = inject(HttpClient);
  images: string[] = [];
  selectedImage = signal<string | null>(null);

  ngOnInit() {
    this.http.get<string[]>('http://localhost:3000/api/gallery').subscribe({
      next: (data) => {
        this.images = data;
        console.log("Data read: " + data);
      },
      error: (err) => {
        console.error('Failed to load images:', err);
      }
    });
  }

  openImage(img: string) {
    this.selectedImage.set(img);
  }

  closeImage() {
    this.selectedImage.set(null);
  }
  
  // ⬅️ Navigate to previous image
  prevImage() {
    const currentIndex = this.images.indexOf(this.selectedImage()!);
    if (currentIndex > 0) {
      this.selectedImage.set(this.images[currentIndex - 1]);
    }
  }

  // ➡️ Navigate to next image
  nextImage() {
    const currentIndex = this.images.indexOf(this.selectedImage()!);
    if (currentIndex < this.images.length - 1) {
      this.selectedImage.set(this.images[currentIndex + 1]);
    }
  }

  // ⌨️ Keyboard support
  @HostListener('document:keydown', ['$event'])
  handleKey(event: KeyboardEvent) {
    if (!this.selectedImage()) return;

    switch (event.key) {
      case 'Escape':
        this.closeImage();
        break;
      case 'ArrowLeft':
        this.prevImage();
        break;
      case 'ArrowRight':
        this.nextImage();
        break;
    }
  }
}

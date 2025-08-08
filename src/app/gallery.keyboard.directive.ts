import { Directive, HostListener } from '@angular/core';
import { GalleryStateService } from './services/common/gallery-state.service';

@Directive({
  selector: '[appGalleryKeyboardControl]',
})
export class GalleryKeyboardControlDirective {
  constructor(private gallery: GalleryStateService) {}

  @HostListener('document:keydown', ['$event'])
  handleKey(event: KeyboardEvent) {
    if (!this.gallery.getSelectedImage()) return;

    switch (event.key) {
      case 'Escape':
        this.gallery.close();
        break;
      case 'ArrowLeft':
        this.gallery.prev();
        break;
      case 'ArrowRight':
        this.gallery.next();
        break;
    }
  }
}

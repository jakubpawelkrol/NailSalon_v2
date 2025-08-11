import { Component, computed } from '@angular/core';
import { ServiceCategory, ServiceItem, SERVICES } from '../../models/services.model';

@Component({
  selector: 'app-services',
  imports: [],
  templateUrl: './services.component.html',
  styleUrl: './services.component.scss'
})
export class ServicesComponent {
  protected readonly all: ServiceItem[] = SERVICES;

  protected categories = computed<ServiceCategory[]>(() => {
    const set = new Set<ServiceCategory>(this.all.map(s => s.category));
    return Array.from(set);
  });

  protected byCategory(cat: ServiceCategory): ServiceItem[] {
    return this.all.filter(s => s.category === cat);
  }
}

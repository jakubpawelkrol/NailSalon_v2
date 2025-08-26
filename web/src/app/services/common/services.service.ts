import { computed, inject, Injectable, signal } from '@angular/core';
import { RestService } from './rest.service';
import { ServiceCategory, ServiceItem } from '../../models/services.model';

@Injectable({
  providedIn: 'root'
})
export class ServicesService {
  private rest = inject(RestService);

  private _services = signal<ServiceItem[]>([]);
  readonly services = this._services.asReadonly();

  private _loading = signal<boolean>(false);
  readonly loading = this._loading.asReadonly();

  // Computed properties for categorized services
  readonly servicesByCategory = computed(() => {
    const services = this._services();
    const categories: Record<ServiceCategory, ServiceItem[]> = {
      'Manicure': [],
      'Pedicure': [],
      'Podologia': []
    };

    services.forEach(service => {
      if (categories[service.category]) {
        categories[service.category].push(service);
      }
    });

    return categories;
  });

  readonly popularServices = computed(() => {
    return this._services().filter(service => service.popular);
  });

  // Load services from API
  loadServices(): void {
    this._loading.set(true);
    this.rest.getServices().subscribe({
      next: (data) => {
        this._services.set(data);
        this._loading.set(false);
        console.log('Loaded services:', data);
      },
      error: (err) => {
        console.error('Failed to load services:', err);
        this._loading.set(false);
      },
    });
  }

  // Utility methods
  getServiceByName(name: string): ServiceItem | undefined {
    return this._services().find(service => service.name === name);
  }

  getServicesByCategory(category: ServiceCategory): ServiceItem[] {
    return this._services().filter(service => service.category === category);
  }

  // Getter method (for backward compatibility)
  getServices(): ServiceItem[] {
    return this._services();
  }

}

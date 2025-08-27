import { computed, inject, Injectable, signal } from '@angular/core';
import { RestService } from './rest.service';
import { ServiceCategory, ServiceItem } from '../../models/services.model';
import { CacheService } from './cache.service';

@Injectable({
  providedIn: 'root'
})
export class ServicesService {
  private rest = inject(RestService);
  private cacheService = inject(CacheService);

  private readonly CACHE_DURATION = 60 * 60 * 1000; // 60 minutes

  private servicesCache = this.cacheService.createCache<ServiceItem>(
    {
      key: 'services',
      cacheDuration: this.CACHE_DURATION
    },
    () => this.rest.getServices()
  );

  readonly services = this.servicesCache.data;
  readonly loading = this.servicesCache.loading;
  readonly error = this.servicesCache.error;

  // Computed properties for categorized services
  readonly servicesByCategory = computed(() => {
    const services: ServiceItem[] = this.services();
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
    return this.services().filter((service: ServiceItem) => service.popular);
  });

  loadServicesIfNeeded(): void {
    this.servicesCache.loadIfNeeded();
  }
  
  // Load services from API
  loadServices(): void {
    this.servicesCache.load();
  }

  refreshServices(): void {
    this.servicesCache.refresh();
  }

  isDataFresh(): boolean {
    return this.servicesCache.isDataFresh();
  }

  getServicesByCategory(category: ServiceCategory): ServiceItem[] {
    return this.servicesCache.filterBy((service: ServiceItem) => service.category === category);
  }

  // Getter method (for backward compatibility)
  getServices(): ServiceItem[] {
    return this.servicesCache.getData();
  }

}

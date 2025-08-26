import { Component, computed, inject } from '@angular/core';
import { ServiceCategory, ServiceItem } from '../../models/services.model';
import { ServicesService } from '../../services/common/services.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-services',
  imports: [CommonModule],
  templateUrl: './services.component.html',
  styleUrl: './services.component.scss'
})
export class ServicesComponent {
  servicesService = inject(ServicesService);

  protected services = this.servicesService.services;
  protected loading = this.servicesService.loading;
  protected servicesByCategory = this.servicesService.servicesByCategory;

  protected categories = computed<ServiceCategory[]>(() => {
    const services = this.services();
    const set = new Set<ServiceCategory>(services.map(s => s.category));
    return Array.from(set);
  });

  ngOnInit() {
    this.servicesService.loadServices();
  }

  protected byCategory(cat: ServiceCategory): ServiceItem[] {
    return this.services().filter(s => s.category === cat);
  }
  
  protected getServicesByCategory(category: ServiceCategory): ServiceItem[] {
    return this.servicesService.getServicesByCategory(category);
  }

}

export type ServiceCategory = 'Manicure' | 'Pedicure' | 'Podologia';

export interface ServiceItem {
  category: ServiceCategory;
  name: string;
  description?: string;
  price: string; 
  duration: number;    
  popular?: boolean;
}

export interface Appointment {
    id: string;
    serviceText: string;
    date: string;   // 'YYYY-MM-DD'
    time: string;   // 'HH:mm'
    name: string;
    notes?: string;
  }
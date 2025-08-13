export interface Appointment {
    id: string;
    serviceText: string;
    date: string;   // 'YYYY-MM-DD'
    time: string;   // 'HH:mm'
    duration: number;
    name: string;
    notes?: string;
  }
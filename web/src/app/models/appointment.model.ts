export interface Appointment {
  id: string;
  serviceText: string;
  date: string; // 'YYYY-MM-DD'
  time: string; // 'HH:mm'
  duration: number;
  name: string;
  notes?: string;
}

export interface AppointmentToSend {
  serviceName: string;
  userEmail: string;
  appointmentDate: string; // 'YYYY-MM-DD'
  time: string; // 'HH:mm'
  notes?: string;
}

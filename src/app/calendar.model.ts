export interface CalendarDay {
    date: Date;
    isCurrentMonth: boolean;
    isToday: boolean;
    appointments?: Appointment[];
}

export interface Appointment {
    id: number;
    clientName: string;
    service: string;
    time: string;
}
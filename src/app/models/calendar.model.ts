import { Appointment } from "./appointment.model";

export interface CalendarDay {
    date: Date;
    isCurrentMonth: boolean;
    isToday: boolean;
    appointments?: Appointment[];
}
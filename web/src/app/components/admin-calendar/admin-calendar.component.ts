import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CalendarDay } from '../../models/calendar.model';
import { AppointmentService } from '../../services/common/appointment.service';
import { Appointment } from '../../models/appointment.model';

@Component({
  selector: 'app-admin-calendar',
  imports: [],
  templateUrl: './admin-calendar.component.html',
  styleUrl: './admin-calendar.component.scss',
})
export class AdminCalendarComponent implements OnInit {
  private appointmentService = inject(AppointmentService);

  currentMonth = signal(new Date().getMonth());
  currentYear = signal(new Date().getFullYear());
  selectedDay = signal<CalendarDay | null>(null);
  readonly dayNames = ['Pon', 'Wt', 'Śr', 'Czw', 'Pt', 'Sob', 'Ndz'];
  today = new Date();

  appointmentExistence = this.appointmentService.appointmentExistence;
  selectedDateAppointments = this.appointmentService.selectedDateAppointments;
  selectedDate = this.appointmentService.selectedDate;

  ngOnInit(): void {
    this.generateCalendar();
    this.loadCurrentMonthExistence();
  }

  // 3) calendar grid (reacts when appointments or month change)
  readonly weeks = computed(() => {
    const start = new Date(this.currentYear(), this.currentMonth(), 1);
    const dayOfWeek = start.getDay(); // 0=Sun ... 1=Mon
    const offset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; // start on Monday

    const days: CalendarDay[] = [];
    const dayCursor = new Date(start);
    dayCursor.setDate(dayCursor.getDate() + offset);

    for (let i = 0; i < 42; i++) {
      const dateStr = this.formatDateLocal(dayCursor); // ⬅ local-safe
      const day: CalendarDay = {
        date: new Date(dayCursor),
        isCurrentMonth: dayCursor.getMonth() === this.currentMonth(),
        isToday: this.isSameDate(dayCursor, this.today),
        appointments: this.hasAppointments(dateStr) ? [] : [], // ⬅ from map
      };
      days.push(day);
      dayCursor.setDate(dayCursor.getDate() + 1);
    }

    const weeks: CalendarDay[][] = [];
    for (let i = 0; i < days.length; i += 7) weeks.push(days.slice(i, i + 7));
    return weeks;
  });

  prevMonth() {
    let newMonth = this.currentMonth() - 1;
    let newYear = this.currentYear();
    if (newMonth < 0) {
      newMonth = 11;
      newYear--;
    }

    this.currentMonth.set(newMonth);
    this.currentYear.set(newYear);
    this.onMonthChange(newYear, newMonth + 1);
  }

  nextMonth() {
    let newMonth = this.currentMonth() + 1;
    let newYear = this.currentYear();
    if (newMonth > 11) {
      newMonth = 0;
      newYear++;
    }

    this.currentMonth.set(newMonth);
    this.currentYear.set(newYear);
    this.onMonthChange(newYear, newMonth + 1);
  }

  onDateClick(day: CalendarDay) {
    const dateISO = this.formatDateLocal(day.date);
    console.log('Date clicked: ', dateISO);

    this.selectedDay.set(day);
    this.appointmentService.loadAppointmentsForDate(dateISO).subscribe();
  }

  onMonthChange(year: number, month: number) {
    console.log('Month changed: ', year, month);
    this.appointmentService.clearSelectedDate();
    this.selectedDay.set(null);
    this.loadMonthExistence(year, month);
  }

  hasAppointments(dateStr: string): boolean {
    return this.appointmentExistence().includes(dateStr);
  }

  // ---- helpers ----

  // Avoid toISOString() (TZ shifts). Format as local YYYY-MM-DD.
  formatDateLocal(d: Date): string {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }

  loadCurrentMonthExistence() {
    this.loadMonthExistence(this.currentYear(), this.currentMonth());
  }

  loadMonthExistence(year: number, month: number) {
    this.appointmentService
      .loadAppointmentsExistenceForMonth(year, month)
      .subscribe();
  }

  generateCalendar() {
    // Implementation for generating the calendar
  }

  getCurrentMonthDate(): Date {
    return new Date(this.currentYear(), this.currentMonth(), 1);
  }

  isSameDate(a: Date, b: Date): boolean {
    return (
      a.getFullYear() === b.getFullYear() &&
      a.getMonth() === b.getMonth() &&
      a.getDate() === b.getDate()
    );
  }

  selectDay(day: CalendarDay) {
    this.selectedDay.set(day);
  }
}

import { Component, computed, inject, signal } from '@angular/core';
import { CalendarDay } from '../../models/calendar.model';
import { AppointmentService } from '../../services/common/appointment.service';
import { Appointment } from '../../models/appointment.model';

@Component({
  selector: 'app-admin-calendar',
  imports: [],
  templateUrl: './admin-calendar.component.html',
  styleUrl: './admin-calendar.component.scss',
})
export class AdminCalendarComponent {
  private apptStore = inject(AppointmentService);
  calendarDays = signal<CalendarDay[]>([]);
  currentMonth = signal(new Date());
  selectedDay = signal<CalendarDay | null>(null);
  readonly dayNames = ['Pon', 'Wt', 'Śr', 'Czw', 'Pt', 'Sob', 'Ndz'];

  today = new Date();

  // appointments = signal<Record<string, Appointment[]>>({
  //   // format: 'YYYY-MM-DD': [...]
  //   '2025-08-10': [
  //     { id: 1, time: '10:00', clientName: 'Alice', service: 'French' },
  //     { id: 2, time: '14:00', clientName: 'Bob', service: 'Pedi' },
  //   ],
  //   '2025-08-12': [
  //     { id: 3, time: '13:00', clientName: 'Clara', service: 'Mani' },
  //   ],
  // });

  private apptsByDate = computed(() => {
    const map = new Map<string, Appointment[]>();
    for (const a of this.apptStore.appointments()) {
      const arr = map.get(a.date) ?? [];
      arr.push(a);
      map.set(a.date, arr);
    }
    return map;
  });

  // 3) calendar grid (reacts when appointments or month change)
  readonly weeks = computed(() => {
    const start = new Date(
      this.currentMonth().getFullYear(),
      this.currentMonth().getMonth(),
      1
    );
    const dayOfWeek = start.getDay(); // 0=Sun ... 1=Mon
    const offset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; // start on Monday

    const days: CalendarDay[] = [];
    const dayCursor = new Date(start);
    dayCursor.setDate(dayCursor.getDate() + offset);

    for (let i = 0; i < 42; i++) {
      const dateStr = this.formatDateLocal(dayCursor); // ⬅ local-safe
      const day: CalendarDay = {
        date: new Date(dayCursor),
        isCurrentMonth: dayCursor.getMonth() === this.currentMonth().getMonth(),
        isToday: this.isSameDate(dayCursor, this.today),
        appointments: this.apptsByDate().get(dateStr) ?? [], // ⬅ from map
      };
      days.push(day);
      dayCursor.setDate(dayCursor.getDate() + 1);
    }

    const weeks: CalendarDay[][] = [];
    for (let i = 0; i < days.length; i += 7) weeks.push(days.slice(i, i + 7));
    return weeks;
  });

  // ---- helpers ----

  // Avoid toISOString() (TZ shifts). Format as local YYYY-MM-DD.
  private formatDateLocal(d: Date): string {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }

  isSameDate(a: Date, b: Date): boolean {
    return a.getFullYear() === b.getFullYear()
        && a.getMonth() === b.getMonth()
        && a.getDate() === b.getDate();
  }

  selectDay(day: CalendarDay) {
    this.selectedDay.set(day);
  }

  prevMonth() {
    const current = this.currentMonth();
    this.currentMonth.set(new Date(current.getFullYear(), current.getMonth() - 1, 1));
  }

  nextMonth() {
    const current = this.currentMonth();
    this.currentMonth.set(new Date(current.getFullYear(), current.getMonth() + 1, 1));
  }
}
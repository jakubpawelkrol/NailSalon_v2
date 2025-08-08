import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { ServicesComponent } from './components/services/services.component';
import { ScheduleComponent } from './components/schedule/schedule.component';
import { GalleryComponent } from './components/gallery/gallery.component';
import { ContactComponent } from './components/contact/contact.component';
import { AdminCalendarComponent } from './components/admin-calendar/admin-calendar.component';
import { LoginComponent } from './components/login/login.component';
import { AboutComponent } from './components/about/about.component';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'services', component: ServicesComponent },
  { path: 'schedule', component: ScheduleComponent },
  { path: 'gallery', component: GalleryComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'admin', component: AdminCalendarComponent },
  { path: 'login', component: LoginComponent },
  { path: 'about', component: AboutComponent },
];

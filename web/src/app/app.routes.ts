import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { ServicesComponent } from './components/services/services.component';
import { ScheduleComponent } from './components/schedule/schedule.component';
import { GalleryComponent } from './components/gallery/gallery.component';
import { ContactComponent } from './components/contact/contact.component';
import { AdminCalendarComponent } from './components/admin-calendar/admin-calendar.component';
import { LoginComponent } from './components/auth/login/login.component';
import { AboutComponent } from './components/about/about.component';
import { SignupComponent } from './components/auth/signup/signup.component';
import { adminGuard, authGuard } from './components/auth/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'services', component: ServicesComponent },
  {
    path: 'schedule',
    canActivate: [authGuard],
    component: ScheduleComponent,
  },
  { path: 'gallery', component: GalleryComponent },
  { path: 'contact', component: ContactComponent },
  {
    path: 'admin',
    canActivate: [adminGuard],
    component: AdminCalendarComponent,
  },
  { path: 'login', component: LoginComponent },
  { path: 'about', component: AboutComponent },
  { path: 'signup', component: SignupComponent },
];

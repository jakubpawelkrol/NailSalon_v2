import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/common/auth.service';
import { map } from 'rxjs/operators';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-site-header',
  imports: [RouterLink, AsyncPipe],
  templateUrl: './site-header.component.html',
  styleUrl: './site-header.component.scss',
})
export class SiteHeaderComponent {
  auth = inject(AuthService);

  user$ = this.auth.getUser();

  greeting$ = this.user$.pipe(map((user) => (user ? `Witaj ${user?.firstName}` : 'Witaj nieznajoma')));

  isLoggedIn$ = this.user$.pipe(map(user => !!user));

  logout() {
    this.auth.logout();
  }
}

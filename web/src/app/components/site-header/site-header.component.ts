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

  user$ = this.auth.getUserSubscription();

  greeting$ = this.user$.pipe(map((user) => `Witaj ${user?.firstName}`));

  isLoggedIn$ = this.auth.isLoggedIn();

  logout() {
    this.auth.logout();
  }
}

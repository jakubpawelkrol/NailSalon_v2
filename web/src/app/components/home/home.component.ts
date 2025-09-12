import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RestService } from '../../services/common/rest.service';
import { AuthService } from '../../services/common/auth.service';
import { map } from 'rxjs/operators';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-home',
  imports: [RouterLink, AsyncPipe],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  private auth = inject(AuthService);

  user$ = this.auth.getUser();
  isLoggedIn$ = this.user$.pipe(map((user) => !!user));
  isAdmin$ = this.auth.isAdmin();
}

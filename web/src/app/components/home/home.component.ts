import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RestService } from '../../services/common/rest-service.service';
import { AuthService } from '../../services/common/auth.service';

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  private auth = inject(AuthService);
  private rest = inject(RestService);

  isLoggedIn(): boolean {
    return this.auth.isLoggedIn();
  }

  isAdmin(): boolean {
    return this.auth.isAdmin();
  }

  helloWorld() {
    this.rest.hello();
  }
}

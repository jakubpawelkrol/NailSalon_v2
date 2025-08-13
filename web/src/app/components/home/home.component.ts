import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MockAuthService } from '../../services/common/mock-auth.service';
import { RestService } from '../../services/common/rest-service.service';

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  private auth = inject(MockAuthService);
  private rest = inject(RestService);

  isLoggedIn(): boolean {
    return this.auth.isLoggedIn();
  }

  helloWorld() {
    this.rest.hello();
  }
}

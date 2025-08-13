import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MockAuthService } from '../../services/common/mock-auth.service';

@Component({
  selector: 'app-site-header',
  imports: [RouterLink],
  templateUrl: './site-header.component.html',
  styleUrl: './site-header.component.scss'
})
export class SiteHeaderComponent {
  auth = inject(MockAuthService);

  // Computed to format greeting text
  greeting = computed(() => {
    const user = this.auth.user()?.name;
    return user ? `Witaj ${user}` : null;
  });

  logout() {
    this.auth.logout();
  }
}

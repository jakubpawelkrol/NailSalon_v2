import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/common/auth.service';
import { map } from 'rxjs/operators';
import { AsyncPipe } from '@angular/common';
import { DropdownMenuComponent } from '../dropdown-menu/dropdown-menu.component';
import { DropdownOption } from '../../models/dropdown.model';

@Component({
  selector: 'app-site-header',
  imports: [RouterLink, AsyncPipe, DropdownMenuComponent],
  templateUrl: './site-header.component.html',
  styleUrl: './site-header.component.scss',
})
export class SiteHeaderComponent {
  private auth = inject(AuthService);

  user$ = this.auth.getUserSubscription();

  greeting$ = this.user$.pipe(
    map((user) => (user ? `Witaj ${user?.firstName}` : 'Witaj nieznajoma'))
  );

  isLoggedIn$ = this.auth.isAuthenticated();

  isDropdownOpen = signal(false);

  menuItems = computed((): DropdownOption[] => {
    console.log('Recomputing menu items');
    let isAdmin: boolean = false;
    console.log('Is admin: ', isAdmin);

    this.auth.isAdmin().subscribe((admin) => {
      console.log('Admin status from service: ', admin);
      isAdmin = admin;
    });

    const items: DropdownOption[] = [
      { label: 'Profil', route: '/profile', icon: 'fas fa-user' },
    ];
    if (isAdmin) {
      items.push(
        { label: 'Divider', divider: true },
        {
          label: 'Zarządzaj użytkownikami',
          route: '/admin/users',
          icon: 'fas fa-cog',
          visible: true,
        },
        {
          label: 'Kalendarz',
          route: '/calendar',
          icon: 'fas fa-calendar',
          visible: true,
        }
      );
    }

    items.push(
      { label: 'Divider', divider: true },
      {
        label: 'Wyloguj',
        action: () => this.logout(),
        icon: 'fas fa-sign-out-alt',
      }
    );

    return items;
  });

  toggleDropdown() {
    console.log('Toggling dropdown');
    this.isDropdownOpen.update((open) => !open);
  }

  onItemClick(item: DropdownOption) {
    console.log('Clicked item: ', item.label);
    this.isDropdownOpen.set(false);
  }

  logout() {
    this.auth.logout();
  }
}

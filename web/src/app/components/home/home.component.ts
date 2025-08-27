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
  private rest = inject(RestService);

  user$ = this.auth.getUser();
  isLoggedIn$ = this.user$.pipe(map(user => !!user));
  isAdmin$ = this.user$.pipe(map(user => user?.role === 'ADMIN'));

  helloWorld() {
    this.rest.hello();
  }

  printUserCookie() {
    console.log('getUser(): ', this.auth.getUser());
    this.auth.getUser().subscribe(user => {
      console.log('User cookie:', user);
    });
  }

  printCookie(name: string) {
    const temp = document.cookie.split(';');
    for (let i = 0; i < temp.length; i++) {
      console.log("Cookie part:", temp[i]);
    }
    console.log("printCookie() called for ", name);
    console.log("Cookie string: ", document.cookie);
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    console.log("Match: ", match);
    if (match) {
      console.log("Cookie: ", decodeURIComponent(match[2]));
      return;
    }
    console.log("No cookie found with name:", name);
  }
}

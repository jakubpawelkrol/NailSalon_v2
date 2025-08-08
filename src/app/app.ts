import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SiteHeaderComponent } from './components/site-header/site-header.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SiteHeaderComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('nail-salon-scheduler');
}

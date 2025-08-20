import { Component, input } from '@angular/core';

@Component({
  selector: 'app-generic-button',
  imports: [],
  templateUrl: './generic-button.component.html',
  styleUrl: './generic-button.component.scss',
})
export class GenericButtonComponent {
  label = input<string>('Click me');
  disabled = input<boolean>(false);

  action = input<(...args: any[]) => void>();
  actionArgs = input<any[]>([]);

  handleClick() {
    this.action();
  }
}

import { CommonModule } from '@angular/common';
import { Component, inject, input, output } from '@angular/core';
import { Router } from '@angular/router';

export type ButtonType =
  | 'custom'
  | 'navigate'
  | 'confirm'
  | 'cancel'
  | 'save'
  | 'submit'
  | 'delete'
  | 'refresh';
export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'danger'
  | 'warning'
  | 'info'
  | 'light'
  | 'dark';
export type ButtonSize = 'sm' | 'md' | 'lg' | 'inherit';

@Component({
  selector: 'app-button',
  imports: [CommonModule],
  templateUrl: './generic-button.component.html',
  styleUrl: './generic-button.component.scss',
})
export class GenericButtonComponent {
  private router = inject(Router);

  label = input<string>('Click me');
  disabled = input<boolean>(false);
  type = input<ButtonType>('custom');
  loading = input<boolean>(false);
  loadingText = input<string>('Ładowanie...');

  variant = input<ButtonVariant>('primary');
  size = input<ButtonSize>('md');
  fullWidth = input<boolean>(false);
  outline = input<boolean>(false);

  buttonClick = output<any[]>();
  clickArgs = input<any[]>([]);
  navigateTo = input<string>();

  get buttonClasses(): string {
    const classes = ['btn'];
    const buttonSize = this.size();

    if (buttonSize !== 'inherit') {
      classes.push(`btn-${buttonSize}`);
    } else {
      classes.push('btn-inherit');
    }

    if (this.outline()) {
      classes.push(`btn-outline-${this.variant()}`);
    } else {
      classes.push(`btn-${this.variant()}`);
    }

    if (this.fullWidth()) classes.push('btn-full-width');
    if (this.loading()) classes.push('btn-loading');
    if (this.disabled()) classes.push('btn-disabled');

    return classes.join(' ');
  }

  handleClick() {
    const args = this.clickArgs() || [];
    const buttonType = this.type();

    switch (buttonType) {
      case 'navigate':
        const route = this.navigateTo();
        this.router.navigate([route]);
        break;
      case 'submit':
        this.buttonClick.emit(['submit', ...args]);
        break;
      case 'cancel':
        this.handleCancel(args);
        break;
      case 'custom':
      default:
        this.buttonClick.emit(args || []);
    }
  }

  private handleCancel(args: any[]) {
    this.buttonClick.emit(['cancel', ...args]);
  }
}

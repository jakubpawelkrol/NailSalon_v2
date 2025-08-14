import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MockAuthService } from '../../../services/common/mock-auth.service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: '../auth.shared.scss'
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private auth = inject(MockAuthService);
  private router = inject(Router);

  loading = false;
  error = '';

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  async submit() {
    this.error = '';
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.loading = true;
    try {
      await this.auth.login(this.form.value.email!, this.form.value.password!);
      this.router.navigate(['/']);
    } catch (e: any) {
      this.error = e?.message || 'Problem z logowaniem';
    } finally {
      this.loading = false;
    }
  }

  hasErr(ctrl: string, err?: string) {
    const c = this.form.get(ctrl);
    return err ? !!(c?.touched && c.hasError(err)) : !!(c?.touched && c.invalid);
  }
}
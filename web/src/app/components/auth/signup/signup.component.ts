// signup.component.ts (standalone)
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/common/auth.service';

@Component({
  standalone: true,
  selector: 'app-signup',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './signup.component.html',
  styleUrl: '../auth.shared.scss',
})
export class SignupComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);

  loading = false;
  error = '';

  form = this.fb.group({
    firstName: ['', [Validators.required, Validators.minLength(2)]],
    lastName: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  async submit() {
    console.log('Submitting signup form:', this.form.value);
    this.error = '';
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.loading = true;
    try {
      await this.auth.signup({
        firstName: this.form.value.firstName!,
        lastName: this.form.value.lastName!,
        email: this.form.value.email!,
        password: this.form.value.password!,
      });
      this.router.navigate(['/']);
    } catch (e: any) {
      this.error = e?.message || 'Problem z rejestracją';
    } finally {
      this.loading = false;
      console.log('Signup completed, loading: ', this.loading);
    }
    console.log('Signup form submitted:', this.form.value);
  }

  hasErr(ctrl: string, err?: string) {
    const c = this.form.get(ctrl);
    return err
      ? !!(c?.touched && c.hasError(err))
      : !!(c?.touched && c.invalid);
  }
}

// signup.component.ts (standalone)
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MockAuthService } from '../../services/common/mock-auth.service';

@Component({
  standalone: true,
  selector: 'app-signup',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss',
})
export class SignupComponent {
  private fb = inject(FormBuilder);
  private auth = inject(MockAuthService);
  private router = inject(Router);

  loading = false;
  error = '';

  form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
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
      await this.auth.signup(
        this.form.value.name!,
        this.form.value.email!,
        this.form.value.password!
      );
      this.router.navigate(['/']);
    } catch (e: any) {
      this.error = e?.message || 'Problem z rejestracją';
    } finally {
      this.loading = false;
    }
  }

  hasErr(ctrl: string, err?: string) {
    const c = this.form.get(ctrl);
    return err ? !!(c?.touched && c.hasError(err)) : !!(c?.touched && c.invalid);
  }
}

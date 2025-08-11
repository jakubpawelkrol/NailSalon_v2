import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { MockAuthService } from './services/common/mock-auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(MockAuthService);
  const session = localStorage.getItem('dev_session');
  const token = session ? (JSON.parse(session).accessToken as string) : null;
  if (token) {
    req = req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
  }
  return next(req);
};

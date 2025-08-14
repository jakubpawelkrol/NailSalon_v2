// mock-auth.service.ts
import { Injectable, signal } from '@angular/core';
import { AuthFacade, User, AuthResult } from '../../models/auth.model';

const LS_USERS = 'dev_users';
const LS_SESSION = 'dev_session';

function b64(str: string) { return btoa(unescape(encodeURIComponent(str))); }
function fakeJwt(payload: any) { return `header.${b64(JSON.stringify(payload))}.sig`; }

@Injectable({ providedIn: 'root' })
export class MockAuthService implements AuthFacade {
  private _user = signal<User | null>(null);

  constructor() {
    const session = JSON.parse(localStorage.getItem(LS_SESSION) || 'null');
    if (session?.user) this._user.set(session.user);
  }

  user() { return this._user(); }
  isLoggedIn() { return !!this._user(); }

  async signup(name: string, email: string, password: string): Promise<AuthResult> {
    // dev-db
    const users: Array<User & { password: string }> = JSON.parse(localStorage.getItem(LS_USERS) || '[]');
    if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
      throw new Error('E-mail już istnieje');
    }
    const newUser: User & { password: string } = {
      id: crypto.randomUUID(),
      name, email, password   // ⚠️ dev-only; don’t store plaintext in real apps
    };
    users.push(newUser);
    localStorage.setItem(LS_USERS, JSON.stringify(users));
    return this.finishLogin(newUser);
  }

  async login(email: string, password: string): Promise<AuthResult> {
    const users: Array<User & { password: string }> = JSON.parse(localStorage.getItem(LS_USERS) || '[]');
    const found = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
    if (!found) throw new Error('Błędny e-mail lub hasło');
    return this.finishLogin(found);
  }

  logout() {
    localStorage.removeItem(LS_SESSION);
    this._user.set(null);
  }

  private async finishLogin(u: User & { password: string }): Promise<AuthResult> {
    const user: User = { id: u.id, name: u.name, email: u.email };
    const accessToken = fakeJwt({ sub: u.id, email: u.email, name: u.name });
    localStorage.setItem(LS_SESSION, JSON.stringify({ user, accessToken }));
    this._user.set(user);
    return { user, accessToken };
  }
}

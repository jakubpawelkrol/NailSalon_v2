export interface User {
    id: string;
    email: string;
    name: string;
  }
  
  export interface AuthResult {
    user: User;
    accessToken: string;   // mock for now
  }
  
  export abstract class AuthFacade {
    abstract user(): User | null;        // current user (sync)
    abstract isLoggedIn(): boolean;
    abstract login(email: string, password: string): Promise<AuthResult>;
    abstract signup(name: string, email: string, password: string): Promise<AuthResult>;
    abstract logout(): void;
    // optional: refresh(): Promise<void>;
  }
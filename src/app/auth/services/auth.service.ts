import { computed, inject, Injectable, Signal, signal } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, Observable, of, tap, throwError } from 'rxjs';
import { AuthStatus, CheckTokenResponse, LoginResponse, User } from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly baseUrl: string = environment.baseUrl;
  private readonly http: HttpClient = inject(HttpClient);

  private _currentUser = signal<User | null>(null);
  private _authStatus = signal<AuthStatus>(AuthStatus.checking);

  public currentUser: Signal<User | null> = computed( () => this._currentUser() );
  public authStatus: Signal<AuthStatus> = computed( () => this._authStatus() );

  constructor() {
    this.checkAuthStatus().subscribe();
  }

  private setAuthentication(user: User, token: string): boolean {
    this._currentUser.set(user);
    this._authStatus.set(AuthStatus.authenticated);
    localStorage.setItem('token', token);

    return true;
  }

  public login(email: string, password: string): Observable<boolean> {

    const endpoint: string = `${this.baseUrl}/auth/login`;
    const body = { email: email, password: password }; 
    
    return this.http.post<LoginResponse>(endpoint, body)
      .pipe(
        map( response => this.setAuthentication(response.user, response.token)),
        catchError(error => throwError( () => error.error.message))
      ); 
  }

  public logout(): void {
    localStorage.removeItem('token');
    this._currentUser.set(null);
    this._authStatus.set(AuthStatus.notAuthenticated);
  }

  public checkAuthStatus(): Observable<boolean> {
    const endpoint = `${this.baseUrl}/auth/check-token`;
    const token = localStorage.getItem('token');

    if (!token) {
      this.logout();
      of(false);
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get<CheckTokenResponse>(endpoint, { headers })
      .pipe(
        map(response => this.setAuthentication(response.user, response.token)),
        catchError(() => of(false))
      );
  }
}

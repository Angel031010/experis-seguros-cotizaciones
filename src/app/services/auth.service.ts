import { computed, inject, Injectable, signal } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, tap, throwError } from 'rxjs';
import { ChangePasswordDto, LoginDto, LoginResponseDto, User } from '../interfaces/auth.models';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  
  private currentUserSignal = signal<User | null>(this.getUserFromStorage());
  
  currentUser = computed(() => this.currentUserSignal());
  isAuthenticated = computed(() => !!this.currentUserSignal()?.token);
  userRole = computed(() => this.currentUserSignal()?.rol || '');
  
  private apiUrl = `${environment.api.apiUrl}/Auth`;

  login(loginDto: LoginDto): Observable<LoginResponseDto> {
    return this.http.post<LoginResponseDto>(`${this.apiUrl}/login`, loginDto)
      .pipe(
        tap(response => {
          const user: User = {
            email: response.email,
            nombre: response.nombre,
            rol: response.rol,
            token: response.token
          };
          this.setUser(user);
        }),
        catchError(error => {
          console.error('Login error:', error);
          return throwError(() => error);
        })
      );
  }

  changePassword(changePasswordDto: ChangePasswordDto): Observable<any> {
    return this.http.post(`${this.apiUrl}/change-password`, changePasswordDto);
  }

  logout(): void {
    this.http.post(`${this.apiUrl}/logout`, {}).subscribe({
      complete: () => {
        this.clearUser();
        this.router.navigate(['/login']);
      }
    });
  }

  private setUser(user: User): void {
    localStorage.setItem('currentUser', JSON.stringify(user));
    this.currentUserSignal.set(user);
  }

  private clearUser(): void {
    localStorage.removeItem('currentUser');
    this.currentUserSignal.set(null);
  }

  private getUserFromStorage(): User | null {
    const userStr = localStorage.getItem('currentUser');
    return userStr ? JSON.parse(userStr) : null;
  }

  getToken(): string | null {
    return this.currentUser()?.token || null;
  }

  hasRole(role: string): boolean {
    return this.userRole() === role;
  }

  hasAnyRole(roles: string[]): boolean {
    return roles.includes(this.userRole());
  }
}
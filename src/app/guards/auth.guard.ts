import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  if (authService.isAuthenticated()) {
    const requiredRoles = route.data['roles'] as string[];
    if (requiredRoles && !authService.hasAnyRole(requiredRoles)) {
      router.navigate(['/unauthorized']);
      return false;
    }
    return true;
  }
  
  const requiredRoles = route.data['requiredRoles'] as string[] | undefined;
  if (requiredRoles && requiredRoles.length > 0) {
    const userRole = authService.userRole();
    if (!requiredRoles.includes(userRole)) {
      router.navigate(['/polizas']); // Redirigir a una página permitida
      return false;
    }
  }
  
  return true;

};
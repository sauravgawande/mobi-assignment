import { inject, Injectable } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import  {UserRole} from '../interfaces/user';


/* Auth guard :start region */
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn()) {
    const userRole = authService.getUserRole();
    const requiredRole: UserRole = route.data['role'];
    if (userRole === requiredRole) {
      return true;
    } else {
      const userId = authService.getUserId();
      if (userRole && userId) {
        const redirectRoutes: { [role in UserRole]: string } = {
          [UserRole.SUPER_USER]: `/super-user-dashboard/${userId}`,
          [UserRole.ADMIN]: `/admin-dashboard/${userId}`,
          [UserRole.USER]: `/user-dashboard/${userId}`,
        };
        router.navigate([redirectRoutes[userRole]]);
      } else {
        router.navigate(['/login']);
      }
      return false;
    }
  } else {
    router.navigate(['/login']);
    return false;
  }
};
/* Auth guard :end region */

/* Login guard :start region */
export const loginGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn()) {
    const userRole = authService.getUserRole();
    const userId = authService.getUserId();

    if (userRole && userId) {
      const redirectRoutes: { [role in UserRole]: string } = {
        [UserRole.SUPER_USER]: `/super-user-dashboard/${userId}`,
        [UserRole.ADMIN]: `/admin-dashboard/${userId}`,
        [UserRole.USER]: `/user-dashboard/${userId}`,
      };
      router.navigate([redirectRoutes[userRole]]);
      return false;
    }
    return false;
  } else {
    return true;
  }
};
/* Login guard :end region */
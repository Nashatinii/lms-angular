import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn()) {
    const role = authService.getRole();
    const requiredRole = route.data?.['role']; // You can define required roles in the route's data

    // If the route requires a specific role and the user's role doesn't match
    if (requiredRole && requiredRole !== role) {
      // Redirect to a page where the user cannot access the current page
      router.navigate(['/access-denied']);
      return false; // Prevent access to the route
    }

    // If user is logged in, redirect based on their role if they are trying to access the login page
    if (route.routeConfig?.path === 'login') {
      if (role === 'Admin') {
        router.navigate(['/requests']);
      } 
      else if (role === 'student') {
        router.navigate(['/studentMyCourse']);
      }
       else if (role === 'instructor') {
        router.navigate(['/insHome']);
      }
      return false; // Prevent navigation to login page
    }

    // Allow access to the route if the user is logged in and roles match
    return true;
  } else {
    // If not logged in, redirect to login page
    router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return false; // Prevent access to the requested route
  }
};

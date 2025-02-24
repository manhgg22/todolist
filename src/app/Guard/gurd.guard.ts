import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';

export const gurdGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const isLoggedIn = !!localStorage.getItem("Login"); 
  if (!isLoggedIn) {
    router.navigate(['/login']); 
    return false;
  }
  return true; 
};

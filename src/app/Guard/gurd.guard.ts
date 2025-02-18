import { CanActivateFn } from '@angular/router';

export const gurdGuard: CanActivateFn = (route, state) => {
  return true;
};

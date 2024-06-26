import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { Observable, of, switchMap } from 'rxjs';
import { AuthService } from '../services/auth/auth.service';

export const AuthGuard: CanActivateFn = (route, state): Observable<boolean | UrlTree> => {
  const router: Router = inject(Router);
  // Check the authentication status
  
  return inject(AuthService).getRole().pipe(

    switchMap((roleData) => {
      const localUrl = state.url.split('/')[1]
      if (localUrl === 'home') {
        return of(true)
      }else if (localUrl === 'dashboard' && roleData === 'user') {
        return of(true)
      } else if (localUrl === 'pacientes' && roleData === 'patient') {
        return of(true)
      } else {
        const urlTree = router.parseUrl('/home');
        localStorage.clear()
        return of(urlTree);
      }
    }),
  );
};

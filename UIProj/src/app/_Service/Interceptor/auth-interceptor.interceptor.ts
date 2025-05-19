import { HttpErrorResponse, HttpEventType, HttpInterceptorFn } from '@angular/common/http';
import { catchError, tap, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { inject } from '@angular/core';
import {
  //...
  EMPTY,
  //...
} from 'rxjs';

export const authInterceptorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  
  return next(req).pipe(
    catchError((e: HttpErrorResponse) => {
      let url = e.url;
      if (e.status === 401 && !url?.includes('GenerateToken')) {
        // tokenService.removeToken();
        router.navigateByUrl('/login');
        return EMPTY;
      }
  
      const error = e.error?.error?.message || e.statusText;
      
      return throwError(() => error);
    })
  );
};

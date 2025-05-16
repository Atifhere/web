import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { LoaderService } from '../loader.service';
import { catchError, tap, throwError } from 'rxjs';

export const TokenInterceptor: HttpInterceptorFn = (req, next) => {
  const loaderService = inject(LoaderService);
  const router = inject(Router);

  const token = localStorage.getItem('token');
  const clonedRequest = req.clone({
    setHeaders: {
      Authorization: token ? 'Bearer ' + token : '',
    },
  });

  // Show loader before request
  loaderService.show();

  return next(clonedRequest).pipe(
    tap({
      next: (event) => {
        // Optionally handle success if needed
      },
    }),
    catchError((error) => {
      // Handle 401 or network errors
      if (error.status === 0) {
        // Network error (no response)
        console.error('Network error occurred');
      } else if (error.status === 401 || error == "Unknown Error") {
        // Unauthorized
        console.error('Unauthorized, redirecting to login');
        router.navigate(['/login']);
      }

      return throwError(() => error);
    }),
    tap({
      complete: () => {
        // Always hide loader
        loaderService.hide();
      },
      error: () => {
        // Ensure loader hides even on error
        loaderService.hide();
      }
    })
  );
};

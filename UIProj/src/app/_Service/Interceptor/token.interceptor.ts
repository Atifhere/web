import { HttpInterceptorFn } from '@angular/common/http';
import { LoaderService } from '../loader.service'; // Adjust the path as necessary
import { tap } from 'rxjs';

export const TokenInterceptor: HttpInterceptorFn = (req, next) => {
  const loaderService = new LoaderService(); // Ensure this is the right way to get the instance in your context
  
  let token = localStorage.getItem('token');
  const clonedRequest = req.clone({
    setHeaders: {
      Authorization: 'Bearer ' + token,
    },
  });

  // Show the loader before sending the request
  //loaderService.show();

  return next(clonedRequest).pipe(
    tap({
      next: (event) => {
        // Handle successful request
      },
      error: () => {
        // Handle error response
      },
      complete: () => {
        // Hide the loader after the request is complete
        loaderService.hide();
      }
    })
  );
};
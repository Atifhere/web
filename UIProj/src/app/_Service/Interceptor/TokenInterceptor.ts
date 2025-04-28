import { Injectable } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { LoaderService } from '../loader.service'; // Adjust the path as necessary
import { HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class TokenInterceptor {
  constructor(private loaderService: LoaderService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('token');
    const clonedRequest = req.clone({
      setHeaders: {
        Authorization: 'Bearer ' + token,
      },
    });

    // Show the loader before sending the request
    //this.loaderService.show();

    return next.handle(clonedRequest).pipe(
      tap({
        next: () => {},
        error: () => {},
        complete: () => {
          // Hide the loader after the request is complete
          this.loaderService.hide();
        }
      })
    );
  }
}
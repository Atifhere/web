import { HttpInterceptorFn } from '@angular/common/http';

export const TokenInterceptor: HttpInterceptorFn = (req, next) => {
let token = localStorage.getItem('token');
let jwttoken = req.clone({
  setHeaders: {
    authorization:'Bearer ' + token
  }
})

  return next(jwttoken);
};

// Register this interceptor in app.config file.
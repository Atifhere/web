import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserService } from '../_Service/user.service';
import { menuPermission } from '../_model/user.model';

export const authGuard: CanActivateFn = (route, state) => {
  let router = inject(Router);
  let service = inject(UserService);
  // same way in ject the taoster

  let menuName = '';
  if (route.url.length > 0) {
    menuName = route.url[0].path;
  }

  if (localStorage.getItem('userName') != null) {
    let token = localStorage.getItem('token') as string;

    if (!token) {
      router.navigateByUrl('/login');
      return false;
    }
    let userRole = localStorage.getItem('userRole') as string;

    if (menuName != '' && menuName != null) {
      service.GetMenuPermission(userRole, menuName).subscribe((item) => {
        if (item.haveview) return true;
        else {
          console.log('Unauthorized Access');
          router.navigateByUrl('/');
          return false;
        }
      });
      return true;
    } else {
      return true;
    }
  } else {
    console.log('Unauthorized Access');
    router.navigateByUrl('/login');
    return false;
  }
};

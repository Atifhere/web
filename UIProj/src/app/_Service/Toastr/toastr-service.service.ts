import { Injectable } from '@angular/core';
import { ToastrService, ToastNoAnimation } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class ToastrSrvc {
  constructor(private toastr: ToastrService) {}

  ShowSuccess(message: string) {
    this.toastr.success(message, 'Success');
  }

  
  ShowInfo(message: string, title: string) {
    this.toastr.info(message, title, {timeOut: 2500});
  }
  ShowError(message: string) {
    this.toastr.error(message, 'Error');
  }

  Confirm() {
    this.toastr.success('message', 'title');
  }
}

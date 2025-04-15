import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../_Service/user.service';
import { Router, RouterLink } from '@angular/router';
import { registerConfirm, ResetPassword, UserRegister } from '../../_model/user.model';
import { MaterialModule } from '../../material.module';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [ReactiveFormsModule, MaterialModule, RouterLink],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css'
})
export class ResetPasswordComponent implements OnInit {
  constructor(private fb: FormBuilder, private Service: UserService, private router: Router) {}
  ngOnInit(): void {

  }
  resetForm = this.fb.group({
    // userName: this.fb.control('', Validators.required),
    oldPassword: this.fb.control('', Validators.required),
    newPassword: this.fb.control('', Validators.required),
  });
  response: any;


  ProceedChange() {
    console.log('Register hit');

    if (this.resetForm.valid) {
      let obj: ResetPassword = {
        userName: localStorage.getItem('userName') as string,
        oldPassword: this.resetForm.value.oldPassword as string,
        newPassword : this.resetForm.value.newPassword as string
      };
      // console.log('Register hit', obj);
      this.Service.ResetPassword(obj).subscribe((item) => {
        this.response = item;
        if (this.response.success == true) {

        
          alert('Please login with new password.');
          this.router.navigateByUrl('/login');
        } else {
          alert(this.response.errorMessage);
        }
      });
    }
  }
}

import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MaterialModule } from '../../material.module';
import { Router, RouterLink } from '@angular/router';
import { Login, registerConfirm, UserRegister } from '../../_model/user.model';
import { UserService } from '../../_Service/user.service';
import { ToastrService } from 'ngx-toastr';
import { TokenService } from '../../_Service/token.service';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, MaterialModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  showError: boolean = false;
  constructor(
    private fb: FormBuilder,
    private Service: UserService,
    private router: Router,
    private toastr: ToastrService,
    private tokenService: TokenService,    
    private dialogRef: MatDialogRef<RegisterComponent>

  ) {}
  regForm = this.fb.group({
    firstName: this.fb.control(
      '',
      Validators.compose([Validators.required, Validators.minLength(1)])
    ),
    lastName: this.fb.control(
      '',
      Validators.compose([Validators.required, Validators.minLength(1)])
    ),
    password: this.fb.control('', Validators.required),
    confirmPassword: this.fb.control('', Validators.required),
    email: this.fb.control('', [Validators.required, Validators.email]),
    phone: this.fb.control('', Validators.required),
  });
  response: any;
  Register() {
    if (this.regForm.value.password != this.regForm.value.confirmPassword) {
      this.toastr.error('Password and confirm password should match!')
      return;
    }
    if (this.regForm.valid) {
      let obj: UserRegister = {
        firstName: this.regForm.value.firstName as string,
        email: this.regForm.value.email as string,
        lastName: this.regForm.value.lastName as string,
        phone: this.regForm.value.phone as string,
        password: this.regForm.value.password as string,
      };
      this.Service.UserRegisteration(obj).subscribe((item) => {
        this.response = item;
        if (this.response.success == true) {
          //  WE WILL IMPLEMENT THE OTP FEATURE LATER WITH THE TEAM I.A !!!
          // let confirmObj : registerConfirm = {
          //   userid: this.response.message,
          //   userName: obj.userName,
          //   OtpText: ''
          // }
          // this.Service.registerResponse.set(confirmObj);
          // this.router.navigateByUrl('/otp');
          this.toastr.success(this.response.Message, 'Success');
          this.Login(obj.email, obj.password);
          this.dialogRef.close();
        } else {
          this.toastr.error(this.response.errorMessage,'Registration Failed');
        }
      });
    }
  }

  Login(userName: string, password: string) {
    let loginObj: Login = {
      username: userName,
      password: password,
    };

    this.Service.Login(loginObj).subscribe(
      (item) => {
        this.response = item;
        this.tokenService.Login(
          this.response.token,
          loginObj.username,
          this.response.userRole
        );

        this.Service.LoadMenuByRole(this.response.userRole).subscribe(
          (item) => {
            this.Service.menuList.set(item); // using signal
          }
        );

        this.router.navigateByUrl('/home');
      },
      (error) => {
        console.error('Login Failed');
      }
    );
  }

  close()
  {
    this.dialogRef.close();
  }
}

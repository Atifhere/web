import { Component, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MaterialModule } from '../../material.module';
import { UserService } from '../../_Service/user.service';
import { ResetPassword, UpdatePassword } from '../../_model/user.model';

@Component({
  selector: 'app-update-password',
  standalone: true,
  imports: [ReactiveFormsModule, MaterialModule, RouterLink],
  templateUrl: './update-password.component.html',
  styleUrl: './update-password.component.css',
})
export class UpdatePasswordComponent implements OnInit {
  currentUserName = '';
  constructor(
    private fb: FormBuilder,
    private Service: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentUserName = this.Service.userName();
  }

  resetForm = this.fb.group({
    password: this.fb.control('', Validators.required),
    otpText: this.fb.control('', Validators.required),
  });
  response: any;

  ProceedChange() {
    if (this.resetForm.valid) {
      let obj: UpdatePassword = {
        userName: this.currentUserName,
        password: this.resetForm.value.password as string,
        OtpText: this.resetForm.value.otpText as string,
      };
      this.Service.UpdatePassword(obj).subscribe((item) => {
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

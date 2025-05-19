import { Component, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { UserService } from '../../_Service/user.service';
import { Router, RouterLink } from '@angular/router';
import { ResetPassword } from '../../_model/user.model';
import { MaterialModule } from '../../material.module';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [ReactiveFormsModule, MaterialModule, RouterLink],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css'
})
export class ResetPasswordComponent implements OnInit {
  constructor(private fb: FormBuilder, private service: UserService, private router: Router) { }

  ngOnInit(): void { }

  resetForm = this.fb.group({
    oldPassword: ['', Validators.required],
    newPassword: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', Validators.required]
  }, { validators: this.passwordsMatchValidator });

  response: any;

  passwordsMatchValidator(group: AbstractControl): ValidationErrors | null {
    const newPasswordControl = group.get('newPassword');
    const confirmPasswordControl = group.get('confirmPassword');

    if (!newPasswordControl || !confirmPasswordControl) return null;

    const newPassword = newPasswordControl.value;
    const confirmPassword = confirmPasswordControl.value;

    if (newPassword !== confirmPassword) {
      confirmPasswordControl.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    } else {
      // clear only passwordMismatch error if it exists
      if (confirmPasswordControl.hasError('passwordMismatch')) {
        confirmPasswordControl.setErrors(null);
      }
      return null;
    }
  }


  ProceedChange() {
    if (this.resetForm.invalid) {
      this.resetForm.markAllAsTouched();
      return;
    }

    const obj: ResetPassword = {
      userName: localStorage.getItem('userName') || '',
      oldPassword: this.resetForm.value.oldPassword!,
      newPassword: this.resetForm.value.newPassword!
    };

    this.service.ResetPassword(obj).subscribe((item) => {
      this.response = item;
      if (this.response.success) {
        alert('Please login with new password.');
        this.router.navigateByUrl('/login');
      } else {
        alert(this.response.errorMessage);
      }
    });
  }

  get f() {
    return this.resetForm.controls;
  }
}

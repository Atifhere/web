import { Component, OnInit } from '@angular/core';
import { MaterialModule } from '../../material.module';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../../_Service/user.service';
import { registerConfirm } from '../../_model/user.model';

@Component({
  selector: 'app-confirm-otp',
  standalone: true,
  imports: [FormsModule, MaterialModule, RouterLink],
  templateUrl: './confirm-otp.component.html',
  styleUrl: './confirm-otp.component.css',
})
export class ConfirmOTPComponent implements OnInit {
  otpText: string = '';
  regResponse!: registerConfirm;
  response: any;

  constructor(private router: Router, private Service: UserService) {}
  ngOnInit(): void {
    this.regResponse = this.Service.registerResponse();
  }

  ConfirmOTP() {
    this.regResponse.OtpText = this.otpText;

    this.Service.ConfirmRegisteration(this.regResponse).subscribe((item) => {
      this.response = item;
      if (this.response.success == true) {
        this.Service.registerResponse.set({
          userid: 0,
          userName: '',
          OtpText: '',
        });
        alert(this.response.message);
        this.router.navigateByUrl('/login');
      }
      else
      {
        alert('Something went wrong Successfully!');
      }
    });
  }
}

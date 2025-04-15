import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from '../../material.module';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../../_Service/user.service';

@Component({
  selector: 'app-forget-password',
  standalone: true,
  imports: [FormsModule, MaterialModule, RouterLink],
  templateUrl: './forget-password.component.html',
  styleUrl: './forget-password.component.css'
})
export class ForgetPasswordComponent implements OnInit {
  userName: string = '';
  response: any;

  constructor(private router: Router, private Service: UserService) {}
  ngOnInit(): void {
  }

  Proceed() {
    this.Service.ForgetPassword(this.userName).subscribe((item) => {
      
      this.response = item;
      if (this.response.success == true) {
        alert(this.response.message);
        this.Service.userName.set(this.userName); // Signal Variable.
        this.router.navigateByUrl('/updatepassword');
      }
      else
      {
        alert('Something went wrong Successfully!');
      }
    });
  }

}

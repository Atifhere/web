import { Component, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MaterialModule } from '../../material.module';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../../_Service/user.service';
import { Login } from '../../_model/user.model';
import { TokenService } from '../../_Service/token.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, MaterialModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  showError: boolean = false;
  constructor(
    private fb: FormBuilder,
    private Service: UserService,
    private router: Router,
    private tokenService: TokenService
  ) {}

  ngOnInit(): void {
    // localStorage.clear();
    debugger
    this.tokenService.Logout();
    this.Service.menuList.set([]);
  }

  email:string = "atif@salonmanger.com";
  contactPerson:string = "Atif";
  contactNumber:string = "055-377-2347";
  companyName:string = "Salon Manager";
  address:string = "ABU DHABI - UAE";
  companyLogo:string = "assets/images/logo.png";
  response: any;
  loginForm = this.fb.group({
    userName: this.fb.control('', Validators.required),
    password: this.fb.control('', Validators.required),
  });

  Login() {
    if (this.loginForm.valid) {
      let loginObj: Login = {
        username: this.loginForm.value.userName as string,
        password: this.loginForm.value.password as string,
      };

      this.Service.Login(loginObj).subscribe(
        (item) => {
          this.response = item;
          // localStorage.setItem('token', this.response.token);
          // localStorage.setItem('userName', loginObj.username);
          // localStorage.setItem('userRole', this.response.userRole);
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

          this.router.navigateByUrl('/');
        },
        (error) => {
          this.showError = true;
          console.log('Login Failed');
        }
      );
    }
  }

  scrollToSection(sectionId: string): void {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

}

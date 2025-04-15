import { Component, DoCheck, effect, OnInit } from '@angular/core';
import { MaterialModule } from '../../material.module';
import { UserService } from '../../_Service/user.service';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { menu } from '../../_model/user.model';
import { TokenService } from '../../_Service/token.service';

@Component({
  selector: 'app-appmenu',
  standalone: true,
  imports: [MaterialModule, RouterOutlet, RouterLink],
  templateUrl: './appmenu.component.html',
  styleUrl: './appmenu.component.css',
})
export class AppmenuComponent implements OnInit, DoCheck {
  menuList!: menu[];
  loggedInUser: string = 'Atif';
  showMenu: boolean = false;
  formattedDate !: string;
  
  constructor(
    private Service: UserService,
    private router: Router,
    private tokenService: TokenService
  ) {
    setInterval(() => {
      let date = new Date();
      const formatter = new Intl.DateTimeFormat('en-US', {
        dateStyle: 'long',
      });
      this.formattedDate = formatter.format(date);
    }, 1000);
    effect(() => {
      this.menuList = this.Service.menuList();
    });
  }

  ngDoCheck(): void {
    this.loggedInUser = localStorage.getItem('userName') as string;
    this.SetAccess();
  }

  ngOnInit(): void {
    let userRole = localStorage.getItem('userRole') as string;

    this.Service.LoadMenuByRole(userRole).subscribe((item) => {
      this.menuList = item;
      console.log(this.menuList);
    });
  }

  SetAccess() {
    let userRole = localStorage.getItem('userRole');
    let currentUrl = this.router.url;
    this.showMenu = !(
      currentUrl === '/register' ||
      currentUrl === '/login' ||
      currentUrl === '/forgetpassword' ||
      currentUrl === '/resetPassword'
    );
  }

  Logout() {
    this.tokenService.Logout();
  }
}

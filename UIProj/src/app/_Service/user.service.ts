import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment.development';
import {
  Login,
  LoginResponse,
  menu,
  menuPermission,
  Menus,
  registerConfirm,
  ResetPassword,
  Role,
  UpdatePassword,
  UpdateStatus,
  updateuser,
  UserRegister,
  users,
} from '../_model/user.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient) {}
  baseUrl = environment.apiUrl;

  // State management concept ::: Signals
  registerResponse = signal<registerConfirm>({
    userid: 0,
    userName: '',
    OtpText: '',
  });

  userName = signal('');

  menuList = signal<menu[]>([]);

  UserRegisteration(data: UserRegister) {
    return this.http.post(this.baseUrl + 'User/UserRegistration', data);
  }

  ConfirmRegisteration(data: registerConfirm) {
    return this.http.post(this.baseUrl + 'User/ConfirmRegistration', data);
  }

  Login(data: Login) {
    return this.http.post<LoginResponse>(
      this.baseUrl + 'Authorize/GenerateToken',
      data
    );
  }

  LoadMenuByRole(userRole: string) {
    return this.http.get<menu[]>(
      this.baseUrl + 'UserRole/GetAllMenusByRole?userRole=' + userRole
    );
  }

  ResetPassword(resetPassword: ResetPassword) {
    return this.http.post(this.baseUrl + 'User/ResetPassword', resetPassword);
  }

  ForgetPassword(userName: string) {
    return this.http.get(
      this.baseUrl + 'User/ForgetPassword?userName=' + userName
    );
  }

  UpdatePassword(updatePassword: UpdatePassword) {
    return this.http.post(this.baseUrl + 'User/UpdatePassword', updatePassword);
  }

  GetMenuPermission(userRole: string, menuCode: string) {
    let apiUrl =
      `UserRole/GetMenuPermissionByRole?userRole=` +
      userRole +
      `&menuCode=` +
      menuCode;
    return this.http.get<menuPermission>(this.baseUrl + apiUrl);
  }

  GetAllUsers() {
    return this.http.get<users[]>(this.baseUrl + 'User/GetAll');
  }

  UpdateUserRole(updateuser: updateuser) {
    return this.http.post(this.baseUrl + 'User/UpdateRole', updateuser);
  }

  UpdateUserStatus(updateStatus: UpdateStatus) {
    return this.http.post(this.baseUrl + 'User/UpdateStatus', updateStatus);
  }

  GetUserByCode(code: string) {
    return this.http.get<users>(this.baseUrl + 'User/GetByCode?code=' + code);
  }

  
  GetAllRoles() {
    return this.http.get<Role[]>(this.baseUrl + 'UserRole/GetAllRoles');
  }

  
  GetAllMenus() {
    return this.http.get<Menus[]>(this.baseUrl + 'UserRole/GetAllMenus');
  }


  
  AssignRolePermission(menuPermission : menuPermission[]) {
    return this.http.post(this.baseUrl + 'UserRole/AssignRolePermission', menuPermission);
  }

}

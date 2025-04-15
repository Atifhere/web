export interface UserRegister {
  lastName: string;
  firstName: string;
  email: string;
  phone: string;
  password: string;
}

export interface registerConfirm {
  userid: number;
  userName: string;
  OtpText: string;
}

export interface Login {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  refreshToken: string;
  userRole: string;
}

export interface menu {
  code: string;
  name: string;
}

export interface ResetPassword {
  userName: string;
  oldPassword: string;
  newPassword: string;
}

export interface UpdatePassword {
  userName: string;
  password: string;
  OtpText: string;
}

export interface menuPermission {
  code: string;
  name: string;
  haveview: boolean;
  haveadd: boolean;
  haveedit: boolean;
  havedelete: boolean;

  // for POST calls
  userrole : string;
  menucode: string;
}

export interface users {
  userName: string;
  name: string;
  email: string;
  phone: string;
  password: string;
  isactive: true;
  statusName: string;
  role: string;
}

export interface updateuser {
  userName: string;
  userRole: string;
}

export interface UpdateStatus {
  userName: string;
  UserStatus: boolean;
}

export interface Role {
  code: string;
  name: string;
  status: true;
}



export interface Menus {
  code: string;
  name: string;
  status: true;
}
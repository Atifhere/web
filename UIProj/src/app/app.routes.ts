import { Routes } from '@angular/router';
import { HomeComponent } from './component/home/home.component';
import { RegisterComponent } from './component/register/register.component';
import { LoginComponent } from './component/login/login.component';
import { ConfirmOTPComponent } from './component/confirm-otp/confirm-otp.component';
import { CustomerComponent } from './component/customer/customer.component';
import { ForgetPasswordComponent } from './component/forget-password/forget-password.component';
import { UpdatePasswordComponent } from './component/update-password/update-password.component';
import { ResetPasswordComponent } from './component/reset-password/reset-password.component';
import { UserComponent } from './component/user/user.component';
import { authGuard } from './Guard/auth.guard';
import { UserRoleComponent } from './component/user-role/user-role.component';
import { AddCustomerComponent } from './component/customer/add-customer/add-customer.component';
import { CompanyComponent } from './component/Company/company/company.component';
import { CompanyBranchComponent } from './component/Company/company-branch/company-branch.component';
import { StaffComponent } from './component/Staff/staff/staff.component';
import { AppointmentsComponent } from './component/Appointments/appointment-calendar.component';
import { ReportsComponent } from './component/Reports/reports/reports.component';
import { AddCompanyComponent } from './component/Company/company/add-company/add-company.component';
import { AddBranchComponent } from './component/Company/company-branch/add-branch/add-branch.component';
import { AddStaffComponent } from './component/Staff/staff/add-staff/add-staff.component';
import { PrivacyComponent } from './component/privacy/privacy.component';
import { AddAppointmentDialogComponent } from './component/login/Appointments/add-appointment-dialog-component';
import { CompanyProfileComponent } from './component/Company/company-profile/company-profile.component';
import { RevenueReportComponent } from './component/revenuereport/revenuereport.component';
import { CategoryComponent } from './component/ServiceCategory/category/category.component';
// test
export const routes: Routes = [
    { path: 'home', component: HomeComponent, canActivate:[authGuard] },
    { path: 'register', component: RegisterComponent },
    { path: 'appointment', component: AddAppointmentDialogComponent },
    { path: 'login', component: LoginComponent },
    { path: 'otp', component: ConfirmOTPComponent },
    { path: 'forgetpassword', component: ForgetPasswordComponent },
    { path: 'updatepassword', component: UpdatePasswordComponent },
    { path: 'resetPassword', component: ResetPasswordComponent },
    { path: 'customer', component: CustomerComponent,  canActivate:[authGuard] }, 
    { path: 'customer/Add', component: AddCustomerComponent,  canActivate:[authGuard] }, 
    { path: 'customer/Edit/:code', component: AddCustomerComponent,  canActivate:[authGuard] }, 
    { path: 'user', component: UserComponent,  canActivate:[authGuard] }, 
    { path: 'UserRole', component:UserRoleComponent,  canActivate:[authGuard] },
    { path: 'company', component:CompanyComponent,  canActivate:[authGuard] }, // DONE
    { path: 'company/Add', component:AddCompanyComponent,  canActivate:[authGuard] }, // TODO
    { path: 'company/Edit/:code', component:AddCompanyComponent,  canActivate:[authGuard] }, // TODO
    { path: 'branch', component:CompanyBranchComponent,  canActivate:[authGuard] }, // TODO
    { path: 'branch/:companyId', component:CompanyBranchComponent,  canActivate:[authGuard] }, // TODO
    { path: 'branch/Add/:companyCode', component:AddBranchComponent,  canActivate:[authGuard] }, // TODO
    { path: 'branch/Edit/:code', component:AddBranchComponent,  canActivate:[authGuard] }, // TODO
    { path: 'Appointments', component:AppointmentsComponent,  canActivate:[authGuard] }, // TODO
    { path: 'staff', component:StaffComponent,  canActivate:[authGuard] }, // TODO
    { path: 'staff/:companyId', component:StaffComponent,  canActivate:[authGuard] }, // TODO
    { path: 'staff/Add/:branchId', component:AddStaffComponent,  canActivate:[authGuard] }, // TODO
    { path: 'staff/Edit/:code', component:AddStaffComponent,  canActivate:[authGuard] }, // TODO
    { path: 'reports', component:ReportsComponent,  canActivate:[authGuard] }, // TODO
    { path: 'vat', component:RevenueReportComponent,  canActivate:[authGuard] }, // TODO
    { path: 'privacy', component:PrivacyComponent}, 
    { path: 'companyProfile', component:CompanyProfileComponent},
    { path: 'category', component:CategoryComponent},
];

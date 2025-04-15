import { Component, Inject, OnInit } from '@angular/core';
import { MaterialModule } from '../../../material.module';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Role, UpdateStatus, updateuser, users } from '../../../_model/user.model';
import { UserService } from '../../../_Service/user.service';

@Component({
  selector: 'app-update-user',
  standalone: true,
  imports: [MaterialModule, ReactiveFormsModule],
  templateUrl: './update-user.component.html',
  styleUrl: './update-user.component.css',
})
export class UpdateUserComponent implements OnInit {
  dialogData: any;
  userData!: users;
  rolesList!: Role[];
  type: string = '';
  response: any;
  constructor(
    private builder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private userService: UserService,
    private ref: MatDialogRef<UpdateUserComponent>
  ) {}
  ngOnInit(): void {
    this.dialogData = this.data;
    this.type = this.dialogData.type;
    this.LoadRoles();
    if (this.dialogData.userName != '') {
      this.userService
        .GetUserByCode(this.dialogData.userName)
        .subscribe((item) => {
          this.userData = item;
          this.userform.setValue({
            userName: this.userData.userName,
            userRole: this.userData.role,
            status: this.userData.isactive,
          });
        });
    }
  }
  userform = this.builder.group({
    userName: this.builder.control({ value: '', disabled: true }),
    userRole: this.builder.control('', Validators.required),
    status: this.builder.control(true),
  });
  ProceedChange() {
    if (this.userform.valid) {
      let obj: updateuser = {
        userName: this.dialogData.userName,
        userRole: this.userform.value.userRole as string
      };
      if (this.type === 'Role') {
        this.userService.UpdateUserRole(obj).subscribe((item) => {
          this.response = item;
          if (this.response.success == true) {
            alert('Role updated successfully.');
            this.ClosePopUp();
          }
        });
      }
      else if (this.type === 'Status') {
        
      let obj: UpdateStatus = {
        userName: this.dialogData.userName,
        UserStatus: this.userform.value.status as boolean
      };
        this.userService.UpdateUserStatus(obj).subscribe((item) => {
          this.response = item;
          if (this.response.success == true) {
            alert('Role updated successfully.');
            this.ClosePopUp();
          }
        });
      }
    }
  }

  LoadRoles() {
    this.userService.GetAllRoles().subscribe((item) => {
      this.rolesList = item;
    });
  }

  ClosePopUp() {
    this.ref.close();
  }
}

import { Component, OnInit } from '@angular/core';
import { MaterialModule } from '../../material.module';
import {
  FormArray,
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { UserService } from '../../_Service/user.service';
import { menuPermission, Menus, Role } from '../../_model/user.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-role',
  standalone: true,
  imports: [MaterialModule, ReactiveFormsModule, CommonModule],
  templateUrl: './user-role.component.html',
  styleUrl: './user-role.component.css',
})
export class UserRoleComponent implements OnInit {
  rolesList: Role[] = [];
  menuList: Menus[] = [];
  accessArray!: FormArray<any>;
  userAccess!: menuPermission;
  response : any;
  constructor(private builder: FormBuilder, private service: UserService) {}

  ngOnInit(): void {
    this.LoadRoles();
    this.LoadMenu('');
  }

  GenerateMenuRow(input: Menus, access: menuPermission, role: string) {
    return this.builder.group({
      menucode: this.builder.control(input.code),
      haveview: this.builder.control(access.haveview),
      haveadd: this.builder.control(access.haveadd),
      haveedit: this.builder.control(access.haveedit),
      havedelete: this.builder.control(access.havedelete),
      userrole: this.builder.control(role),
    });
  }

  AddNewRow(input: Menus, access: menuPermission, role: string) {
    this.accessArray.push(this.GenerateMenuRow(input, access, role));
  }

  get GetRows() {
    return this.roleForm.get('access') as FormArray;
  }

  roleForm = this.builder.group({
    userRole: this.builder.control('', Validators.required),
    access: this.builder.array([]),
  });
  LoadRoles() {
    this.service.GetAllRoles().subscribe((rolesList) => {
      this.rolesList = rolesList;
    });
  }

  LoadMenu(selectedRole: string) {
    this.accessArray = this.roleForm.get('access') as FormArray;
    this.accessArray.clear();
    this.service.GetAllMenus().subscribe((menuList) => {
      this.menuList = menuList;
      if (this.menuList.length > 0) {
        this.menuList.map((o: Menus) => {
          if (selectedRole != '') {
            this.service
              .GetMenuPermission(selectedRole, o.code)
              .subscribe((item) => {
                this.userAccess = item;
                this.AddNewRow(o, this.userAccess, selectedRole);
              });
          } else {
            this.AddNewRow(
              o,
              {
                code: '',
                menucode: '',
                name: '',
                haveview: false,
                haveadd: false,
                haveedit: false,
                havedelete: false,
                userrole: '',
              },
              selectedRole
            );
          }
        });
      }
    });
  }

  RoleChange(e: any) {
    let selectedRole = e.value;
    this.LoadMenu(selectedRole);
  }

  SaveRoles() {
    if (this.roleForm.valid) {
      let formArray = this.roleForm.value.access as menuPermission[];

      this.service.AssignRolePermission(formArray).subscribe((item) => {
        this.response = item;
        if(this.response.success == true)
        {
          alert('Role Updated Successfully.');
        }
        else{
          alert('Something went wrong. Please try again.')
        }
      });
    }
  }
}

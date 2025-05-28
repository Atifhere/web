import { Component, OnInit, ViewChild } from '@angular/core';
import { menuPermission, users } from '../../_model/user.model';
import { MaterialModule } from '../../material.module';
import { Router, RouterLink } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { UserService } from '../../_Service/user.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { UpdateUserComponent } from './update-user/update-user.component';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [MaterialModule, RouterLink],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css',
})
export class UserComponent implements OnInit {
  userList: users[] = [];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  displayedColumns: string[] = [
    'userName',
    'name',
    'email',
    'phone',
    'password',
    // 'isactive',
    'statusName',
    'role',
    'action',
  ];
  dataSource: any;
  constructor(
    private userService: UserService,
    private router: Router,
    private dialog: MatDialog
  ) {}
  ngOnInit() {
    this.LoadUsers();
  }

  LoadUsers() {
    this.userService.GetAllUsers().subscribe((item) => {
      this.userList = item;
      this.dataSource = new MatTableDataSource<users>(this.userList);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }
  OpenPopup(userName: string, type: string) {
    this.dialog
      .open(UpdateUserComponent, {
        width: '30%',
        enterAnimationDuration: '100ms',
        exitAnimationDuration: '1000ms',
        data: {
          userName: userName,
          type: type,
        },
      })
      .afterClosed()
      .subscribe((item) => {
        this.LoadUsers();
      });
  }
  UpdateRole(userName: string) {
    this.OpenPopup(userName, 'Role');
  }

  UpdateStatus(userName: string) {
    this.OpenPopup(userName, 'Status');
  }
}

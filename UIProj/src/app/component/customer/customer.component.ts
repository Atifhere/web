import { Component, OnInit, ViewChild } from '@angular/core';
import { MaterialModule } from '../../material.module';
import { Router, RouterLink } from '@angular/router';
import { CustomerService } from '../../_Service/Customer/customer.service';
import { Customer } from '../../_model/Customer.model';
import { MatTableDataSource } from '@angular/material/table';
import { menuPermission } from '../../_model/user.model';
import { UserService } from '../../_Service/user.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-customer',
  standalone: true,
  imports: [MaterialModule, RouterLink],
  templateUrl: './customer.component.html',
  styleUrl: './customer.component.css',
})
export class CustomerComponent implements OnInit {
  customerList: Customer[] = [];
  permission: menuPermission = {
    code: '',
    name: '',
    haveview: false,
    haveadd: false,
    haveedit: false,
    havedelete: false,
    userrole: '',
    menucode: ''
  };

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  displayedColumns: string[] = [
    'code',
    'name',
    'email',
    'phone',
    'creditlimit',
    'taxcode',
    'status',
    'action',
  ];
  dataSource: any;
  response: any;
  constructor(
    private Service: CustomerService,
    private userService: UserService,
    private router: Router
  ) {}
  ngOnInit() {
    this.LoadCustomers();
    this.SetAccess();
  }

  LoadCustomers() {
    this.Service.GetAll().subscribe((item) => {
      this.customerList = item;
      this.dataSource = new MatTableDataSource<Customer>(this.customerList);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  SetAccess() {
    let role = localStorage.getItem('userRole') as string;
    this.userService.GetMenuPermission(role, 'customer').subscribe((item) => {
      this.permission = item;
    });
  }

  Edit(code: string) {
    if (this.permission.haveedit) {
      this.router.navigateByUrl('/customer/Edit/' + code);
    } else {
      alert('You don not have permission to edit');
    }
  }

  Delete(code: string) {
    if (this.permission.havedelete) {
      if (confirm('Are you sure you want to delete?')) {
        this.Service.DeleteCustomer(code).subscribe((item) => {
          this.response = item;
          if (this.response.success) {
            alert(this.response.message);
            this.LoadCustomers();
          } else alert(this.response.ErrorMessage);
        });
      }
    } else {
      alert('You don not have permission to delete Customer');
    }
  }
}

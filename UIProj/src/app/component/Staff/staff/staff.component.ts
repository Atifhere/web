import { Component, OnInit, ViewChild } from '@angular/core';
import { Company, CompanyBranch } from '../../../_model/company.model';
import { menuPermission } from '../../../_model/user.model';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { UserService } from '../../../_Service/user.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MaterialModule } from '../../../material.module';
import { Constants } from '../../../_model/Constants';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Staff } from '../../../_model/staff.model';
import { StaffService } from '../../../_Service/Staff/staff.service';
import { CompanyBranchService } from '../../../_Service/Company/company-branch.service';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { ToastrSrvc } from '../../../_Service/Toastr/toastr-service.service';
import { CommonModule } from '@angular/common';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'app-staff',
  standalone: true,
  imports: [
    MaterialModule,
    RouterLink,
    MatIconModule,
    MatTooltipModule,
    FormsModule,
    CommonModule,
    MatChipsModule
  ],
  templateUrl: './staff.component.html',
  styleUrl: './staff.component.css',
})
export class StaffComponent {
  staffList: Staff[] = [];
  staffListMaster: Staff[] = [];
  branchList: CompanyBranch[] = [];
  pageSize = Constants.PAGE_SIZE;
  branchIdFromRoute: string = '';
  selectedBranchId: string = '';
  companyId: string = '';
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  permission = Constants.MENUPERMISSION;
  displayedColumns: string[] = [
    'name',
    // 'email',
    'phone',
    'paymentDetails',
    'monthlyTarget',
    'companyBranchName',
    'status',
    'action',
  ];
  dataSource: any;
  response: any;
  constructor(
    private Service: StaffService,
    private branchService: CompanyBranchService,
    private userService: UserService,
    private router: Router,
    private activateRoute: ActivatedRoute,
    private toastrService: ToastrSrvc
  ) { }
  ngOnInit() {
    this.companyId = localStorage.getItem('selectedCompanyId') as string;
    this.branchIdFromRoute = localStorage.getItem('branchId') as string;

    this.LoadBranches();
    this.LoadEmployees(this.branchIdFromRoute);
    this.selectedBranchId = this.branchIdFromRoute;
    this.SetAccess();
  }

  LoadEmployees(branchId: string) {
    this.Service.GetAll(branchId).subscribe((item) => {
      this.staffListMaster = item;
      this.staffList = item;
      if (this.staffList.length == 0) {
        this.toastrService.ShowInfo(
          'Please Add new Employee',
          'No records Found'
        );
      }
      localStorage.setItem('branchId', branchId);
      this.MapDataSource();
    });
  }
  LoadBranches() {
    this.branchService.GetAll(this.companyId).subscribe((item) => {
      this.branchList = item;
    });
  }

  CompanyChange(event: any) {
    this.selectedBranchId = event.value;
    this.LoadEmployees(this.selectedBranchId);
    this.MapDataSource();
  }
  private MapDataSource() {
    this.dataSource = new MatTableDataSource<Staff>(this.staffList);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  SetAccess() {
    let role = localStorage.getItem('userRole') as string;
    this.userService.GetMenuPermission(role, 'staff').subscribe((item) => {
      this.permission = item;
    });
  }

  Edit(code: string) {
    if (this.permission.haveedit) {
      this.router.navigateByUrl('/staff/Edit/' + code);
    } else {
      this.toastrService.ShowError('You don not have permission to edit');

      // alert('You don not have permission to edit');
    }
  }

  Delete(code: string) {
    if (this.permission.havedelete) {
      if (confirm('Are you sure you want to delete?')) {
        this.Service.DeleteStaff(code).subscribe((item) => {
          this.response = item;
          if (this.response.success) {
            this.toastrService.ShowSuccess(this.response.message);
            this.LoadEmployees(this.selectedBranchId);
          } else alert(this.response.ErrorMessage);
        });
      }
    } else {
      alert('You don not have permission to delete Company');
    }
  }

  AddEmployee() {
    if (this.permission.haveadd) {
      this.router.navigateByUrl('/staff/Add/' + this.selectedBranchId);
      let companyName = this.branchList.filter(
        (x) => x.id == this.selectedBranchId
      )[0].branchName;

      localStorage.setItem('CompanyToAddBranch', companyName);
    } else {
      alert('You don not have permission to edit');
    }
  }

  getPaymentTypeDescription(type: number): string {
    switch (type) {
      case 0:
        return 'Salary Based';
      case 1:
        return 'Commission Based';
      case 2:
        return 'Commission + Target';
      case 3:
        return 'Fixed Salary + Commission';
      default:
        return 'Unknown';
    }
  }
  getPaymentTypeLabel(type: number): string {
    switch (type) {
      case 0: return 'Salary';
      case 1: return 'Commission';
      case 2: return 'Commission + Target';
      case 3: return 'Fixed + Commission';
      default: return 'Not Defined';
    }
  }


}

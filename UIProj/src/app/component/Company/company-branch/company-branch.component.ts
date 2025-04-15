import { Component, OnInit, ViewChild } from '@angular/core';
import { Company, CompanyBranch } from '../../../_model/company.model';
import { menuPermission } from '../../../_model/user.model';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { CompanyService } from '../../../_Service/Company/company.service';
import { UserService } from '../../../_Service/user.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MaterialModule } from '../../../material.module';
import { Constants } from '../../../_model/Constants';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CompanyBranchService } from '../../../_Service/Company/company-branch.service';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ToastrSrvc } from '../../../_Service/Toastr/toastr-service.service';

@Component({
  selector: 'app-company-branch',
  standalone: true,
  imports: [
    MaterialModule,
    RouterLink,
    MatIconModule,
    MatTooltipModule,
    FormsModule,
  ],
  templateUrl: './company-branch.component.html',
  styleUrl: './company-branch.component.css',
})
export class CompanyBranchComponent implements OnInit {
  companyBranchList: CompanyBranch[] = [];
  companyList: Company[] = [];
  pageSize = Constants.PAGE_SIZE;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  companyIdFromRoute: string = '';
  selectedCompanyId: string = '';
  permission = Constants.MENUPERMISSION;
  displayedColumns: string[] = [
    'branchName',
    'companyName',
    'address',
    'phoneNumber',
    'status',
    'action',
  ];
  dataSource: any;
  response: any;
  constructor(
    private Service: CompanyBranchService,
    private companyService: CompanyService,
    private userService: UserService,
    private router: Router,
    private activateRoute: ActivatedRoute,
    private toastr: ToastrSrvc
  ) {}
  ngOnInit() {
    
    localStorage.setItem('branchId', '');
    // this.companyIdFromRoute = localStorage.getItem('selectedCompanyId') as string;
    this.companyIdFromRoute = this.activateRoute.snapshot.paramMap.get('companyId') as string
    this.LoadBranches(this.companyIdFromRoute);
    this.SetAccess();
    localStorage.setItem('BranchName', '');
  }

  LoadCompanies() {
    this.companyService.GetAll().subscribe((item) => {
      this.companyList = item;
      if (this.companyIdFromRoute != null && this.companyIdFromRoute != '') {
        this.selectedCompanyId = this.companyIdFromRoute;
      } else if (this.companyList.length > 1) {
        this.selectedCompanyId = this.companyList[0].id;
      }

      if (this.companyBranchList.length == 0){
        this.toastr.ShowInfo('Please Add new Branch', ' No records Found');
      }
      this.MapDataSource();
    });
  }

  LoadBranches(companyId: string) {
    this.Service.GetAll(companyId).subscribe((item) => {
      this.companyBranchList = item;
      this.LoadCompanies();
    });
  }
  CompanyChange(event: any) {
    this.companyIdFromRoute = event.value;
    localStorage.setItem('branchId', this.companyIdFromRoute);
    this.LoadBranches(this.companyIdFromRoute);
    this.MapDataSource();
  }

  private MapDataSource() {
    this.companyBranchList = this.companyBranchList.filter(
      (x) => x.companyId == this.selectedCompanyId
    );
    this.dataSource = new MatTableDataSource<CompanyBranch>(
      this.companyBranchList
    );
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  SetAccess() {
    let role = localStorage.getItem('userRole') as string;
    this.userService.GetMenuPermission(role, 'company').subscribe((item) => {
      this.permission = item;
    });
  }

  AddEmployee(branch: CompanyBranch) {
    if (this.permission.haveedit) {
      this.router.navigateByUrl('/staff/Add/' + branch.id);
    } else {
      alert('You don not have permission to add a new Employee');
    }
  }

  Edit(code: string) {
    if (this.permission.haveedit) {
      this.router.navigateByUrl('/branch/Edit/' + code);
    } else {
      alert('You don not have permission to edit');
    }
  }

  StaffList(branch: CompanyBranch) {
    if (this.permission.haveedit) {
      localStorage.setItem('selectedCompanyId', branch.companyId)
      localStorage.setItem('branchId', branch.id);
      this.router.navigateByUrl('/staff/' + branch.id);
    } else {
      alert('You don not have permission to edit');
    }
  }

  Delete(code: string) {
    if (this.permission.havedelete) {
      if (confirm('Are you sure you want to delete?')) {
        this.Service.DeleteCompany(code).subscribe((item) => {
          this.response = item;
          if (this.response.success) {
            this.toastr.ShowSuccess(this.response.message)
            // alert(this.response.message);
            this.LoadBranches(this.companyIdFromRoute);
          } else this.toastr.ShowSuccess(this.response.ErrorMessage);
        });
      }
    } else {
      this.toastr.ShowError('You don not have permission to delete Company');
    }
  }

  AddBranch() {
    if (this.permission.haveadd) {
      if(!this.selectedCompanyId)
      {
        this.toastr.ShowError('Please Select Company');
        return;
      }
      this.router.navigateByUrl('/branch/Add/' + this.selectedCompanyId);
      let companyName = this.companyList.filter(
        (x) => x.id == this.selectedCompanyId
      )[0].name;

      localStorage.setItem('CompanyToAddBranch', companyName);
    } else {
      this.toastr.ShowError('You don not have permission to edit');
    }
  }
}

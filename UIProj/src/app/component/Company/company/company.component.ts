import { Component, OnInit, ViewChild } from '@angular/core';
import { Company } from '../../../_model/company.model';
import { menuPermission } from '../../../_model/user.model';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { CompanyService } from '../../../_Service/Company/company.service';
import { UserService } from '../../../_Service/user.service';
import { Router, RouterLink } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MaterialModule } from '../../../material.module';
import { Constants } from '../../../_model/Constants';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ToastrService } from 'ngx-toastr';
import { ToastrSrvc } from '../../../_Service/Toastr/toastr-service.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-company',
  standalone: true,
  imports: [MaterialModule, RouterLink, MatIconModule, MatTooltipModule, CommonModule],
  templateUrl: './company.component.html',
  styleUrl: './company.component.css',
})
export class CompanyComponent implements OnInit {
  companyList: Company[] = [];
  pageSize = Constants.PAGE_SIZE;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  permission = Constants.MENUPERMISSION;
  displayedColumns: string[] = [
    'name',
    'arabicName',
    'email',
    'phoneNumber',
    // 'tradeLicenseNo',
    'status',
    'action',
  ];
  dataSource: any;
  response: any;
  constructor(
    private Service: CompanyService,
    private userService: UserService,
    private router: Router,
    private toastrService: ToastrService,
    private toastr: ToastrSrvc
  ) {}
  ngOnInit() {
    this.LoadCompanies();
    this.SetAccess();
    localStorage.setItem('CompanyToAddBranch', '');
  }

  LoadCompanies() {
    this.Service.GetAll().subscribe((item) => {
      this.companyList = item;
      if(this.companyList.length == 0)
      {
        this.toastr.ShowInfo('Please Add new Company', ' No records Found');
      }
      this.dataSource = new MatTableDataSource<Company>(this.companyList);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  SetAccess() {
    let role = localStorage.getItem('userRole') as string;
    this.userService.GetMenuPermission(role, 'company').subscribe((item) => {
      this.permission = item;
    });
  }

  Edit(code: string) {
    if (this.permission.haveedit) {
      this.router.navigateByUrl('/company/Edit/' + code);
    } else {
      this.toastr.ShowError('You do not have permission to edit');

      // alert('You don not have permission to edit');
    }
  }

  AddBranch(company: Company) {
    if (this.permission.haveedit) {
      this.Service.CompanyToAddBranch.set(company.name);
      localStorage.setItem('CompanyToAddBranch', company.name);
      this.router.navigateByUrl('/branch/Add/' + company.id);
    } else {
      alert('You don not have permission to add a branch');
    }
  }

  BranchList(company: Company) {
    
    localStorage.setItem('selectedCompanyId', company.id);
    if (this.permission.haveedit) {
      this.router.navigateByUrl('/branch/' + company.id);
    } else {
      alert('You don not have permission to add a branch List');
    }
  }

  Delete(code: string) {
    if (this.permission.havedelete) {
      if (confirm('Are you sure you want to delete?')) {
        this.Service.DeleteCompany(code).subscribe((item) => {
          this.response = item;
          if (this.response.success) {
            this.toastr.ShowSuccess(this.response.message);
            this.LoadCompanies();
          } else {
            this.toastr.ShowError(this.response.message);
          }
        });
      }
    } else {
      alert('You don not have permission to delete Company');
    }
  }
}

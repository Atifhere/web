import { Component, OnInit } from '@angular/core';
import { Company, CompanyBranch } from '../../../../_model/company.model';
import { MaterialModule } from '../../../../material.module';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CompanyService } from '../../../../_Service/Company/company.service';
import { StaffService } from '../../../../_Service/Staff/staff.service';
import { Staff } from '../../../../_model/staff.model';
import { CompanyBranchService } from '../../../../_Service/Company/company-branch.service';
import { ToastrSrvc } from '../../../../_Service/Toastr/toastr-service.service';

@Component({
  selector: 'app-add-staff',
  standalone: true,
  imports: [MaterialModule, RouterLink, ReactiveFormsModule],
  templateUrl: './add-staff.component.html',
  styleUrl: './add-staff.component.css',
})
export class AddStaffComponent {
  response: any;
  editCode: string = '';
  companyId: string = '';
  branchId: string = '';
  isEdit: boolean = false;
  Title: string = 'Add Employee';
  editData!: Staff;
  branchList: CompanyBranch[] = [];
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private staffService: StaffService,
    private companyBranchService: CompanyBranchService,
    private activateRoute: ActivatedRoute,
    private toastr: ToastrSrvc
  ) {}

  staffForm = this.fb.group({
    id: this.fb.control(''),
    firstName: this.fb.control('', Validators.required),
    lastName: this.fb.control('', Validators.required),
    emiratesId: this.fb.control('', Validators.required),
    email: this.fb.control('', Validators.required),
    phone: this.fb.control('', Validators.required),
    address: this.fb.control('', Validators.required),
    companyBranchId: this.fb.control('', Validators.required),
    isActive: this.fb.control(true),
    CompanyBranchName: this.fb.control(''),
  });

  ngOnInit(): void {
    this.editCode = this.activateRoute.snapshot.paramMap.get('code') as string;
    this.companyId = localStorage.getItem('selectedCompanyId') as string;
    this.branchId = localStorage.getItem('branchId') as string;

    if (this.branchId != null && this.branchId != '') {
      this.staffForm.controls['companyBranchId'].setValue(this.branchId);
    }
    this.GetCompanyBranchList();
    if (this.editCode != '' && this.editCode != null) {
      this.isEdit = true;
      this.Title = 'Edit Company';
      this.staffService.GetStaffBycode(this.editCode).subscribe((item) => {
        this.editData = item;
        this.staffForm.setValue({
          id: this.editData.id,
          email: this.editData.email,
          firstName: this.editData.firstName,
          lastName: this.editData.lastName,
          phone: this.editData.phone,
          address: this.editData.address,
          isActive: item.isActive,
          companyBranchId: this.editData.companyBranchId,
          emiratesId: this.editData.emiratesId,
          CompanyBranchName: '',
        });
      });
    }
  }

  GetCompanyBranchList() {
    this.companyBranchService.GetAll(this.companyId).subscribe((item) => {
      this.branchList = item;
    });
  }

  Save() {
    if (this.staffForm.valid) {
      let staffObj: Staff = {
        id: '',
        // code: this.staffForm.value.code as string,
        firstName: this.staffForm.value.firstName as string,
        lastName: this.staffForm.value.lastName as string,
        email: this.staffForm.value.email as string,
        phone: this.staffForm.value.phone as string,
        address: this.staffForm.value.address as string,
        companyBranchId: this.staffForm.value.companyBranchId as string,
        emiratesId: this.staffForm.value.emiratesId as string,
        createdBy: '',
        isActive: this.staffForm.value.isActive as boolean,
        status: '',
        companyBranchName: '',
      };
      if (!this.isEdit) {
        this.staffService.CreateStaff(staffObj).subscribe((item) => {
          if (item) {
            this.response = item;

            if (this.response.success) {
              this.toastr.ShowSuccess(this.response.message);
              //alert(this.response.message);
              this.router.navigateByUrl('/staff');
            } else {
              this.toastr.ShowError(this.response.errorMessage);

              //alert(this.response.errorMessage);
            }
          } else {
            alert('Something Went Wrong. Please try again.');
          }
        });
      } else if (this.isEdit == true) {
        staffObj.id = this.editCode;
        this.staffService.UpdateStaff(staffObj).subscribe((item) => {
          if (item) {
            this.response = item;

            if (this.response.success) {
              this.toastr.ShowSuccess(this.response.message);

              // alert(this.response.message);
              this.router.navigateByUrl('/staff');
            } else {
              this.toastr.ShowError(this.response.errorMessage);

              // alert('Something Went   Wrong. Please try again.');
            }
          } else {
            alert('Something Went Wrong. Please try again.');
          }
        });
      }
    }
  }

  BranchChange(event: any) {
    console.log(event.value);
    localStorage.setItem('branchId', event.value);
  }
}

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
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-staff',
  standalone: true,
  imports: [MaterialModule, RouterLink, ReactiveFormsModule, CommonModule],
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
  selectedSalaryType: string = 'salary';
  branchList: CompanyBranch[] = [];
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private staffService: StaffService,
    private companyBranchService: CompanyBranchService,
    private activateRoute: ActivatedRoute,
    private toastr: ToastrSrvc
  ) { }

  staffForm = this.fb.group({
    id: this.fb.control(''),
    firstName: this.fb.control('', [Validators.required, Validators.maxLength(30)]),
    lastName: this.fb.control('', [Validators.required, Validators.maxLength(30)]),
    emiratesId: this.fb.control('', Validators.required),
    email: this.fb.control('', [Validators.required, Validators.maxLength(50), Validators.email]),
    phone: this.fb.control('', [Validators.required, Validators.maxLength(15)]),
    monthlyTarget: this.fb.control(0, [Validators.required, Validators.min(0), Validators.max(100000)]),
    percentageShare: this.fb.control(0, [Validators.required, Validators.min(0), Validators.max(100)]),
    address: this.fb.control('', [Validators.required, Validators.maxLength(50)]),
    companyBranchId: this.fb.control('', Validators.required),
    isActive: this.fb.control(true),
    CompanyBranchName: this.fb.control(''),

    monthlySalary: this.fb.control(0),
    salaryType: this.fb.control('salary', Validators.required)  // Default value

  });

  ngOnInit(): void {
    this.editCode = this.activateRoute.snapshot.paramMap.get('code') as string;
    this.companyId = localStorage.getItem('selectedCompanyId') as string;
    this.branchId = localStorage.getItem('branchId') as string;
    this.staffForm.get('salaryType')?.valueChanges.subscribe((value) => {
      if (value !== null) {
        this.updateSalaryFieldsVisibility(value);
      }
    });

    if (this.branchId) {
      this.staffForm.controls['companyBranchId'].setValue(this.branchId);
    }

    this.GetCompanyBranchList();

    if (this.editCode) {
      this.isEdit = true;
      this.Title = 'Edit Staff Details';

      this.staffService.GetStaffBycode(this.editCode).subscribe((item) => {
        this.editData = item;

        let salaryType = '';
        const hasSalary = item.monthlySalary && item.monthlySalary > 0;
        const hasCommission = item.percentageShare && item.percentageShare > 0;

        if (hasSalary && hasCommission) salaryType = 'both';
        else if (hasSalary) salaryType = 'salary';
        else if (hasCommission) salaryType = 'commission';

        this.staffForm.patchValue({
          id: item.id,
          email: item.email,
          firstName: item.firstName,
          lastName: item.lastName,
          phone: item.phone,
          address: item.address,
          isActive: item.isActive,
          companyBranchId: item.companyBranchId,
          emiratesId: item.emiratesId,
          monthlyTarget: item.monthlyTarget,
          percentageShare: item.percentageShare,
          monthlySalary: item.monthlySalary,
          salaryType: salaryType
        });
        // ✅ Ensure template reacts properly
        this.selectedSalaryType = salaryType;
        this.updateSalaryFieldsVisibility(salaryType); // ✅ Force visibility update on load
      });
    }

  }

  updateSalaryFieldsVisibility(type: string | null) {
    if (type === 'salary') {
      this.staffForm.get('monthlySalary')?.setValidators([Validators.required]);
      this.staffForm.get('percentageShare')?.clearValidators();
    } else if (type === 'commission') {
      this.staffForm.get('percentageShare')?.setValidators([Validators.required]);
      this.staffForm.get('monthlySalary')?.clearValidators();
    } else if (type === 'both') {
      this.staffForm.get('monthlySalary')?.setValidators([Validators.required]);
      this.staffForm.get('percentageShare')?.setValidators([Validators.required]);
    } else {
      // fallback case: clear all
      this.staffForm.get('monthlySalary')?.clearValidators();
      this.staffForm.get('percentageShare')?.clearValidators();
    }

    this.staffForm.get('monthlySalary')?.updateValueAndValidity();
    this.staffForm.get('percentageShare')?.updateValueAndValidity();
  }


  GetCompanyBranchList() {
    this.companyBranchService.GetAll(this.companyId).subscribe((item) => {
      this.branchList = item;
    });
  }

  Save() {
    if (!this.staffForm.valid) return;

    const type = this.staffForm.value.salaryType!;
    let staffObj: Staff = {
      id: this.isEdit ? this.editCode : '',  // ✅ Set ID correctly for edit
      firstName: this.staffForm.value.firstName!,
      lastName: this.staffForm.value.lastName!,
      email: this.staffForm.value.email!,
      phone: this.staffForm.value.phone!,
      address: this.staffForm.value.address!,
      companyBranchId: this.staffForm.value.companyBranchId!,
      emiratesId: this.staffForm.value.emiratesId!,
      createdBy: '',
      isActive: this.staffForm.value.isActive!,
      status: '',
      companyBranchName: '',
      monthlyTarget: this.staffForm.value.monthlyTarget!,
      percentageShare: 0,
      monthlySalary: 0,
      paymentType: this.getPaymentTypeFromSelection(type) // ✅ Set payment type properly
    };

    if (type === 'salary' || type === 'both') {
      staffObj.monthlySalary = this.staffForm.value.monthlySalary!;
    }
    if (type === 'commission' || type === 'both') {
      staffObj.percentageShare = this.staffForm.value.percentageShare!;
    }

    const saveOperation = this.isEdit
      ? this.staffService.UpdateStaff(staffObj)
      : this.staffService.CreateStaff(staffObj);

    saveOperation.subscribe((item) => {
      if (item) {
        this.response = item;
        if (this.response.success) {
          this.toastr.ShowSuccess(this.response.message);
          this.router.navigateByUrl('/staff');
        } else {
          this.toastr.ShowError(this.response.errorMessage);
        }
      } else {
        alert('Something Went Wrong. Please try again.');
      }
    });
  }

  getPaymentTypeFromSelection(type: string): number {
    switch (type) {
      case 'salary': return 1;
      case 'commission': return 2;
      case 'both': return 3;
      default: return 0;
    }
  }

  BranchChange(event: any) {
    localStorage.setItem('branchId', event.value);
  }


  onSalaryTypeChange(value: string) {
    this.selectedSalaryType = value;

    // Reset validators dynamically
    const salaryCtrl = this.staffForm.get('monthlySalary');
    const percentCtrl = this.staffForm.get('percentageShare');

    salaryCtrl?.clearValidators();
    percentCtrl?.clearValidators();

    if (value === 'salary') {
      salaryCtrl?.setValidators([Validators.required, Validators.min(0)]);
    } else if (value === 'commission') {
      percentCtrl?.setValidators([Validators.required, Validators.min(0), Validators.max(100)]);
    } else if (value === 'both') {
      salaryCtrl?.setValidators([Validators.required, Validators.min(0)]);
      percentCtrl?.setValidators([Validators.required, Validators.min(0), Validators.max(100)]);
    }

    salaryCtrl?.updateValueAndValidity();
    percentCtrl?.updateValueAndValidity();
  }
  getSalaryType(salary: number, percent: number): string {
    if (salary && percent) return 'both';
    if (salary) return 'salary';
    if (percent) return 'commission';
    return 'salary'; // Default fallback
  }

}

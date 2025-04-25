import { Component, OnInit } from '@angular/core';
import { Company } from '../../../../_model/company.model';
import { MaterialModule } from '../../../../material.module';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CompanyService } from '../../../../_Service/Company/company.service';
import { ToastrService } from 'ngx-toastr';
import { ToastrSrvc } from '../../../../_Service/Toastr/toastr-service.service';

@Component({
  selector: 'app-add-company',
  standalone: true,
  imports: [MaterialModule, RouterLink, ReactiveFormsModule],
  templateUrl: './add-company.component.html',
  styleUrl: './add-company.component.css',
})
export class AddCompanyComponent implements OnInit {
  response: any;
  editCode: string = '';
  isEdit: boolean = false;
  Title: string = 'Create Company';
  editData!: Company;
  ngOnInit(): void {
    this.editCode = this.activateRoute.snapshot.paramMap.get('code') as string;

    if (this.editCode != '' && this.editCode != null) {
      this.isEdit = true;
      this.Title = 'Edit Company';
      this.companyService
        .GetCompanyBycode(this.editCode)
        .subscribe((item) => {
          this.editData = item;
          this.companyForm.setValue({
            Id: this.editData.id,
            email: this.editData.email,
            name: this.editData.name,
            phoneNumber: this.editData.phoneNumber,
            address: this.editData.address,
            isActive: item.status == 'Active' ? true : false,
            arabicName : this.editData.arabicName,
            mobileNumber: this.editData.mobileNumber,
            natureOfBusiness: this.editData.natureOfBusiness,
            tradeLicenseNo: this.editData.tradeLicenseNo,
          });
        });
    }
  }

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private companyService: CompanyService,
    private activateRoute: ActivatedRoute,
    private toastrService: ToastrService,
    private toastr: ToastrSrvc
  ) {}

  companyForm = this.fb.group({
    Id: this.fb.control(''),
    name: this.fb.control('', Validators.required),
    email: this.fb.control('', [Validators.required, Validators.email]),
    phoneNumber: this.fb.control('', Validators.required),
    address: this.fb.control('', Validators.required),
    mobileNumber: this.fb.control('', Validators.required),
    natureOfBusiness: this.fb.control('', Validators.required),
    tradeLicenseNo: this.fb.control('', Validators.required),
    isActive: this.fb.control(true),
    arabicName : this.fb.control('', Validators.required),
  });

  SaveCompany() {
    if (this.companyForm.valid) {
      let companyObj: Company = {
        id: '',
        name: this.companyForm.value.name as string,
        email: this.companyForm.value.email as string,
        phoneNumber: this.companyForm.value.phoneNumber as string,
        isActive: this.companyForm.value.isActive as boolean,
        status: '',
        userId: '',
        address: this.companyForm.value.address as string,
        mobileNumber: this.companyForm.value.mobileNumber as string,
        natureOfBusiness: this.companyForm.value.natureOfBusiness as string,
        arabicName: this.companyForm.value.arabicName as string,
        tradeLicenseNo: this.companyForm.value.tradeLicenseNo as string,
      };
      if (!this.isEdit) {
        this.companyService.CreateCompany(companyObj).subscribe((item) => {
          if (item) {
            this.response = item;

            if (this.response.success) {
              this.toastr.ShowSuccess(this.response.message);
              this.router.navigateByUrl('/company');
            } else {
              this.toastr.ShowError(this.response.errorMessage);
            }
          } else {
            alert('Something Went Wrong. Please try again.');
          }
        });
      } else if (this.isEdit == true) {
        companyObj.id = this.editCode;
        this.companyService.UpdateCompany(companyObj).subscribe((item) => {
          if (item) {
            this.response = item;

            if (this.response.success) {
              this.toastr.ShowSuccess(this.response.message);
              this.router.navigateByUrl('/company');
            } else {
              this.toastr.ShowSuccess('Something Went Wrong. Please try again');
            }
          } else {
            this.toastr.ShowSuccess('Something Went Wrong. Please try again');
          }
        });
      }
    }
  }
}

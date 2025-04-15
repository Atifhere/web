import { Component, OnInit } from '@angular/core';
import { Company, CompanyBranch } from '../../../../_model/company.model';
import { MaterialModule } from '../../../../material.module';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CompanyService } from '../../../../_Service/Company/company.service';
import { CompanyBranchService } from '../../../../_Service/Company/company-branch.service';
import { ToastrService } from 'ngx-toastr';
import { ToastrSrvc } from '../../../../_Service/Toastr/toastr-service.service';

@Component({
  selector: 'app-add-branch',
  standalone: true,
  imports: [MaterialModule, RouterLink, ReactiveFormsModule],
  templateUrl: './add-branch.component.html',
  styleUrl: './add-branch.component.css',
})
export class AddBranchComponent implements OnInit {
  response: any;
  editCode: string = '';
  companyCode: string = '';
  companyName: string = '';
  isEdit: boolean = false;
  Title: string = 'Create Branch';
  editData!: CompanyBranch;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private companyService: CompanyBranchService,
    private Service: CompanyService,
    private activateRoute: ActivatedRoute,
    private toastr: ToastrSrvc
  ) {}
  ngOnInit(): void {
    this.editCode = this.activateRoute.snapshot.paramMap.get('code') as string;
    this.companyCode = this.activateRoute.snapshot.paramMap.get(
      'companyCode'
    ) as string;
    this.companyName = localStorage.getItem('CompanyToAddBranch') as string;
    if (this.editCode != '' && this.editCode != null) {
      this.isEdit = true;
      this.Title = 'Edit Branch';
      this.companyService.GetBranchBycode(this.editCode).subscribe((item) => {
        this.editData = item;
        this.companyForm.setValue({
          Id: this.editData.id,
          //email: this.editData.email,
          branchName: this.editData.branchName,
          phoneNumber: this.editData.phoneNumber,
          address: this.editData.address,
          isActive: item.status == 'Active' ? true : false,
          arabicName: this.editData.arabicName,
          mobileNumber: this.editData.mobileNumber,
          companyId: '',
        });
      });
    }
  }

  companyForm = this.fb.group({
    Id: this.fb.control(''),
    branchName: this.fb.control('', Validators.required),
    //email: this.fb.control('', Validators.required),
    phoneNumber: this.fb.control('', Validators.required),
    address: this.fb.control('', Validators.required),
    mobileNumber: this.fb.control('', Validators.required),
    isActive: this.fb.control(true),
    arabicName: this.fb.control('', Validators.required),
    companyId: this.fb.control(''),
  });

  SaveCompany() {
    if (this.companyForm.valid) {
      let companyObj: CompanyBranch = {
        id: '',
        branchName: this.companyForm.value.branchName as string,
        //email: this.companyForm.value.email as string,
        phoneNumber: this.companyForm.value.phoneNumber as string,
        isActive: this.companyForm.value.isActive as boolean,
        status: '',
        address: this.companyForm.value.address as string,
        mobileNumber: this.companyForm.value.mobileNumber as string,
        arabicName: this.companyForm.value.arabicName as string,
        companyId: this.companyCode,
        CreatedBy: '',
        CompanyName : ''
      };
      if (!this.isEdit) {
        this.companyService
          .CreateCompanyBranch(companyObj)
          .subscribe((item) => {
            if (item) {
              this.response = item;

              if (this.response.success) {
                this.toastr.ShowSuccess(this.response.message);
                this.router.navigateByUrl('/branch/'+ companyObj.companyId);
              } else {
                
                this.toastr.ShowError(this.response.errorMessage);
              }
            } else {
              this.toastr.ShowError('Something Went Wrong. Please try again');
            }
          });
      } else if (this.isEdit == true) {
        companyObj.companyId = '';
        companyObj.id = this.editCode;
        this.companyService.UpdateBranch(companyObj).subscribe((item) => {
          if (item) {
            this.response = item;

            if (this.response.success) {
              this.toastr.ShowSuccess(this.response.message);
              this.router.navigateByUrl('/branch/'+ companyObj.companyId);
            } else {
              this.toastr.ShowError(this.response.errorMessage);
            }
          } else {
            this.toastr.ShowError('Something Went Wrong. Please try again');
          }
        });
      }
    }
  }
  
  Cancel()
  {
    if(this.isEdit)
      this.router.navigateByUrl('/branch/'+ this.companyCode);
    else
      this.router.navigateByUrl('/company')
    

  }
}

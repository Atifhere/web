// log-work.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { Branch, Category, LogWorkRequest, SubCategory } from '../../_model/LogWork.modal';
import { CompanyService } from '../../_Service/Company/company.service';
import { StaffService } from '../../_Service/Staff/staff.service';
import { CompanyBranchService } from '../../_Service/Company/company-branch.service';
import { CompanyBranch } from '../../_model/company.model';
import { Staff } from '../../_model/staff.model';
import { CategoryService } from '../../_Service/Category/category.service';
import { MaterialModule } from '../../material.module';

@Component({
  standalone: true,
  imports:[ReactiveFormsModule, MaterialModule],
  selector: 'app-log-work',
  templateUrl: './log-work.component.html',
})
export class LogWorkComponent implements OnInit {
  form!: FormGroup;

  branches: CompanyBranch[] = [];

  staffList: Staff[] = [];
  categories: Category[] = [];
  subCategories: SubCategory[] = [];

  constructor(private fb: FormBuilder, private branchService: CompanyBranchService, private staffService: StaffService,
    private categoryService: CategoryService
  ) { }

  ngOnInit() {
    this.form = this.fb.group({
      branchId: ['', Validators.required],
      staffId: ['', Validators.required],
      businessCategoryId: ['', Validators.required],
      customerName: [''],
      customerPhone: [''],
      workItem: this.fb.array([])
    });

    this.loadBranches(); // Initially load branches
  }

  get workItemControls() {
    return this.form.get('workItem') as FormArray;
  }

  addWorkItem() {
    this.workItemControls.push(
      this.fb.group({
        subCategoryId: ['', Validators.required],
        serviceFee: [0, [Validators.required, Validators.min(1)]],
      })
    );
  }

  removeWorkItem(index: number) {
    this.workItemControls.removeAt(index);
  }

  loadBranches() {
    this.branchService.GetAll('null').subscribe({
      next: data => this.branches = data,
      error: err => console.error('Failed to load branches', err)
    });
  }

  onBranchChange() {
    const branchId = this.form.get('branchId')?.value;
    if (branchId) {
      this.staffService.GetAll(branchId).subscribe(res => this.staffList = res);
    }
  }



  onCategoryChange() {
    const categoryId = this.form.get('businessCategoryId')?.value;
    if (categoryId) {
      this.categoryService.GetAll().subscribe(res => this.subCategories = res);
    }
  }

  submitForm() {
    if (this.form.invalid) return;

    const payload: LogWorkRequest = {
      businessCategoryId: this.form.value.businessCategoryId,
      customerName: this.form.value.customerName,
      customerPhone: this.form.value.customerPhone,
      workItem: this.form.value.workItem
    };

    this.staffService.logWork(payload).subscribe(res => {
      if (res.success) {
        alert(res.message);
        this.form.reset();
        this.workItemControls.clear();
      } else {
        alert(res.message);
      }
    });
  }
}

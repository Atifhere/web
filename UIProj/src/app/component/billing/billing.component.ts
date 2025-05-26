import { Component, OnInit, ViewChild } from '@angular/core';
import { BillingService } from '../../_Service/Billing/billing.service';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MaterialModule } from '../../material.module';
import { CompanyBranchService } from '../../_Service/Company/company-branch.service';
import { CommonModule } from '@angular/common';
import { Constants } from '../../_model/Constants';

@Component({
  standalone: true,
  selector: 'app-billing',
  templateUrl: './billing.component.html',
  styleUrls: ['./billing.component.scss'],
  imports: [MaterialModule, ReactiveFormsModule, CommonModule],
})
export class BillingComponent implements OnInit {
  billingForm!: FormGroup;
  showAddBilling = false;
  NewBillingRecord = "New Billing Record";
  displayedColumns: string[] = ['companyBranchId', 'receiptNumber', 'amount', 'month', 'year', 'createdDate'];
  dataSource = new MatTableDataSource<any>();
  branches: any[] = [];
  pageSize = Constants.PAGE_SIZE;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  months = [
    { name: 'January', value: 1 },
    { name: 'February', value: 2 },
    { name: 'March', value: 3 },
    { name: 'April', value: 4 },
    { name: 'May', value: 5 },
    { name: 'June', value: 6 },
    { name: 'July', value: 7 },
    { name: 'August', value: 8 },
    { name: 'September', value: 9 },
    { name: 'October', value: 10 },
    { name: 'November', value: 11 },
    { name: 'December', value: 12 }
  ];
  years: number[] = [];

  constructor(private fb: FormBuilder, private billingService: BillingService, private companyBranch: CompanyBranchService) { }

  ngOnInit(): void {
    this.billingForm = this.fb.group({
      companyBranchId: ['', Validators.required],
      year: [new Date().getFullYear(), Validators.required],
      month: [new Date().getMonth() + 1, Validators.required],
      amount: [null, Validators.required],
      receiptNumber: ['', Validators.required]
    });

    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    // load branches from API or service
    this.loadBranches();
    this.fetchBillingRecords();
    const currentYear = new Date().getFullYear();
    this.years = [currentYear - 2, currentYear - 1, currentYear];

  }

  toggleAddBilling(): void {
    this.showAddBilling = !this.showAddBilling;
  }

  fetchBillingRecords(): void {
    const { companyBranchId, year, month } = this.billingForm.value;
    this.billingService.getBillingRecords(companyBranchId, year, month).subscribe(data => {
      this.dataSource.data = data;
    });
  }

  submitBilling(): void {
    if (
      this.billingForm.controls['amount'].valid &&
      this.billingForm.controls['receiptNumber'].valid
    ) {
      const { companyBranchId, year, month, amount, receiptNumber } = this.billingForm.value;
      this.billingService
        .addBillingRecord({ companyBranchId, year, month, amount, receiptNumber })
        .subscribe(() => {
          this.fetchBillingRecords();
          this.billingForm.get('amount')?.reset();
          this.billingForm.get('receiptNumber')?.reset();
          this.showAddBilling = false;
        });
    }
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  getBranchName(branchId: string): string {
    const branch = this.branches.find(b => b.id === branchId);
    return branch ? branch.branchName : 'Unknown';
  }

  loadBranches(): void {
    this.companyBranch.GetAll('null').subscribe(data => {
      this.branches = data;
    });
  }
  getMonthName(monthNumber: number): string {
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return monthNames[monthNumber - 1] || 'Invalid';
  }

}

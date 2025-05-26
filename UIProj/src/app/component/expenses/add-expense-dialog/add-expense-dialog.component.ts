import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MaterialModule } from '../../../material.module';
import { FormsModule } from '@angular/forms';
import { CompanyBranch, CompanyBranchDTO } from '../../../_model/company.model';
import { ExpenseService } from '../../../_Service/Expense/ExpenseService.service';
import { CompanyBranchService } from '../../../_Service/Company/company-branch.service';
import { NgFor } from '@angular/common'; // ✅ Import NgFor
@Component({
  selector: 'app-add-expense-dialog',
  standalone: true,
  imports: [MaterialModule, FormsModule, NgFor],
  templateUrl: './add-expense-dialog.component.html',
  styleUrl: './add-expense-dialog.component.css'
})

export class AddExpenseDialogComponent implements OnInit {
  expense = {
    description: '',
    amount: 0,
    companyBranchId: ''
  };

  branches: CompanyBranch[] = [];

  constructor(
    public dialogRef: MatDialogRef<AddExpenseDialogComponent>, private companyBranchService: CompanyBranchService,
    private expenseService: ExpenseService
  ) { }

  ngOnInit(): void {
    this.loadBranches();
  }

  loadBranches() {
    this.companyBranchService.GetAll('null').subscribe({
      next: data => this.branches = data,
      error: err => console.error('Failed to load branches', err)
    });
  }

  submit() {
    this.dialogRef.close(this.expense);
  }
}
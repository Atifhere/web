// src/app/features/staff/salary-summary-dialog/salary-summary-dialog.component.ts
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { EmployeeSalary, SalaryService } from '../../../_Service/Staff/EmployeeSalary';
import { MaterialModule } from '../../../material.module';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CommonModule } from '@angular/common';
import { MatChipsModule } from '@angular/material/chips';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({

  standalone: true,
  imports: [
    MaterialModule,
    RouterLink,
    MatIconModule,
    MatTooltipModule,
    FormsModule,
    CommonModule,
    MatChipsModule,
    ReactiveFormsModule
  ],
  selector: 'app-salary-summary-dialog',
  templateUrl: './salary-summary-dialog.component.html',
  styleUrls: ['./salary-summary-dialog.component.scss']
})
export class SalarySummaryDialogComponent {
  loading = false;
  error = '';
  rows: EmployeeSalary[] = [];

  form = this.fb.group({
    month: [new Date().getMonth() + 1, [Validators.required, Validators.min(1), Validators.max(12)]],
    year: [new Date().getFullYear(), [Validators.required, Validators.min(2000), Validators.max(2100)]],
  });

  displayedColumns: string[] = [
    'employeeName',
    'paymentType',
    'monthlySalary',
    'percentageShare',
    'totalServiceFees',
    'calculatedSalary'
  ];
  constructor(
    private fb: FormBuilder,
    private salarySvc: SalaryService,
    private dialogRef: MatDialogRef<SalarySummaryDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { defaultMonth?: number; defaultYear?: number } | null
  ) {
    if (data?.defaultMonth) this.form.patchValue({ month: data.defaultMonth });
    if (data?.defaultYear) this.form.patchValue({ year: data.defaultYear });
  }

  fetch() {
    this.error = '';
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const { month, year } = this.form.value;
    this.loading = true;
    this.salarySvc.getSalarySummary(Number(month), Number(year)).subscribe({
      next: (res) => {
        this.rows = res || [];
        this.loading = false;
      },
      error: (err) => {
        this.error = err?.error?.message || 'Failed to load salary summary.';
        this.loading = false;
      }
    });
  }

  close() { this.dialogRef.close(); }

  paymentTypeMap: Record<number, string> = {
    1: 'Fixed Salary',
    2: 'Commission Based',
    3: 'Salary + Commission'
  };

  getPaymentTypeLabel(type: number): string {
    return this.paymentTypeMap[type] || 'Not Defined';
  }


  total(row: EmployeeSalary[]): number {
    return row.reduce((sum, r) => sum + (r.calculatedSalary ?? 0), 0);
  }

  months = [
    { value: 1, name: 'January' },
    { value: 2, name: 'February' },
    { value: 3, name: 'March' },
    { value: 4, name: 'April' },
    { value: 5, name: 'May' },
    { value: 6, name: 'June' },
    { value: 7, name: 'July' },
    { value: 8, name: 'August' },
    { value: 9, name: 'September' },
    { value: 10, name: 'October' },
    { value: 11, name: 'November' },
    { value: 12, name: 'December' }
  ];

}

export interface EmployeeSalaryDTO {
  staffId: string;
  employeeName: string;
  paymentType: number;
  totalServiceFees: number;
  calculatedSalary: number;
  monthlySalary: number;
  percentageShare?: number | null;
}

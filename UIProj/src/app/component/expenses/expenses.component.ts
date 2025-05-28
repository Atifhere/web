import { Component, OnInit } from '@angular/core';
import { ExpenseDTO, CreateExpenseDTO, Expense } from '../../_model/Expenses.modal';
import { ExpenseService } from '../../_Service/Expense/ExpenseService.service';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { AddExpenseDialogComponent } from './add-expense-dialog/add-expense-dialog.component';
import { Constants } from '../../_model/Constants';
import { MaterialModule } from '../../material.module';
import { ToastrSrvc } from '../../_Service/Toastr/toastr-service.service';
import { GSTDatePipe } from '../../Pipes/GSTDatePipe.pipe';


@Component({
  selector: 'app-expenses',
  standalone: true,
  imports: [CommonModule, FormsModule, MaterialModule, GSTDatePipe],
  templateUrl: './expenses.component.html',
  styleUrl: './expenses.component.css'
})
export class ExpensesComponent implements OnInit {
  expenses: ExpenseDTO[] = [];
  newExpense: CreateExpenseDTO = { description: '', amount: 0, companyBranchId: '' };
  error: string = '';
  success: string = '';
  pageSize = Constants.PAGE_SIZE;
  currentPage = 0;
  pagedExpenses: Expense[] = [];
  years: number[] = [];
  displayedColumns: string[] = ['description', 'amount', 'createdDate', 'actions'];

  selectedMonth: number = new Date().getMonth() + 1; // JS months are 0-based
  selectedYear: number = new Date().getFullYear();

  constructor(private expenseService: ExpenseService, private dialog: MatDialog,
    private toastr: ToastrSrvc) { }

  ngOnInit(): void {
    const currentYear = new Date().getFullYear();
    this.years = [currentYear - 2, currentYear - 1, currentYear];
    this.loadExpenses();
  }
  getMonthName(monthNumber: number): string {
    const date = new Date(2000, monthNumber - 1); // Months are 0-based
    return date.toLocaleString('default', { month: 'long' });
  }

  loadExpenses(): void {
    this.expenseService.getAllExpenses(this.selectedYear, this.selectedMonth).subscribe({
      next: (res) => {
        this.pagedExpenses = res.data;
        //this.setPagedData();
      },
      error: (err) => {
        this.toastr.ShowInfo('Failed to load expenses', ' No records Found');

      } //this.error = err.error?.message || 'Failed to load expenses'
    });
  }

  createExpense(): void {
    if (!this.newExpense.description || this.newExpense.amount <= 0) {
      this.error = 'Please enter a valid description and amount.';
      return;
    }

    this.expenseService.createExpense(this.newExpense).subscribe({
      next: (res) => {
        if (res.success) {
          this.expenses.unshift(res.data);
          this.newExpense = { description: '', amount: 0, companyBranchId: '' };
          this.success = res.message;
          this.error = '';
        } else {
          this.error = res.message;
        }
      },
      error: () => this.error = 'Failed to create expense.'
    });
  }
  openAddExpenseDialog() {
    const dialogRef = this.dialog.open(AddExpenseDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.expenseService.createExpense(result).subscribe({
          next: () => {
            this.toastr.ShowSuccess('Expense added successfully');

            // this.success = 'Expense added successfully!';
            this.loadExpenses();
          },
          error: (err) => this.error = err.error?.message || 'Failed to add expense'
        });
      }
    });
  }
  deleteExpense(id: string) {
    if (!confirm('Are you sure you want to delete this expense?')) return;

    this.expenseService.deleteExpense(id).subscribe({
      next: () => {
        this.toastr.ShowSuccess('Expense deleted successfully');

        // this.success = 'Expense deleted successfully!';
        this.loadExpenses();
      },
      error: (err) => this.error = err.error?.message || 'Failed to delete expense'
    });
  }
}

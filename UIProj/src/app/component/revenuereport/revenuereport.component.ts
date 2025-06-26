import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { RevenueService } from '../../_Service/Revenue/revenue.services';
import { Constants } from '../../_model/Constants';
import { MaterialModule } from '../../material.module';
import { CommonModule } from '@angular/common';
import { MatSort } from '@angular/material/sort';

// Define interface for employee data
interface EmployeeRevenue {
  staffId: string;
  staffName: string;
  totalWorkRevenue: number;
  contributionPercentage: number;
  branchName : string;
}

interface RevenueSummary {
  companyName: string;
  month: number;
  year: number;
  totalRevenue: number;
  vaT5Percent: number;
  employees: EmployeeRevenue[];
}
interface BranchRevenue {
  branchName: string;
  totalRevenue: number;
  vatAmount: number;
}
@Component({
  selector: 'app-revenuereport',
  standalone: true,
  imports: [MaterialModule, CommonModule, ReactiveFormsModule],
  templateUrl: './revenuereport.component.html',
  styleUrl: './revenuereport.component.css'
})
export class RevenueReportComponent implements OnInit {
  filterForm: FormGroup;
  dataSource: MatTableDataSource<EmployeeRevenue> = new MatTableDataSource<EmployeeRevenue>([]);
  displayedColumns = ['staffName', 'branchName', 'totalWorkRevenue', 'contributionPercentage'];
  pageSize = Constants.PAGE_SIZE;
  summary: RevenueSummary | null = null;
  years: number[] = [];
  noDataFound = false;
  branchRevenues: BranchRevenue[] = [];

  months = [
    { value: 1, label: 'January' },
    { value: 2, label: 'February' },
    { value: 3, label: 'March' },
    { value: 4, label: 'April' },
    { value: 5, label: 'May' },
    { value: 6, label: 'June' },
    { value: 7, label: 'July' },
    { value: 8, label: 'August' },
    { value: 9, label: 'September' },
    { value: 10, label: 'October' },
    { value: 11, label: 'November' },
    { value: 12, label: 'December' }
  ];
  generateYears(): void {
    const currentYear = new Date().getFullYear();
    this.years = [currentYear, currentYear - 1, currentYear - 2];
  }

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private fb: FormBuilder, private revenueService: RevenueService) {
    const today = new Date();
    this.filterForm = this.fb.group({
      month: [today.getMonth() + 1],
      year: [today.getFullYear()],
    });
  }

  ngOnInit(): void {
    this.generateYears();
    this.loadReport();
  }
calculateBranchRevenues(): void {
    if (!this.summary?.employees) {
      this.branchRevenues = [];
      return;
    }

    const branchMap = new Map<string, number>();

    // Sum revenue by branch
    for (const emp of this.summary.employees) {
      const currentSum = branchMap.get(emp.branchName) ?? 0;
      branchMap.set(emp.branchName, currentSum + emp.totalWorkRevenue);
    }

    // Convert to array with VAT
    this.branchRevenues = Array.from(branchMap.entries()).map(([branchName, totalRevenue]) => ({
      branchName,
      totalRevenue,
      vatAmount: +(totalRevenue * 0.05).toFixed(2) // 5% VAT
    }));
  }

  // loadReport(): void {
  //   const { month, year } = this.filterForm.value;
  //   this.revenueService.getCompanyRevenue(month, year).subscribe(data => {
  //     if (Array.isArray(data) && data.length > 0) {
  //       this.summary = data[0];
  //       this.dataSource = new MatTableDataSource(this.summary?.employees ?? []);
  //     } else {
  //       this.summary = null;
  //       this.dataSource = new MatTableDataSource<EmployeeRevenue>([]);
  //     }

  //     // Always assign paginator and sort after dataSource is set
  //     this.dataSource.paginator = this.paginator;
  //     this.dataSource.sort = this.sort;
  //   });
  // }
 loadReport() {
    const filters = this.filterForm.value;

    this.revenueService.getCompanyRevenue(filters.month, filters.year).subscribe({
      next: (response) => {
        if (response && response.length > 0) {
          this.noDataFound = false;
          this.summary = response[0]; // assuming single company
          this.dataSource = new MatTableDataSource(this.summary?.employees ?? []);

          // Calculate branch-wise revenues & VAT
          this.calculateBranchRevenues();
        } else {
          this.noDataFound = true;
          this.summary = null;
          this.dataSource.data = [];
          this.branchRevenues = [];
        }
      },
      error: (err) => {
        console.error(err);
        this.noDataFound = true;
        this.summary = null;
        this.dataSource.data = [];
        this.branchRevenues = [];
      }
    });
  }


  resetFilters(): void {
    const today = new Date();
    this.filterForm.patchValue({
      month: today.getMonth() + 1,
      year: today.getFullYear()
    });
    this.loadReport();
  }

  getMonthName(monthNumber: number): string {
    const month = this.months.find(m => m.value === monthNumber);
    return month ? month.label : '';
  }
}

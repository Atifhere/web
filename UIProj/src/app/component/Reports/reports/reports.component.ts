import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MaterialModule } from '../../../material.module';
import { CommonModule } from '@angular/common';
import { MatTableDataSource } from '@angular/material/table';
import { CompanyService } from '../../../_Service/Company/company.service';
import { MatPaginator } from '@angular/material/paginator';
import { Constants } from '../../../_model/Constants';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [MaterialModule, CommonModule, ReactiveFormsModule],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.css',
})
export class ReportsComponent {
  title = 'Reports';
  filterForm!: FormGroup;
    pageSize = Constants.PAGE_SIZE;
    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;
  dataSource = new MatTableDataSource<any>();
  displayedColumns: string[] = [
    'employeeName',
    'serviceName',
    'serviceFee',
    'branchName',
    'createdDate',
  ];

  constructor(private fb: FormBuilder, private reportService: CompanyService) {}

  ngOnInit(): void {
    this.LoadReport();
  }

  private LoadReport() {
    this.filterForm = this.fb.group({
      fromDate: [],
      toDate: [],
      branchName: [''],
      serviceName: [''],
      employeeName: [''],
    });
    this.loadReport();
  }

  loadReport() {
    const filters = this.filterForm.value;
    this.reportService.getServiceReport(filters).subscribe(res => {
      this.dataSource.data = res.data;
      this.dataSource.paginator = this.paginator; // Set paginator
      this.dataSource.sort = this.sort;
    });
  }

  resetFilters() {
    this.LoadReport();
  }
}

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
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import { ToastrModule } from 'ngx-toastr';
import { ToastrSrvc } from '../../../_Service/Toastr/toastr-service.service';

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
    'isActive',
    'createdDate',
  ];

  constructor(
    private fb: FormBuilder,
    private reportService: CompanyService,
    private toastr: ToastrSrvc
  ) {}

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
  totalAmount: number = 0;
  totalDeleted: number = 0;
  loadReport() {
    const filters = this.filterForm.value;
    this.reportService.getServiceReport(filters).subscribe((res) => {
      this.dataSource.data = res?.data?.report;
      this.dataSource.paginator = this.paginator; // Set paginator
      this.dataSource.sort = this.sort;

      this.totalAmount = res.data.totalActive;
      this.totalDeleted = res.data.totalDeleted;

      // Calculate total amount
      // if (res.data && res.data.length > 0) {
      //   this.totalAmount = res.data.reduce(
      //     (total: any, item: { serviceFee: any }) => total + item.serviceFee,
      //     0
      //   );
      // } else {
      //   this.totalAmount = 0; // Reset total amount if no data
      //   this.toastr.ShowInfo('No records found', '');
      // }
    });
  }

  resetFilters() {
    this.LoadReport();
  }

  downloadExcel() {
    const fileName = 'Report.xlsx';

    // Prepare your data
    const worksheet = XLSX.utils.json_to_sheet(
      this.dataSource.data.map((item) => ({
        'Employee Name': item.employeeName,
        'Service Name': item.serviceName,
        'Service Fee': item.serviceFee,
        'Branch Name': item.branchName,
        'Created Date': new Date(item.createdDate).toLocaleDateString(),
        'Is Deleted' : item.isACtive
      }))
    );

    const workbook = {
      Sheets: { 'Service Report': worksheet },
      SheetNames: ['Service Report'],
    };

    const excelBuffer: any = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });

    // Save the file
    const blobData: Blob = new Blob([excelBuffer], {
      type: 'application/octet-stream',
    });
    FileSaver.saveAs(blobData, fileName);
    this.toastr.ShowSuccess('Excel file downloaded successfully!');
  }
}

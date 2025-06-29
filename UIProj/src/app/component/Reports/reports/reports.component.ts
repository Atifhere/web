import { Component, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';

import { MaterialModule } from '../../../material.module';
import { CompanyService } from '../../../_Service/Company/company.service';
import { Constants } from '../../../_model/Constants';
import { ToastrSrvc } from '../../../_Service/Toastr/toastr-service.service';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [MaterialModule, CommonModule, ReactiveFormsModule],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.css',
})
export class ReportsComponent implements OnInit {
  title = 'Reports';
  filterForm!: FormGroup;
  pageSize = Constants.PAGE_SIZE;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  dataSource = new MatTableDataSource<any>();
  selection = new SelectionModel<any>(true, []);
  displayedColumns: string[] = [
    'select',
    'employeeName',
    'serviceName',
    'serviceFee',
    'branchName',
    'customerName',
    'customerPhone',
    'isActive',
    'createdDate',
  ];

  totalAmount: number = 0;
  totalDeleted: number = 0;

  constructor(
    private fb: FormBuilder,
    private reportService: CompanyService,
    private toastr: ToastrSrvc
  ) { }

  ngOnInit(): void {
    this.initializeForm();
    this.loadReport();
  }

  private initializeForm() {
    this.filterForm = this.fb.group({
      fromDate: [],
      toDate: [],
      branchName: [''],
      serviceName: [''],
      employeeName: [''],
    });
  }

  loadReport() {
    const filters = this.filterForm.value;

    this.reportService.getServiceReport(filters).subscribe((res) => {
      const reportData = res?.data?.report ?? [];

      this.dataSource.data = reportData;
      this.totalAmount = res?.data?.totalActive ?? 0;
      this.totalDeleted = res?.data?.totalDeleted ?? 0;

      if (this.paginator) {
        this.dataSource.paginator = this.paginator;
      }

      // Always assign paginator and sort after dataSource is set
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;

      // ✅ Clear selection if no data is present
      if (reportData.length === 0) {
        this.selection.clear();
      }
    });
  }


  resetFilters() {
    this.filterForm.setValue({
      fromDate: null,
      toDate: null,
      branchName: '',
      serviceName: '',
      employeeName: ''
    });
    this.loadReport(); // reload the report with reset filters
  }


  downloadExcel() {
    const fileName = 'Report.xlsx';
    const worksheet = XLSX.utils.json_to_sheet(
      this.dataSource.data.map((item) => ({
        'Employee Name': item.employeeName,
        'Service Name': item.serviceName,
        'Service Fee': item.serviceFee,
        'Branch Name': item.branchName,
        'Created Date': new Date(item.createdDate).toLocaleDateString(),
        'Is Deleted': item.isActive,
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

    const blobData: Blob = new Blob([excelBuffer], {
      type: 'application/octet-stream',
    });
    FileSaver.saveAs(blobData, fileName);
    this.toastr.ShowSuccess('Excel file downloaded successfully!');
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  toggleAllRows(event: any) {
    if (event.checked) {
      this.selection.select(...this.dataSource.data);
    } else {
      this.selection.clear();
    }
  }

  printSelectedReceipts() {
    const selectedData = this.selection.selected;
    if (!selectedData.length) {
      this.toastr.ShowInfo('Please select at least one record to print.', '');
      return;
    }

    const screenWidth = window.screen.width;
    const printerWidth: '58mm' | '80mm' = screenWidth <= 380 ? '58mm' : '80mm';

    const widthStyles = {
      '58mm': `
      body { width: 58mm; font-size: 10px; margin: 0; padding: 4px; font-family: monospace; color: #000; }
    `,
      '80mm': `
      body { width: 80mm; font-size: 12px; margin: 0; padding: 5px; font-family: monospace; color: #000; }
    `,
    };

    const commonStyle = `
    @page {
      size: auto;
      margin: 0;
    }
    .receipt {
      padding: 8px 0;
      border-bottom: 1px dashed #000;
    }
    .header {
      text-align: center;
      margin-bottom: 6px;
    }
    .header h2 { font-size: 14px; margin: 0; }
    .header h4 { font-size: 12px; margin: 0; }
    .row {
      display: flex;
      justify-content: space-between;
      margin: 2px 0;
    }
    .label {
      font-weight: bold;
    }
    .footer {
      text-align: center;
      font-style: italic;
      margin-top: 6px;
      font-size: 10px;
    }
    .divider {
      border-bottom: 1px dotted #000;
      margin: 4px 0;
    }
  `;

    const firstItem = selectedData[0];

    const serviceRows = selectedData.map((item, i) => `
    <div class="row"><div class="label">Service:</div><div>${item.serviceName}</div></div>
    <div class="row"><div class="label">Fee:</div><div>AED ${item.serviceFee}</div></div>
    ${i < selectedData.length - 1 ? '<div class="divider"></div>' : ''}
  `).join('');

    const content = `
    <div class="receipt">
      <div class="header">
        <h2>Service Receipt</h2>
        <h4>${firstItem.branchName}</h4>
      </div>
      <div class="row"><div class="label">Receipt No:</div><div>${Date.now()}</div></div>
      <div class="row"><div class="label">Date:</div><div>${new Date(firstItem.createdDate).toLocaleDateString()}</div></div><br>
      <div class="divider"></div>
      ${serviceRows}
      <div class="footer">Thank you for visiting!</div>
    </div>
  `;

    const popupWin = window.open('', '_blank', 'width=400,height=600');
    if (!popupWin) {
      this.toastr.ShowError('Popup blocked. Please allow popups for this site.');
      return;
    }

    popupWin.document.open();
    popupWin.document.write(`
    <html>
      <head>
        <title>Receipts</title>
        <style>
          ${widthStyles[printerWidth]}
          ${commonStyle}
        </style>
      </head>
      <body>
        ${content}
        <script>
          window.onload = function () {
            setTimeout(() => {
              window.print();
              window.close();
            }, 500);
          };
        </script>
      </body>
    </html>
  `);

    popupWin.document.close();
    this.selection.clear();
  }




  isFilterEmpty(): boolean {
    const { fromDate, toDate, branchName, serviceName, employeeName } = this.filterForm.value;
    return !fromDate && !toDate && !branchName && !serviceName && !employeeName;
  }

}

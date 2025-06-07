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
import { ToastrSrvc } from '../../../_Service/Toastr/toastr-service.service';
import { SelectionModel } from '@angular/cdk/collections';


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
    'select',
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
  ) { }
  selection = new SelectionModel<any>(true, []);

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
        'Is Deleted': item.isACtive
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
    `
    };

    const commonStyle = `
      .receipt {
        page-break-after: always;
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

    // Grouping selected items
    const grouped = new Map<string, any>();

    selectedData.forEach(item => {
      const key = `${item.employeeName}-${item.branchName}-${new Date(item.createdDate).toDateString()}`;
      if (!grouped.has(key)) {
        grouped.set(key, {
          employeeName: item.employeeName,
          branchName: item.branchName,
          createdDate: item.createdDate,
          services: []
        });
      }
      grouped.get(key).services.push({
        serviceName: item.serviceName,
        serviceFee: item.serviceFee
      });
    });

    const groupedReceipts = Array.from(grouped.values());

    const content = groupedReceipts.map((item, index) => {
      const serviceRows = item.services.map((s: { serviceName: any; serviceFee: any; }, i: number, arr: any[]) => `
      <br /><div class="row"><div class="label">Service Provided:</div><div>${s.serviceName}</div></div>
      <div class="row"><div class="label">Service Fee:</div><div>AED ${s.serviceFee}</div></div>
      ${i < arr.length - 1 ? `<div class="divider"></div>` : ''}
    `).join('');


      return `
      <div class="receipt">
        <div class="header">
          <h2>Service Receipt</h2>
          <h4>${item.branchName}</h4>
        </div>
        <div class="row"><div class="label">Receipt No:</div><div>${Date.now()}-${index + 1}</div></div>
        <div class="row"><div class="label">Date:</div><div>${new Date(item.createdDate).toLocaleDateString()}</div></div>
        <div class="row"><div class="label">Staff:</div><div>${item.employeeName}</div></div>
        ${serviceRows}
        <div class="footer">Thank you for visiting!</div>
      </div>
    `;
    }).join('');

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
      <body onload="window.print(); window.close();">
        ${content}
      </body>
    </html>
  `);
    popupWin.document.close();

    this.selection.clear();
  }




  // exportSelectedReceiptsAsPDF() {
  //   const selectedData = this.selection.selected;

  //   if (!selectedData.length) {
  //     this.toastr.ShowInfo('Please select at least one record to export.', '');
  //     return;
  //   }

  //   const screenWidth = window.screen.width;
  //   const printerWidth: '58mm' | '80mm' = screenWidth <= 380 ? '58mm' : '80mm';

  //   const widthStyles = {
  //     '58mm': `
  //     body { width: 58mm; font-size: 10px; margin: 0; padding: 4px; font-family: monospace; }
  //     .receipt { page-break-after: always; padding-bottom: 10px; border-bottom: 1px dashed #000; }
  //     h3 { font-size: 12px; text-align: center; margin: 5px 0; }
  //     p { margin: 3px 0; }
  //   `,
  //     '80mm': `
  //     body { width: 80mm; font-size: 12px; margin: 0; padding: 5px; font-family: monospace; }
  //     .receipt { page-break-after: always; padding-bottom: 10px; border-bottom: 1px dashed #000; }
  //     h3 { font-size: 14px; text-align: center; margin: 6px 0; }
  //     p { margin: 4px 0; }
  //   `
  //   };

  //   const content = selectedData.map((item, index) => `
  //   <div class="receipt">
  //     <h3>Service Receipt</h3>
  //     <p><strong>Receipt No:</strong> ${Date.now()}-${index}</p>
  //     <p><strong>Employee:</strong> ${item.employeeName}</p>
  //     <p><strong>Service:</strong> ${item.serviceName}</p>
  //     <p><strong>Fee:</strong> AED ${item.serviceFee}</p>
  //     <p><strong>Branch:</strong> ${item.branchName}</p>
  //     <p><strong>Status:</strong> ${item.isActive ? 'Active' : 'Deleted'}</p>
  //     <p><strong>Date:</strong> ${new Date(item.createdDate).toLocaleDateString()}</p>
  //   </div>
  // `).join('');

  //   // Create hidden container
  //   const container = document.createElement('div');
  //   container.innerHTML = `
  //   <style>${widthStyles[printerWidth]}</style>
  //   ${content}
  // `;
  //   container.style.display = 'block'; // Ensuring it gets rendered
  //   document.body.appendChild(container);

  //   // Wait for the browser to fully render content
  //   setTimeout(() => {
  //     // Use html2pdf to generate the PDF
  //     html2pdf()
  //       .set({
  //         margin: 0,
  //         filename: 'Receipts.pdf',
  //         image: { type: 'jpeg', quality: 0.98 },
  //         html2canvas: { scale: 2 },
  //         jsPDF: { unit: 'mm', format: printerWidth, orientation: 'portrait' },
  //       })
  //       .from(container)
  //       .save()
  //       .then(() => {
  //         document.body.removeChild(container);
  //         this.toastr.ShowSuccess('PDF downloaded successfully!');
  //       })
  //       .catch((e:any) => {
  //         console.error('PDF export failed:', e);
  //         this.toastr.ShowError('Failed to generate PDF.');
  //       });
  //   }, 500); // Extended delay to ensure the content is fully rendered
  // }






}

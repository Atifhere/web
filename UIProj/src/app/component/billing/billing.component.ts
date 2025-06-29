import { Component, OnInit, ViewChild } from '@angular/core';
import { BillingService } from '../../_Service/Billing/billing.service';
import { DynamicBillingSummaryDTO } from '../../_model/BillingRecord.modal';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../material.module';
import { FormsModule } from '@angular/forms';
import { BankTransferDialogComponent } from './bank-transfer.component';
import { MatDialog } from '@angular/material/dialog';
import { MarkAsPaidDialogComponent } from './MarkAsPaid/mark-as-paid-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RejectPaymentDialogComponent } from './MarkAsReject/Reject_Payment_Dailog.component';


@Component({
  standalone: true,
  selector: 'app-billing',
  templateUrl: './billing.component.html',
  styleUrls: ['./billing.component.scss'],
  imports: [CommonModule, MaterialModule, FormsModule],
})
export class BillingComponent implements OnInit {
  billingSummaries: DynamicBillingSummaryDTO[] = [];
  displayedSummaries: DynamicBillingSummaryDTO[] = [];
  companySearch = '';
  pageSize = 10;
  currentPage = 0;
  totalCount = 0;
  branchSearch = '';
  role = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private billingService: BillingService, private dialog: MatDialog,
    private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.loadData();
    this.role = localStorage.getItem('userRole') as string;
  }

  loadData(): void {
    // only load if companySearch or branchSearch are empty or length >= 3
    if (
      (this.companySearch && this.companySearch.trim().length > 0 && this.companySearch.trim().length < 3) ||
      (this.branchSearch && this.branchSearch.trim().length > 0 && this.branchSearch.trim().length < 3)
    ) {
      // Don't load data if search terms are shorter than 3 chars
      this.billingSummaries = [];
      this.displayedSummaries = [];
      this.totalCount = 0;
      return;
    }

    this.billingService
      .getBillingSummaryPaged(
        undefined,
        this.companySearch.trim() || undefined,
        this.branchSearch.trim() || undefined
      )
      .subscribe((response) => {
        this.billingSummaries = response.items;
        this.totalCount = response.totalCount;

        this.currentPage = 0;
        if (this.paginator) {
          this.paginator.firstPage();
        }
        this.updateDisplayedSummaries();
      });
  }

  updateDisplayedSummaries(): void {
    const startIndex = this.currentPage * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.displayedSummaries = this.billingSummaries.slice(startIndex, endIndex);
  }

  onPageChange(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.updateDisplayedSummaries();
  }


  onSearchChange(): void {
    if (this.companySearch.length >= 3) {
      this.applyCompanyFilter(this.companySearch.trim().toLowerCase());
    } else {
      // If less than 3 chars, clear filter and show all
      this.displayedSummaries = [...this.billingSummaries];
      this.totalCount = this.billingSummaries.length;
      this.currentPage = 0;
      if (this.paginator) {
        this.paginator.firstPage();
      }
    }
  }
  applyCompanyFilter(searchTerm: string): void {
    const filtered = this.billingSummaries.filter(item =>
      item.salonName.toLowerCase().includes(searchTerm)
    );

    this.displayedSummaries = filtered;
    this.totalCount = filtered.length;
    this.currentPage = 0;
    if (this.paginator) {
      this.paginator.firstPage();
    }
  }
  onCompanySearchChange(): void {
    this.currentPage = 0;
    this.loadData();
  }

  onBranchSearchChange(): void {
    this.currentPage = 0;
    this.loadData();
  }
  clearFilters(): void {
    this.companySearch = '';
    this.branchSearch = '';
    this.currentPage = 0;
    this.loadData();
  }
  isFilterEmpty(): boolean {
    return !this.companySearch?.trim() && !this.branchSearch?.trim();
  }
  openBankTransferDialog(): void {
    this.dialog.open(BankTransferDialogComponent, {
      width: '600px',
    });
  }


  openMarkAsPaidDialog(item: DynamicBillingSummaryDTO): void {
    const dialogRef = this.dialog.open(MarkAsPaidDialogComponent, {
      width: '600px',
      data: {
        ...item,
        fixedAmount: item.fixedMonthlyFee,       // map fixedMonthlyFee → fixedAmount
        commissionAmount: item.commissionAmount,
        totalAmountDue: item.totalAmountDue
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.markBillingAsPaid(
          result.item,
          result.file,
          result.fixedAmount,
          result.commissionAmount,
          result.totalAmountDue
        );
      }
    });
  }

  markBillingAsPaid(
    item: DynamicBillingSummaryDTO,
    file: File,
    fixedAmount?: number,
    commissionAmount?: number,
    totalAmountDue?: number
  ): void {
    const formData = new FormData();
    formData.append('receipt', file);
    formData.append('billingId', item.id);

    if (fixedAmount !== undefined) {
      formData.append('fixedAmount', fixedAmount.toString());
    }
    if (commissionAmount !== undefined) {
      formData.append('commissionAmount', commissionAmount.toString());
    }
    if (totalAmountDue !== undefined) {
      formData.append('totalAmountDue', totalAmountDue.toString());
    }

    this.billingService.markAsPaid(formData).subscribe({
      next: () => {
        this.snackBar.open('Your payment is under review.', 'Close', { duration: 3000 });
        this.loadData();
      },
      error: () => {
        this.snackBar.open('Error while marking as paid.', 'Close', { duration: 3000 });
      }
    });
  }
  approvePayment(item: DynamicBillingSummaryDTO): void {
    if (!confirm(`Approve payment for ${item.salonName} - ${item.monthName} ${item.year}?`)) {
      return;
    }

    debugger
    this.billingService.approveBilling(item.id).subscribe({
      next: () => {
        this.snackBar.open('Payment approved successfully.', 'Close', { duration: 3000 });
        this.loadData(); // reload the table data
      },
      error: () => {
        this.snackBar.open('Failed to approve payment.', 'Close', { duration: 3000 });
      }
    });
  }
  downloadReceipt(item: DynamicBillingSummaryDTO): void {
    this.billingService.downloadReceipt(item.id).subscribe({
      next: (blob: Blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = item.receiptNumber || 'receipt.pdf';
        link.click();
        window.URL.revokeObjectURL(url);
      },
      error: () => {
        this.snackBar.open('Failed to download receipt.', 'Close', { duration: 3000 });
      }
    });
  }

  getReceiptUrl(item: DynamicBillingSummaryDTO): string {
    return `${this.billingService.baseUrl}/download-receipt/${item.id}`;
  }
  openRejectPaymentDialog(item: any) {
    const dialogRef = this.dialog.open(RejectPaymentDialogComponent, {
      width: '400px',
      data: { itemId: item.id }
    });

    dialogRef.afterClosed().subscribe(reason => {
      if (reason) {
        this.rejectPayment(item, reason);
      }
    });
  }

rejectPayment(item: any, reason: string) {
  // Call your backend API to reject payment, sending both billingId and reason
  this.billingService.rejectBilling({ billingId: item.id, reason }).subscribe({
    next: () => {
      this.loadData();
      this.snackBar.open('Payment rejected successfully', 'Close', { duration: 3000 });
    },
    error: () => {
      this.snackBar.open('Failed to reject receipt.', 'Close', { duration: 5000 });
    }
  });
}


}

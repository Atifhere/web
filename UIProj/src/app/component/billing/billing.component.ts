import { Component, OnInit, ViewChild } from '@angular/core';
import { BillingService } from '../../_Service/Billing/billing.service';
import { DynamicBillingSummaryDTO } from '../../_model/BillingRecord.modal';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../material.module';
import { FormsModule } from '@angular/forms';
import { BankTransferDialogComponent } from './bank-transfer.component';
import { MatDialog } from '@angular/material/dialog';


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

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private billingService: BillingService,private dialog: MatDialog) { }

  ngOnInit(): void {
    this.loadData();
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
}

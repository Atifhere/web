export interface BillingRecord {
  id?: string;
  companyBranchId: string;
  year: number;
  month: number;
  amount: number;
  receiptNumber: string;
  createdBy?: string;
  createdDate?: Date;
}

export interface DynamicBillingSummaryDTO {
  id: string;
  companyBranchId: string;
  salonName: string;
  year: number;
  month: number;
  monthName: string;
  totalServicesCompleted: number;
  totalRevenue: number;
  commissionAmount: number;
  fixedMonthlyFee: number;
  totalAmountDue: number;
  isPaid: boolean;
  receiptNumber?: string | null;
  paidOn?: string | null;
}

export interface RejectBillingDto {
  billingId: string;
  reason: string;
}
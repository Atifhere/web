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
export interface ExpenseDTO {
  id: string;
  description: string;
  amount: number;
  createdDate: string;
}

export interface CreateExpenseDTO {
  description: string;
  amount: number;
  companyBranchId : string
}

export interface APIResponse {
  success: boolean;
  responseCode: number;
  result?: string;
  errorMessage?: string;
  message: string;
  data?: any;
}
export interface Expense {
  id: string;
  description: string;
  amount: number;
  createdDate: string;
}
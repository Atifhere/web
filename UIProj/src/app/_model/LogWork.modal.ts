

export interface Branch {
  id: string;
  name: string;
}

export interface Category {
  id: string;
  name: string;
}

export interface SubCategory {
  id: string;
  name: string;
}

export interface WorkItem {
  subCategoryId: string;
  serviceFee: number;
}

export interface LogWorkRequest {
  businessCategoryId: string;
  customerName?: string;
  customerPhone?: string;
  workItem: WorkItem[];
}

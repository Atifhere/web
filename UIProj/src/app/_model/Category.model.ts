export interface Category {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  status: string;
}

export interface SubCategory {
  id: string;
  name: string;
  description: string;
  categoryId: string;
  isActive: boolean;
  status: string;
}

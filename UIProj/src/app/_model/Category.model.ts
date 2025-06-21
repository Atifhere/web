export interface Category {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  status: string;
  subCategories: SubCategory[]; // ← Add this line
}


export interface SubCategory {
  id: string;
  name: string;
  description: string;
  categoryId: string;
  isActive: boolean;
  status: string;
}

export interface CreateCategoryDTO {
  name: string;
  description: string;
  categoryId: string;
  // add other properties allowed on create, but omit id, status, subCategories, etc.
}
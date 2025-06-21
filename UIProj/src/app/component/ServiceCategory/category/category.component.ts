import { Component, inject, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../material.module';
import { CategoryService } from '../../../_Service/Category/category.service';
import { Category, SubCategory } from '../../../_model/Category.model';
import { FormsModule } from '@angular/forms';

interface CategoryWithSubcategories extends Category {
  subcategories: SubCategory[];
}

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [CommonModule, MaterialModule, FormsModule],
  templateUrl: './category.component.html',
  styleUrl: './category.component.css'
})
export class CategoryComponent implements OnInit {

  router = inject(Router);
  categoryService = inject(CategoryService);
  subcategorySearchTerm: string = ''; showAddCategory = false;



  newSubcategory = {
    categoryId: '',
    name: '',
    description: ''
  };
  toggleAddCategory() {
    this.showAddCategory = !this.showAddCategory;
  }

  // addCategory() {
  //   if (!this.newCategory.name.trim()) return;

  //   // Example: call your category service to save new category
  //   this.categoryService.CreateCategory(this.newCategory).subscribe({
  //     next: (addedCat) => {
  //       this.categoryList.push({
  //         ...addedCat,
  //         subcategories: []  // lowercase here
  //       });
  //       this.newCategory = { name: '', description: '' }; // Match CreateCategoryDTO shape
  //       this.showAddCategory = false;

  //       this.loadCategories();
  //     },
  //     error: (err) => {
  //       console.error('Add category failed:', err);
  //     }
  //   });


  // }


  displayedColumns: string[] = ['name', 'description', 'createdBy', 'status', 'actions'];
  subcategoryColumns: string[] = ['name', 'description', 'status', 'actions'];

  categoryList: CategoryWithSubcategories[] = [];
  dataSource = new MatTableDataSource<CategoryWithSubcategories>();

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.categoryService.GetAll().subscribe({
      next: (categories: Category[]) => {
        // Use actual subCategories as returned from the API
        this.categoryList = categories.map(c => ({
          ...c,
          subcategories: (c.subCategories ?? []).filter(sub => sub !== null) // remove nulls if any
        }));
        this.dataSource.data = this.categoryList;
      },
      error: (err) => {
        console.error('Failed to load categories:', err);
      }
    });
  }

  getFilteredSubcategories(subcategories: SubCategory[]): SubCategory[] {
    if (!this.subcategorySearchTerm?.trim()) {
      return subcategories;
    }

    const term = this.subcategorySearchTerm.trim().toLowerCase();
    return subcategories.filter(sub =>
      sub.name?.toLowerCase().includes(term) ||
      sub.description?.toLowerCase().includes(term)
    );
  }




  viewSubcategories(category: Category): void {
    this.router.navigate(['/category', category.id, 'subcategories']);
  }

  editCategory(id: string): void {
    this.router.navigate(['/category/edit', id]);
  }

  deleteCategory(id: string): void {
    if (confirm('Are you sure you want to delete this category?')) {
      this.categoryService.DeleteCategory(id).subscribe({
        next: () => {
          this.categoryList = this.categoryList.filter(c => c.id !== id);
          this.dataSource.data = this.categoryList;
        },
        error: (err) => {
          console.error('Delete failed:', err);
        }
      });
    }
  }

  editSubcategory(id: string): void {
    this.router.navigate(['/subcategory/edit', id]);
  }

  deleteSubcategory(id: string): void {
    if (confirm('Are you sure you want to delete this subcategory?')) {
      alert('Subcategory deletion not yet implemented');
    }
  }



  addSubcategory() {
    if (!this.newSubcategory.name || !this.newSubcategory.categoryId) return;

    this.categoryService.CreateSubCategory(this.newSubcategory).subscribe({
      next: (res) => {
        // handle success - maybe refresh subcategory list or clear form
        this.newSubcategory = { categoryId: '', name: '', description: '' };
      },
      error: (err) => {
        console.error('Failed to add subcategory', err);
      }
    });
  }


}

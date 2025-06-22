import { Component, inject, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../material.module';
import { CategoryService } from '../../../_Service/Category/category.service';
import { Category, SubCategory } from '../../../_model/Category.model';
import { FormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { CategoryDialogComponent } from './add-category/add-category.component';

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
  constructor(
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) { }
  router = inject(Router);

  categoryService = inject(CategoryService);
  subcategorySearchTerm: string = ''; showAddCategory = false;
  selectedCategoryId: string = '';



  newSubcategory = {
    categoryId: '',
    name: '',
    description: '',
    maxValue: 0,
    minValue: 0
  };
  toggleAddCategory() {
    this.showAddCategory = !this.showAddCategory;
  }
  // }
  // subcategoryColumns: string[] = ['name', 'description', 'minValue', 'maxValue', 'status', 'actions'];
  subcategoryColumns: string[] = ['name', 'description', 'status', 'actions'];

  categoryList: CategoryWithSubcategories[] = [];
  dataSource = new MatTableDataSource<CategoryWithSubcategories>();

  ngOnInit(): void {
    this.loadCategories();
  }
  onTabChange(index: number): void {
    if (this.categoryList && this.categoryList.length > index) {
      this.selectedCategoryId = this.categoryList[index].id;
      console.log('Selected Category ID:', this.selectedCategoryId);
    }
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

  editSubcategory(id: string): void {
    this.router.navigate(['/subcategory/edit', id]);
  }

  deleteSubcategory(id: string): void {
    this.snackBar.dismiss();
    if (confirm('Are you sure you want to delete this subcategory?')) {
      this.categoryService.DeleteSubCategory(id).subscribe({
        next: () => {
          // Remove subcategory from UI
          this.categoryList.forEach(category => {
            category.subcategories = category.subcategories.filter(sub => sub.id !== id);
          });
          this.dataSource.data = [...this.categoryList]; // Trigger UI update
          this.snackBar.open('Subcategory delete.', 'Close', { duration: 5000 });
          this.loadCategories();

        },
        error: (err) => {
          console.error('Subcategory deletion failed:', err);
        }
      });
    }
  }

  openAddCategoryDialog(): void {
    const dialogRef = this.dialog.open(CategoryDialogComponent, {
      width: '800px',
      maxWidth: '90vw',
      panelClass: 'responsive-dialog',
      data: {
        categoryId: this.selectedCategoryId,
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.categoryService.CreateSubCategory(result).subscribe({
          next: () => {
            this.snackBar.open('Subcategory added successfully', 'Close', { duration: 3000 });
            this.loadCategories();
          },
          error: (err) => {
            console.error('Create subcategory failed', err);
          }
        });
      }
    });
  }

  openEditCategoryDialog(category: Category): void {
    const dialogRef = this.dialog.open(CategoryDialogComponent, {
      width: '800px',
      maxWidth: '90vw',
      panelClass: 'responsive-dialog',
      data: { category }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.categoryService.UpdateCategory(result).subscribe({
          next: () => {
            this.snackBar.open('Category updated successfully', 'Close', { duration: 3000 });
            this.loadCategories();
          },
          error: (err) => {
            console.error('Update category failed', err);
          }
        });
      }
    });
  }

}

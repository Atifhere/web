import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../../material.module';

@Component({
  selector: 'app-category-dialog',
  templateUrl: './add-category.component.html',
  styleUrl: './add-category.component.css',
  standalone: true,
  imports: [CommonModule, MaterialModule, ReactiveFormsModule]
})
export class CategoryDialogComponent {
  categoryForm: FormGroup;
  isEditMode = false;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<CategoryDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.isEditMode = !!data?.category;
    this.categoryForm = this.fb.group({
      name: [data?.category?.name || '', Validators.required],
      description: [data?.category?.description || ''],
      categoryId: [data.categoryId]
    });
    console.log(data.categoryId);
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if (this.categoryForm.valid) {
      const result = {
        ...this.data?.category,
        ...this.categoryForm.value,
      };
      this.dialogRef.close(result);
    }
  }
}

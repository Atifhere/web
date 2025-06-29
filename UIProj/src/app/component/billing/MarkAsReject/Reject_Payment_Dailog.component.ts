import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MaterialModule } from '../../../material.module';

@Component({
    standalone: true,
    selector: 'app-reject-payment-dialog',
    imports: [MaterialModule, ReactiveFormsModule],
    template: `
    <h2 mat-dialog-title>Reject Payment</h2>
    <mat-dialog-content [formGroup]="form">
      <mat-form-field appearance="fill" class="w-100">
        <mat-label>Reason for rejection</mat-label>
        <textarea matInput formControlName="reason" rows="4" placeholder="Enter rejection reason"></textarea>
        <mat-error *ngIf="form.controls['reason'].hasError('required')">
          Reason is required
        </mat-error>
      </mat-form-field>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-stroked-button (click)="onCancel()">Cancel</button>
      <button mat-raised-button color="warn" [disabled]="form.invalid" (click)="onSubmit()">
        Reject
      </button>
    </mat-dialog-actions>
  `,
})
export class RejectPaymentDialogComponent {
    form: FormGroup;

    constructor(
        public dialogRef: MatDialogRef<RejectPaymentDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { itemId: string }, // pass item id
        private fb: FormBuilder
    ) {
        this.form = this.fb.group({
            reason: ['', Validators.required]
        });
    }

    onCancel(): void {
        this.dialogRef.close();
    }

    onSubmit(): void {
        if (this.form.valid) {
            this.dialogRef.close(this.form.value.reason);
        }
    }
}

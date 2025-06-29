import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MaterialModule } from '../../../material.module';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';

@Component({
    standalone: true,
    imports: [MaterialModule, CommonModule],
    selector: 'app-mark-as-paid-dialog',
    templateUrl: './mark-as-paid-dialog.component.html',
    styleUrls: ['./mark-as-paid-dialog.component.scss']
})
export class MarkAsPaidDialogComponent {
    uploadedFile?: File | null = null;

    constructor(
        public dialogRef: MatDialogRef<MarkAsPaidDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private snackBar: MatSnackBar
    ) { }


    onFileSelected(event: any): void {
        const file = event.target.files[0];
        if (file && file.size <= 5 * 1024 * 1024) {
            this.uploadedFile = file;
        } else {
            this.snackBar.open('File size exceeds 5MB.', 'Close', { duration: 3000 });
        }
    }


    confirm(): void {
        if (this.uploadedFile) {
            this.dialogRef.close({
                file: this.uploadedFile,
                item: this.data,
                fixedAmount: this.data.fixedMonthlyFee,       // <-- pass fixed amount
                commissionAmount: this.data.commissionAmount,  // <-- pass commission
                totalAmountDue: this.data.totalAmountDue       // <-- pass total due
            });
        }
    }

    cancel(): void {
        this.dialogRef.close();
    }
}

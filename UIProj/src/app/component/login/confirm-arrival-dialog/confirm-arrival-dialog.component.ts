import { Component, Inject } from '@angular/core';
import { MaterialModule } from '../../../material.module';
import { CompanyService } from '../../../_Service/Company/company.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-confirm-arrival-dialog',
  standalone: true,
  imports: [MaterialModule, CommonModule],
  templateUrl: './confirm-arrival-dialog.component.html',
  styleUrl: './confirm-arrival-dialog.component.css'
})
export class ConfirmArrivalDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmArrivalDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private companyService: CompanyService
  ) {

  }



  confirmArrival(hasArrived: boolean) {
    this.companyService.markUserAsArrived(this.data.appointmentId, hasArrived).subscribe(() => {
      this.dialogRef.close(true);
    });
  }

  close() {
    this.dialogRef.close(false);
  }
}

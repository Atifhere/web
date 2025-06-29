import { Component } from '@angular/core';
import { MaterialModule } from '../../material.module';

@Component({
  selector: 'app-bank-transfer-dialog',
  standalone: true,
  imports: [MaterialModule],
  template: `
    <h2 mat-dialog-title>💳 Bank Transfer Instructions</h2>
    <hr />
    <mat-dialog-content>
      <div class="row mb-3">
        <div class="col-md-6 mb-2">
          <p><strong>Account Name:</strong> ATIF SHAHZAD</p>
        </div>
        <div class="col-md-6 mb-2">
          <p><strong>Account Number:</strong> 10484887132001</p>
        </div>
        <div class="col-md-6 mb-2">
          <p><strong>Swift Code:</strong> ADCBAEAA</p>
        </div>
        <div class="col-md-6 mb-2">
          <p><strong>IBAN:</strong> AE390030010484887132001</p>
        </div>
        <div class="col-md-6 mb-2">
          <p><strong>Bank Name:</strong> Abu Dhabi Commercial Bank PJSC</p>
        </div>
        <br><br><br>
        <div class="col-md-12 mb-2">
          <p><strong>Note:</strong> Please include your company name in the payment reference.</p>
        </div>
      </div>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Close</button>
    </mat-dialog-actions>
  `,
  styles: [
    `
      p {
        margin: 0;
        font-size: 14px;
        line-height: 1.4;
      }
      .mat-dialog-content {
        padding-top: 8px;
        padding-bottom: 8px;
      }
      .row {
        margin-left: 0;
        margin-right: 0;
      }
      .mb-2 {
        margin-bottom: 8px;
      }
    `
  ]
})
export class BankTransferDialogComponent {}

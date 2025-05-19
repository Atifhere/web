import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../../material.module';
import { ResetPasswordComponent } from '../../reset-password/reset-password.component';
import { CompanyService } from '../../../_Service/Company/company.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Partner } from '../../../_model/Partner.modal';

@Component({
  selector: 'app-company-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MaterialModule, ResetPasswordComponent],
  templateUrl: './company-profile.component.html',
  styleUrl: './company-profile.component.css'
})
export class CompanyProfileComponent implements OnInit {
  showAddForm = false;
  newPartnerForm!: FormGroup;

  // Static partner list
  staticPartners = [
    {
      name: 'Alice Johnson',
      share: 40,
      mobile: '9876543210',
      address: '123 Elm Street, NY'
    },
    {
      name: 'Bob Smith',
      share: 30,
      mobile: '9876543211',
      address: '456 Maple Avenue, CA'
    },
    {
      name: 'Clara Lee',
      share: 30,
      mobile: '9876543212',
      address: '789 Oak Drive, TX'
    }
  ];

  constructor(
    private fb: FormBuilder,
    private companyService: CompanyService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.newPartnerForm = this.fb.group({
      name: ['', Validators.required],
      share: ['', [Validators.required, Validators.min(0), Validators.max(100)]],
      mobile: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      address: ['', Validators.required]
    });
  }

  saveNewPartner(): void {
    if (this.newPartnerForm.invalid) {
      this.newPartnerForm.markAllAsTouched();
      return;
    }

    const newPartner: Partner = this.newPartnerForm.value;

    // Replace 1 with your actual company ID or fetch dynamically
    const companyId = 1;

    this.companyService.addPartner(companyId, newPartner).subscribe({
      next: () => {
        this.staticPartners.push(newPartner); // Optimistic update
        this.newPartnerForm.reset();
        this.showAddForm = false;
        this.snackBar.open('Partner added successfully!', 'Close', { duration: 3000 });
      },
      error: (err) => {
        console.error('Failed to add partner', err);
        this.snackBar.open('Failed to add partner. Please try again.', 'Close', { duration: 3000 });
      }
    });
  }

}

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../../material.module';
import { ResetPasswordComponent } from '../../reset-password/reset-password.component';
import { BillingComponent } from '../../billing/billing.component';
import { CompanyService } from '../../../_Service/Company/company.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Partner } from '../../../_model/Partner.modal';
import { PartnerService } from '../../../_Service/Partner/Partner.Service';
import { BrowserModule } from '@angular/platform-browser';
import { ExpensesComponent } from '../../expenses/expenses.component';

@Component({
  selector: 'app-company-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MaterialModule, ResetPasswordComponent, BillingComponent, ExpensesComponent,
    FormsModule
  ],
  templateUrl: './company-profile.component.html',
  styleUrl: './company-profile.component.css'
})
export class CompanyProfileComponent implements OnInit {
  showAddForm = false;
  newPartnerForm!: FormGroup;
  partners: Partner[] = [];
  editingPartner: Partner | null = null;
  editingPartnerId: any;

  constructor(
    private fb: FormBuilder,
    private partnerService: PartnerService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.newPartnerForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.maxLength(50), Validators.email]],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$'), Validators.maxLength(15)]],
      position: ['', [Validators.required, Validators.maxLength(50)]],
      companyPercentageShare: ['', [Validators.required, Validators.min(0), Validators.max(100)]],
      address: ['', [Validators.required, Validators.maxLength(50)]]
    });

    this.loadPartners(); // Initial partner list
  }

  loadPartners(): void {
    const companyId = 'your-company-id'; // Replace or fetch this dynamically

    this.partnerService.getPartnersByCompany(companyId).subscribe({
      next: (data: Partner[]) => {
        this.partners = data;
      },
      error: (err) => {
        console.error('Error loading partners', err);
        this.snackBar.open('Failed to load partners.', 'Close', { duration: 5000 });
      }
    });
  }

  saveNewPartner(): void {
    if (this.newPartnerForm.invalid) {
      this.newPartnerForm.markAllAsTouched();
      return;
    }

    const companyId = 'your-company-id'; // Replace or fetch this dynamically
    const newPartner: Partner = {
      ...this.newPartnerForm.value,
      id: '',
      CompanyName: '',
      companyId
    };
    this.partnerService.addPartner(companyId, newPartner).subscribe({
      next: (createdPartner: Partner) => {
        this.loadPartners();
        this.newPartnerForm.reset();
        this.showAddForm = false;
        this.snackBar.open('Partner added successfully!', 'Close', { duration: 5000 });
      },
      error: (err) => {
        console.error('Failed to add partner', err);
        this.snackBar.open('Failed to add partner. Please try again.', 'Close', { duration: 5000 });
      }
    });
  }

  // Start editing
  editPartner(partner: Partner): void {
    this.editingPartner = partner;
    this.editingPartnerId = partner.id;
    this.showAddForm = true;

    this.newPartnerForm.patchValue({
      fullName: partner.fullName,
      email: partner.email,
      phone: partner.phone,
      position: partner.position,
      companyPercentageShare: partner.companyPercentageShare,
      address: partner.address
    });
  }


  // Cancel editing
  cancelEdit(): void {
    this.editingPartner = null;
    this.editingPartnerId = null;
    this.newPartnerForm.reset();
    this.showAddForm = false;
  }
  toggleAddForm(): void {
    if (this.editingPartner) {
      this.cancelEdit();
    } else {
      this.showAddForm = !this.showAddForm;
      this.newPartnerForm.reset();
    }
  }

  updatePartner(): void {
    if (!this.editingPartnerId || this.newPartnerForm.invalid) return;

    const updatedPartner: Partner = {
      ...this.newPartnerForm.value,
      id: this.editingPartnerId,
      companyId: this.editingPartner?.companyId ?? '', // fallback
      CompanyName: this.editingPartner?.CompanyName ?? ''
    };

    this.partnerService.updatePartner(this.editingPartnerId, updatedPartner).subscribe({
      next: () => {
        // const index = this.partners.findIndex(p => p.id === this.editingPartnerId);
        // if (index !== -1) this.partners[index] = updatedPartner;
        this.loadPartners();
        this.snackBar.open('Partner updated!', 'Close', { duration: 8000 });
        this.cancelEdit();
      },
      error: () => this.snackBar.open('Failed to update partner', 'Close', { duration: 3000 })
    });
  }

  deletePartner(partner: Partner): void {
    if (!confirm(`Are you sure you want to delete ${partner.fullName}?`)) return;

    this.partnerService.deletePartner(partner.id!).subscribe({
      next: () => {
        //this.partners = this.partners.filter(p => p.id !== partner.id);
        this.loadPartners();
        this.snackBar.open('Partner deleted.', 'Close', { duration: 8000 });
      },
      error: () => this.snackBar.open('Failed to delete partner.', 'Close', { duration: 3000 })
    });
  }




  // Earnings Working //

  selectedYear = new Date().getFullYear();
  selectedMonth = new Date().getMonth() + 1; // JS month is 0-indexed
  months = [
    { name: 'January', value: 1 }, { name: 'February', value: 2 }, { name: 'March', value: 3 },
    { name: 'April', value: 4 }, { name: 'May', value: 5 }, { name: 'June', value: 6 },
    { name: 'July', value: 7 }, { name: 'August', value: 8 }, { name: 'September', value: 9 },
    { name: 'October', value: 10 }, { name: 'November', value: 11 }, { name: 'December', value: 12 }
  ];

  earnings: any[] = [];
displayedColumns: string[] = [
  'partnerName',
  'companyPercentageShare',
  'partnerEarnings'
];



  fetchEarnings() {
    this.partnerService.getPartnerEarnings(this.selectedYear, this.selectedMonth).subscribe({
      next: (data) => this.earnings = data,
      error: (err) => console.error('Failed to fetch partner earnings', err)
    });
  }
 email : string = 'atif@managesalons.com';

}

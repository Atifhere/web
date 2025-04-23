import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MaterialModule } from '../../../material.module';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CompanyService } from '../../../_Service/Company/company.service';
import { CompanyBranchService } from '../../../_Service/Company/company-branch.service';
import { CompanyBranch } from '../../../_model/company.model';
import { FormsModule } from '@angular/forms';
import { startWith, map } from 'rxjs/operators';

@Component({
  selector: 'app-add-appointment-dialog-component',
  standalone: true,
  imports: [MaterialModule, CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './add-appointment-dialog-component.html',
  styleUrls: ['./add-appointment-dialog-component.css'],
})
export class AddAppointmentDialogComponent implements OnInit {
  appointmentForm: FormGroup;
  branches: CompanyBranch[] = []; // This will hold the company branches based on selected state
  timeSlots = this.generateTimeSlots();
  states: any[] = [];
  searchBranch: string = ''; // Search term
  filteredBranches: CompanyBranch[] = []; // Filtered branches based on search term

  constructor(
    private fb: FormBuilder,
    private companyService: CompanyService,
    private CompanyBranchService: CompanyBranchService,
    private dialogRef: MatDialogRef<AddAppointmentDialogComponent>
  ) {
    this.appointmentForm = this.fb.group({
      customerPhone: ['', Validators.required],
      customerName: ['', Validators.required],
      customerEmail: ['', [Validators.required, Validators.email]],
      companyBranchId: this.companyBranchControl,
      appointmentDate: ['', Validators.required],
      appointmentTimeSlot: ['', Validators.required],
      notes: [''],
      state: [''],
    });
  }
  companyBranchControl = new FormControl('', Validators.required);

  ngOnInit() {
    this.loadStates(); // Load states when the component is initialized

    // Watch companyBranchId input and filter dynamically
    this.appointmentForm
      .get('companyBranchId')!
      .valueChanges.pipe(
        startWith(''),
        map((value) => (typeof value === 'string' ? value : value?.branchName)),
        map((name) =>
          name ? this._filterBranches(name) : this.branches.slice()
        )
      )
      .subscribe((filtered) => (this.filteredBranches = filtered));
  }

  displayBranchName = (branch: CompanyBranch): string =>
    branch && branch.branchName ? branch.branchName : '';

  private _filterBranches(value: string): CompanyBranch[] {
    const filterValue = value.toLowerCase();
    return this.branches.filter((branch) =>
      branch.branchName.toLowerCase().includes(filterValue)
    );
  }
  loadStates() {
    this.companyService.getStates().subscribe(
      (data) => {
        this.states = data; // Set the states to be used in dropdown
        console.log(this.states);
      },
      (error) => {
        console.error('Error loading states:', error);
      }
    );
  }

  generateTimeSlots() {
    const slots = [];
    const start = new Date();
    start.setHours(0, 0, 0, 0);

    for (let i = 0; i < 48; i++) {
      const time = new Date(start.getTime() + i * 30 * 60000);
      const label = time.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      });
      const value = time.toTimeString().substring(0, 8); // "HH:mm:ss"
      slots.push({ label, value });
    }

    return slots;
  }

  close() {
    this.dialogRef.close();
  }

  onStateChange(stateCode: string): void {
    this.companyBranchControl.reset(); // Reset the selected branch
    this.CompanyBranchService.GetBranchesByState(stateCode).subscribe(
      (branches) => {
        this.branches = branches;
        this.filteredBranches = branches; // Set filtered branches initially
      },
      (error) => {
        console.error('Error loading branches:', error);
      }
    );
  }

  filterBranches(): void {
    const query = this.searchBranch.toLowerCase();
    this.filteredBranches = this.branches.filter((branch) =>
      branch.branchName.toLowerCase().includes(query)
    );
  }

  submit() {
    if (this.appointmentForm.valid) {
      const appointmentData = this.appointmentForm.value;
      appointmentData.companyBranchId =
        this.appointmentForm.get('companyBranchId')?.value?.id; // Get the ID of the selected branch

      const formValue = { ...this.appointmentForm.value };
      const date = new Date(this.appointmentForm.get('appointmentDate')?.value);
      formValue.appointmentDate = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate()
      );

      appointmentData.appointmentDate = formValue.appointmentDate;

      this.companyService.createAppointment(appointmentData).subscribe({
        next: (res) => {
          console.log(res.message);
          alert('Appointment booked successfully!');
          this.dialogRef.close(true);
        },
        error: (err) => {
          console.error(err);
          alert(err.error?.message || 'Failed to book appointment.');
        },
      });
    }
  }
}

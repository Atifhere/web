import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MaterialModule } from '../../../material.module';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-add-appointment-dialog-component',
  standalone: true, 
  //
  imports: [MaterialModule, CommonModule, ReactiveFormsModule],
  templateUrl: './add-appointment-dialog-component.html',
  styleUrl: './add-appointment-dialog-component.css',
})
export class AddAppointmentDialogComponent {
  appointmentForm: FormGroup;
  branches = [
    { id: 'b1', name: 'Downtown Branch' },
    { id: 'b2', name: 'Uptown Branch' },
  ];

  timeSlots = this.generateTimeSlots();

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddAppointmentDialogComponent>
  ) {
    this.appointmentForm = this.fb.group({
      customerName: ['', Validators.required],
      customerEmail: ['', [Validators.required, Validators.email]],
      companyBranchId: ['', Validators.required],
      appointmentDate: ['', Validators.required],
      appointmentTimeSlot: ['', Validators.required],
      notes: [''],
    });
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

  submit() {
    if (this.appointmentForm.valid) {
      console.log(this.appointmentForm.value);
      this.dialogRef.close(this.appointmentForm.value);
    }
  }
}

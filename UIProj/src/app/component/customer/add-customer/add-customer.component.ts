import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MaterialModule } from '../../../material.module';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CustomerService } from '../../../_Service/Customer/customer.service';
import { Customer } from '../../../_model/Customer.model';

@Component({
  selector: 'app-add-customer',
  standalone: true,
  imports: [MaterialModule, RouterLink, ReactiveFormsModule],
  templateUrl: './add-customer.component.html',
  styleUrl: './add-customer.component.css',
})
export class AddCustomerComponent implements OnInit {
  response: any;
  editCode: string = '';
  isEdit: boolean = false;
  Title: string = 'Create Customer';
  editData!: Customer;
  ngOnInit(): void {
    this.editCode = this.activateRoute.snapshot.paramMap.get('code') as string;

    if (this.editCode != '' && this.editCode != null) {
      this.isEdit = true;
      this.Title = 'Edit Customer';
      this.customerForm.controls['code'].disable();
      this.customerService
        .GetCustomerBycode(this.editCode)
        .subscribe((item) => {
          this.editData = item;
          this.customerForm.setValue({
            code: this.editData.code,
            email: this.editData.email,
            name: this.editData.name,
            phone: this.editData.phone,
            creditlimit: this.editData.creditlimit,
            status: item.status == "Active" ? true : false,
          });
        });
    }
  }

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private customerService: CustomerService,
    private activateRoute: ActivatedRoute
  ) {}

  customerForm = this.fb.group({
    code: this.fb.control('', Validators.required),
    name: this.fb.control('', Validators.required),
    email: this.fb.control('', Validators.required),
    phone: this.fb.control('', Validators.required),
    creditlimit: this.fb.control(0, Validators.required),
    status: this.fb.control(true),
  });

  SaveCustomer() {
    if (this.customerForm.valid) {
      let customerObj: Customer = {
        id: this.editCode as string,
        code: this.customerForm.value.code as string,
        name: this.customerForm.value.name as string,
        email: this.customerForm.value.email as string,
        phone: this.customerForm.value.phone as string,
        creditlimit: this.customerForm.value.creditlimit as number,
        isActive: this.customerForm.value.status as boolean,
        taxcode: '0',
        status: '',
      };
      if (!this.isEdit) {
        this.customerService.CreateCustomer(customerObj).subscribe((item) => {
          if (item) {
            this.response = item;

            if (this.response.success) {
              alert(this.response.message);
              this.router.navigateByUrl('/customer');
            } else {
              alert('Something Went Wrong. Please try again.');
            }
          } else {
            alert('Something Went Wrong. Please try again.');
          }
        });
      } else if (this.isEdit == true) {
        customerObj.code = this.editCode;
        this.customerService.UpdateCustomer(customerObj).subscribe((item) => {
          if (item) {
            this.response = item;

            if (this.response.success) {
              alert(this.response.message);
              this.router.navigateByUrl('/customer');
            } else {
              alert('Something Went Wrong. Please try again.');
            }
          } else {
            alert('Something Went Wrong. Please try again.');
          }
        });
      }
    }
  }
}

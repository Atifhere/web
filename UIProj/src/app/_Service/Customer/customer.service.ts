import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { Customer } from '../../_model/Customer.model';

@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  constructor(private http: HttpClient) {}

  baseUrl = environment.apiUrl + 'Customer/';
  constant = environment;
  GetAll() {
    // passing the token through http interceptor.
    return this.http.get<Customer[]>(this.baseUrl + this.constant.GET_ALL);
  }

  GetCustomerBycode(id: string) {
    // passing the token through http interceptor.
    return this.http.get<Customer>(this.baseUrl + this.constant.GET_BY_CODE + id);
  }

  CreateCustomer(data: Customer) {
    return this.http.post(this.baseUrl + this.constant.CREATE, data);
  }

  UpdateCustomer(data: Customer) {
    return this.http.put(this.baseUrl + this.constant.UPDATE +  data.id, data);
  }

  DeleteCustomer(code: string) {
    return this.http.delete(this.baseUrl + this.constant.REMOVE + code);
  }
}

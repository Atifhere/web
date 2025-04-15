import { Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { Company } from '../../_model/company.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {

  constructor(private http: HttpClient) { }
  baseUrl = environment.apiUrl + 'Company/';
  CompanyToAddBranch = signal('');
  GetAll() {
    // passing the token through http interceptor.
    return this.http.get<Company[]>(this.baseUrl + 'GetAll');
  }
  
  GetCompanyBycode(id: string) {
    // passing the token through http interceptor.
    return this.http.get<Company>(this.baseUrl + 'GetByCode?code=' + id);
  }

  CreateCompany(data: Company) {
    return this.http.post(this.baseUrl + 'Create', data);
  }

  UpdateCompany(data: Company) {
    return this.http.put(
      this.baseUrl + 'Update?code=' + data.id,
      data
    );
  }

  
  DeleteCompany(code: string) {
    return this.http.delete(
      this.baseUrl + 'Remove?code=' + code
    );
  }

  
  GetCompanyEarningSummary() {
    // passing the token through http interceptor.
    return this.http.get<Company>(this.baseUrl + 'GetCompanyEarningSummary');
  }
}

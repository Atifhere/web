import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { CompanyBranch } from '../../_model/company.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CompanyBranchService {
  constructor(private http: HttpClient) {}
  constant = environment;
  baseUrl = this.constant.apiUrl + 'CompanyBranch/';
  GetAll(id: string) {
    // passing the token through http interceptor.
    return this.http.get<CompanyBranch[]>(this.baseUrl + this.constant.GET_ALL+ '/' + id);
  }

  GetBranchBycode(id: string) {
    // passing the token through http interceptor.
    return this.http.get<CompanyBranch>(this.baseUrl + this.constant.GET_BY_CODE + id);
  }

  CreateCompanyBranch(data: CompanyBranch) {
    return this.http.post(this.baseUrl + this.constant.CREATE, data);
  }

  UpdateBranch(data: CompanyBranch) {
    return this.http.put(this.baseUrl + this.constant.UPDATE + data.id, data);
  }

  DeleteCompany(id: string) {
    return this.http.delete(this.baseUrl + this.constant.REMOVE + id);
  }

  GetBranchesByState(stateCode: string): Observable<CompanyBranch[]> {
    return this.http.get<CompanyBranch[]>(this.baseUrl + 'GetBranchesByState?code=' + stateCode);
  }
  
}
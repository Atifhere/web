import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { Staff } from '../../_model/staff.model';
import { LatestTransactionDto } from '../../_model/Chart.modal';
import { Observable } from 'rxjs';
import { LogWorkRequest } from '../../_model/LogWork.modal';
import { APIResponse } from '../../_model/Expenses.modal';

@Injectable({
  providedIn: 'root',
})
export class StaffService {
  constructor(private http: HttpClient) { }
  baseUrl = environment.apiUrl + 'Staff/';
  GetAll(branchId: string) {
    // passing the token through http interceptor.
    return this.http.get<Staff[]>(this.baseUrl + 'GetAll/' + branchId);
  }

  GetStaffBycode(id: string) {
    // passing the token through http interceptor.
    return this.http.get<Staff>(this.baseUrl + 'GetByCode?code=' + id);
  }

  CreateStaff(data: Staff) {
    return this.http.post(this.baseUrl + 'Create', data);
  }

  UpdateStaff(data: Staff) {
    return this.http.put(this.baseUrl + 'Update?code=' + data.id, data);
  }

  DeleteStaff(id: string) {
    return this.http.delete(this.baseUrl + 'Remove?code=' + id);
  }

  getLatestTransactions(): Observable<LatestTransactionDto[]> {
    return this.http.get<LatestTransactionDto[]>(`${this.baseUrl}GetLatestTransactions`);
  }

  logWork(payload: LogWorkRequest): Observable<APIResponse> {
    return this.http.post<APIResponse>(`${this.baseUrl}/LogWork`, payload);
  }

}

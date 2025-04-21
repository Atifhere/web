import { Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { Company } from '../../_model/company.model';
import { HttpClient } from '@angular/common/http';
import { LatestTransactionDto, MonthlyRevenueChartDto } from '../../_model/Chart.modal';
import { Observable } from 'rxjs';
import { DashboardInsightsDto } from '../../_model/Dashboard.modal';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {
  monthlyRevenueData: MonthlyRevenueChartDto[] = [];

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
  
  getMonthlyRevenue(){
    return this.http.get<MonthlyRevenueChartDto[]>(this.baseUrl + 'GetChartRevenue');
  }
  
  getDashboardInsights(): Observable<LatestTransactionDto[]> {
    return this.http.get<LatestTransactionDto[]>(`${this.baseUrl}GetDashboardInsights`);
  }

  getDashboardStatistics(): Observable<DashboardInsightsDto> {
    return this.http.get<DashboardInsightsDto>(`${this.baseUrl}GetDashboardStatistics`);
  }


  getCompanyById(id: string): Observable<Company> {
    return this.http.get<Company>(`${this.baseUrl}GetByCode?code=${id}`);
  }

  getAppointments(): Observable<any[]> {
    return this.http.get<any[]>('/appointments');
  }
  getAppointmentDetails(appointmentId: string): Observable<any> {
    return this.http.get<any>(`/api/appointments/${appointmentId}`);
  }
  markUserAsArrived(appointmentId: string): Observable<any> {
    return this.http.post(`/api/appointments/${appointmentId}/arrived`, {});
  }
}

import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';

@Injectable({ providedIn: 'root' })
export class RevenueService {

  constructor(private http: HttpClient) {}
    baseUrl = environment.apiUrl + 'Revenue';

  getCompanyRevenue(month?: number, year?: number): Observable<any[]> {
    let params = new HttpParams();
    if (month) params = params.set('month', month.toString());
    if (year) params = params.set('year', year.toString());

    return this.http.get<any[]>(`${this.baseUrl}/GetCompanyRevenue`, { params });
  }
}

import { Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LatestTransactionDto, MonthlyRevenueChartDto } from '../../_model/Chart.modal';
import { Observable } from 'rxjs';
import { DashboardInsightsDto } from '../../_model/Dashboard.modal';
import { AppointmentsDto } from '../../_model/Appointments.modal';
import { Partner, PartnerEarning } from '../../_model/Partner.modal';

@Injectable({
    providedIn: 'root'
})
export class PartnerService {
    monthlyRevenueData: MonthlyRevenueChartDto[] = [];

    constructor(private http: HttpClient) { }
    baseUrl = environment.apiUrl + 'Partners';

    // GET: Get all partners by company ID
    getPartnersByCompany(companyId: string): Observable<Partner[]> {
        return this.http.get<Partner[]>(`${this.baseUrl}`);
    }

    // GET: Get a single partner by ID
    getPartnerById(id: string): Observable<Partner> {
        return this.http.get<Partner>(`${this.baseUrl}/${id}`);
    }

    // POST: Create a new partner
    createPartner(partner: Partner): Observable<Partner> {
        return this.http.post<Partner>(`${this.baseUrl}`, partner);
    }

    // PUT: Update an existing partner
    updatePartner(id: string, partner: Partner): Observable<Partner> {
        return this.http.put<Partner>(`${this.baseUrl}/${id}`, partner);
    }

    // DELETE: Delete a partner by ID
    deletePartner(id: string): Observable<void> {
        return this.http.delete<void>(`${this.baseUrl}/${id}`);
    }


    addPartner(companyId: string, partner: Partner): Observable<any> {
        return this.http.post(`${this.baseUrl}`, partner);
    }


    getPartnerEarnings(year: number, month: number): Observable<PartnerEarning[]> {
        const url = `${this.baseUrl}/earnings?year=${year}&month=${month}`;
        return this.http.get<PartnerEarning[]>(url);
    }

}

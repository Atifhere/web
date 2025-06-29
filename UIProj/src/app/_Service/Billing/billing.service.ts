import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { BillingRecord, DynamicBillingSummaryDTO } from '../../_model/BillingRecord.modal';

@Injectable({
  providedIn: 'root',
})
export class BillingService {
  constructor(private http: HttpClient) { }
  constant = environment;
  baseUrl = this.constant.apiUrl + 'Billing';

  // Add a new billing record
  addBillingRecord(record: BillingRecord): Observable<any> {
    return this.http.post(`${this.baseUrl}/`, record);
  }

  // Fetch billing records by branch, year and month
  getBillingRecords(branchId: string, year: number, month: number): Observable<BillingRecord[]> {
    const params = new HttpParams()
      .set('year', year.toString())
      .set('month', month.toString());
    return this.http.get<BillingRecord[]>(`${this.baseUrl}`, { params });
  }

  /**
  * Fetch billing summaries filtered by IsPaid flag.
  * @param isPaid Optional boolean to filter paid/unpaid summaries.
  */
  getBillingSummaryPaged(
    isPaid?: boolean,
    company?: string,
    branchName?: string
  ): Observable<{ totalCount: number; items: DynamicBillingSummaryDTO[] }> {
    let params = new HttpParams();

    if (isPaid !== undefined) {
      params = params.set('isPaid', isPaid.toString());
    }
    if (company) {
      params = params.set('company', company);
    }
    if (branchName) {
      params = params.set('branchName', branchName);
    }

    return this.http.get<{ totalCount: number; items: DynamicBillingSummaryDTO[] }>(
      `${this.baseUrl}/BillingSummary`,
      { params }
    );
  }




}

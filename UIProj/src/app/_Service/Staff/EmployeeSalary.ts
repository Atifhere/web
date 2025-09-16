// src/app/core/services/salary.service.ts
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';

export interface EmployeeSalary {
    staffId: string;
    employeeName: string;
    paymentType: number;
    totalServiceFees: number;
    calculatedSalary: number;
}

@Injectable({ providedIn: 'root' })
export class SalaryService {
    constructor(private http: HttpClient) { }
    baseUrl = environment.apiUrl + 'Staff/';

    getSalarySummary(month: number, year: number): Observable<EmployeeSalary[]> {
        const params = new HttpParams().set('month', month).set('year', year);
        // if your controller is not under mobile route, change to '/salary-summary'
        return this.http.get<EmployeeSalary[]>(`${this.baseUrl}salary-summary`, { params });
    }
}
    
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { APIResponse, CreateExpenseDTO } from '../../_model/Expenses.modal';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ExpenseService {
  constructor(private http: HttpClient) { }
  apiUrl = environment.apiUrl + 'Expenses';

  getAllExpenses(year: number, month: number): Observable<APIResponse> {
    return this.http.get<APIResponse>(`${this.apiUrl}?year=${year}&month=${month}`);
  }

  createExpense(dto: CreateExpenseDTO): Observable<APIResponse> {
    return this.http.post<APIResponse>(this.apiUrl, dto);
  }

  deleteExpense(id: string): Observable<APIResponse> {
    return this.http.delete<APIResponse>(`${this.apiUrl}/${id}`);
  }



}

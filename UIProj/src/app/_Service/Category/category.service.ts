import { Injectable } from '@angular/core';
import { Category, CreateCategoryDTO } from '../../_model/Category.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  constructor(private http: HttpClient) { }
  constant = environment;
  baseUrl = this.constant.apiUrl + 'Category/';

  GetAll(): Observable<Category[]> {
    return this.http.get<Category[]>(this.baseUrl + this.constant.GET_ALL);
  }


  GetCategoryBycode(id: string) {
    // passing the token through http interceptor.
    return this.http.get<Category>(this.baseUrl + this.constant.GET_BY_CODE + id);
  }

  CreateSubCategory(data: CreateCategoryDTO): Observable<Category> {
    return this.http.post<Category>(this.baseUrl + 'SubCategory/Create' + this.constant.CREATE, data);
  }


  UpdateCategory(data: Category): Observable<Category> {
    return this.http.put<Category>(this.baseUrl + this.constant.UPDATE + data.id, data);
  }

  DeleteCategory(id: string): Observable<void> {
    return this.http.delete<void>(this.baseUrl + this.constant.REMOVE + id);
  }
}

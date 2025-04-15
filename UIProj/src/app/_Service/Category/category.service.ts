import { Injectable } from '@angular/core';
import { Category } from '../../_model/Category.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  constructor(private http: HttpClient) {}
  constant = environment;
  baseUrl = this.constant.apiUrl + 'Category/';
  GetAll() {
    // passing the token through http interceptor.
    return this.http.get<Category[]>(this.baseUrl + this.constant.GET_ALL);
  }

  GetCategoryBycode(id: string) {
    // passing the token through http interceptor.
    return this.http.get<Category>(this.baseUrl + this.constant.GET_BY_CODE + id);
  }

  CreateCategory(data: Category) {
    return this.http.post(this.baseUrl + this.constant.CREATE, data);
  }

  UpdateCategory(data: Category) {
    return this.http.put(this.baseUrl + this.constant.UPDATE + data.id, data);
  }

  DeleteCategory(id: string) {
    return this.http.delete(this.baseUrl + this.constant.REMOVE + id);
  }
}

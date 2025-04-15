import { Injectable } from '@angular/core';
import { SubCategory } from '../../_model/Category.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class SubCategoryService {
  constructor(private http: HttpClient) {}
  baseUrl = environment.apiUrl + 'Category/SubCategory/';
  constant = environment;
  GetAll() {
    // passing the token through http interceptor.
    return this.http.get<SubCategory[]>(this.baseUrl + this.constant.GET_ALL);
  }

  GetSubCategoryBycode(id: string) {
    // passing the token through http interceptor.
    return this.http.get<SubCategory>(this.baseUrl + this.constant.GET_BY_CODE + id);
  }

  CreateSubCategory(data: SubCategory) {
    return this.http.post(this.baseUrl + this.constant.CREATE, data);
  }

  UpdateSubCategory(data: SubCategory) {
    return this.http.put(this.baseUrl + this.constant.UPDATE + data.id, data);
  }

  DeleteCategory(id: string) {
    return this.http.delete(this.baseUrl + this.constant.REMOVE + id);
  }
}

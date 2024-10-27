import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Department } from '../models/department.model';
import { AppConstants } from '../app-constants';


@Injectable({
  providedIn: 'root'
})
export class DepartmentService {
  private apiUrl = AppConstants.BASE_URL_API + "/departments"

  constructor(private http: HttpClient) {}

  getDepartments(): Observable<{ code: number; departments: Department[] }> {
    return this.http.get<{ code: number; departments: Department[] }>(this.apiUrl);
  }

}
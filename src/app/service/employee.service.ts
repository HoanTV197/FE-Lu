import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Employee } from '../models/employee.model';
import { AppConstants } from '../app-constants';
import { EmployeePayload } from '../models/EmployeePayload.model';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private apiUrl = AppConstants.BASE_URL_API + "/employees"

  constructor(private http: HttpClient) {}

  getEmployees(limit: number, offset: number, employeeName: string, departmentId: string, sortEmployeeName: string, sortCertificationName: string, sortEndDate: string): Observable<any> {
    let apiUrl = `${this.apiUrl}?limit=${limit}&offset=${offset}`;
  
    if (employeeName) {
      apiUrl += `&employeeName=${employeeName}`;
    }
    if (departmentId) {
      apiUrl += `&departmentId=${departmentId}`;
    }
  
    apiUrl += `&ord_employee_name=${sortEmployeeName}&ord_certification_name=${sortCertificationName}&ord_end_date=${sortEndDate}`;
    console.log("API URL:", apiUrl);
    return this.http.get<any>(apiUrl);
  }

  // Hàm gọi API để thêm nhân viên mới 
  addEmployee(employee: EmployeePayload): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/add`, employee);
  }


  editEmployee(employeeId: string, employee: EmployeePayload): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/edit`, { ...employee, employeeId });
  }
  

  
  //Hàm gọi API để lấy thông tin chi tiết nhân viên 
  getEmployeeDetail(employeeId: string): Observable<any>{
    return this.http.get(`${this.apiUrl}/${employeeId}`);
  }

  //Hàm gọi API để xóa nhân viên
  deleteEmployee(employeeId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${employeeId}`);
  }
  
}

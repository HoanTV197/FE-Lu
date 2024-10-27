import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

// Service để lưu trữ dữ liệu ID tạm thời.
export class DataTransferService {
  private employeeId: string | null = null;
  private messageCode: string | null = null;

  setEmployeeId(id: string): void {
    this.employeeId = id;
  }

  getEmployeeId(): string | null {
    return this.employeeId;
  }

  clearEmployeeId(): void {
    this.employeeId = null;
  }

  // Lưu và lấy messageCode
  setMessageCode(code: string): void {
    this.messageCode = code;
  }

  getMessageCode(): string | null {
    return this.messageCode;
  }

  clearMessageCode(): void {
    this.messageCode = null;
  }
}

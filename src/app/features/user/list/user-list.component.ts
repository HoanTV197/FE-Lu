import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EmployeeService } from '../../../service/employee.service';
import { DepartmentService } from '../../../service/department.service';
import { Employee } from '../../../models/employee.model';
import { Department } from '../../../models/department.model';
import { DataTransferService } from '../../../service/DataTransfer.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {
  employees: Employee[] = [];
  departments: Department[] = [];
  employeeName: string = '';
  departmentId: string = '';
  currentPage: number = 1;  // Trang hiện tại
  totalPages: number = 1;
  limit: number = 5;
  totalRecords: number = 0;
  errorMessage: string = '';

  sortEmployeeName: string = 'asc';
  sortCertificationName: string = 'asc';
  sortEndDate: string = 'asc';

  constructor(
    private employeeService: EmployeeService,
    private departmentService: DepartmentService,
    private dataTransferService: DataTransferService, // Inject Service
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getDepartments();
    this.getEmployees();  // Load dữ liệu lần đầu tiên
  }

  // Lấy danh sách phòng ban
  getDepartments(): void {
    this.departmentService.getDepartments().subscribe({
      next: (response) => {
        if (response && response.departments) {
          this.departments = response.departments;
        }
      },
      error: (error) => {
        this.errorMessage = '部門を取得できません';
        console.error('Error fetching departments:', error);
      }
    });
  }

  // Lấy danh sách nhân viên (employees)
  getEmployees(): void {
    const offset = (this.currentPage - 1) * this.limit;  // Tính toán offset dựa trên trang hiện tại
    console.log('Fetching employees for page:', this.currentPage);
    console.log('Offset:', offset, 'Limit:', this.limit);  // Hiển thị offset và limit
    

    
    this.employeeService.getEmployees(
      this.limit, offset, this.employeeName, this.departmentId, 
      this.sortEmployeeName, this.sortCertificationName, this.sortEndDate
    ).subscribe({
      next: (response) => {
        if (response && response.employees) {
          console.log('Employees data:', response.employees);  // Kiểm tra dữ liệu nhận được từ API
          this.employees = response.employees;
          this.totalRecords = response.totalRecords;
          this.totalPages = Math.ceil(this.totalRecords / this.limit);  // Tính toán số trang
          console.log('Total pages:', this.totalPages);  // Hiển thị tổng số trang
        } else {
          this.employees = [];
          this.totalPages = 1;
          this.currentPage = 1;
          console.log('No employees found.');
        }
      },
      error: (error) => {
        console.error('Error fetching employees:', error);
      }
    });
  }
  

  // Khi người dùng nhấn nút tìm kiếm
  onSearch(): void {
    if (this.employeeName.length > 125) {
      alert('氏名は125文字以内で入力してください。');
      return;
    }
    this.currentPage = 1;  // Reset về trang 1
    this.getEmployees();   // Gọi lại API
  }

  // Khi nhấn nút tạo mới
  onCreateNew(): void {
     // Xóa toàn bộ dữ liệu trong sessionStorage
  sessionStorage.removeItem('employeeId'); 

    //xóa session
    this.router.navigate(['/user/add']);
    sessionStorage.removeItem('formData');
  }

  // Phương thức để lưu ID vào service và điều hướng đến màn hình ADM003
viewEmployeeDetail(employeeId: string): void {
  this.dataTransferService.setEmployeeId(employeeId);
  this.router.navigate(['/user/detail']);
}

  // Khi nhấn vào cột để sắp xếp (sort)
  onSort(column: string): void {
    // Reset trang hiện tại về 1 khi sort
    this.currentPage = 1;
  
    // Kiểm tra cột nào được click và đảo ngược trạng thái sort của cột đó
    if (column === 'employeeName') {
      this.sortEmployeeName = this.sortEmployeeName === 'asc' ? 'desc' : 'asc';
    } else if (column === 'certificationName') {
      this.sortCertificationName = this.sortCertificationName === 'asc' ? 'desc' : 'asc';
    } else if (column === 'endDate') {
      this.sortEndDate = this.sortEndDate === 'asc' ? 'desc' : 'asc';
    }
  
    // Gọi lại API để lấy danh sách employees theo trạng thái sort mới
    this.getEmployees();
  }
  

  // Chuyển đến trang trước đó
  goToPreviousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;  // Giảm số trang hiện tại
      this.getEmployees();  // Gọi API để lấy dữ liệu trang mới
    }
  }

  // Chuyển đến trang tiếp theo
  goToNextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;  // Tăng số trang hiện tại
      this.getEmployees();  // Gọi API để lấy dữ liệu trang mới
    }
  }

  goToPage(page: number): void {
    console.log('Attempting to navigate to page:', page);  // Kiểm tra xem bạn đang nhấn trang nào
    if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
      this.currentPage = page;
      console.log('Navigating to page:', this.currentPage);  // Xác nhận trang hiện tại sau khi cập nhật
      this.getEmployees();  // Gọi lại API với offset dựa trên currentPage
    }
  }
  

  // Hàm để tính tổng số trang hiển thị
  get totalPagesArray(): number[] {
    const range: number[] = [];
    const total = this.totalPages;

    if (total <= 5) {
      // Hiển thị tất cả các trang nếu tổng số trang <= 5
      for (let i = 1; i <= total; i++) {
        range.push(i);
      }
    } else {
      // Hiển thị trang đầu tiên, trang hiện tại, và các trang gần trang hiện tại, cùng với dấu "..."
      range.push(1);
      if (this.currentPage > 3) {
        range.push(-1);  // Đại diện cho "..."
      }
      
      const start = Math.max(2, this.currentPage - 1);
      const end = Math.min(total - 1, this.currentPage + 1);
      
      for (let i = start; i <= end; i++) {
        range.push(i);
      }
      
      if (this.currentPage < total - 2) {
        range.push(-1);  // Đại diện cho "..."
      }
      range.push(total);
    }
    return range;
  }
}

import { Component, OnInit } from '@angular/core';
import { DepartmentService } from '../../../service/department.service';
import { CertificationService } from '../../../service/certification.service';
import { Router } from '@angular/router';
import { EmployeeService } from 'src/app/service/employee.service';
import { EmployeePayload } from 'src/app/models/EmployeePayload.model';
import { DataTransferService } from '../../../service/DataTransfer.service';
import { ERROR_MESSAGES } from '../../../../app/constants/contants';

@Component({
  selector: 'app-adm005',
  templateUrl: './adm005.component.html',
  styleUrls: ['./adm005.component.css']
})
export class Adm005Component implements OnInit {
  formData: any;
  departmentName: string = '';
  certificationName: string = '';
  errorMessage: string = ''; // Biến để lưu thông báo lỗi
  employeeId: string | null = null; // ID nhân viên từ sessionStorage để xác định chế độ edit

  constructor(
    private departmentService: DepartmentService,
    private certificationService: CertificationService,
    private employeeService: EmployeeService,
    private dataTransferService: DataTransferService,
    private router: Router
  ) { }

  ngOnInit(): void {
    // Lấy dữ liệu từ sessionStorage
    const storedData = sessionStorage.getItem('formData');
    this.employeeId = sessionStorage.getItem('employeeId'); // Lấy employeeId từ sessionStorage

    if (storedData) {
      this.formData = JSON.parse(storedData);

      // Gọi API lấy danh sách phòng ban và chứng chỉ
      this.getDepartmentName();
      this.getCertificationName();
    } else {
      console.warn('Không tìm thấy dữ liệu trong sessionStorage.');
    }
  }

  // Xử lý thêm hoặc chỉnh sửa nhân viên và điều hướng đến trang thành công
  onSubmit(): void {
    // Kiểm tra nếu nhân viên không có chứng chỉ, thì gửi lên dữ liệu rỗng cho các trường liên quan đến chứng chỉ
    if (!this.formData.certifications.certificationId) {
      this.formData.certifications = {
        certificationId: '',
        certificationDate: '',
        expirationDate: '',
        score: ''
      };
    }
  
    // Tạo payload chứa dữ liệu nhân viên
    const payload: EmployeePayload = {
      employeeLoginId: this.formData.employeeLoginId,
      // Chỉ thêm employeeLoginPassword nếu người dùng nhập
      ...(this.formData.employeeLoginPassword && { employeeLoginPassword: this.formData.employeeLoginPassword }),
      employeeName: this.formData.employeeName,
      employeeNameKana: this.formData.employeeNameKaTa,
      employeeBirthDate: this.formData.employeeBirthDate.split('T')[0],
      employeeEmail: this.formData.employeeEmail,
      employeeTelephone: this.formData.employeeTelephone,
      departmentId: this.formData.departmentId ? this.formData.departmentId.toString() : '',
      certifications: [
        {
          certificationId: this.formData.certifications.certificationId ? this.formData.certifications.certificationId.toString() : '',
          certificationDate: this.formData.certifications.certificationDate,
          expirationDate: this.formData.certifications.expirationDate,
          score: this.formData.certifications.score
        }
      ]
    };
  
    // In ra console để kiểm tra payload gửi lên API
    console.log('Payload gửi lên API:', payload);
  
    // Kiểm tra nếu đang ở chế độ edit (tồn tại employeeId)
    if (this.employeeId) {
      this.employeeService.editEmployee(this.employeeId, payload).subscribe({
        next: (response) => {
          if (response.code === 200 && response.message && response.message.code) {
            this.dataTransferService.setMessageCode(response.message.code);
            this.router.navigate(['/user/message-success']);
          }
        },
        error: (error) => {
          this.handleError(error);
        }
      });
    } else {
      // Trường hợp thêm mới nhân viên
      this.employeeService.addEmployee(payload).subscribe({
        next: (response) => {
          if (response.code === 200 && response.message && response.message.code) {
            this.dataTransferService.setMessageCode(response.message.code);
            this.router.navigate(['/user/message-success']);
          }
        },
        error: (error) => {
          this.handleError(error);
        }
      });
    }
  }
  
  // Hàm xử lý lỗi
  private handleError(error: any): void {
    if (error.status === 500 && error.error && error.error.message && error.error.message.code) {
      if (error.error.message.code === 'ER003') {
        this.errorMessage = ERROR_MESSAGES.ACCOUNT_EXISTS;// Hiển thị lỗi account đã tồn tại
      } else {
        this.errorMessage = ERROR_MESSAGES.GENERAL_ERROR;
      }
    } else {
      this.errorMessage = ERROR_MESSAGES.UNKNOWN_ERROR;
    }
    console.error('Lỗi:', error);
  }
  

  // Gọi API để chỉnh sửa nhân viên
  updateEmployee(payload: EmployeePayload): void {
    // Gọi API editEmployee với employeeId và payload
    this.employeeService.editEmployee(this.employeeId!, payload).subscribe({
      next: (response) => {
        if (response.code === 200 && response.message && response.message.code) {
          // Lưu messageCode vào DataTransferService
          this.dataTransferService.setMessageCode(response.message.code);
          // Điều hướng đến ADM006
          this.router.navigate(['/user/message-success']);
        }
      },
      error: (error) => {
        if (error.status === 500 && error.error && error.error.message && error.error.message.code) {
          // Hiển thị thông báo lỗi từ API
          if (error.error.message.code === 'ER003') {
            this.errorMessage = ERROR_MESSAGES.ACCOUNT_EXISTS; 
          } else {
            this.errorMessage = ERROR_MESSAGES.GENERAL_ERROR;
          }
        } else {
          // Lỗi không xác định
          this.errorMessage = ERROR_MESSAGES.UNKNOWN_ERROR;
        }
        console.error('Lỗi khi cập nhật nhân viên:', error);
      }
    });
  }

  // Gọi API để thêm nhân viên mới
  addEmployee(payload: EmployeePayload): void {
    this.employeeService.addEmployee(payload).subscribe({
      next: (response) => {
        if (response.code === 200 && response.message && response.message.code) {
          // Lưu messageCode vào DataTransferService
          this.dataTransferService.setMessageCode(response.message.code);
          // Điều hướng đến ADM006
          this.router.navigate(['/user/message-success']);
        }
      },
      error: (error) => {
        if (error.status === 500 && error.error && error.error.message && error.error.message.code) {
          // Hiển thị thông báo lỗi từ API
          if (error.error.message.code === 'ER003') {
            this.errorMessage = ERROR_MESSAGES.ACCOUNT_EXISTS;
          } else {
            this.errorMessage = ERROR_MESSAGES.GENERAL_ERROR;
          }
        } else {
          // Lỗi không xác định
          this.errorMessage = ERROR_MESSAGES.UNKNOWN_ERROR;
        }
        console.error('Lỗi khi thêm nhân viên:', error);
      }
    });
  }

  // Hàm gọi API để lấy tên phòng ban
  getDepartmentName(): void {
    if (this.formData.departmentId) {
      this.departmentService.getDepartments().subscribe({
        next: (response) => {
          const department = response.departments.find((dept: any) => dept.departmentId === Number(this.formData.departmentId));
          this.departmentName = department ? department.departmentName : 'Không tìm thấy phòng ban';
        },
        error: (error) => {
          console.error('Error fetching department name', error);
        }
      });
    }
  }

  // Gọi API để lấy tên chứng chỉ từ certificationId
  getCertificationName(): void {
    if (this.formData.certifications.certificationId) {
      this.certificationService.getCertifications().subscribe({
        next: (response) => {
          const certification = response.certifications.find((cert: any) => cert.certificationId === Number(this.formData.certifications.certificationId));
          this.certificationName = certification ? certification.certificationName : 'Không tìm thấy chứng chỉ';
        },
        error: (error) => {
          console.error('Error fetching certification name', error);
        }
      });
    }
  }

  // Hàm quay lại trang trước
  onBack(): void {
    window.history.back();
  }
}

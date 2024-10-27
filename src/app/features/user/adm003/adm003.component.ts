import { Component, OnInit } from '@angular/core';
import { EmployeeService } from '../../../service/employee.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DataTransferService } from '../../../service/DataTransfer.service';
import { ERROR_MESSAGES } from '../../../../app/constants/contants';

@Component({
  selector: 'app-adm003',
  templateUrl: './adm003.component.html',
  styleUrls: ['./adm003.component.css']
})
export class Adm003Component implements OnInit {
  employeeId: string | null = null;
  employeeData: any = {};
  errorMessage: string = '';

  constructor(
    private employeeService: EmployeeService,
    private route: ActivatedRoute,
    private dataTransferService: DataTransferService,
    private router: Router
  ) {}

  /**
   * 
   */
  ngOnInit(): void {
    // Lấy employeeId từ service
    this.employeeId = this.dataTransferService.getEmployeeId();

    if (this.employeeId) {
      // Lưu ID vào sessionStorage để phòng trường hợp reload lại trang
      sessionStorage.setItem('employeeId', this.employeeId);
      // Gọi API để lấy chi tiết nhân viên
      this.getEmployeeDetail(this.employeeId);
    } else {
      // Nếu không có ID từ service, thử lấy từ sessionStorage
      this.employeeId = sessionStorage.getItem('employeeId');
      if (this.employeeId) {
        console.log("Retrieved employeeId from sessionStorage:", this.employeeId);
        // Gọi API để lấy chi tiết nhân viên
        this.getEmployeeDetail(this.employeeId);
      } else {
        // Không có ID, chuyển về trang system error hoặc thông báo lỗi
        this.errorMessage = 'Không tìm thấy ID nhân viên.';
        this.router.navigate(['**']);
        console.error('Không tìm thấy ID nhân viên.');
      }
    }
  }

    /**
     * Hàm gọi API để lấy chi tiết nhân viên
     * @param employeeId  
     */
  getEmployeeDetail(employeeId: string): void {
    this.employeeService.getEmployeeDetail(employeeId).subscribe({
      next: (response) => {
        // Xử lý thành công
        if (response.code === '200 OK') {
          this.employeeData = response;
        }
      },
      error: (error) => {
        // Xử lý lỗi nếu nhân viên không tồn tại
        if (error.status === 500 && error.error && error.error.message && error.error.message.code === '該当するユーザは存在していません。') {
          this.errorMessage = ERROR_MESSAGES.GENERAL_ERROR;
        } else {
          this.errorMessage = ERROR_MESSAGES.UNKNOWN_ERROR;
        }
      }
    });
  }

  /**
   * Xác nhận xóa nhân viên 
   */
  confirmDelete(): void {
    const isConfirmed = confirm(ERROR_MESSAGES.CONFIRM_DELETE);
    if (isConfirmed && this.employeeId) {
      this.employeeService.deleteEmployee(this.employeeId).subscribe({
        next: (response) => {
          if (response.code === 200 && response.message && response.message.code) {
            // Lưu messageCode vào DataTransferService
            this.dataTransferService.setMessageCode(response.message.code);
            // Điều hướng đến ADM006
            this.router.navigate(['/user/message-success']);
          }
        },
        error: (error) => {
          // Nếu xảy ra lỗi, điều hướng đến trang system error
          console.error('Error during delete:', error);
          this.router.navigate(['**']);
        }
      });
    }
  }

  // Hàm điều hướng tới màn hình edit adm004
  goToEditPage(): void {
    if (this.employeeId) {
      // Lưu ID vào DataTransferService để truyền sang màn hình adm004
      this.dataTransferService.setEmployeeId(this.employeeId);
      // Điều hướng tới màn hình adm004
      this.router.navigate(['/user/add']);
    }
  }
  
  /**
   * Hàm quay lại adm002 - list user
   */
  goBack(): void {
    this.router.navigate(['/user/list']);
  }

}

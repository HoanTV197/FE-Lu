import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DepartmentService } from '../../../service/department.service';
import { CertificationService } from '../../../service/certification.service';
import { EmployeeService } from '../../../service/employee.service';
import { Department } from '../../../models/department.model';
import { Certification } from '../../../models/certification.model';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import * as moment from 'moment'; // Sử dụng moment.js để so sánh ngày
import { NgForm } from '@angular/forms';
import * as $ from 'jquery';
import 'jquery-ui-dist/jquery-ui';
@Component({
  selector: 'app-adm004',
  templateUrl: './adm004.component.html',
  styleUrls: ['./adm004.component.css']
})
export class Adm004Component implements OnInit {
  // Dữ liệu form, chứa thông tin của nhân viên và chứng chỉ
  formData = {
    employeeLoginId: '',
    departmentId: '',
    employeeName: '',
    employeeNameKaTa: '',
    employeeBirthDate: '',
    employeeEmail: '',
    employeeTelephone: '',
    employeeLoginPassword: '',
    confirmPassword: '',
    certifications: {
      certificationId: '',
      certificationDate: '',
      expirationDate: '',
      score: ''
    }
  };

  isDisabled: boolean = true;
  isExpirationDateValid: boolean = true; // Cờ để kiểm tra ngày hết hạn lớn hơn ngày hiệu lực
  isEditMode: boolean = false; // Cờ để kiểm tra có phải chế độ edit không
  passwordsMatch: boolean = true;   //check password nhập lại

  departments: Department[] = [];
  certifications: Certification[] = [];
  // Thêm cấu hình datepicker
  bsConfig: Partial<BsDatepickerConfig>;




  constructor(
    private departmentService: DepartmentService,
    private certificationService: CertificationService,
    private employeeService: EmployeeService,
    private router: Router
  ) {
    // Cấu hình định dạng ngày theo yêu cầu
    this.bsConfig = {
      dateInputFormat: 'YYYY/MM/DD',
      containerClass: 'theme-default',
    };
  }

  ngOnInit(): void {
    this.getDepartments();
    this.getCertifications();




    // Kiểm tra xem có employeeId trong sessionStorage không
    const employeeId = sessionStorage.getItem('employeeId');
    if (employeeId) {
      this.isEditMode = true; // Đang ở chế độ chỉnh sửa
      this.loadEmployeeDetail(employeeId); // Gọi API lấy thông tin nhân viên
    } else {
      this.isEditMode = false; // Đang ở chế độ thêm mới
    }

    // Kiểm tra xem có dữ liệu nào đã lưu trong sessionStorage hay không
    const storedData = sessionStorage.getItem('formData');
    if (storedData) {
      // Nếu có dữ liệu, load vào form
      this.formData = JSON.parse(storedData);
    }
  }

  checkPasswordsMatch(): void {
    this.passwordsMatch = this.formData.employeeLoginPassword === this.formData.confirmPassword;
  }

  // Hàm lấy thông tin chi tiết nhân viên từ API
  loadEmployeeDetail(employeeId: string): void {
    this.employeeService.getEmployeeDetail(employeeId).subscribe({
      next: (response) => {
        if (response.code === '200 OK') {
          this.formData = {
            employeeLoginId: response.employeeLoginId,
            departmentId: response.departmentId,
            employeeName: response.employeeName,
            employeeNameKaTa: response.employeeNameKana,
            employeeBirthDate: response.employeeBirthDate,
            employeeEmail: response.employeeEmail,
            employeeTelephone: response.employeeTelephone,
            employeeLoginPassword: '',  // Mật khẩu để trống
            confirmPassword: '',         // Mật khẩu xác nhận để trống
            certifications: {
              certificationId: response.certifications[0]?.certificationId || '',
              certificationDate: response.certifications[0]?.certificationDate || '',
              expirationDate: response.certifications[0]?.expirationDate || '',
              score: response.certifications[0]?.score || ''
            }
          };
          console.log('Dữ liệu nhân viên đã được load:', response);
        } else {
          console.error('Dữ liệu nhân viên không tồn tại hoặc có lỗi.');
          this.router.navigate(['**']);
        }
      },
      error: (error) => {
        console.error('Lỗi khi gọi API lấy thông tin nhân viên:', error);
        this.router.navigate(['**']);

      }
    });
  }

  // Hàm lấy danh sách phòng ban từ server
  getDepartments(): void {
    this.departmentService.getDepartments().subscribe({
      next: (response) => {
        this.departments = response.departments;  // Gán danh sách phòng ban vào biến departments
      },
      error: (error) => {
        console.error('Error fetching departments', error);  // In lỗi ra console
      }
    });
  }

  // Hàm lấy danh sách chứng chỉ từ server
  getCertifications(): void {
    this.certificationService.getCertifications().subscribe({
      next: (response) => {
        this.certifications = response.certifications;  // Gán danh sách chứng chỉ vào biến certifications
      },
      error: (error) => {
        console.error('Error fetching certifications', error);  // In lỗi ra console
      }
    });
  }

  // Cập nhật trạng thái của cờ isDisabled và xóa dữ liệu khi không có chứng chỉ được chọn
  onJapaneseLevelChange(): void {
    // Nếu không chọn chứng chỉ, thì các input bị khóa; ngược lại, mở khóa các input
    if (!this.formData.certifications.certificationId) {
      this.isDisabled = true;

      // Xóa dữ liệu cho các trường input
      this.formData.certifications.certificationDate = '';
      this.formData.certifications.expirationDate = '';
      this.formData.certifications.score = '';
    } else {
      this.isDisabled = false;
    }
  }


  // Khi nhấn nút xác nhận
  onSubmit(form: NgForm): void {
    // Kiểm tra tính hợp lệ của form và đánh dấu là đã submit
    if (!form.valid) {
      form.form.markAllAsTouched();  // Đánh dấu tất cả các trường đã được "chạm" để hiện thông báo lỗi
      console.log('Form is invalid, please complete all required fields.');
      return;  // Không cho phép submit nếu form không hợp lệ
    }

    // Kiểm tra mật khẩu xác nhận (chỉ khi không ở chế độ edit hoặc nếu có điền mật khẩu)
    if (!this.isEditMode || (this.formData.employeeLoginPassword && this.formData.confirmPassword)) {
      this.passwordsMatch = this.formData.employeeLoginPassword === this.formData.confirmPassword;
      if (!this.passwordsMatch) {
        console.log('Passwords do not match.');
        return;
      }
    }



    // Kiểm tra ngày hết hạn có hợp lệ không
    this.validateExpirationDate();
    if (!this.isExpirationDateValid) {
      console.log('Expiration date is invalid.');
      return;
    }

    // Lưu dữ liệu form vào sessionStorage
    sessionStorage.setItem('formData', JSON.stringify(this.formData));

    // Điều hướng đến màn hình ADM005
    this.router.navigate(['/user/confirm']);
  }

  // Khi nhấn nút quay lại
  onBack(): void {
    // Điều hướng về danh sách nhân viên
    this.router.navigate(['/user/list']);
  }

  // Kiểm tra xem ngày hết hạn có lớn hơn ngày hiệu lực không
  validateExpirationDate(): void {
    const certificationDate = this.formData.certifications.certificationDate;
    const expirationDate = this.formData.certifications.expirationDate;

    if (certificationDate && expirationDate) {
      const certDateMoment = moment(certificationDate, 'YYYY-MM-DD');
      const expDateMoment = moment(expirationDate, 'YYYY-MM-DD');
      this.isExpirationDateValid = expDateMoment.isAfter(certDateMoment);
    } else {
      this.isExpirationDateValid = true; // Trường hợp nếu chưa nhập đủ ngày thì không báo lỗi
    }
  }
}

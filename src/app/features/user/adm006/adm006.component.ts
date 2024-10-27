import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataTransferService } from '../../../service/DataTransfer.service';

@Component({
  selector: 'app-adm006',
  templateUrl: './adm006.component.html',
  styleUrls: ['./adm006.component.css']
})
export class Adm006Component implements OnInit {
  message: string = '';

  constructor(
    private router: Router,
    private dataTransferService: DataTransferService
  ) {}

  ngOnInit(): void {
    // Lấy messageCode từ DataTransferService
    const messageCode = this.dataTransferService.getMessageCode();
    if (messageCode) {
      this.setMessage(messageCode);
      // Xóa messageCode để tránh lỗi khi reload
      this.dataTransferService.clearMessageCode();
    } else {
      this.message = '操作が完了しました。';
    }
  }

  setMessage(messageCode: string): void {
    switch (messageCode) {
      case 'MSG001':
        this.message = 'ユーザの登録が完了しました。'; // Thêm mới thành công
        break;
      case 'MSG002':
        this.message = 'ユーザの更新が完了しました。'; // Cập nhật thành công
        break;
      case 'MSG003':
        this.message = 'ユーザの削除が完了しました。'; // Xóa thành công
        break;
      default:
        this.message = '操作が完了しました。'; // Thông báo mặc định
    }
  }

  onOK(): void {
    this.router.navigate(['/user/list']); // Điều hướng về màn hình ADM002
  }
}

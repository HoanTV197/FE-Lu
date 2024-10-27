import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
})
export class HeaderComponent {
  constructor(private router: Router) { }

  logout() {
    // Xóa tất cả các session và localStorage
    sessionStorage.clear();
    localStorage.clear();
    // Nếu bạn chỉ muốn xóa một mục cụ thể (ví dụ: token)
    sessionStorage.removeItem('access_token');

    // Điều hướng về trang đăng nhập
    this.router.navigate(['/login']);
    
    return false;  // Ngăn chặn hành vi mặc định của thẻ <a>
  }
}

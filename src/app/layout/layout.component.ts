import { Component, OnInit } from '@angular/core';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzPopoverModule } from 'ng-zorro-antd/popover';
import { NzDrawerModule, NzDrawerService } from 'ng-zorro-antd/drawer'; 
import { DashboardComponent } from "../dashboard/dashboard.component";
import { NzMessageService } from 'ng-zorro-antd/message';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ProfileComponent } from '../profile/profile.component';
import { NzModalService } from 'ng-zorro-antd/modal'; 

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    NzBreadCrumbModule, CommonModule, NzIconModule, NzBadgeModule,
    NzPopoverModule, NzLayoutModule, NzAvatarModule, NzMenuModule, DashboardComponent, NzDrawerModule
  ],
  providers: [NzModalService, NzMessageService, NzDrawerService],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class LayoutComponent implements OnInit {
  userAvatar = 'https://avataaars.io/?avatarStyle=Circle&topType=ShortHairShortWaved&accessoriesType=Blank&hairColor=BrownDark&facialHairType=Blank&clotheType=BlazerShirt&eyeType=Default&eyebrowType=Default&mouthType=Default&skinColor=Light';
  userName = 'Nguyễn Văn A';
  notificationCount = 5;
  adminProfile: any;

  cities = ['Hà Nội', 'Hồ Chí Minh', 'Đà Nẵng', 'Hải Phòng', 'Cần Thơ'];
  roles = ['Administrator', 'Editor', 'User'];

  constructor(
    private router: Router,
    private message: NzMessageService,
    private drawerService: NzDrawerService,
    private modal: NzModalService
  ) {}

  ngOnInit(): void {
    const savedProfile = localStorage.getItem('AdminProfile');
    if (savedProfile) {
      this.adminProfile = JSON.parse(savedProfile);
    } else {
      this.adminProfile = {
        username: 'admin123',
        fullName: 'Nguyễn Văn A',
        email: 'admin@example.com',
        phone: '0987654321',
        city: 'Hà Nội',
        country: 'Việt Nam',
        role: 'Administrator',
        lastLogin: new Date().toLocaleString('vi-VN')
      };
      localStorage.setItem('AdminProfile', JSON.stringify(this.adminProfile));
    }
  }

  logout(): void {
    this.modal.confirm({
      nzTitle: 'Xác nhận đăng xuất',
      nzContent: 'Bạn có chắc chắn muốn đăng xuất không?',
      nzOkText: 'Đăng xuất',
      nzOkDanger: true,
      nzCancelText: 'Hủy',
      nzOnOk: () => {
        localStorage.removeItem('Login');
        this.message.success('Đăng xuất thành công!');
        this.router.navigateByUrl('/login');
      }
    });
  }

  openDrawer(): void {
    console.log('Mở drawer, dữ liệu admin:', this.adminProfile);
    this.drawerService.create({
      nzTitle: 'Thông tin quản trị viên',
      nzContent: ProfileComponent,
      nzWidth: '400px',
      nzData: { user: this.adminProfile },
      nzClosable: true
    });
  }

  validatePhone(phone: string): boolean {
    const phoneRegex = /^0\d{9}$/;
    return phoneRegex.test(phone);
  }

  updateProfile(): void {
    if (!this.validatePhone(this.adminProfile.phone)) {
      this.message.error('Số điện thoại không hợp lệ! Phải có 10 số và bắt đầu bằng 0.');
      return;
    }
    this.adminProfile.lastLogin = new Date().toLocaleString('vi-VN');
    localStorage.setItem('AdminProfile', JSON.stringify(this.adminProfile));
    this.message.success('Cập nhật thông tin thành công!');
  }
}
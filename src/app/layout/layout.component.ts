import { Component } from '@angular/core';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzPopoverModule } from 'ng-zorro-antd/popover';
import { NzDrawerModule, NzDrawerService } from 'ng-zorro-antd/drawer'; // Import Drawer
import { DashboardComponent } from "../dashboard/dashboard.component";
import { NzMessageService } from 'ng-zorro-antd/message';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ProfileComponent } from '../profile/profile.component';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    NzBreadCrumbModule, CommonModule, NzIconModule, NzBadgeModule,
    NzPopoverModule, NzLayoutModule, NzAvatarModule, NzMenuModule, DashboardComponent, NzDrawerModule
  ],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class LayoutComponent {
  userAvatar = 'https://i.pravatar.cc/150?img=3'; 
  userName = 'Nguyễn Văn A'; 
  notificationCount = 5; 

  // Fake dữ liệu admin
  adminProfile = {
    username: "admin123",
    fullName: "Nguyễn Văn A",
    email: "admin@example.com",
    phone: "0987654321",
    city: "Hà Nội",
    country: "Việt Nam",
    role: "Administrator",
    lastLogin: "2025-02-18 14:30"
  };

  constructor(
    private router: Router, 
    private message: NzMessageService,
    private drawerService: NzDrawerService // Inject NzDrawerService
  ) {}

  logout(): void {
    localStorage.removeItem("Login");
    this.message.success('Đăng xuất thành công!');
    this.router.navigateByUrl('/login');
  }

  openDrawer(): void {
    console.log("Mở drawer, dữ liệu admin:", this.adminProfile); // Debug
    this.drawerService.create({
      nzTitle: 'Thông tin quản trị viên',
      nzContent: ProfileComponent,
      nzWidth: '400px',
      nzData: { user: this.adminProfile }, // Truyền dữ liệu adminProfile vào drawer
      nzClosable: true
    });
  }
}
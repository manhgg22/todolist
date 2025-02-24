import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzDrawerRef, NZ_DRAWER_DATA } from 'ng-zorro-antd/drawer';
import { FormsModule } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule, NzAvatarModule, FormsModule, NzButtonModule, 
    NzInputModule, NzSelectModule
  ],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {
  userAvatar = 'https://avataaars.io/?avatarStyle=Circle&topType=ShortHairShortWaved&accessoriesType=Blank&hairColor=BrownDark&facialHairType=Blank&clotheType=BlazerShirt&eyeType=Default&eyebrowType=Default&mouthType=Default&skinColor=Light'; 
  user: any;
  isEditing: boolean = false;

  cities = ['Hà Nội', 'Hồ Chí Minh', 'Đà Nẵng', 'Hải Phòng', 'Cần Thơ'];
  roles = ['Administrator', 'Editor', 'User'];

  constructor(
    private drawerRef: NzDrawerRef,
    @Inject(NZ_DRAWER_DATA) public data: { user: any },
    private message: NzMessageService
  ) {
    this.user = { ...data.user }; 
  }

  closeDrawer(): void {
    this.drawerRef.close();
  }

  validatePhone(phone: string): boolean {
    const phoneRegex = /^0\d{9}$/;
    return phoneRegex.test(phone);
  }

  saveChanges(): void {
    if (!this.validatePhone(this.user.phone)) {
      this.message.error('Số điện thoại không hợp lệ! Phải có 10 số và bắt đầu bằng 0.');
      return;
    }

    this.user.lastLogin = new Date().toLocaleString('vi-VN');
    localStorage.setItem('AdminProfile', JSON.stringify(this.user));

    this.isEditing = false;
    this.message.success('Cập nhật thông tin thành công!');
  }

  toggleEdit(): void {
    this.isEditing = !this.isEditing;
  }
}

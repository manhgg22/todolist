import { Component, Inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NZ_DRAWER_DATA, NzDrawerRef } from 'ng-zorro-antd/drawer';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    ReactiveFormsModule, 
    NzFormModule, 
    NzInputModule, 
    NzSelectModule, 
    NzButtonModule
  ],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {
  todo: any;
  isEditing = false; // Mặc định là chế độ xem

  constructor(
    private drawerRef: NzDrawerRef,
    @Inject(NZ_DRAWER_DATA) public data: { todo: any }
  ) {
    this.todo = { ...data.todo }; // Sao chép dữ liệu để chỉnh sửa mà không ảnh hưởng bản gốc
  }

  toggleEditMode() {
    this.isEditing = !this.isEditing; // Chuyển đổi giữa chế độ xem & chỉnh sửa
  }

  saveTodo() {
    console.log('🚀 Lưu công việc:', this.todo);
    this.drawerRef.close(this.todo);
  }

  closeDrawer() {
    this.drawerRef.close();
  }
}

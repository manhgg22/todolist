import { Component, Inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NZ_DRAWER_DATA, NzDrawerRef } from 'ng-zorro-antd/drawer';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cusprofile',
  
  imports: [
    CommonModule, 
    FormsModule, 
    ReactiveFormsModule, 
    NzFormModule, 
    NzInputModule, 
    NzSelectModule, 
    NzButtonModule
  ],
  templateUrl: './cusprofile.component.html',
  styleUrls: ['./cusprofile.component.css']
})
export class CusprofileComponent {
  todo: any;
  isEditing = false; 

  constructor(
    private drawerRef: NzDrawerRef,
    @Inject(NZ_DRAWER_DATA) public data: { todo: any }
  ) {
    this.todo = { ...data.todo };
  }

  toggleEditMode() {
    this.isEditing = !this.isEditing; 
  }

  saveTodo() {
    console.log('🚀 Lưu công việc:', this.todo);
    this.drawerRef.close(this.todo);
  }

  closeDrawer() {
    this.drawerRef.close();
  }
}
import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzDrawerRef, NZ_DRAWER_DATA } from 'ng-zorro-antd/drawer';
import { FormsModule } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, NzAvatarModule, FormsModule, NzButtonModule, NzInputModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {
   userAvatar = 'https://i.pravatar.cc/150?img=3'; 
  user: any;
  isEditing: boolean = false;

  constructor(
    private drawerRef: NzDrawerRef,
    @Inject(NZ_DRAWER_DATA) public data: { user: any }
  ) {
    this.user = data.user;
  }

  closeDrawer(): void {
    this.drawerRef.close();
  }

  saveChanges(): void {
    // Logic to save changes
    console.log('User data saved:', this.user);
    this.isEditing = false;
  }

  toggleEdit(): void {
    this.isEditing = !this.isEditing;
  }
}
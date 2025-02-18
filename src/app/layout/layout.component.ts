import { Component } from '@angular/core';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu'
import { DashboardComponent } from "../dashboard/dashboard.component";
import { NzMessageService } from 'ng-zorro-antd/message';
import { Router } from '@angular/router';
@Component({
  selector: 'app-layout',
  imports: [NzBreadCrumbModule, NzIconModule, NzLayoutModule, NzMenuModule, DashboardComponent],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent {
  constructor(private router: Router, private message: NzMessageService) {}
  logout(): void {
    localStorage.removeItem("Login");
    this.message.success('Logged out successfully');
    this.router.navigateByUrl('/login');
  }
}

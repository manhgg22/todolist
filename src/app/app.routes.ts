import { Routes } from '@angular/router';
import { LoginComponent } from './Login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LayoutComponent } from './layout/layout.component';
import { gurdGuard } from './Guard/gurd.guard';

export const routes: Routes = [
    {path:'', redirectTo: 'login', pathMatch:'full'},
    {path:'login', component:LoginComponent},
    {path:'dashboard', component:DashboardComponent,  canActivate: [gurdGuard]},
    {path:'layout', component:LayoutComponent,  canActivate: [gurdGuard]}

    
];

import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators, FormGroup } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { RouterModule } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-login',
  
  imports: [ReactiveFormsModule, NzButtonModule, RouterModule, NzCheckboxModule, NzFormModule, NzInputModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  validateForm!: FormGroup;

  constructor(
    private fb: NonNullableFormBuilder,
    private router: Router,
    private message: NzMessageService
  ) {
    this.validateForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
      remember: [true]
    });
  }

  submitForm(): void {
    if (this.validateForm.valid) {
      const { username, password } = this.validateForm.value;

     
      const validUsername = "admin";
      const validPassword = "admin";

     
      if (username === validUsername && password === validPassword) {
        

        localStorage.setItem("user", JSON.stringify({ username, password }));
        this.router.navigateByUrl('layout');
        this.message.success('Login successful');
      } else {
        this.message.error('Check username or password');
      }
    } 
    
  }
}

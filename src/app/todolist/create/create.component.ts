import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';
import { TodoService } from '../../todo.service';
import { Todo } from '../../todo';
import { CommonModule } from '@angular/common';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';

@Component({
  selector: 'app-create-todo',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NzButtonModule, NzInputModule, NzSelectModule],
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateTodoComponent {
  createForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private modalRef: NzModalRef,
    private todoService: TodoService,
    private message: NzMessageService
  ) {
    this.createForm = this.fb.group({
      user: ['', Validators.required], // Nhập tên người làm
      title: ['', Validators.required], // Tiêu đề công việc
      completed: ['false', Validators.required] // Mặc định chưa hoàn thành
    });
  }

  saveTodo() {
    if (this.createForm.valid) {
      const newTodo: Todo = {
        id: Math.floor(Math.random() * 10000), // Giả lập id
        userId: Math.floor(Math.random() * 1000), // Thêm userId vào
        title: this.createForm.value.title,
        completed: this.createForm.value.completed === 'true',
        user: {
          id: Math.floor(Math.random() * 1000), // Giả lập id user
          name: this.createForm.value.user,
          username: '', 
          email: '', 
          address: {
            street: '', suite: '', city: '', zipcode: '', geo: { lat: '', lng: '' }
          },
          phone: '',
          website: '',
          company: { name: '', catchPhrase: '', bs: '' }
        }
      };
  
      this.todoService.addTodo(newTodo).subscribe({
        next: () => {
          this.message.success('✔ Công việc đã được tạo!');
          this.modalRef.close(newTodo);
        },
        error: () => {
          this.message.error('❌ Tạo công việc thất bại, thử lại!');
        }
      });
    }
  }
  
  closeModal() {
    this.modalRef.destroy();
  }
}

import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { NzModalRef, NZ_MODAL_DATA } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Todo, User } from '../../todo';
import { CommonModule } from '@angular/common';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';

@Component({
  selector: 'app-edit-todo',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NzButtonModule, NzInputModule, NzSelectModule],
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditTodoComponent implements OnInit {
  editForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private modalRef: NzModalRef,
    private message: NzMessageService,
    @Inject(NZ_MODAL_DATA) public data: { todo: Todo }
  ) {}

  ngOnInit() {
    this.editForm = this.fb.group({
      user: [this.data.todo.user?.name || '', Validators.required],
      title: [this.data.todo.title, Validators.required],
      completed: [this.data.todo.completed ? 'true' : 'false', Validators.required]
    });
  }

  saveTodo() {
    if (this.editForm.valid) {
      const updatedUser: User = {
        ...this.data.todo.user!,
        name: this.editForm.value.user
      };

      const updatedTodo: Todo = {
        ...this.data.todo,
        title: this.editForm.value.title,
        completed: this.editForm.value.completed === 'true',
        user: updatedUser
      };

      const todos: Todo[] = JSON.parse(localStorage.getItem('todosWithUsers') || '[]');

      const index = todos.findIndex(todo => todo.id === this.data.todo.id);
      if (index !== -1) {
        todos[index] = updatedTodo;
        localStorage.setItem('todosWithUsers', JSON.stringify(todos));
        this.message.success('✔ Công việc đã được cập nhật!');
        this.modalRef.close(updatedTodo);
      } else {
        this.message.error('❌ Không tìm thấy công việc để cập nhật.');
      }
    }
  }

  closeModal() {
    this.modalRef.destroy();
  }
}

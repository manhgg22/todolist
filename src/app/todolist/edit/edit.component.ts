import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { NzModalRef, NZ_MODAL_DATA } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';
import { TodoService } from '../../todo.service';
import { Todo } from '../../todo';
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
    private todoService: TodoService,
    private message: NzMessageService,
    @Inject(NZ_MODAL_DATA) public data: { todo: Todo }
  ) {}

  ngOnInit() {
    this.editForm = this.fb.group({
      user: [this.data.todo.user?.name || '', Validators.required], // Cho phép nhập tên người làm
      title: [this.data.todo.title, Validators.required],
      completed: [this.data.todo.completed ? 'true' : 'false', Validators.required]
    });
  }

  saveTodo() {
    if (this.editForm.valid) {
      const updatedTodo: Todo = {
        ...this.data.todo,
        ...this.editForm.value,
        completed: this.editForm.value.completed === 'true',
        user: { name: this.editForm.value.user } // Cập nhật user với tên mới
      };

      this.todoService.editTodo(updatedTodo).subscribe({
        next: () => {
          this.message.success('✔ Công việc đã được cập nhật!');
          this.modalRef.close(updatedTodo);
        },
        error: () => {
          this.message.error('❌ Cập nhật thất bại, thử lại!');
        }
      });
    }
  }

  closeModal() {
    this.modalRef.destroy();
  }
}

import { Component, createComponent, OnInit } from '@angular/core';
import { TodoService } from '../todo.service';
import { Todo } from '../todo';
import { CommonModule } from '@angular/common';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ViewComponent } from '../todolist/view/view.component';
import { ProfileComponent } from '../profile/profile.component';
import { NzDrawerService } from 'ng-zorro-antd/drawer';
import { EditTodoComponent } from '../todolist/edit/edit.component';
import { CreateTodoComponent } from '../todolist/create/create.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, NzTableModule, NzIconModule, ],
  providers: [NzModalService, NzMessageService,NzDrawerService], 
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  todos: Todo[] = [];

  constructor(
    private todoService: TodoService,
    private modal: NzModalService,
    private message: NzMessageService,
    private drawer: NzDrawerService,
    private modalService: NzModalService
  ) {}

  ngOnInit() {
    this.loadTodos();
  }

  loadTodos() {
    this.todoService.getTodosWithUsers().subscribe({
      next: (data) => {
        this.todos = data;
        
      },
      error: (err) => {
        console.error('❌ Lỗi khi tải dữ liệu:', err);
      }
    });
  }
  

  confirmDelete(todoId: number) {
    this.modal.confirm({
      nzTitle: 'Bạn có chắc muốn xóa công việc này?',
      nzContent: 'Hành động này không thể hoàn tác. Bạn chắc chắn muốn xóa',
      nzOkText: 'Xóa',
      nzOkDanger: true,
      nzOnOk: () => this.deleteTodo(todoId),
      nzCancelText: 'Hủy'
    });
  }

  deleteTodo(todoId: number) {
    this.todoService.deleteTodo(todoId).subscribe({
      next: () => {
        this.todos = this.todos.filter(todo => todo.id !== todoId);
        this.message.success('🗑️ Xóa công việc thành công!');
      },
      error: () => {
        this.message.error('❌ Xóa thất bại, vui lòng thử lại!');
      }
    });
  }

  openViewModal(todo: Todo) {
    console.log('📌 Dữ liệu gửi vào modal:', todo)
    this.modal.create({
      nzTitle: 'Thông tin Công Việc',
      nzContent: ViewComponent, // Component hiển thị modal
      nzData: { todo }, // Truyền dữ liệu vào modal
      nzFooter: null // Ẩn footer
    });
  }
  openTodoDrawer(todo: Todo) {
    this.drawer.create({
      nzTitle: 'Thông Tin Công Việc',
      nzContent: ProfileComponent,
      nzData: { todo }, // Truyền dữ liệu vào drawer
      nzWidth: 480
    });
  }
  openEditModal(todo: Todo) {
    const modal = this.modal.create({
      nzTitle: 'Chỉnh sửa Công Việc',
      nzContent: EditTodoComponent,
      nzData: { todo },
      nzFooter: null
    });
  
    modal.afterClose.subscribe(updatedTodo => {
      if (updatedTodo) {
        this.todos = this.todos.map(t => (t.id === updatedTodo.id ? updatedTodo : t)); // Cập nhật dữ liệu ngay
      }
    });
  }

  openCreateModal() {
    const modal = this.modalService.create({
      nzTitle: 'Tạo Công Việc',
      nzContent: CreateTodoComponent,
      nzFooter: null
    });
  
    modal.afterClose.subscribe((newTodo) => {
      if (newTodo) {
        this.todos = [newTodo, ...this.todos]; 
      }
    });
  }
  
}

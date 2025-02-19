import { Component, OnInit } from '@angular/core';
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
import { NzPaginationModule } from 'ng-zorro-antd/pagination';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, NzTableModule, NzIconModule,NzPaginationModule],
  providers: [NzModalService, NzMessageService, NzDrawerService],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  todos: Todo[] = []; // Danh sách công việc đầy đủ
  displayTodos: Todo[] = []; // Danh sách công việc hiển thị theo trang
  pageSize = 10; // Số công việc mỗi trang
  pageIndex = 1; // Trang hiện tại

  constructor(
    private todoService: TodoService,
    private modal: NzModalService,
    private message: NzMessageService,
    private drawer: NzDrawerService
  ) {}

  ngOnInit() {
    this.loadTodos();
  }

  // Lấy danh sách công việc từ API
  loadTodos() {
    this.todoService.getTodosWithUsers().subscribe({
      next: (data) => {
        this.todos = data;
        this.updateDisplayTodos(); // Cập nhật danh sách hiển thị ban đầu
      },
      error: (err) => {
        console.error('❌ Lỗi khi tải dữ liệu:', err);
      }
    });
  }

  // Cập nhật danh sách công việc hiển thị dựa trên trang hiện tại
  updateDisplayTodos() {
    const startIndex = (this.pageIndex - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.displayTodos = this.todos.slice(startIndex, endIndex);
  }

  // Khi chuyển trang, cập nhật danh sách hiển thị
  onPageChange(index: number) {
    this.pageIndex = index;
    this.updateDisplayTodos();
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
        this.updateDisplayTodos();
        this.message.success('🗑️ Xóa công việc thành công!');
      },
      error: () => {
        this.message.error('❌ Xóa thất bại, vui lòng thử lại!');
      }
    });
  }

  openViewModal(todo: Todo) {
    this.modal.create({
      nzTitle: 'Thông tin Công Việc',
      nzContent: ViewComponent,
      nzData: { todo },
      nzFooter: null
    });
  }

  openTodoDrawer(todo: Todo) {
    this.drawer.create({
      nzTitle: 'Thông Tin Công Việc',
      nzContent: ProfileComponent,
      nzData: { todo },
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
        this.todos = this.todos.map(t => (t.id === updatedTodo.id ? updatedTodo : t));
        this.updateDisplayTodos();
      }
    });
  }

  openCreateModal() {
    const modal = this.modal.create({
      nzTitle: 'Tạo Công Việc',
      nzContent: CreateTodoComponent,
      nzFooter: null
    });

    modal.afterClose.subscribe((newTodo) => {
      if (newTodo) {
        this.todos = [newTodo, ...this.todos];
        this.updateDisplayTodos();
      }
    });
  }
}

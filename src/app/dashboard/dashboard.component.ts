import { Component, OnInit } from '@angular/core';
import { TodoService } from '../todo.service';
import { Todo } from '../todo';
import { CommonModule } from '@angular/common';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzDrawerService } from 'ng-zorro-antd/drawer';
import { FormsModule } from '@angular/forms';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { ViewComponent } from '../todolist/view/view.component';
import { EditTodoComponent } from '../todolist/edit/edit.component';
import { CreateTodoComponent } from '../todolist/create/create.component';
import { CusprofileComponent } from '../cusprofile/cusprofile.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    NzTableModule,
    NzIconModule,
    FormsModule,
    NzInputModule,
    NzSelectModule,
    NzPaginationModule
  ],
  providers: [NzModalService, NzMessageService, NzDrawerService],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  todos: Todo[] = [];
  filteredTodos: Todo[] = [];
  displayTodos: Todo[] = [];
  pageSize = 10;
  pageIndex = 1;
  total = 0;
  searchText = '';
  filterStatus: string = '';

  constructor(
    private todoService: TodoService,
    private modal: NzModalService,
    private message: NzMessageService,
    private drawer: NzDrawerService
  ) {}

  ngOnInit() {
    this.loadTodos();
  }

  loadTodos() {
    this.todoService.getTodosWithUsers().subscribe({
      next: (data) => {
        this.todos = data.slice(0, 30); // Chỉ lấy 30 công việc đầu tiên
        this.todoService.updateLocalStorage(this.todos);
        this.autoFilterOnLogin();
        console.log('🚀 Đã tải dữ liệu công việc:', this.todos);
      },
      error: (err) => {
        console.error('Lỗi khi tải dữ liệu:', err);
      }
    });
    
  }
  

  autoFilterOnLogin() {
    this.filterStatus = '';
    this.searchText = '';
    this.applyFilters();
  }

  applyFilters(): void {
    this.filteredTodos = this.todos.filter((todo) => {
      const matchesSearch = this.searchText
        ? todo.title.toLowerCase().includes(this.searchText.toLowerCase())
        : true;

      const matchesStatus = this.filterStatus
        ? this.filterStatus === 'done'
          ? todo.completed
          : !todo.completed
        : true;

      return matchesSearch && matchesStatus;
    });

    this.total = this.filteredTodos.length;
    this.pageIndex = 1;
    this.updateDisplayTodos();
  }

  updateDisplayTodos() {
    const startIndex = (this.pageIndex - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.displayTodos = this.filteredTodos.slice(startIndex, endIndex);
  }

  onPageChange(index: number) {
    this.pageIndex = index;
    this.updateDisplayTodos();
  }

  onPageSizeChange(size: number) {
    this.pageSize = size;
    this.pageIndex = 1;
    this.updateDisplayTodos();
  }

  onSearchChange() {
    this.applyFilters();
  }

  onFilterChange() {
    this.applyFilters();
  }

  confirmDelete(todoId: number) {
    this.modal.confirm({
      nzTitle: 'Bạn có chắc muốn xóa công việc này?',
      nzContent: 'Hành động này không thể hoàn tác.',
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
        this.todoService.updateLocalStorage(this.todos);
        this.applyFilters();
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
      nzTitle: 'Thông Tin Chi Tiết Người Làm',
      nzContent: CusprofileComponent,
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

    modal.afterClose.subscribe((updatedTodo: Todo) => {
      if (updatedTodo) {
        const index = this.todos.findIndex(t => t.id === updatedTodo.id);
        if (index !== -1) {
          this.todos[index] = updatedTodo;
          this.todoService.updateLocalStorage(this.todos);
          this.applyFilters();
        }
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
        this.todoService.updateLocalStorage(this.todos);
        this.applyFilters();
      }
    });
  }
}

import { Component, OnInit } from '@angular/core';
import { TodoService } from '../todo.service';
import { Todo } from '../todo';
import { CommonModule } from '@angular/common';
import { NzTabComponent } from 'ng-zorro-antd/tabs';
import { NzTableModule } from 'ng-zorro-antd/table'; 
import { NzIconModule } from 'ng-zorro-antd/icon';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule,NzTableModule,NzIconModule], 
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  todos: Todo[] = [];

  constructor(private todoService: TodoService) {}

  ngOnInit() {
    this.loadTodos();
  }

  loadTodos() {
    this.todoService.getTodosWithUsers().subscribe({
      next: (data) => {
        this.todos = data;
        console.log('✅ Dữ liệu đã tải thành công!', data);
      },
      error: (err) => {
        console.error('❌ Lỗi khi gọi API:', err);
      }
    });
  }
}

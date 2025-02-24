import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { mergeMap, map, tap } from 'rxjs/operators';
import { Todo } from './todo';

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  private apiTodo = 'https://jsonplaceholder.typicode.com/todos';
  private apiUser = 'https://jsonplaceholder.typicode.com/users';
  private localStorageKey = 'todosWithUsers';

  constructor(private http: HttpClient) {}

  getTodosWithUsers(): Observable<Todo[]> {
    const cachedData = localStorage.getItem(this.localStorageKey);
    if (cachedData) {
      return of(JSON.parse(cachedData));
    }

    return this.http.get<Todo[]>(this.apiTodo).pipe(
      mergeMap(todos => {
        return this.http.get<any[]>(this.apiUser).pipe(
          map(users => {
            const todosWithUsers = todos.map(todo => ({
              ...todo,
              user: users.find(user => user.id === todo.userId)
            }));

            this.updateLocalStorage(todosWithUsers);
            return todosWithUsers;
          })
        );
      })
    );
  }

  updateLocalStorage(todos: Todo[]) {
    localStorage.setItem(this.localStorageKey, JSON.stringify(todos));
  }

  addTodo(newTodo: Todo): Observable<Todo> {
    return this.http.post<Todo>(this.apiTodo, newTodo).pipe(
      tap(todo => {
        const cachedData = JSON.parse(localStorage.getItem(this.localStorageKey) || '[]');
        this.updateLocalStorage([todo, ...cachedData]);
      })
    );
  }

  editTodo(updatedTodo: Todo): Observable<Todo> {
    return this.http.put<Todo>(`${this.apiTodo}/${updatedTodo.id}`, updatedTodo).pipe(
      tap((savedTodo) => {
        let todos = JSON.parse(localStorage.getItem(this.localStorageKey) || '[]');
        todos = todos.map((t: Todo) => (t.id === savedTodo.id ? savedTodo : t));
        this.updateLocalStorage(todos); // cập nhật localStorage
      })
    );
  }

  deleteTodo(todoId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiTodo}/${todoId}`).pipe(
      tap(() => {
        let todos = JSON.parse(localStorage.getItem(this.localStorageKey) || '[]');
        todos = todos.filter((t: Todo) => t.id !== todoId);
        this.updateLocalStorage(todos);
      })
    );
  }
  editTodoLocal(updatedTodo: Todo): void {
    const todos = JSON.parse(localStorage.getItem(this.localStorageKey) || '[]');
    const updatedTodos = todos.map((t: Todo) => (t.id === updatedTodo.id ? updatedTodo : t));
    localStorage.setItem(this.localStorageKey, JSON.stringify(updatedTodos));
  }
  
}

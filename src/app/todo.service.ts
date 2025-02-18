import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { mergeMap, map } from 'rxjs/operators';
import { Todo } from './todo';

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  private apiTodo = 'https://jsonplaceholder.typicode.com/todos';
  private apiUser = 'https://jsonplaceholder.typicode.com/users';

  constructor(private http: HttpClient) {}

  getTodosWithUsers(): Observable<Todo[]> {
    return this.http.get<Todo[]>(this.apiTodo).pipe(
      mergeMap(todos => {
        return this.http.get<any[]>(this.apiUser).pipe(
          map(users => {
            return todos.map(todo => ({
              ...todo, 
              user: users.find(user => user.id === todo.userId)  
            }));
          })
        );
      })
    );
  }

  
  addTodo(newTodo: Todo): Observable<Todo> {
    return this.http.post<Todo>(this.apiTodo, newTodo);
  }

 
  editTodo(updatedTodo: Todo): Observable<Todo> {
    return this.http.put<Todo>(`${this.apiTodo}/${updatedTodo.id}`, updatedTodo);
  }

  
  deleteTodo(todoId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiTodo}/${todoId}`);
  }
}

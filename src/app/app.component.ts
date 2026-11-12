import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TodoBoardComponent } from './todo-board.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, TodoBoardComponent],
  template: '<app-todo-board />',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'todo-app';
}

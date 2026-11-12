import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TodoService } from './todo.service';

@Component({
  selector: 'app-todo-board',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="layout">
      <aside>
        <h2>Projets</h2>
        @for (p of todo.projects(); track p.id) {
          <div class="row" [class.active]="p.id === todo.selectedId()">
            <button class="link" (click)="todo.select(p.id!)">{{ p.name }}</button>
            <button title="Renommer" (click)="rename(p.id!, p.name)">✏️</button>
            <button title="Supprimer" (click)="todo.deleteProject(p.id!)">🗑️</button>
          </div>
        }
        <input data-test="project-input" [(ngModel)]="newProject" placeholder="Nouveau projet" (keyup.enter)="addProject()" />
        <button data-test="project-add" (click)="addProject()">Ajouter</button>
      </aside>

      <main>
        @if (todo.error()) { <p class="error" data-test="error">{{ todo.error() }}</p> }
        @if (todo.selectedId() !== null) {
          <h2>Tâches</h2>
          @for (t of todo.tasks(); track t.id) {
            <div class="row">
              <input type="checkbox" [checked]="t.done" (change)="todo.toggleTask(t.id!)" />
              <span [class.done]="t.done">{{ t.title }}</span>
              <button title="Modifier" (click)="edit(t.id!, t.title)">✏️</button>
              <button title="Supprimer" (click)="todo.deleteTask(t.id!)">🗑️</button>
            </div>
          } @empty { <p>Aucune tâche 🎉</p> }
          <input data-test="task-input" [(ngModel)]="newTask" placeholder="Nouvelle tâche" (keyup.enter)="addTask()" />
          <button data-test="task-add" (click)="addTask()">Ajouter</button>
        } @else {
          <p>Crée un projet pour commencer 👈</p>
        }
      </main>
    </div>
  `,
  styles: `
    .layout { display: grid; grid-template-columns: 260px 1fr; gap: 24px; font-family: system-ui, sans-serif; padding: 16px; }
    .row { display: flex; align-items: center; gap: 8px; margin: 6px 0; }
    .active .link { font-weight: 700; }
    .link { background: none; border: none; cursor: pointer; flex: 1; text-align: left; }
    .done { text-decoration: line-through; opacity: .6; flex: 1; }
    .row span { flex: 1; }
    .error { color: #b00020; }
  `,
})
export class TodoBoardComponent {
  readonly todo = inject(TodoService);
  newProject = '';
  newTask = '';

  async addProject() { await this.todo.addProject(this.newProject); if (!this.todo.error()) this.newProject = ''; }
  async addTask() { await this.todo.addTask(this.newTask); if (!this.todo.error()) this.newTask = ''; }
  rename(id: number, current: string) { const n = prompt('Nouveau nom du projet', current); if (n !== null) this.todo.renameProject(id, n); }
  edit(id: number, current: string) { const n = prompt('Modifier la tâche', current); if (n !== null) this.todo.editTask(id, n); }
}

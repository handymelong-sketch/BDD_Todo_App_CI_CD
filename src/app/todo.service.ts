import { Injectable, signal } from '@angular/core';
import { TodoDb } from './core/db';
import { TodoRepository } from './core/todo-repository';
import { Project, Task } from './core/models';

@Injectable({ providedIn: 'root' })
export class TodoService {
  private readonly repo = new TodoRepository(new TodoDb());

  readonly projects = signal<Project[]>([]);
  readonly tasks = signal<Task[]>([]);
  readonly selectedId = signal<number | null>(null);
  readonly error = signal('');

  constructor() {
    void this.refresh();
  }

  async refresh(): Promise<void> {
    const projects = await this.repo.listProjects();
    this.projects.set(projects);
    if (this.selectedId() === null && projects.length) this.selectedId.set(projects[0].id!);
    const id = this.selectedId();
    this.tasks.set(id === null ? [] : await this.repo.listTasks(id));
  }

  async select(id: number): Promise<void> {
    this.selectedId.set(id);
    await this.refresh();
  }

  /** Exécute une action et affiche l'erreur métier éventuelle. */
  private async run(fn: () => Promise<unknown>): Promise<void> {
    this.error.set('');
    try { await fn(); } catch (e) { this.error.set((e as Error).message); }
    await this.refresh();
  }

  addProject(name: string) { return this.run(async () => this.selectedId.set(await this.repo.addProject(name))); }
  renameProject(id: number, name: string) { return this.run(() => this.repo.renameProject(id, name)); }
  async deleteProject(id: number) {
    this.selectedId.set(null);
    await this.run(() => this.repo.deleteProject(id));
  }
  addTask(title: string) {
    const id = this.selectedId();
    return this.run(() => this.repo.addTask(id!, title));
  }
  editTask(id: number, title: string) { return this.run(() => this.repo.updateTask(id, { title })); }
  toggleTask(id: number) { return this.run(() => this.repo.toggleTask(id)); }
  deleteTask(id: number) { return this.run(() => this.repo.deleteTask(id)); }
}

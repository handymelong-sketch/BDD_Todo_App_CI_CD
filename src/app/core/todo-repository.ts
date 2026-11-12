import { TodoDb } from './db';
import { Project, Task } from './models';

/** Logique métier pure (sans Angular) : testée par Cucumber. */
export class TodoRepository {
  constructor(private readonly db: TodoDb) {}

  // ---------- Projets ----------
  async addProject(name: string): Promise<number> {
    const clean = name.trim();
    if (!clean) throw new Error('Le nom du projet est obligatoire');
    if (await this.db.projects.where('name').equals(clean).count()) {
      throw new Error('Ce projet existe déjà');
    }
    return this.db.projects.add({ name: clean });
  }

  async renameProject(id: number, name: string): Promise<void> {
    const clean = name.trim();
    if (!clean) throw new Error('Le nom du projet est obligatoire');
    const other = await this.db.projects.where('name').equals(clean).first();
    if (other && other.id !== id) throw new Error('Ce projet existe déjà');
    await this.db.projects.update(id, { name: clean });
  }

  async deleteProject(id: number): Promise<void> {
    await this.db.transaction('rw', this.db.projects, this.db.tasks, async () => {
      await this.db.tasks.where('projectId').equals(id).delete();
      await this.db.projects.delete(id);
    });
  }

  listProjects(): Promise<Project[]> {
    return this.db.projects.orderBy('name').toArray();
  }

  // ---------- Tâches ----------
  async addTask(projectId: number, title: string): Promise<number> {
    const clean = title.trim();
    if (!clean) throw new Error('Le titre de la tâche est obligatoire');
    if (!(await this.db.projects.get(projectId))) throw new Error('Projet introuvable');
    return this.db.tasks.add({ projectId, title: clean, done: false, createdAt: Date.now() });
  }

  async updateTask(id: number, patch: Partial<Pick<Task, 'title' | 'projectId'>>): Promise<void> {
    if (patch.title !== undefined) {
      patch = { ...patch, title: patch.title.trim() };
      if (!patch.title) throw new Error('Le titre de la tâche est obligatoire');
    }
    if (patch.projectId !== undefined && !(await this.db.projects.get(patch.projectId))) {
      throw new Error('Projet introuvable');
    }
    await this.db.tasks.update(id, patch);
  }

  async toggleTask(id: number): Promise<void> {
    const t = await this.db.tasks.get(id);
    if (t) await this.db.tasks.update(id, { done: !t.done });
  }

  deleteTask(id: number): Promise<void> {
    return this.db.tasks.delete(id);
  }

  listTasks(projectId?: number): Promise<Task[]> {
    const q = projectId === undefined ? this.db.tasks.toCollection() : this.db.tasks.where('projectId').equals(projectId);
    return q.sortBy('createdAt');
  }
}

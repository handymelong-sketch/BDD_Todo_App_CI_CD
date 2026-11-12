import { setWorldConstructor, World, Before, After } from '@cucumber/cucumber';
import { indexedDB, IDBKeyRange } from 'fake-indexeddb';
import { TodoDb } from '../../src/app/core/db';
import { TodoRepository } from '../../src/app/core/todo-repository';

let counter = 0;

export class TodoWorld extends World {
  dbName = '';
  db!: TodoDb;
  repo!: TodoRepository;
  lastError: Error | null = null;

  open(): void {
    this.db = new TodoDb(this.dbName, { indexedDB, IDBKeyRange });
    this.repo = new TodoRepository(this.db);
  }

  /** Simule la fermeture puis la réouverture du navigateur. */
  reopen(): void {
    this.db.close();
    this.open();
  }

  async attempt(fn: () => Promise<unknown>): Promise<void> {
    this.lastError = null;
    try { await fn(); } catch (e) { this.lastError = e as Error; }
  }

  async projectId(name: string): Promise<number> {
    const p = (await this.repo.listProjects()).find((x) => x.name === name);
    if (!p?.id) throw new Error(`Projet "${name}" introuvable dans la base`);
    return p.id;
  }
}

setWorldConstructor(TodoWorld);

Before(function (this: TodoWorld) {
  this.dbName = `todo-test-${++counter}-${Date.now()}`;
  this.open();
});

After(async function (this: TodoWorld) {
  await this.db.delete();
});

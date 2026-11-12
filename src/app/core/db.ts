import Dexie, { Table } from 'dexie';
import { Project, Task } from './models';

export class TodoDb extends Dexie {
  projects!: Table<Project, number>;
  tasks!: Table<Task, number>;

  // `options` permet d'injecter fake-indexeddb dans les tests BDD
  constructor(name = 'todo-db', options?: ConstructorParameters<typeof Dexie>[1]) {
    super(name, options);
    this.version(1).stores({
      projects: '++id, &name',
      tasks: '++id, projectId, done',
    });
  }
}

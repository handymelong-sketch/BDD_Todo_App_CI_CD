import { Given, When, Then } from '@cucumber/cucumber';
import assert from 'node:assert/strict';
import { TodoWorld } from '../support/world';

async function titles(w: TodoWorld, project: string): Promise<string[]> {
  return (await w.repo.listTasks(await w.projectId(project))).map((t) => t.title);
}

async function findTask(w: TodoWorld, project: string, title: string) {
  const t = (await w.repo.listTasks(await w.projectId(project))).find((x) => x.title === title);
  assert.ok(t, `Tâche "${title}" introuvable dans "${project}"`);
  return t;
}

Given('une tâche {string} dans le projet {string}', async function (this: TodoWorld, title: string, project: string) {
  await this.repo.addTask(await this.projectId(project), title);
});

When('j\'ajoute la tâche {string} au projet {string}', async function (this: TodoWorld, title: string, project: string) {
  await this.repo.addTask(await this.projectId(project), title);
});

When('j\'essaie d\'ajouter la tâche {string} au projet {string}', async function (this: TodoWorld, title: string, project: string) {
  await this.attempt(async () => this.repo.addTask(await this.projectId(project), title));
});

When('j\'essaie d\'ajouter une tâche au projet numéro {int}', async function (this: TodoWorld, id: number) {
  await this.attempt(() => this.repo.addTask(id, 'Orpheline'));
});

When('je modifie la tâche {string} du projet {string} en {string}', async function (this: TodoWorld, old: string, project: string, next: string) {
  const t = await findTask(this, project, old);
  await this.repo.updateTask(t.id!, { title: next });
});

When('j\'essaie de modifier la tâche {string} du projet {string} avec le titre {string}', async function (this: TodoWorld, old: string, project: string, next: string) {
  const t = await findTask(this, project, old);
  await this.attempt(() => this.repo.updateTask(t.id!, { title: next }));
});

When('je déplace la tâche {string} du projet {string} vers le projet {string}', async function (this: TodoWorld, title: string, from: string, to: string) {
  const t = await findTask(this, from, title);
  await this.repo.updateTask(t.id!, { projectId: await this.projectId(to) });
});

When('je coche la tâche {string} du projet {string}', async function (this: TodoWorld, title: string, project: string) {
  const t = await findTask(this, project, title);
  await this.repo.toggleTask(t.id!);
});

When('je supprime la tâche {string} du projet {string}', async function (this: TodoWorld, title: string, project: string) {
  const t = await findTask(this, project, title);
  await this.repo.deleteTask(t.id!);
});

Then('le projet {string} contient la tâche {string}', async function (this: TodoWorld, project: string, title: string) {
  assert.ok((await titles(this, project)).includes(title));
});

Then('le projet {string} ne contient pas la tâche {string}', async function (this: TodoWorld, project: string, title: string) {
  assert.ok(!(await titles(this, project)).includes(title));
});

Then('le projet {string} contient {int} tâche(s)', async function (this: TodoWorld, project: string, n: number) {
  assert.equal((await titles(this, project)).length, n);
});

Then('la tâche {string} du projet {string} est terminée', async function (this: TodoWorld, title: string, project: string) {
  assert.equal((await findTask(this, project, title)).done, true);
});

Then('la tâche {string} du projet {string} n\'est pas terminée', async function (this: TodoWorld, title: string, project: string) {
  assert.equal((await findTask(this, project, title)).done, false);
});

Then('il n\'existe aucune tâche', async function (this: TodoWorld) {
  assert.equal((await this.repo.listTasks()).length, 0);
});

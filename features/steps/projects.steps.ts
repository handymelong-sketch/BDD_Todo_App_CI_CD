import { Given, When, Then } from '@cucumber/cucumber';
import assert from 'node:assert/strict';
import { TodoWorld } from '../support/world';

Given('un projet {string}', async function (this: TodoWorld, name: string) {
  await this.repo.addProject(name);
});

When('je crée le projet {string}', async function (this: TodoWorld, name: string) {
  await this.repo.addProject(name);
});

When("j'essaie de créer le projet {string}", async function (this: TodoWorld, name: string) {
  await this.attempt(() => this.repo.addProject(name));
});

When('je renomme le projet {string} en {string}', async function (this: TodoWorld, old: string, next: string) {
  await this.repo.renameProject(await this.projectId(old), next);
});

When('je supprime le projet {string}', async function (this: TodoWorld, name: string) {
  await this.repo.deleteProject(await this.projectId(name));
});

When('je rouvre le navigateur', function (this: TodoWorld) {
  this.reopen();
});

Then('la liste des projets contient {string}', async function (this: TodoWorld, name: string) {
  const names = (await this.repo.listProjects()).map((p) => p.name);
  assert.ok(names.includes(name), `Projets présents : ${names.join(', ') || '(aucun)'}`);
});

Then('la liste des projets ne contient pas {string}', async function (this: TodoWorld, name: string) {
  const names = (await this.repo.listProjects()).map((p) => p.name);
  assert.ok(!names.includes(name));
});

Then('la liste des projets est vide', async function (this: TodoWorld) {
  assert.equal((await this.repo.listProjects()).length, 0);
});

Then("j'obtiens l'erreur {string}", function (this: TodoWorld, message: string) {
  assert.ok(this.lastError, "Aucune erreur n'a été levée");
  assert.equal(this.lastError.message, message);
});

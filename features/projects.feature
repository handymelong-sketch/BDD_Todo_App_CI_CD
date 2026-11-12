# language: fr
Fonctionnalité: Gestion des projets
  En tant qu'utilisateur
  Je veux organiser mes tâches dans des projets

  Scénario: Créer un projet
    Quand je crée le projet "Travail"
    Alors la liste des projets contient "Travail"

  Scénario: Refuser un nom de projet vide
    Quand j'essaie de créer le projet "   "
    Alors j'obtiens l'erreur "Le nom du projet est obligatoire"
    Et la liste des projets est vide

  Scénario: Refuser un projet en doublon
    Soit un projet "Travail"
    Quand j'essaie de créer le projet "Travail"
    Alors j'obtiens l'erreur "Ce projet existe déjà"

  Scénario: Renommer un projet
    Soit un projet "Travail"
    Quand je renomme le projet "Travail" en "Boulot"
    Alors la liste des projets contient "Boulot"
    Et la liste des projets ne contient pas "Travail"

  Scénario: Supprimer un projet supprime ses tâches
    Soit un projet "Travail"
    Et une tâche "Rapport" dans le projet "Travail"
    Quand je supprime le projet "Travail"
    Alors la liste des projets est vide
    Et il n'existe aucune tâche

  Scénario: Les projets survivent à la fermeture du navigateur
    Soit un projet "Travail"
    Quand je rouvre le navigateur
    Alors la liste des projets contient "Travail"

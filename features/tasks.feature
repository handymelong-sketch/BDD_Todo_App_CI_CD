# language: fr
Fonctionnalité: Gestion des tâches
  En tant qu'utilisateur
  Je veux ajouter, modifier et terminer des tâches dans mes projets

  Contexte:
    Soit un projet "Travail"
    Et un projet "Perso"

  Scénario: Ajouter une tâche à un projet
    Quand j'ajoute la tâche "Écrire le rapport" au projet "Travail"
    Alors le projet "Travail" contient la tâche "Écrire le rapport"
    Et la tâche "Écrire le rapport" du projet "Travail" n'est pas terminée

  Scénario: Refuser une tâche sans titre
    Quand j'essaie d'ajouter la tâche "  " au projet "Travail"
    Alors j'obtiens l'erreur "Le titre de la tâche est obligatoire"
    Et le projet "Travail" contient 0 tâche

  Scénario: Refuser une tâche dans un projet inexistant
    Quand j'essaie d'ajouter une tâche au projet numéro 999
    Alors j'obtiens l'erreur "Projet introuvable"

  Scénario: Modifier le titre d'une tâche
    Soit une tâche "Rapport" dans le projet "Travail"
    Quand je modifie la tâche "Rapport" du projet "Travail" en "Rapport final"
    Alors le projet "Travail" contient la tâche "Rapport final"
    Et le projet "Travail" ne contient pas la tâche "Rapport"

  Scénario: Refuser de vider le titre d'une tâche
    Soit une tâche "Rapport" dans le projet "Travail"
    Quand j'essaie de modifier la tâche "Rapport" du projet "Travail" avec le titre ""
    Alors j'obtiens l'erreur "Le titre de la tâche est obligatoire"
    Et le projet "Travail" contient la tâche "Rapport"

  Scénario: Déplacer une tâche vers un autre projet
    Soit une tâche "Courses" dans le projet "Travail"
    Quand je déplace la tâche "Courses" du projet "Travail" vers le projet "Perso"
    Alors le projet "Perso" contient la tâche "Courses"
    Et le projet "Travail" contient 0 tâche

  Scénario: Terminer une tâche
    Soit une tâche "Rapport" dans le projet "Travail"
    Quand je coche la tâche "Rapport" du projet "Travail"
    Alors la tâche "Rapport" du projet "Travail" est terminée

  Scénario: Décocher une tâche terminée
    Soit une tâche "Rapport" dans le projet "Travail"
    Quand je coche la tâche "Rapport" du projet "Travail"
    Et je coche la tâche "Rapport" du projet "Travail"
    Alors la tâche "Rapport" du projet "Travail" n'est pas terminée

  Scénario: Supprimer une tâche
    Soit une tâche "Rapport" dans le projet "Travail"
    Quand je supprime la tâche "Rapport" du projet "Travail"
    Alors le projet "Travail" contient 0 tâche

  Scénario: Les tâches sont isolées par projet
    Quand j'ajoute la tâche "Rapport" au projet "Travail"
    Et j'ajoute la tâche "Sport" au projet "Perso"
    Alors le projet "Travail" contient 1 tâche
    Et le projet "Perso" ne contient pas la tâche "Rapport"

  Scénario: Les tâches survivent à la fermeture du navigateur
    Soit une tâche "Rapport" dans le projet "Travail"
    Quand je coche la tâche "Rapport" du projet "Travail"
    Et je rouvre le navigateur
    Alors la tâche "Rapport" du projet "Travail" est terminée

  Plan du Scénario: Ajouter plusieurs tâches
    Quand j'ajoute la tâche "<titre>" au projet "<projet>"
    Alors le projet "<projet>" contient la tâche "<titre>"

    Exemples:
      | titre          | projet  |
      | Faire le TP    | Travail |
      | Appeler maman  | Perso   |

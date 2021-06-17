# Groupomania Workplace

Formation développeur web de l'école OpenClassrooms: Projet 7. Créer un réseau social interne d'entreprise. Ce réseau social permet les échanges et facilite la communication entre les empoyés de l'entreprise Groupomania.
___
## Technologies

Voici la liste technologies utilisées dans ce projet:

### Backend:

* Nodejs: Version 14.16.0
* Express: Version 4.17.1
* Sequelize-cli: Version 6.2.0
* Sequelize: Version 6.6.2
* mysql2: Version 2.2.5
* nodemon: Version 2.0.7

### Frontend:

* vue: Version 2.6.11
* vue-router: Version 3.5.1
* axios: Version 0.21.1
___
## Installation

### API

Prérequis: Nodejs installé sur votre machine.
Clonez ce Repository puis aller dans le dossier Backend et ouvrez un terminal. 

Pour installer les modules nécessaires, tapez cette commande dans le terminal:
```
npm install
```
Lancez l'API, en tapant cette commande dans le terminal: 
```
nodemon server
```

L'API devra écouter le PORT 3000 

### Base de données MySQL

Le nom de la base de données est "groupomania_database". Si vous voulez changer son nom, allez dans le fichier config.json => database : "votre_nouveau_nom"

Prérequis: mySQL installé sur votre machine et connecté sur le port 3306.

Créez la base de donnée avec Seequelize, en tapant cette commande dans le terminal du dossier backend:

```
sequelize db:create
```
Puis pour remplir cette base de données avec les tables existantes, tapez cette commande dans le même terminal:

```
sequelize db:migrate
```
Votre base de données est créée. 

### Application Frontend

Allez sur le dossier frontend et ouvrez un terminal. Pour installer les modules nécessaires, tapez la commande suivante:

```
npm install
```
Puis pour lancer l'application, tapez la commande suivante:
```
npm run serve
```
Vous devrez avoir cet affichage dans le terminal:

```
 App running at:
  - Local:   http://localhost:8080/
```
Cliquer sur le lien pour accéder au navigateur qui affiche l'application.

#### Définir un utilisateur en tant qu'administrateur de l'application

Tapez la ligne de commande suivante:

```
UPDATE users SET isAdmin= 1 where email = 'votre-email@email.fr';
```

#### Vous pouvez désormais utiliser l'application.

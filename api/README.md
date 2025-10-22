# API Job Board

API REST pour une plateforme de recrutement développée avec Node.js, Express et MySQL.

## 📋 Table des matières

- [Installation](#installation)
- [Configuration](#configuration)
- [Démarrage](#démarrage)
- [Authentification](#authentification)
- [Rôles et Permissions](#rôles-et-permissions)
- [Endpoints](#endpoints)
  - [Authentification](#authentification-1)
  - [Utilisateurs](#utilisateurs)
  - [Entreprises](#entreprises)
  - [Annonces](#annonces)
  - [Candidatures](#candidatures)

## 🚀 Installation

```bash
# Cloner le repository
git clone https://github.com/EpitechMscProPromo2028/T-WEB-501-PAR_23.git

# Installer les dépendances
npm install
```

## ⚙️ Configuration

Créer un fichier `.env` à la racine du projet :

```env
DB_HOST=localhost
DB_USER=API_USER
DB_PASSWORD=wD7GbP@NcakIU9EB
DB_NAME=job_board
JWT_SECRET=votre_secret_jwt
PORT=3000
```

## 🏃 Démarrage

```bash
npm start
```

Le serveur démarre sur `http://localhost:3000`

## 🔐 Authentification

L'API utilise JWT (JSON Web Token) pour l'authentification. 

### Obtenir un token

Envoyez une requête POST à `/` avec les identifiants :

```json
{
  "email": "user@example.com",
  "password": "password"
}
```

### Utiliser le token

Incluez le token dans l'en-tête `Authorization` de vos requêtes :

```
Authorization: Bearer votre_token_jwt
```

## 👥 Rôles et Permissions

| Rôle | ID | Description |
|------|-----|-------------|
| Admin | 1 | Accès complet à toutes les ressources |
| Company | 2 | Gestion des entreprises et annonces |
| People | 3 | Consultation et candidature aux offres |

## 📚 Endpoints

### Authentification

#### Connexion
```
POST /
```

**Public** - Pas d'authentification requise

**Body:**
```json
{
  "email": "user@example.com",
  "password": "password"
}
```

**Réponse:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "role": 3
  }
}
```

---

### Utilisateurs

#### Récupérer tous les utilisateurs
```
GET /users
```

**Auth requise:** Oui | **Rôles:** Admin (1)

**Réponse:**
```json
[
  {
    "id": 1,
    "email": "user@example.com",
    "firstname": "John",
    "lastname": "Doe",
    "role": 3
  }
]
```

#### Récupérer tous les emails
```
GET /users/email/
```

**Public** - Pas d'authentification requise

**Réponse:**
```json
[
  "user1@example.com",
  "user2@example.com"
]
```

#### Récupérer un utilisateur par ID
```
GET /users/:id
```

**Auth requise:** Oui | **Rôles:** Tous

**Paramètres:**
- `id` (path) - ID de l'utilisateur

**Réponse:**
```json
{
  "id": 1,
  "email": "user@example.com",
  "firstname": "John",
  "lastname": "Doe",
  "role": 3
}
```

#### Créer un utilisateur (Inscription)
```
POST /users
```

**Public** - Pas d'authentification requise

**Body:**
```json
{
  "email": "newuser@example.com",
  "password": "securepassword",
  "firstname": "Jane",
  "lastname": "Smith",
  "role": 3
}
```

**Réponse:**
```json
{
  "id": 2,
  "email": "newuser@example.com",
  "message": "Utilisateur créé avec succès"
}
```

#### Modifier un utilisateur
```
PATCH /users/:id
```

**Auth requise:** Oui | **Rôles:** Admin (1), Company (2), People (3)

**Paramètres:**
- `id` (path) - ID de l'utilisateur

**Body:**
```json
{
  "firstname": "Jane",
  "lastname": "Doe"
}
```

#### Modifier le mot de passe
```
PATCH /users/password/:id
```

**Auth requise:** Oui | **Rôles:** Admin (1), Company (2), People (3)

**Paramètres:**
- `id` (path) - ID de l'utilisateur

**Body:**
```json
{
  "oldPassword": "ancien_mot_de_passe",
  "newPassword": "nouveau_mot_de_passe"
}
```

#### Supprimer un utilisateur
```
DELETE /users/:id
```

**Auth requise:** Oui | **Rôles:** Admin (1), Company (2), People (3)

**Paramètres:**
- `id` (path) - ID de l'utilisateur

---

### Entreprises

#### Récupérer toutes les entreprises
```
GET /companies
```

**Public** - Pas d'authentification requise

**Réponse:**
```json
[
  {
    "id": 1,
    "name": "Tech Corp",
    "description": "Entreprise de technologie",
    "location": "Paris"
  }
]
```

#### Récupérer une entreprise par ID
```
GET /companies/:id
```

**Auth requise:** Oui | **Rôles:** Tous

**Paramètres:**
- `id` (path) - ID de l'entreprise

**Réponse:**
```json
{
  "id": 1,
  "name": "Tech Corp",
  "description": "Entreprise de technologie",
  "location": "Paris",
  "website": "https://techcorp.com"
}
```

#### Créer une entreprise
```
POST /companies
```

**Auth requise:** Oui | **Rôles:** Admin (1)

**Body:**
```json
{
  "name": "New Company",
  "description": "Description de l'entreprise",
  "location": "Lyon",
  "website": "https://newcompany.com"
}
```

#### Modifier une entreprise
```
PATCH /companies/:id
```

**Auth requise:** Oui | **Rôles:** Admin (1), Company (2)

**Paramètres:**
- `id` (path) - ID de l'entreprise

**Body:**
```json
{
  "description": "Nouvelle description",
  "location": "Marseille"
}
```

#### Supprimer une entreprise
```
DELETE /companies/:id
```

**Auth requise:** Oui | **Rôles:** Admin (1)

**Paramètres:**
- `id` (path) - ID de l'entreprise

---

### Annonces

#### Récupérer toutes les annonces
```
GET /ads
```

**Public** - Pas d'authentification requise

**Réponse:**
```json
[
  {
    "id": 1,
    "title": "Développeur Full Stack",
    "description": "Nous recherchons un développeur...",
    "company_id": 1,
    "salary": "45000",
    "location": "Paris"
  }
]
```

#### Récupérer une annonce par ID
```
GET /ads/:id
```

**Public** - Pas d'authentification requise

**Paramètres:**
- `id` (path) - ID de l'annonce

**Réponse:**
```json
{
  "id": 1,
  "title": "Développeur Full Stack",
  "description": "Nous recherchons un développeur...",
  "company_id": 1,
  "salary": "45000",
  "location": "Paris",
  "created_at": "2024-01-15"
}
```

#### Récupérer les annonces d'une entreprise
```
GET /ads/company/:company_id
```

**Public** - Pas d'authentification requise

**Paramètres:**
- `company_id` (path) - ID de l'entreprise

**Réponse:**
```json
[
  {
    "id": 1,
    "title": "Développeur Full Stack",
    "company_id": 1
  },
  {
    "id": 2,
    "title": "Designer UX/UI",
    "company_id": 1
  }
]
```

#### Créer une annonce (Company)
```
POST /ads
```

**Auth requise:** Oui | **Rôles:** Company (2)

**Body:**
```json
{
  "title": "Développeur Backend",
  "description": "Description du poste",
  "salary": "50000",
  "location": "Paris"
}
```

#### Créer une annonce (Admin)
```
POST /ads/admin/
```

**Auth requise:** Oui | **Rôles:** Admin (1)

**Body:**
```json
{
  "title": "Développeur Backend",
  "description": "Description du poste",
  "company_id": 1,
  "salary": "50000",
  "location": "Paris"
}
```

#### Modifier une annonce (Company)
```
PATCH /ads/:id
```

**Auth requise:** Oui | **Rôles:** Company (2)

**Paramètres:**
- `id` (path) - ID de l'annonce

**Body:**
```json
{
  "title": "Nouveau titre",
  "salary": "55000"
}
```

#### Modifier une annonce (Admin)
```
PATCH /ads/admin/:id
```

**Auth requise:** Oui | **Rôles:** Admin (1)

**Paramètres:**
- `id` (path) - ID de l'annonce

**Body:**
```json
{
  "title": "Nouveau titre",
  "company_id": 2
}
```

#### Supprimer une annonce
```
DELETE /ads/:id
```

**Auth requise:** Oui | **Rôles:** Admin (1), Company (2)

**Paramètres:**
- `id` (path) - ID de l'annonce

---

### Candidatures

#### Récupérer toutes les candidatures
```
GET /job_applications
```

**Auth requise:** Oui | **Rôles:** Tous

**Réponse:**
```json
[
  {
    "id": 1,
    "ad_id": 1,
    "people_id": 3,
    "status": "pending",
    "created_at": "2024-01-15"
  }
]
```

#### Récupérer une candidature par ID
```
GET /job_applications/:id
```

**Auth requise:** Oui | **Rôles:** Tous

**Paramètres:**
- `id` (path) - ID de la candidature

**Réponse:**
```json
{
  "id": 1,
  "ad_id": 1,
  "people_id": 3,
  "status": "pending",
  "message": "Je suis intéressé par ce poste...",
  "created_at": "2024-01-15"
}
```

#### Récupérer les candidatures d'une annonce
```
GET /job_applications/ad/:ad_id
```

**Auth requise:** Oui | **Rôles:** Admin (1), Company (2)

**Paramètres:**
- `ad_id` (path) - ID de l'annonce

**Réponse:**
```json
[
  {
    "id": 1,
    "ad_id": 1,
    "people_id": 3,
    "status": "pending"
  }
]
```

#### Récupérer les candidatures d'un candidat
```
GET /job_applications/people/:people_id
```

**Auth requise:** Oui | **Rôles:** Admin (1), People (3)

**Paramètres:**
- `people_id` (path) - ID du candidat

**Réponse:**
```json
[
  {
    "id": 1,
    "ad_id": 1,
    "people_id": 3,
    "status": "pending"
  }
]
```

#### Créer une candidature
```
POST /job_applications
```

**Public** - Pas d'authentification requise

**Body:**
```json
{
  "ad_id": 1,
  "people_id": 3,
  "message": "Je suis très intéressé par ce poste..."
}
```

**Réponse:**
```json
{
  "id": 1,
  "message": "Candidature créée avec succès"
}
```

#### Modifier une candidature (User)
```
PATCH /job_applications/:id
```

**Auth requise:** Oui | **Rôles:** People (3)

**Paramètres:**
- `id` (path) - ID de la candidature

**Body:**
```json
{
  "message": "Message mis à jour"
}
```

#### Modifier une candidature (Admin)
```
PATCH /job_applications/admin/:id
```

**Auth requise:** Oui | **Rôles:** Admin (1)

**Paramètres:**
- `id` (path) - ID de la candidature

**Body:**
```json
{
  "status": "accepted"
}
```

#### Supprimer une candidature
```
DELETE /job_applications/:id
```

**Auth requise:** Oui | **Rôles:** Admin (1), People (3)

**Paramètres:**
- `id` (path) - ID de la candidature

---

## 📝 Codes de statut HTTP

| Code | Signification |
|------|--------------|
| 200 | Succès |
| 201 | Créé avec succès |
| 400 | Mauvaise requête |
| 401 | Non authentifié |
| 403 | Accès refusé |
| 404 | Ressource non trouvée |
| 500 | Erreur serveur |

## 🛠️ Technologies utilisées

- **Node.js** - Runtime JavaScript
- **Express** - Framework web
- **MySQL2** - Base de données
- **JWT** - Authentification
- **bcrypt** - Hachage des mots de passe
- **dotenv** - Gestion des variables d'environnement


## 🔗 Liens

- [Repository GitHub](https://github.com/EpitechMscProPromo2028/T-WEB-501-PAR_23/api)

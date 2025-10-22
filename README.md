# 🎯 Job Board - DWMT

Plateforme de recrutement complète avec interface web et API REST. Ce projet permet aux candidats de postuler à des offres d'emploi, aux entreprises de gérer leurs annonces et candidatures, et aux administrateurs de superviser l'ensemble de la plateforme.

## 📋 Table des matières

- [Architecture du projet](#architecture-du-projet)
- [Prérequis](#prérequis)
- [Installation](#installation)
- [Configuration de la base de données](#configuration-de-la-base-de-données)
- [Lancement du projet](#lancement-du-projet)
- [Pages et fonctionnalités](#pages-et-fonctionnalités)
- [Documentation API](#documentation-api)
- [Technologies utilisées](#technologies-utilisées)

---

## 🏗️ Architecture du projet

```
T-WEB-501-PAR_23/
├── api/                          # Backend API REST
│   ├── app/
│   │   ├── controllers/          # Logique métier
│   │   ├── middlewares/          # Auth JWT et rôles
│   │   ├── models/               # Modèles de données
│   │   ├── routes/               # Routes de l'API
│   │   └── connectDB.js          # Connexion MySQL
│   ├── server.js                 # Point d'entrée de l'API
│   ├── database.sql              # Schéma de la BDD
│   └── package.json              # Dépendances backend
├── css/                          # Styles CSS
│   ├── admin.css                 # Styles admin
│   ├── candidate_style.css       # Styles candidat
│   ├── company.css               # Styles entreprise
│   └── style.css                 # Styles login/signup
├── js/                           # Scripts JavaScript
│   ├── admin.js                  # Logique admin
│   ├── candidate_script.js       # Logique candidat
│   ├── company.js                # Logique entreprise
│   └── validation.js             # Login/Signup
├── images/                       # Ressources visuelles
├── admin.html                    # Dashboard admin
├── candidate.html                # Page candidat
├── company.html                  # Dashboard entreprise
├── login.html                    # Page de connexion
├── signup.html                   # Page d'inscription
└── .env                          # Configuration JWT
```

---

## ⚙️ Prérequis

- **Node.js** >= 14.x
- **MySQL** >= 5.7
- **npm** ou **yarn**
- Un navigateur web moderne

---

## 🚀 Installation

### 1. Cloner le repository

```bash
git clone https://github.com/EpitechMscProPromo2028/T-WEB-501-PAR_23.git
cd T-WEB-501-PAR_23
```

### 2. Installer les dépendances de l'API

```bash
cd api
npm install
```

---

## 🗄️ Configuration de la base de données

### 1. Créer la base de données et importer le schéma

```bash
mysql -u root -p < api/database.sql
```

Le fichier `database.sql` crée automatiquement :
- La base de données `job_board`
- L'utilisateur `API_USER`
- Les tables nécessaires :
  - `companies` - Entreprises
  - `advertisements` - Offres d'emploi
  - `TYPE_PEOPLE` - Types d'utilisateurs (Admin, Company, Candidate)
  - `people` - Utilisateurs
  - `applications` - Candidatures
- Des données de test incluant un compte admin

### 2. Compte administrateur par défaut

Un compte admin est créé automatiquement :
- **Email :** `admintest@example.com`
- **Mot de passe :** `koka2025` (hash bcrypt déjà dans la BDD)

### 3. Structure de la base de données

**Table `companies`**
- `id` - Identifiant unique
- `name` - Nom de l'entreprise
- `address` - Adresse
- `description` - Description

**Table `advertisements`**
- `id` - Identifiant unique
- `title` - Titre du poste
- `short_description` - Description courte
- `full_description` - Description complète
- `salary` - Salaire
- `position_type` - Type de contrat (CDI, CDD, Internship, etc.)
- `location` - Lieu de travail
- `schedule` - Horaires
- `experience` - Niveau requis (Entry, Mid, Senior)
- `company_id` - Référence à l'entreprise

**Table `people`**
- `id` - Identifiant unique
- `first_name` - Prénom
- `last_name` - Nom
- `email` - Email (unique)
- `phone` - Téléphone
- `password` - Mot de passe hashé (bcrypt)
- `skills` - Compétences (JSON, uniquement pour les candidats)
- `type_people` - Type d'utilisateur (1=Admin, 2=Company, 3=Candidate)
- `company_id` - Référence à l'entreprise (uniquement pour type=2)

**Table `applications`**
- `id` - Identifiant unique
- `email` - Email du candidat
- `first_name` - Prénom
- `last_name` - Nom
- `ad_id` - Référence à l'annonce
- `date_application` - Date de candidature
- `message` - Message de motivation

---

## 🎮 Lancement du projet

### Étape 1 : Démarrer l'API (Backend)

Dans le dossier `api/` :

```bash
cd api
node server.js
```

✅ L'API démarre sur **http://localhost:3000**

Vous devriez voir :
```
Connected to Database
Server started on port 3000
```

### Étape 2 : Démarrer le Frontend

**Option 1 : Avec Live Server (VS Code) - Recommandé**
1. Installer l'extension "Live Server"
2. Clic droit sur `candidate.html` → "Open with Live Server"
3. Le site s'ouvre sur **http://127.0.0.1:5500**

**Option 2 : Avec Python**
```bash
# À la racine du projet (pas dans /api)
python -m http.server 8080
```
Puis accédez à **http://localhost:8080**

**Option 3 : Avec Node.js**
```bash
npx http-server -p 8080
```

---

## 📄 Pages et fonctionnalités

### 🔐 **login.html** - Page de connexion
**URL :** `/login.html`

**Fonctionnalités :**
- Authentification par email/mot de passe
- Validation des champs en temps réel
- Stockage du token JWT dans localStorage
- Redirection automatique selon le rôle :
  - **Admin (type=1)** → `admin.html`
  - **Company (type=2)** → `company.html`
  - **Candidate (type=3)** → `candidate.html`

**Compte de test :**
```
Email: admintest@example.com
Mot de passe: admin
```

**Fichiers liés :** `js/validation.js`, `css/style.css`

---

### 📝 **signup.html** - Page d'inscription
**URL :** `/signup.html`

**Fonctionnalités :**
- Inscription avec choix du rôle (Candidat ou Entreprise)
- Validation complète :
  - Email unique (vérification en temps réel)
  - Mot de passe minimum 8 caractères
  - Correspondance des mots de passe
  - Tous les champs obligatoires

**Pour les candidats (type=3) :**
- Ajout de compétences (skills) avec système de tags
- Stockage des compétences au format JSON
- Ajout dynamique par pression de "Entrée" ou ","

**Pour les entreprises (type=2) :**
- Sélection obligatoire de l'entreprise associée
- Chargement dynamique de la liste des entreprises depuis l'API

**Après inscription :**
- Connexion automatique
- Redirection selon le rôle

**Fichiers liés :** `js/validation.js`, `css/style.css`

---

### 👤 **candidate.html** - Interface candidat
**URL :** `/candidate.html`

**Fonctionnalités :**

**1. Consultation des offres d'emploi**
- Liste de toutes les annonces disponibles
- Affichage par carte avec :
  - Titre du poste
  - Nom de l'entreprise
  - Description courte
  - Localisation
  - Type de contrat

**3. Vue détaillée des offres**
- Clic sur "Learn More" pour voir :
  - Salaire
  - Horaires (schedule)
  - Localisation
  - Type de contrat
  - Description complète

**4. Candidature aux offres**
- Bouton "Apply Now" sur chaque offre
- Formulaire de candidature :
  - Prénom, nom
  - Email, téléphone
  - Message de motivation
- **Pré-remplissage automatique** pour les utilisateurs connectés
- **Candidature possible sans authentification**

**5. Interface utilisateur**
- Boutons Login/Register pour les visiteurs
- Bouton Logout pour les utilisateurs connectés
- Design responsive et moderne

**Fichiers liés :** `js/candidate_script.js`, `css/candidate_style.css`

---

### 🏢 **company.html** - Dashboard entreprise
**URL :** `/company.html`

**Accès réservé :** Type d'utilisateur = 2 (Company)

**Fonctionnalités :**

**1. Sidebar de navigation**
- Dashboard (vue principale)
- Post Job (créer une offre)
- Manage Jobs (gérer les offres)
- Log Out

**2. Dashboard - Vue des candidatures**
- Affichage de toutes les offres de l'entreprise
- Pour chaque offre :
  - Titre, localisation, horaires, type de contrat
  - Nombre de candidatures reçues
  - Liste des candidats avec :
    - Email
    - Nom , Prénom
    - Date de candidature
    - Bouton "View Profile" pour voir les détails

**3. Post Job - Créer une offre**
Modal avec formulaire :
- Titre du poste
- Localisation
- Salaire
- Type de contrat (CDI, CDD, Internship, etc.)
- Description courte
- Description complète
- Horaires (schedule)
- Niveau d'expérience (Entry, Mid, Senior)

**4. Manage Jobs - Gérer les offres**
- Liste de toutes les offres de l'entreprise
- Actions disponibles :
  - **Edit** : Modifier une offre existante
  - **Delete** : Supprimer une offre (avec confirmation)
- Bouton Refresh pour actualiser la liste


**5. View Profile - Détails d'un candidat**
Modal affichant :
- Nom du candidat
- Email
- Téléphone
- Compétences (skills)
- Message de motivation

**Fichiers liés :** `js/company.js`, `css/company.css`

---

### 🔧 **admin.html** - Dashboard administrateur
**URL :** `/admin.html`

**Accès réservé :** Type d'utilisateur = 1 (Admin)

**Fonctionnalités :**

**1. Menu de navigation**
- Advertisements (Annonces)
- Users (Utilisateurs)
- Companies (Entreprises)
- Applications (Candidatures)

**2. Gestion des Annonces (Advertisements)**
- **Affichage :** Tableau avec titre, description, salaire, type, localisation, expérience, entreprise
- **Actions :**
  - Add : Créer une nouvelle annonce (avec sélection de l'entreprise)
  - Edit : Modifier une annonce existante
  - Delete : Supprimer une annonce

**3. Gestion des Utilisateurs (Users)**
- **Affichage :** Tableau avec prénom, nom, email, téléphone, type, compétences, entreprise
- **Actions :**
  - Add : Créer un nouvel utilisateur avec :
    - Choix du type (Admin, Company, Candidate)
    - Compétences (pour Candidate uniquement)
    - Entreprise (pour Company uniquement)
  - Edit : Modifier un utilisateur (avec possibilité de changer le mot de passe)
  - Delete : Supprimer un utilisateur

**4. Gestion des Entreprises (Companies)**
- **Affichage :** Tableau avec nom, adresse, description
- **Actions :**
  - Add : Créer une nouvelle entreprise
  - Edit : Modifier une entreprise
  - Delete : Supprimer une entreprise

**5. Gestion des Candidatures (Applications)**
- **Affichage :** Tableau avec candidat (email), entreprise, date, message
- **Actions :**
  - Add : Créer une nouvelle candidature
  - Edit : Modifier une candidature
  - Delete : Supprimer une candidature

**Modales (popups) :**
- Chaque section dispose de modales pour ajouter/modifier
- Validation automatique des champs
- Pré-remplissage lors de l'édition
- Sélecteurs dynamiques (entreprises, annonces)

**Fichiers liés :** `js/admin.js`, `css/admin.css`

---

## 🔌 Documentation API

L'API REST est accessible sur **http://localhost:3000**

### Authentification

L'API utilise JWT (JSON Web Token). Après connexion, incluez le token dans l'en-tête :

```
Authorization: Bearer <votre_token>
```

### Rôles et Permissions

| Rôle | ID | Accès |
|------|-----|-------|
| Admin | 1 | Accès complet |
| Company | 2 | Gestion entreprises et annonces |
| Candidate | 3 | Consultation et candidatures |

### Endpoints principaux

#### Authentification
- `POST /` - Connexion (retourne le token JWT)

#### Utilisateurs
- `GET /users` - Liste (Admin uniquement)
- `GET /users/email/` - Liste des emails (Public)
- `GET /users/:id` - Détails (Authentifié)
- `POST /users` - Inscription (Public)
- `PATCH /users/:id` - Modification (Authentifié)
- `PATCH /users/password/:id` - Changer mot de passe (Authentifié)
- `DELETE /users/:id` - Suppression (Authentifié)

#### Entreprises
- `GET /companies` - Liste (Public)
- `GET /companies/:id` - Détails (Authentifié)
- `POST /companies` - Créer (Admin)
- `PATCH /companies/:id` - Modifier (Admin, Company)
- `DELETE /companies/:id` - Supprimer (Admin)

#### Annonces
- `GET /ads` - Liste (Public)
- `GET /ads/:id` - Détails (Public)
- `GET /ads/company/:company_id` - Par entreprise (Public)
- `POST /ads` - Créer (Company)
- `POST /ads/admin/` - Créer (Admin)
- `PATCH /ads/:id` - Modifier (Company)
- `PATCH /ads/admin/:id` - Modifier (Admin)
- `DELETE /ads/:id` - Supprimer (Admin, Company)

#### Candidatures
- `GET /job_applications` - Liste (Authentifié)
- `GET /job_applications/:id` - Détails (Authentifié)
- `GET /job_applications/ad/:ad_id` - Par annonce (Admin, Company)
- `GET /job_applications/people/:people_id` - Par candidat (Admin, Candidate)
- `POST /job_applications` - Créer (Public)
- `PATCH /job_applications/:id` - Modifier (Candidate)
- `PATCH /job_applications/admin/:id` - Modifier (Admin)
- `DELETE /job_applications/:id` - Supprimer (Admin, Candidate)

### Exemples de requêtes

**Connexion**
```bash
curl -X POST http://localhost:3000/ \
  -H "Content-Type: application/json" \
  -d '{"email":"admintest@example.com","password":"admin"}'
```

**Obtenir toutes les annonces**
```bash
curl http://localhost:3000/ads
```

**Créer une candidature**
```bash
curl -X POST http://localhost:3000/job_applications \
  -H "Content-Type: application/json" \
  -d '{
    "email":"john@example.com",
    "first_name":"John",
    "last_name":"Doe",
    "ad_id":1,
    "message":"Je suis très intéressé..."
  }'
```

---

## 🛠️ Technologies utilisées

### Backend
- **Node.js** - Runtime JavaScript
- **Express** 5.1.0 - Framework web
- **MySQL2** 3.15.1 - Driver MySQL avec support Promise
- **bcrypt** 6.0.0 - Hachage des mots de passe
- **jsonwebtoken** 9.0.2 - Authentification JWT
- **dotenv** 17.2.3 - Variables d'environnement
- **cors** - Gestion CORS

### Frontend
- **HTML5** - Structure
- **CSS3** - Styles personnalisés
- **JavaScript (Vanilla)** - Logique client
- **Fetch API** - Requêtes HTTP

### Base de données
- **MySQL** 5.7+ - Base de données relationnelle

---

## 📝 Notes importantes

### Sécurité
- Les mots de passe sont hashés avec bcrypt (10 rounds)
- Token JWT expire après 1 heure (3600000ms)
- Validation des rôles via middleware sur toutes les routes protégées

### Contraintes de la base de données
- Un utilisateur de type "Company" doit avoir un `company_id`
- Un utilisateur de type "Candidate" doit avoir des `skills` (JSON)
- Les emails sont uniques

### LocalStorage utilisé
- `user` - Objet utilisateur complet
- `accessToken` - Token JWT
- `role` - Type d'utilisateur (1, 2 ou 3)
- `company_id` - ID entreprise (pour type=2)
- `first_name`, `last_name`, `email`, `phone` - Infos utilisateur

---

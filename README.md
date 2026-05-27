# 🛒 Kaino v0.06 — Liste de Courses Collaborative, Offline-First & Auto-Adaptative



Bienvenue sur **Kaino**, une plateforme collaborative de gestion de listes de courses de classe entreprise, conçue avec une philosophie **Local-First / Offline-First** et propulsée par un moteur de thèmes dynamiques s'adaptant à l'ergonomie native de votre appareil.

Kaino élimine les comptes à mot de passe traditionnels au profit de clés de sécurité cryptographiques **Passkeys (WebAuthn)**, garantissant une sécurité à toute épreuve tout en simplifiant la connexion. Grâce à l'intégration d'**Electric SQL** et de **PostgreSQL**, toutes vos modifications sont instantanées, enregistrées localement et synchronisées en temps réel dès que le réseau est disponible.

---

## ✨ Fonctionnalités Majeures

### 1. 🔌 Offline-First & Synchronisation Temps Réel (Electric SQL)
* **Base de données réactive locale** : L'application écrit immédiatement dans une base de données embarquée dans le navigateur (IndexedDB) pour une latence de 0ms.
* **Synchronisation bidirectionnelle** : Electric SQL gère la réplication active en arrière-plan entre le client local et l'instance PostgreSQL centrale.
* **Résilience réseau** : Ajoutez, cochez ou supprimez des articles en plein sous-sol de supermarché sans réseau. L'application synchronisera automatiquement les conflits de manière transparente lors de la reconnexion.

### 2. 🔑 Authentification Cryptographique par Passkeys
* **Adieu les mots de passe** : Finie la vulnérabilité aux fuites de données ou aux attaques par force brute.
* **WebAuthn Native** : Inscription et connexion en 1 clic via le capteur biométrique de votre appareil (FaceID, TouchID, Windows Hello, clé USB de sécurité).
* **Identité Décentralisée** : La clé cryptographique générée représente de manière unique et sécurisée le compte de l'utilisateur (son ID unique).

### 3. 🎨 Moteur de Thèmes Auto-Adaptatifs (Device-Adaptive Engine)
Un script ultra-léger et bloquant s'exécute dans le `<head>` avant le premier rendu (*First Paint*) pour identifier votre appareil et injecter la classe de style adéquate sans aucun effet de scintillement (*Flash of Unstyled Content - FOUC*).

Chaque thème applique une ergonomie sur mesure :
* **📱 Thème iOS (Apple Notes Style)** : Typographie SF Pro, angles de `12px` continus, en-tête pliable au défilement, barre de saisie flottante en bas en verre dépoli (`backdrop-blur`), cases à cocher bleu système animées par ressort (*spring*).
* **📱 Thème Samsung One UI (Ergonomie à 1 Main)** : Typographie Samsung One, angles extrêmement arrondis de `24px` sur les cartes, règle des 1/3 supérieure allouée au titre et statistiques (laissant le haut de l'écran dégagé) et 2/3 inférieurs pour l'interaction à portée de pouce.
* **🤖 Thème Android Pixel (Material Modern)** : Typographie Product Sans, angles gélules de `16px`, palette pastel, bouton d'action flottant (FAB) dans le coin inférieur droit et effet d'onde tactile animée (*ripple effect*).
* **💻 Thème Générique (OLED Linear Desktop)** : Typographie monospace JetBrains Mono, design technique angulaire rigide de `6px`, bordures fines de `1px`, sans transitions superflues (instantanéité).

### 4. 🧠 Analyse de Langage Naturel (NLP Parser)
* Saisissez simplement un produit comme `"3 boîtes de tomates à 1.49€ pour Marie"`.
* Le parser intelligent extrait automatiquement les attributs : **Nom** (`tomates`), **Quantité** (`3`), **Unité** (`boîtes`), **Prix** (`1.49`) et **Assignation** (`Marie`).

### 5. 🌍 Système de Traduction Intelligent (i18n)
* **Détection du téléphone** : L'application détecte automatiquement la langue du téléphone ou du navigateur de l'utilisateur.
* **Cinq langues majeures** : Traduction intégrale en **Français (`fr`)**, **Anglais (`en`)**, **Espagnol (`es`)**, **Allemand (`de`)**, et **Italien (`it`)**.
* **Configuration administrateur** : L'administrateur système peut configurer une langue par défaut pour le serveur depuis son panel. L'application basculera sur cette langue si le téléphone de l'utilisateur utilise une langue non prise en charge.

---

## 📊 Matrice des Jetons de Design (Design Tokens)

| Attribut | Thème iOS (Apple) | Thème Samsung (One UI) | Thème Android (Pixel) | Thème Générique (OLED Desktop) |
| :--- | :--- | :--- | :--- | :--- |
| **Famille de police** | SF Pro, -apple-system | Samsung One, Inter | Product Sans, Roboto | JetBrains Mono, Geist |
| **Arrondis (Radius)**| `12px` (légèrement continu) | `24px` (très prononcé/cartes) | `16px` (moyen/gélules) | `6px` (angulaire/technique) |
| **Effets visuels** | Flou de verre (`backdrop-blur`) | Arrière-plans semi-opaques unis | Ombres douces, pastels | Bordures ultra-fines de `1px` |
| **Zone d'interaction**| Flottante, centrée en bas | Bas de l'écran (accessibilité) | Grille aérée + FAB | Barre d'entrée centrale fixe |
| **Animations** | Glissement fluide (Ressort) | Échelle douce (Scale) | Ondulation (Ripple) | Instantané (Fade/Cut) |

---

## 🛠️ Architecture Technique & Technologies

* **Framework principal** : [Next.js 14](https://nextjs.org/) (App Router, Route Handlers, Standalone Production Build).
* **Base de données principale** : [PostgreSQL 15](https://www.postgresql.org/) (moteur relationnel persistant).
* **Moteur Local-First** : [Electric SQL 0.11](https://electric-sql.com/) (gestionnaire de réplication active et agent de synchronisation logique réactif).
* **Base locale navigateur** : [IndexedDB / Wa-SQLite](https://github.com/rhashimoto/wa-sqlite) (moteur SQLite virtualisé Wasm).
* **Styling & UI** : [Tailwind CSS](https://tailwindcss.com/) & [Shadcn UI](https://ui.shadcn.com/) (icônes Lucide-React, transitions GPU-accelerated).
* **PWA Engine** : [next-pwa](https://github.com/shadowwalker/next-pwa) (Service Workers, Offline Manifest).
* **Sécurité & Authentification** : [SimpleWebAuthn](https://simplewebauthn.dev/) (moteur de gestion des credentials et clés d'authentification Passkeys).

---

## 🚀 Démarrage Rapide (Docker Compose)

Kaino est entièrement conteneurisé. La configuration Docker Compose gère automatiquement le démarrage ordonné de PostgreSQL, d'Electric SQL et de l'application Next.js.

### 📋 Prérequis
* [Docker Desktop](https://www.docker.com/products/docker-desktop/) et **Docker Compose** installés sur votre machine de développement.

### 🏃 Lancement de la stack applicative
1. Clonez ce dépôt sur votre machine locale.
2. Copiez le fichier d'exemple des variables d'environnement :
   ```bash
   cp .env.local.example .env.local
   ```
3. Lancez la stack entière en tâche de fond :
   ```bash
   docker compose up --build -d
   ```
4. Une fois les conteneurs démarrés, l'application est disponible sur :
   * **Application Web** : [http://localhost:3000](http://localhost:3000)
   * **Console d'administration Electric SQL** : [http://localhost:5133](http://localhost:5133)
   * **Port PostgreSQL** : `5432` (avec accès proxy proxy_password)

---

## 💾 Persistance & Portabilité inter-machines (Docker Volumes)

Par défaut, Kaino utilise des volumes Docker nommés pour stocker vos données de manière isolée et performante :
* **PostgreSQL** : Les données de vos listes sont stockées dans le volume `postgres-data`.
* **Electric SQL** : Les conteneurs Electric SQL sont stateless par défaut.

Si vous souhaitez arrêter votre stack sans perdre vos données, exécutez simplement `docker compose down`. Les volumes nommés seront conservés en toute sécurité par Docker et automatiquement re-montés lors du prochain `docker compose up`.

### 📂 Mode Ultra-Portable (Sauvegarde et déplacement physique inter-PC)

Si vous souhaitez stocker vos bases de données **directement à l'intérieur du dossier de votre projet** pour pouvoir copier/coller ou zipper le dossier, le déplacer sur une clé USB (ou un autre ordinateur) et le relancer instantanément avec l'intégralité de vos listes et de vos comptes sans rien perdre, suivez ce guide :

#### 1. Configuration locale de `docker-compose.yml`
Modifiez les chemins de volumes dans votre `docker-compose.yml` local pour pointer vers des dossiers relatifs (bind mounts) au lieu de volumes nommés gérés par Docker, et activez le répertoire persistant d'Electric :

```yaml
services:
  postgres:
    # ...
    volumes:
      - ./db/postgres-data:/var/lib/postgresql/data # <-- Dossier local dans le projet

  electric:
    # ...
    environment:
      # ...
      - ELECTRIC_STORAGE_DIR=/app/persistent # <-- Indique à Electric d'écrire sur le disque
    volumes:
      - ./db/electric-data:/app/persistent # <-- Dossier local dans le projet
```

*(Note : Retirez ensuite le bloc `volumes:` déclarant `postgres-data` tout en bas de votre fichier `docker-compose.yml`)*

#### 2. Sécurisation Git
Pour éviter que vos bases de données privées ne soient poussées par accident sur votre dépôt GitHub public, ajoutez ces deux entrées dans votre fichier `.gitignore` local :
```text
db/postgres-data/
db/electric-data/
```

#### 3. Déplacement du projet
Désormais, tout votre historique applicatif est stocké dans le dossier `db/` du projet. Pour migrer Kaino sur un autre ordinateur :
1. Arrêtez la stack : `docker compose down`
2. Compressez ou copiez le dossier `KaiNo` sur votre clé USB (les dossiers `db/postgres-data` et `db/electric-data` y seront inclus).
3. Collez le dossier sur l'autre PC et lancez : `docker compose up -d`
4. L'application démarrera instantanément avec toutes vos données intactes !

---

## 🔧 Variables d'Environnement

Le fichier `.env.local` permet de configurer l'application :

```ini
# Port d'accès à l'instance locale ou distante d'Electric SQL (moteur de réplication)
NEXT_PUBLIC_ELECTRIC_URL=http://localhost:5133

# URL de connexion directe à PostgreSQL (utilisée par Next.js pour l'admin et l'i18n de secours)
DATABASE_URL=postgresql://postgres:proxy_password@postgres:5432/kaino
```

---

## 📂 Structure du Projet

```text
├── db/                       # Migrations initiales PostgreSQL et Electric SQL
├── public/                   # Fichiers statiques, icônes PWA et Manifeste mobile
├── src/
│   ├── app/                  # Routes et pages Next.js (App Router)
│   │   ├── admin/            # Dashboard d'administration (Paramètres serveur)
│   │   ├── api/              # Points d'accès d'API (Settings, Passkeys Auth, NLP Parser)
│   │   ├── lists/            # Création, édition et vue détaillée adaptative des listes
│   │   ├── setup-admin/      # Page de création du premier compte administrateur
│   │   ├── layout.tsx        # Fichier racine avec injection du script anti-FOUC
│   │   └── page.tsx          # Page d'accueil / connexion par Passkey
│   ├── components/           # Composants réutilisables (shadcn, animations, swipe)
│   ├── hooks/                # Custom hooks (suggestions)
│   ├── lib/                  # Services et configuration de base
│   │   ├── db.ts             # Couche de compatibilité Dexie-like sur Electric SQL
│   │   ├── electric.ts       # Initialisation du client de synchronisation
│   │   ├── i18n.ts           # Dictionnaire et logique multilingue
│   │   ├── parser.ts         # Moteur NLP d'analyse des phrases d'articles
│   │   ├── settings-db.ts    # Accès direct Postgres pour les configurations globales
│   │   └── useTheme.ts       # Hook réactif de liaison du thème d'affichage
├── Dockerfile                # Recette de build multi-stage optimisée pour Next.js Standalone
├── docker-compose.yml        # Orchestration PostgreSQL, Electric SQL & Kaino Web App
└── package.json              # Dépendances Node.js et scripts de build
```

---

## 🧪 Guide de Test en Développement

Pour simuler les différents types de terminaux (iOS, Samsung, Android Pixel, Ordinateur) et tester les adaptations d'interfaces de Kaino :

1. Ouvrez l'application [http://localhost:3000](http://localhost:3000).
2. Lancez l'inspecteur web de votre navigateur (**F12**) et activez la simulation mobile.
3. Modifiez le **User Agent** dans les conditions réseau de votre console de développement :
   * **iOS (Apple)** : Saisissez un agent contenant `iPhone` ou `iPad`.
   * **Samsung One UI** : Saisissez un agent contenant `Samsung` ou `SamsungBrowser`.
   * **Android Pixel** : Saisissez un agent contenant `Android` (sans mention de Samsung).
   * **Bureau (Desktop)** : Utilisez l'agent par défaut de votre système (sans mention de périphérique tactile ou mobile).
4. Actualisez la page. L'application appliquera instantanément le squelette structurel, les polices, les angles et les courbes d'animations de transition de la plateforme ciblée sans aucun clignotement visuel.

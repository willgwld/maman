# MamanZen 🌸 — Plateforme Digitale d'Accompagnement de la Maternité

MamanZen est une application PWA (Progressive Web App) complète et bienveillante, conçue pour accompagner les futures mères à chaque étape de leur grossesse : suivi quotidien de santé, soutien en santé mentale, nutrition adaptée, recommandations IA sur-mesure et vidéos thématiques.

---

## 🚀 Fonctionnalités Clés

- **🌸 Suivi de Santé Quotidien & Mode Hors-Ligne (PWA)** : Journal des symptômes, niveau de fatigue, nausées et humeur, fonctionnant même sans connexion internet grâce au Service Worker et à la file d'attente de synchronisation en arrière-plan.
- **🧠 Santé Mentale & Relaxation** : Exercices de cohérence cardiaque guidés, exercices de sophrologie et suivi des émotions.
- **🥗 Nutrition & Alimentation Prénatale** : Recettes équilibrées par trimestre, suivi de l'hydratation quotidienne et aliments autorisés / à éviter.
- **🤖 Assistant & Conseils IA (MamanZen IA)** : Recommandations personnalisées basées sur les symptômes enregistrés et assistant virtuel bienveillant 24/7.
- **🎥 Vidéos & Audios YouTube** : Sélection de cours de yoga prénatal, exercices de respiration et méditations guidées.
- **📋 Checklists & Valise de Maternité** : Organisation des rendez-vous médicaux et valise de naissance interactive.
- **🔐 Authentification Sûre (Supabase Auth)** : Gestion de compte par Supabase Auth avec confirmation d'e-mail, OAuth Google et profils synchronisés.
- **🛡️ Espace d'Administration Sécurisé** : Dashboard de modération et de gestion des utilisatrices protégé par rôle Supabase (`role = 'admin'`).

---

## 🛠️ Stack Technique

- **Frontend** : React 18, TypeScript, Vite
- **Styling & UI** : Tailwind CSS, Lucide React (Icônes), Motion (Animations)
- **Base de Données & Auth** : Supabase (Auth JWT & PostgreSQL)
- **Offline & PWA** : Service Worker (`sw.js`), IndexedDB/LocalStorage Queue, Web Push Notifications
- **Déploiement** : Vercel / Cloud Run

---

## 💻 Installation et Lancement Local

### 1. Prérequis
- Node.js (v18+)
- npm ou yarn

### 2. Cloner le projet
```bash
git clone https://github.com/willgwld/maman.git
cd maman
```

### 3. Installer les dépendances
```bash
npm install
```

### 4. Configurer les variables d'environnement
Créez un fichier `.env` à la racine en dupliquant `.env.example` :
```bash
cp .env.example .env
```
Renseignez vos identifiants Supabase :
```env
VITE_SUPABASE_URL=https://votre-projet.supabase.co
VITE_SUPABASE_ANON_KEY=votre_cle_anon_public_supabase_ici
```

### 5. Démarrer le serveur de développement
```bash
npm run dev
```
L'application est accessible sur `http://localhost:3000`.

---

## 🌐 Déploiement sur Vercel

1. Connectez votre dépôt GitHub `willgwld/maman` à **Vercel**.
2. Dans le panneau de configuration de Vercel (**Project Settings > Environment Variables**), ajoutez :
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `GEMINI_API_KEY` (optionnel)
3. L'instruction de build par défaut `npm run build` génère les fichiers de production dans `dist/`.
4. Vercel gère le routage des Single Page Applications grâce à la configuration `vercel.json` à la racine.

---

## 📁 Structure du Projet

```
├── public/                 # Fichiers statiques, icônes & Service Worker (sw.js)
├── components/             # Composants partagés (AuthProvider, Disclaimer, Lock)
├── src/
│   ├── components/         # Composants UI (PWAInstallBanner, PushNotificationManager)
│   ├── lib/                # Services (Supabase client, Sync Queue, Push, Premium Context)
│   ├── pages/              # Pages de l'application (Dashboard, Tracker, Mental, Nutrition...)
│   ├── App.tsx             # Routage React Router & AppLayout avec Navigation
│   ├── main.tsx            # Point d'entrée React & enregistrement Service Worker
│   └── index.css           # Configuration Tailwind CSS & Thèmes
├── .env.example            # Exemple sécurisé de variables d'environnement
├── supabase-security-rls.sql # Script SQL des politiques de sécurité Supabase RLS
├── vercel.json             # Configuration de déploiement Vercel
└── README.md               # Documentation du projet
```

---

## 🔒 Sécurité & Politiques RLS (Row Level Security)

Les données médicales et personnelles sont protégées par les politiques RLS de Supabase. Consultez le fichier `supabase-security-rls.sql` pour exécuter la configuration RLS recommandée sur votre projet Supabase :
- Chaque utilisateur accède uniquement à ses propres données (`user_id = auth.uid()`).
- L'administration exige un rôle `admin` vérifié sur la table `profiles` ou dans `auth.users.raw_user_meta_data`.

---

## ⚠️ Avertissement Médical

MamanZen propose des outils d'information et d'accompagnement au bien-être. L'application ne remplace en aucun cas un avis, un diagnostic ou un suivi médical professionnel assuré par une sage-femme, un gynécologue ou un médecin.

---

## 📄 Licence & Contribution

Projet développé avec passion par Wilfried GWLD pour l'accompagnement des mères et des familles.
`License: MIT`

# Beninease — Next.js + Supabase Auth (rôles)

Application **Next.js (App Router)** séparée du site marketing Vite (`../beninease2`).

## Prérequis

- Un projet Supabase
- Variables dans `.env.local` (copier `.env.local.example`)

## Base de données

1. Exécuter `supabase/migrations/001_users_role_and_trigger.sql` dans **SQL Editor** Supabase.
2. Vérifier **Authentication → URL configuration** : ajouter `http://localhost:3000/auth/callback` (et ton domaine prod).

Le trigger crée une ligne `public.users` à chaque inscription avec `role = candidate` et `is_approved = false`.

Pour tester **jury** / **admin**, mets à jour la ligne dans `public.users` (via SQL ou une future UI admin) :

- `role = 'jury'`, `is_approved = false` → `/pending-approval`
- `role = 'jury'`, `is_approved = true` → `/jury/dashboard`
- `role = 'admin'` → `/admin/dashboard`
- `role = 'candidate'` → `/profile/edit`

## Démarrage

```bash
cd beninease-next
npm install
npm run dev
```

Ouvre `http://localhost:3000`.

## Fichiers clés

- `middleware.ts` : garde les routes `/admin/*`, `/jury/*`, `/profile/*`, `/pending-approval`
- `src/lib/auth/get-user-role.ts` : lecture `public.users` côté serveur
- `src/lib/auth/routes.ts` : redirection “home” selon rôle

# Déploiement Nebula

## Architecture de production

```
Vercel (frontend)  →  Railway (backend)  →  Railway PostgreSQL
```

---

## 1. Backend — Railway

### Prérequis
- Compte Railway (railway.app)
- CLI Railway : `npm install -g @railway/cli`

### Étapes

```bash
# 1. Se connecter
railway login

# 2. Créer le projet depuis le dossier backend
cd backend
railway init

# 3. Ajouter PostgreSQL
railway add --plugin postgresql

# 4. Déployer
railway up
```

### Variables d'environnement Railway
Dans le dashboard Railway → Settings → Variables :

| Variable | Valeur |
|----------|--------|
| `DATABASE_URL` | Automatique via `${{Postgres.DATABASE_URL}}` |
| `JWT_SECRET` | `openssl rand -hex 32` |
| `JWT_REFRESH_SECRET` | `openssl rand -hex 32` |
| `NODE_ENV` | `production` |
| `ALLOWED_ORIGIN` | `https://ton-app.vercel.app` |

### Seeder le contenu
```bash
# Depuis le dashboard Railway → Shell, ou via CLI :
railway run bun run ../scripts/sync-content.ts
```

---

## 2. Frontend — Vercel

### Prérequis
- Compte Vercel (vercel.com)
- CLI Vercel : `npm install -g vercel`

### Étapes

```bash
cd frontend
vercel

# Framework preset: Vite
# Build command: bun run build
# Output directory: dist
```

### Variables d'environnement Vercel
Dans le dashboard Vercel → Settings → Environment Variables :

| Variable | Valeur |
|----------|--------|
| `VITE_API_URL` | `https://ton-backend.railway.app` |

> **Important** : laisser `VITE_API_URL` vide en développement — le proxy Vite gère les requêtes.

---

## 3. Checklist avant mise en ligne

- [ ] `JWT_SECRET` et `JWT_REFRESH_SECRET` sont des secrets aléatoires (≥ 32 chars)
- [ ] `ALLOWED_ORIGIN` sur Railway pointe vers le domaine Vercel exact
- [ ] `VITE_API_URL` sur Vercel pointe vers le backend Railway
- [ ] Les migrations ont tourné (`prisma migrate deploy` dans le CMD Docker)
- [ ] Le contenu est seedé (`sync-content`)
- [ ] Lighthouse PWA score ≥ 90

---

## 4. Domaine personnalisé (optionnel)

### Vercel
Dashboard → Domains → Add → `nebula.app`

### Railway
Dashboard → Settings → Networking → Custom domain → `api.nebula.app`

Mettre à jour `ALLOWED_ORIGIN` sur Railway : `https://nebula.app`
Mettre à jour `VITE_API_URL` sur Vercel : `https://api.nebula.app`

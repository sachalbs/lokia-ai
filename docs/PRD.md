# PRD — Lokia
## Assistant IA Local pour PME

**Version:** 2.0
**Date:** Février 2026
**Auteur:** Sacha Le Breton

---

## 1. Résumé exécutif

### Vision
Lokia est un assistant IA premium pour les PME françaises, combinant la puissance d'un LLM local (100% confidentiel) avec l'option d'une API cloud performante. L'assistant répond aux questions à partir des documents internes de l'entreprise avec une interface de niveau professionnel.

### Proposition de valeur
> "Votre IA d'entreprise — locale ou cloud, toujours confidentielle, toujours professionnelle."

### Cible
- PME françaises 10-100 salariés
- Cabinets comptables, juridiques, conseil
- PME industrielles et services
- Utilisateurs non techniques

### Pricing
- 199€ HT/mois
- 10 utilisateurs inclus
- 1 espace entreprise isolé
- Support humain

### Identité visuelle
- **Mascotte:** Ornithorynque
- **Thème local:** Mode sombre (sobre, premium)
- **Thème API:** Bleu clair (lumineux, professionnel)

---

## 2. Exigences Design

### 2.1 Philosophie Design

| Critère | Exigence |
|---------|----------|
| Niveau | Premium — équivalent Claude, ChatGPT, Gemini |
| Ton de l'IA | Professionnel, sobre, **aucun emoji** |
| Interface | Moderne, épurée, animations subtiles |
| Typographie | Clean, lisible, hiérarchie claire |
| Objectif | Effet "waw" dès la première seconde |

### 2.2 Inspirations
- **Claude (Anthropic)** — Épuré, élégant
- **Linear** — Moderne, animations fluides
- **Vercel** — Dark mode premium

### 2.3 Thèmes

**Mode Local (Ollama/Mistral Nemo)**
- Palette sombre
- Accents subtils
- Indicateur "100% local" visible

**Mode API (Mistral Large)**
- Palette bleu clair
- Ambiance lumineuse et professionnelle
- Indicateur "Cloud sécurisé" visible

---

## 3. Architecture technique

### 3.1 Double mode LLM

| Mode | Moteur | Avantage | Thème |
|------|--------|----------|-------|
| **Local** | Ollama + Mistral Nemo 12B | 100% confidentiel, aucune donnée sortante | Sombre |
| **API** | Mistral Large (API) | Plus rapide, plus puissant | Bleu clair |

L'utilisateur peut basculer entre les deux modes selon ses besoins.

### 3.2 Stack technique

| Couche | Technologie | Justification |
|--------|-------------|---------------|
| **Frontend** | Next.js 14 + TypeScript + Tailwind | Performance, SSR, DX |
| **Backend API** | Python 3.11 + FastAPI | Standard ML/LLM, async |
| **Base de données** | PostgreSQL 16 | Robuste, local |
| **Vector Store** | FAISS | Rapide, pas de dépendance externe |
| **LLM Local** | Ollama + Mistral Nemo 12B | Local, français natif |
| **LLM API** | Mistral Large | Performant, français |
| **Embeddings** | sentence-transformers (MiniLM) | Léger, multilingue |
| **Auth** | JWT + bcrypt + Google OAuth | Flexible, sécurisé |
| **Hébergement** | OVH VPS-3 (8 vCores, 24 Go RAM) | France, ~12€/mois |

### 3.3 Schéma d'architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                       VPS OVH FRANCE                            │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                      FRONTEND                             │  │
│  │                   Next.js + TypeScript                    │  │
│  │                                                           │  │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌───────────┐ │  │
│  │  │  Login   │  │Documents │  │   Chat   │  │   Admin   │ │  │
│  │  │  Google  │  │  Upload  │  │ Streaming│  │ Dashboard │ │  │
│  │  └──────────┘  └──────────┘  └──────────┘  └───────────┘ │  │
│  └─────────────────────────┬─────────────────────────────────┘  │
│                            │ HTTP/REST + WebSocket              │
│  ┌─────────────────────────▼─────────────────────────────────┐  │
│  │                      BACKEND API                          │  │
│  │                    Python + FastAPI                       │  │
│  │                                                           │  │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌───────────┐ │  │
│  │  │   Auth   │  │ Document │  │   RAG    │  │   Chat    │ │  │
│  │  │  + OAuth │  │ Pipeline │  │  Search  │  │ Streaming │ │  │
│  │  └────┬─────┘  └────┬─────┘  └────┬─────┘  └─────┬─────┘ │  │
│  └───────┼─────────────┼─────────────┼──────────────┼───────┘  │
│          │             │             │              │          │
│          ▼             ▼             ▼              ▼          │
│  ┌─────────────┐ ┌───────────┐ ┌───────────┐ ┌─────────────┐   │
│  │ PostgreSQL  │ │ Filesystem│ │   FAISS   │ │   Ollama    │   │
│  │  (Users,    │ │   (Docs)  │ │ (Vectors) │ │  (Mistral   │   │
│  │   Convos)   │ │           │ │           │ │    Nemo)    │   │
│  └─────────────┘ └───────────┘ └───────────┘ └─────────────┘   │
│                                                     │          │
│                                              ┌──────▼────────┐ │
│                                              │ Mistral API   │ │
│                                              │ (optionnel)   │ │
│                                              └───────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

---

## 4. Fonctionnalités MVP

### 4.1 Authentification

| Fonctionnalité | Détail |
|----------------|--------|
| Login email/password | Classique avec validation |
| Google OAuth | Connexion rapide |
| Reset password | Email avec lien sécurisé |
| JWT | Tokens avec expiration 24h |

### 4.2 Gestion des tenants

- **Super-admin interface** pour créer/gérer les entreprises clientes
- Isolation stricte des données entre tenants
- Configuration par tenant (limites, mode LLM par défaut)

### 4.3 Gestion documentaire

**Documents partagés (niveau tenant)**
- Tous les users peuvent uploader
- Visibles par tous les users du tenant
- Indexés dans le RAG commun

**Documents personnels (niveau user)**
- Chaque user peut avoir ses docs privés
- Indexés dans un RAG personnel
- Invisibles aux autres users

**Formats supportés**
- PDF natif
- PDF scanné (OCR automatique via Tesseract)
- DOCX

**Upload**
- Onglet "Documents" avec interface dédiée
- Drag & drop dans une conversation (ajout automatique au RAG)

### 4.4 Chat RAG

**Fonctionnement**
1. User pose une question
2. RAG cherche dans : docs partagés + docs perso du user
3. LLM génère une réponse basée sur le contexte
4. Sources citées avec nom du fichier et page

**Streaming**
- Réponses en temps réel (mot par mot)
- Indicateur de chargement élégant

**Conversations**
- Privées par user
- Historique conservé
- Possibilité de renommer/supprimer

### 4.5 Double mode LLM

| Mode | Description | Quand l'utiliser |
|------|-------------|------------------|
| **Local** | Mistral Nemo via Ollama | Données ultra-sensibles |
| **API** | Mistral Large | Réponses plus rapides/qualitatives |

Switch visible dans l'interface avec changement de thème.

### 4.6 Dashboard Admin

- Statistiques d'usage (documents, conversations, users)
- Gestion des utilisateurs (CRUD)
- Vue sur le stockage utilisé

---

## 5. Modèle de données

### 5.1 Structure multi-tenant

```
TENANT (Entreprise)
│
├── 📁 DOCUMENTS PARTAGÉS
│   └── Accessibles par tous les users
│
└── 👤 USERS
    ├── User 1
    │   ├── 📁 Documents personnels
    │   └── 💬 Conversations privées
    │
    └── User 2
        ├── 📁 Documents personnels
        └── 💬 Conversations privées
```

### 5.2 Schéma PostgreSQL

```sql
-- =====================
-- TENANTS (Entreprises)
-- =====================
CREATE TABLE tenants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    plan VARCHAR(50) DEFAULT 'standard',
    max_users INT DEFAULT 10,
    max_documents INT DEFAULT 500,
    default_llm_mode VARCHAR(20) DEFAULT 'local',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- =====================
-- USERS
-- =====================
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255),
    google_id VARCHAR(255),
    name VARCHAR(255),
    role VARCHAR(50) DEFAULT 'user',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    last_login TIMESTAMP,
    UNIQUE(tenant_id, email)
);

-- =====================
-- SUPER ADMINS
-- =====================
CREATE TABLE super_admins (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW()
);

-- =====================
-- DOCUMENTS
-- =====================
CREATE TABLE documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    is_shared BOOLEAN DEFAULT false,
    filename VARCHAR(255) NOT NULL,
    original_filename VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_size INT,
    file_type VARCHAR(50),
    status VARCHAR(50) DEFAULT 'pending',
    chunk_count INT DEFAULT 0,
    uploaded_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW(),
    processed_at TIMESTAMP
);

-- =====================
-- DOCUMENT CHUNKS
-- =====================
CREATE TABLE document_chunks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    document_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
    chunk_index INT NOT NULL,
    content TEXT NOT NULL,
    page_number INT,
    metadata JSONB,
    created_at TIMESTAMP DEFAULT NOW()
);

-- =====================
-- CONVERSATIONS
-- =====================
CREATE TABLE conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255),
    llm_mode VARCHAR(20) DEFAULT 'local',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- =====================
-- MESSAGES
-- =====================
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    role VARCHAR(20) NOT NULL,
    content TEXT NOT NULL,
    sources JSONB,
    tokens_used INT,
    response_time_ms INT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- =====================
-- PASSWORD RESET TOKENS
-- =====================
CREATE TABLE password_reset_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token VARCHAR(255) UNIQUE NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    used BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW()
);

-- =====================
-- INDEXES
-- =====================
CREATE INDEX idx_users_tenant ON users(tenant_id);
CREATE INDEX idx_users_google_id ON users(google_id);
CREATE INDEX idx_documents_tenant ON documents(tenant_id);
CREATE INDEX idx_documents_user ON documents(user_id);
CREATE INDEX idx_documents_shared ON documents(tenant_id, is_shared);
CREATE INDEX idx_chunks_tenant ON document_chunks(tenant_id);
CREATE INDEX idx_chunks_document ON document_chunks(document_id);
CREATE INDEX idx_conversations_tenant ON conversations(tenant_id);
CREATE INDEX idx_conversations_user ON conversations(user_id);
CREATE INDEX idx_messages_conversation ON messages(conversation_id);
```

### 5.3 Stockage des embeddings (FAISS)

```
/data/
  /embeddings/
    /{tenant_id}/
      /shared/
        index.faiss
        metadata.json
      /users/
        /{user_id}/
          index.faiss
          metadata.json
```

---

## 6. API Backend

### 6.1 Structure du projet

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py
│   ├── config.py
│   ├── database.py
│   │
│   ├── models/
│   │   ├── __init__.py
│   │   ├── tenant.py
│   │   ├── user.py
│   │   ├── document.py
│   │   ├── conversation.py
│   │   └── message.py
│   │
│   ├── schemas/
│   │   ├── __init__.py
│   │   ├── auth.py
│   │   ├── document.py
│   │   ├── chat.py
│   │   └── admin.py
│   │
│   ├── api/
│   │   ├── __init__.py
│   │   ├── auth.py
│   │   ├── documents.py
│   │   ├── chat.py
│   │   ├── admin.py
│   │   └── super_admin.py
│   │
│   ├── services/
│   │   ├── __init__.py
│   │   ├── auth_service.py
│   │   ├── document_service.py
│   │   ├── rag_service.py
│   │   ├── llm_service.py
│   │   └── embedding_service.py
│   │
│   └── utils/
│       ├── __init__.py
│       ├── security.py
│       ├── file_utils.py
│       ├── ocr.py
│       └── chunking.py
│
├── requirements.txt
├── Dockerfile
└── docker-compose.yml
```

### 6.2 Endpoints API

#### Auth
```
POST   /api/auth/login              # Email/password
POST   /api/auth/google             # Google OAuth
POST   /api/auth/forgot-password    # Demande reset
POST   /api/auth/reset-password     # Reset avec token
GET    /api/auth/me                 # User courant
```

#### Documents
```
POST   /api/documents/upload        # Upload (shared ou perso)
GET    /api/documents               # Liste docs accessibles
GET    /api/documents/{id}          # Détail d'un doc
DELETE /api/documents/{id}          # Supprimer
GET    /api/documents/{id}/status   # Statut traitement
```

#### Chat
```
POST   /api/chat                    # Envoyer message (streaming)
GET    /api/conversations           # Liste conversations
GET    /api/conversations/{id}      # Détail + messages
PATCH  /api/conversations/{id}      # Renommer
DELETE /api/conversations/{id}      # Supprimer
```

#### Admin (niveau tenant)
```
GET    /api/admin/stats             # Statistiques
GET    /api/admin/users             # Liste users
POST   /api/admin/users             # Créer user
PATCH  /api/admin/users/{id}        # Modifier user
DELETE /api/admin/users/{id}        # Supprimer user
```

#### Super Admin
```
POST   /api/super/login             # Login super admin
GET    /api/super/tenants           # Liste tenants
POST   /api/super/tenants           # Créer tenant
PATCH  /api/super/tenants/{id}      # Modifier tenant
DELETE /api/super/tenants/{id}      # Supprimer tenant
GET    /api/super/stats             # Stats globales
```

---

## 7. Frontend

### 7.1 Structure du projet

```
frontend/
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── login/
│   │   │   └── page.tsx
│   │   ├── chat/
│   │   │   ├── page.tsx
│   │   │   └── [conversationId]/
│   │   │       └── page.tsx
│   │   ├── documents/
│   │   │   └── page.tsx
│   │   ├── admin/
│   │   │   ├── page.tsx
│   │   │   └── users/
│   │   │       └── page.tsx
│   │   └── super-admin/
│   │       ├── page.tsx
│   │       └── tenants/
│   │           └── page.tsx
│   │
│   ├── components/
│   │   ├── ui/
│   │   ├── chat/
│   │   │   ├── ChatInput.tsx
│   │   │   ├── ChatMessage.tsx
│   │   │   ├── ChatSources.tsx
│   │   │   ├── StreamingMessage.tsx
│   │   │   └── ConversationList.tsx
│   │   ├── documents/
│   │   │   ├── UploadDropzone.tsx
│   │   │   ├── DocumentList.tsx
│   │   │   └── DocumentStatus.tsx
│   │   ├── layout/
│   │   │   ├── Sidebar.tsx
│   │   │   ├── Header.tsx
│   │   │   ├── ThemeToggle.tsx
│   │   │   └── LLMModeSwitcher.tsx
│   │   └── auth/
│   │       ├── LoginForm.tsx
│   │       ├── GoogleButton.tsx
│   │       └── ResetPasswordForm.tsx
│   │
│   ├── lib/
│   │   ├── api.ts
│   │   ├── auth.ts
│   │   └── utils.ts
│   │
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useChat.ts
│   │   ├── useDocuments.ts
│   │   └── useTheme.ts
│   │
│   └── types/
│       └── index.ts
│
├── public/
│   └── logo-ornithorynque.svg
├── tailwind.config.js
├── next.config.js
└── package.json
```

### 7.2 Composants clés

#### Switch mode LLM
```tsx
// components/layout/LLMModeSwitcher.tsx
// Toggle élégant Local <-> API avec changement de thème
```

#### Message avec streaming
```tsx
// components/chat/StreamingMessage.tsx
// Affichage progressif des tokens, curseur animé
```

#### Sources citées
```tsx
// components/chat/ChatSources.tsx
// Badges élégants avec nom fichier + page
```

---

## 8. Limites et quotas

| Limite | Valeur | Configurable |
|--------|--------|--------------|
| Max documents par tenant | 500 | Oui |
| Max taille fichier | 30 Mo | Oui |
| Max users par tenant | 10 | Oui |
| Max requêtes/jour/user | 100 | Oui |

---

## 9. Sécurité

### 9.1 Isolation des tenants
- Toutes les requêtes filtrées par tenant_id
- FAISS index séparés par tenant
- Aucun accès cross-tenant possible

### 9.2 Authentification
- JWT avec expiration 24h
- Refresh tokens
- Google OAuth sécurisé
- Passwords hashés (bcrypt)

### 9.3 Documents
- Validation MIME type
- Scan antivirus (optionnel)
- Stockage isolé par tenant

---

## 10. Déploiement

### 10.1 Infrastructure

**VPS OVH VPS-3**
- 8 vCores
- 24 Go RAM
- 200 Go NVMe
- Ubuntu 24.04
- ~12€ HT/mois

### 10.2 Docker Compose

```yaml
version: '3.8'

services:
  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_URL=http://backend:8000
    depends_on:
      - backend

  backend:
    build: ./backend
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=postgresql://user:pass@db:5432/lokia
      - OLLAMA_URL=http://ollama:11434
      - MISTRAL_API_KEY=${MISTRAL_API_KEY}
      - JWT_SECRET=${JWT_SECRET}
      - GOOGLE_CLIENT_ID=${GOOGLE_CLIENT_ID}
      - GOOGLE_CLIENT_SECRET=${GOOGLE_CLIENT_SECRET}
    volumes:
      - ./data/documents:/data/documents
      - ./data/embeddings:/data/embeddings
    depends_on:
      - db
      - ollama

  db:
    image: postgres:16
    environment:
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=pass
      - POSTGRES_DB=lokia
    volumes:
      - postgres_data:/var/lib/postgresql/data

  ollama:
    image: ollama/ollama
    volumes:
      - ollama_data:/root/.ollama
    deploy:
      resources:
        limits:
          memory: 20G

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./certs:/etc/nginx/certs
    depends_on:
      - frontend
      - backend

volumes:
  postgres_data:
  ollama_data:
```

---

## 11. Critères d'acceptation

### 11.1 Fonctionnel

| Test | Critère | Priorité |
|------|---------|----------|
| Login email | Connexion réussie | P0 |
| Login Google | OAuth fonctionnel | P0 |
| Reset password | Email reçu, reset OK | P0 |
| Upload PDF natif | Indexé < 2 min | P0 |
| Upload PDF scanné | OCR + indexé < 5 min | P0 |
| Upload DOCX | Indexé < 2 min | P0 |
| Question RAG | Réponse correcte avec sources | P0 |
| Streaming | Tokens affichés progressivement | P0 |
| Mode local | Ollama fonctionne | P0 |
| Mode API | Mistral API fonctionne | P0 |
| Switch mode | Thème change correctement | P0 |
| Isolation tenant | Aucun leak de données | P0 |
| Docs partagés | Visibles par tous les users | P1 |
| Docs perso | Visibles que par le owner | P1 |
| Drag & drop conv | Doc ajouté au RAG | P1 |

### 11.2 Performance

| Métrique | Cible |
|----------|-------|
| Temps réponse (local) | < 30s |
| Temps réponse (API) | < 10s |
| Temps d'indexation | < 30s/page |
| First token (streaming) | < 2s |

### 11.3 Design

| Critère | Validation |
|---------|------------|
| Look premium | Comparable à Claude/ChatGPT |
| Ton IA | Pro, zéro emoji |
| Animations | Subtiles, fluides |
| Responsive | Desktop + tablet |

---

## 12. Roadmap post-MVP

- [ ] Excel, TXT, images
- [ ] Connecteurs (Google Drive, SharePoint)
- [ ] Gestion fine des droits
- [ ] Export conversations
- [ ] Analytics avancés
- [ ] SSO / SAML
- [ ] Application mobile
- [ ] Multi-langue interface

---

## 13. Variables d'environnement

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/lokia

# Auth
JWT_SECRET=your-super-secret-key
ACCESS_TOKEN_EXPIRE_MINUTES=1440

# Google OAuth
GOOGLE_CLIENT_ID=xxx
GOOGLE_CLIENT_SECRET=xxx

# LLM
OLLAMA_URL=http://localhost:11434
LLM_MODEL_LOCAL=mistral-nemo
MISTRAL_API_KEY=xxx
LLM_MODEL_API=mistral-large-latest

# Storage
DOCUMENTS_PATH=/data/documents
EMBEDDINGS_PATH=/data/embeddings

# Limits
MAX_FILE_SIZE_MB=30
MAX_DOCUMENTS_PER_TENANT=500
MAX_REQUESTS_PER_DAY=100

# Email (pour reset password)
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=xxx
SMTP_PASSWORD=xxx
```

---

## 14. Résumé pour développement

**Lokia MVP — Points clés :**

1. **Double mode LLM** : Local (Ollama/Mistral Nemo) + API (Mistral Large)
2. **Thèmes** : Sombre = local, Bleu clair = API
3. **Auth** : Email/password + Google OAuth + Reset password
4. **RAG** : Docs partagés (tenant) + Docs perso (user)
5. **Streaming** : Réponses en temps réel
6. **Design** : Premium, niveau Claude/ChatGPT, zéro emoji IA
7. **Super-admin** : Interface pour gérer les tenants
8. **Isolation** : Stricte entre tenants

**Mascotte** : Ornithorynque
**Langue** : Français
**Hébergement** : OVH VPS-3 (24 Go RAM, ~12€/mois)

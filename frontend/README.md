# Lokia Frontend

Interface premium pour l'assistant IA Lokia.

## Stack

- **Framework:** Next.js 14
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion
- **State:** Zustand
- **Icons:** Lucide React

## Demarrage

```bash
# Installation des dependances
npm install

# Lancement en mode developpement
npm run dev

# Build de production
npm run build

# Lancement en production
npm start
```

## Structure

```
src/
├── app/                    # Pages Next.js (App Router)
│   ├── page.tsx           # Page principale (Chat)
│   ├── login/             # Page de connexion
│   └── documents/         # Gestion des documents
├── components/
│   ├── ui/                # Composants UI de base
│   ├── chat/              # Composants du chat
│   └── layout/            # Layout et navigation
├── hooks/                 # Custom hooks (Zustand stores)
├── lib/                   # Utilitaires
└── types/                 # Types TypeScript
```

## Themes

Lokia dispose de deux themes lies au mode LLM :

- **Mode Local (sombre):** Pour Mistral Nemo via Ollama - 100% confidentiel
- **Mode API (clair):** Pour Mistral Large - Plus rapide

## Design

Inspire de Claude, Linear et Vercel avec :
- Interface epuree et minimaliste
- Animations fluides (200ms)
- Glassmorphism subtil
- Typographie Inter
- Aucun emoji dans les reponses IA

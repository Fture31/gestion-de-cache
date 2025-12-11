# 📦 Architecture du projet — Gestion de Cache Client (Zustand + Next.js)

Ce dossier présente une architecture moderne en **Next.js App Router**, utilisant :

- **Zustand** pour le cache client  
- **TypeScript strict**  
- **Hooks réutilisables**  
- **Pages dynamiques**  
- **API typée**

🎯 **Objectif :** optimiser les performances en évitant les requêtes réseau répétées.

src/
├── app/
│   ├── store/
│   │   └── cacheStore.ts          # Store Zustand pour stocker les données en cache
│   ├── hooks/
│   │   └── useCache.ts            # Hook générique (get/set cache + typage)
│   ├── components/
│   │   ├── Spinner.tsx            # Loader réutilisable
│   │   └── ProductList.tsx        # Liste utilisant le cache
│   ├── utils/
│   │   └── products.ts            # Fonctions API avec typage strict
│   └── product/
│       └── [id]/
│           └── page.tsx           # Page dynamique qui lit depuis le cache
└── types/
    └── index.ts                   # Types globaux pour un typage centralisé

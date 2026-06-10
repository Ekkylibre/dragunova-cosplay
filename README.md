# Dragunova Cosplay — Site vitrine / Book photo

Site vitrine artistique pour une cosplayeuse, construit avec **Next.js** et **Tailwind CSS**. Direction artistique « Le Codex » : un grimoire numérique entre fantasy et gaming — nuit arcanique animée, particules magiques, titre à reflets, cartes holographiques inclinables, fiche de personnage RPG et lightbox.

## Lancer le projet

```bash
npm install
npm run dev
```

Puis ouvrez [http://localhost:3000](http://localhost:3000).

## Remplacer les photos

Les photos actuelles sont des **placeholders** (picsum.photos). Pour mettre les vraies photos :

1. Placez vos images dans le dossier `public/photos/`.
2. Ouvrez `lib/photos.ts` et remplacez les `src` par vos fichiers, par exemple :

```ts
src: "/photos/mononoke-01.jpg",
```

3. Mettez à jour `alt`, `serie`, `personnage` et `annee` pour chaque photo.

Les photos du hero et de la section « À propos » se changent directement dans `components/Hero.tsx` et `components/About.tsx`.

## Personnaliser

- **Nom & textes** : `components/Hero.tsx`, `About.tsx`, `Contact.tsx`, `Nav.tsx`
- **Questions / réponses** : tableau `questions` dans `components/Interview.tsx`
- **Couleurs & ambiance** : variables dans `app/globals.css` (bloc `@theme`)
- **Polices** : `app/layout.tsx` (Cinzel + Space Grotesk via `next/font`)
- **Réseaux sociaux & email** : `components/Contact.tsx`

## Structure

```
app/
  layout.tsx      # Polices, metadata, structure HTML
  page.tsx        # Assemblage des sections
  globals.css     # Thème, grain, animations
components/
  Nav.tsx         # Navigation fixe
  Hero.tsx        # Écran d'accueil
  Marquee.tsx     # Bandeau défilant
  Gallery.tsx     # Galerie book + lightbox
  About.tsx       # Présentation + statistiques
  Interview.tsx   # Questions / réponses (accordéon)
  Contact.tsx     # Email + réseaux
  Footer.tsx
lib/
  photos.ts       # Données des photos du book
```

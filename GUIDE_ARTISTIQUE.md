# GUIDE DE DIRECTION ARTISTIQUE - PORTFOLIO 2026
**Vision :** L'Architecte Digital // Editorial Minimalist Tech  
**Cible :** Clients Premium, Agences Awwwards, Recruteurs Tech  
**Version :** 2.0 — Mise à jour UX/UI

---

## 1. L'ESSENCE DU DESIGN (MOOD)

L'interface doit **respirer**. Chaque élément existe pour une raison. On recherche l'équilibre parfait entre :
- La **chaleur éditoriale** des magazines de design
- La **précision technique** de l'ingénierie logicielle
- L'**espace** comme élément de design à part entière

### Principes Fondamentaux
1. **Whitespace is king** — L'espace vide guide le regard
2. **Contraste assumé** — Des hiérarchies typographiques marquées
3. **Grille visible** — Structure apparente mais élégante
4. **Mouvement subtil** — Micro-interactions raffinées

* **Mots-clés :** Rigueur, Respiration, Typographie Cinétique, Matériaux Nobles
* **Anti-patterns :** Surcharge, Uniformité, Animations excessives

---

## 2. SYSTÈME TYPOGRAPHIQUE

### Échelle Typographique (Golden Ratio ~1.618)

| Élément | Desktop | Mobile | Font | Weight |
|---------|---------|--------|------|--------|
| **H1 Hero** | 6rem (96px) | 3rem | Playfair Display | 500 |
| **H2 Section** | 4rem (64px) | 2.25rem | Playfair Display | 500 |
| **H3 Titre** | 2rem (32px) | 1.5rem | Playfair Display | 500 |
| **H4 Sous-titre** | 1.5rem (24px) | 1.25rem | Outfit | 500 |
| **Body Large** | 1.25rem (20px) | 1.125rem | Outfit | 300 |
| **Body** | 1rem (16px) | 1rem | Outfit | 300 |
| **Caption** | 0.75rem (12px) | 0.75rem | JetBrains Mono | 400 |
| **Micro** | 0.625rem (10px) | 0.625rem | JetBrains Mono | 400 |

### A. Display & Titres (L'Émotion)
* **Font :** **Playfair Display**
* **Usage :** Gros titres (H1, H2), Citations, Mots-clés "Hero"
* **Style :** Utiliser l'**Italique** pour emphase sur UN mot par phrase
    * *Exemple :* "Digital products that create *emotion*."
* **Tracking :** -0.02em pour les très grands titres

### B. Corps de Texte & UI (La Fonction)
* **Font :** **Outfit**
* **Usage :** Paragraphes, Boutons, Menus, Labels
* **Style :** `Light (300)` pour le texte, `Medium (500)` pour les boutons
* **Interlignage :** 170% pour le corps de texte

### C. La "Touche Code" (Le Détail)
* **Font :** **JetBrains Mono**
* **Usage :** Numérotation, Tags, Timestamps, Crédits
* **Taille :** 10-12px, majuscules, spacing 0.1em

---

## 3. PALETTE CHROMATIQUE 2.1

Une palette **Noir/Gris/Blanc/Orange** avec un blanc chaud et un noir froid légèrement saturé.

### Couleurs de Base

| Nom | Variable | Hex | Usage |
|-----|----------|-----|-------|
| **Warm White** | `--color-bg` | `#FAF8F5` | Fond principal (blanc crème chaud) |
| **Cream** | `--color-bg-warm` | `#F3F0EB` | Fond alternatif, sections |
| **Cold Black** | `--color-ink` | `#12131A` | Texte principal (noir légèrement bleuté) |
| **Cold Gray** | `--color-ink-soft` | `#4A4B55` | Texte secondaire |
| **Warm Gray** | `--color-border` | `#E2DFD9` | Bordures, séparateurs |
| **Light Gray** | `--color-grid` | `#EDEAE4` | Fond des cards |

### Couleur d'Accent

| Nom | Variable | Hex | Usage |
|-----|----------|-----|-------|
| **Vibrant Orange** | `--color-accent` | `#FF3200` | Accent principal, hover, CTA |
| **Dark Orange** | `--color-accent-hover` | `#E62D00` | Hover sur accent |
| **Pale Orange** | `--color-accent-light` | `#FFF0EB` | Highlights subtils |

### Échelle de Gris (Teinte Froide)

| Token | Hex | Description |
|-------|-----|-------------|
| `gray-100` | `#F5F4F2` | Très clair |
| `gray-200` | `#E8E6E2` | Clair |
| `gray-300` | `#D1CEC8` | Medium clair |
| `gray-400` | `#9A989F` | Medium (froid) |
| `gray-500` | `#6B6A72` | Medium foncé |
| `gray-600` | `#4A4B55` | Foncé |
| `gray-700` | `#2D2E38` | Très foncé |
| `gray-800` | `#1E1F28` | Presque noir |
| `gray-900` | `#12131A` | Noir froid |

### Principes de la Palette

1. **Blanc chaud** : Le fond `#FAF8F5` a une légère teinte jaune/beige pour la chaleur
2. **Noir froid** : Le texte `#12131A` a une légère teinte bleue/violette
3. **Gris cohérents** : Transition fluide entre le chaud (bordures) et le froid (texte)
4. **Orange vibrant** : `#FF3200` comme seule couleur d'accent pour un impact maximum

---

## 4. SYSTÈME D'ESPACEMENT

### Échelle d'espacement (Base 8px)

| Token | Valeur | Usage |
|-------|--------|-------|
| `--space-2xs` | 4px | Micro-espacements |
| `--space-xs` | 8px | Entre éléments proches |
| `--space-sm` | 16px | Padding interne |
| `--space-md` | 24px | Gap entre éléments |
| `--space-lg` | 40px | Séparation de groupes |
| `--space-xl` | 64px | Margin de sections |
| `--space-2xl` | 96px | Grandes séparations |
| `--space-3xl` | 160px | Padding vertical sections |

### Règles d'Espacement

1. **Sections :** Padding vertical de 160px minimum sur desktop
2. **Container :** Padding horizontal de 80px sur desktop, 24px mobile
3. **Cards :** Padding interne de 32-40px
4. **Gap grille :** 24px entre les items

---

## 5. SYSTÈME DE GRILLE

### Grille 12 colonnes

```
Desktop (1440px+) : 12 colonnes, 24px gap, 80px margin
Tablet (768-1440px) : 8 colonnes, 20px gap, 40px margin  
Mobile (<768px) : 4 colonnes, 16px gap, 24px margin
```

### Grille Visible
- Les lignes verticales peuvent être suggérées par des bordures fines (#E8E8E8)
- Les sections s'alignent sur la grille
- Le contenu texte ne dépasse jamais 65-70 caractères par ligne

### Breakpoints

| Nom | Valeur | Description |
|-----|--------|-------------|
| `sm` | 640px | Mobile large |
| `md` | 768px | Tablette |
| `lg` | 1024px | Desktop small |
| `xl` | 1280px | Desktop |
| `2xl` | 1536px | Large screens |

---

## 6. COMPOSANTS CLÉS

### Boutons

**Primary (Deep Ocean)**
- Background: `--color-primary`
- Text: white
- Hover: `--color-primary-light` + scale(1.02) + shadow
- Radius: 100px (pill)
- Padding: 16px 32px

**Secondary (Outline)**
- Border: 1px solid `--color-border`
- Text: `--color-ink`
- Hover: fill `--color-ink`, text white
- Radius: 100px

**Ghost**
- Background: transparent
- Underline on hover (accent color)

### Cards (Bento Items)

- Background: `--color-white`
- Border: 1px solid `--color-border`
- Border-radius: 12px
- Shadow: none par défaut, subtle on hover
- Hover: translateY(-8px) + shadow + border-color accent

### Tags & Badges

- Background: `--color-grid`
- Text: `--color-ink-soft`
- Padding: 4px 12px
- Radius: 4px
- Font: JetBrains Mono, 10px, uppercase

### Images & Placeholders

- Border-radius: 8px ou 12px
- Border: 1px solid `--color-border`
- Aspect ratios: 16/9, 4/5, 1/1
- Hover: scale(1.02) sur l'image interne

---

## 7. MICRO-INTERACTIONS

### Principes
- **Durée :** 200-400ms maximum
- **Easing :** cubic-bezier(0.4, 0, 0.2, 1) pour la fluidité
- **Subtilité :** Les animations doivent améliorer, pas distraire

### Effets Hover Recommandés

| Élément | Animation |
|---------|-----------|
| Liens nav | Underline de gauche à droite |
| Cards | TranslateY(-8px) + shadow |
| Boutons primary | Scale(1.02) + shadow + lighten bg |
| Images | Scale(1.03) interne |
| Tags | Background darken |

### Scroll Animations
- Fade-in + translateY(20px) pour les sections
- Stagger de 0.1s entre éléments similaires
- Trigger: 20% de l'élément visible

---

## 8. CHECKLIST UX/UI

### Hiérarchie Visuelle
- [ ] Le regard est naturellement guidé de haut en bas
- [ ] Un seul point focal par section
- [ ] Contraste H1/H2 clairement visible (ratio 1.5x minimum)
- [ ] Les CTAs sont immédiatement identifiables

### Espacement
- [ ] Au moins 160px entre les sections majeures
- [ ] Aucun élément ne touche les bords
- [ ] Respiration suffisante autour des titres
- [ ] Cohérence des gaps dans la grille

### Typographie
- [ ] Hiérarchie Playfair/Outfit respectée
- [ ] Maximum 65-70 caractères par ligne de texte
- [ ] Interlignage de 170% pour le body
- [ ] JetBrains Mono uniquement pour les détails techniques

### Couleurs
- [ ] Utilisation cohérente des accents
- [ ] Contraste WCAG AA minimum (4.5:1)
- [ ] Pas plus de 3 couleurs dominantes par section
- [ ] Accent utilisé pour les éléments interactifs

### Responsive
- [ ] Testé sur 320px, 768px, 1024px, 1440px
- [ ] Touch targets minimum 44x44px
- [ ] Titres lisibles sur mobile
- [ ] Navigation accessible

---

## 9. RÉFÉRENCES VISUELLES

### Sites d'Inspiration
- Awards: awwwards.com, cssdesignawards.com
- Portfolios: cuberto.com, basicagency.com
- Editorial: stripe.com, linear.app

### Ambiance
- Clean mais pas froid
- Professionnel mais créatif
- Technique mais accessible
- Moderne mais intemporel
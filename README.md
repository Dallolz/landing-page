# NexAI - Landing Page Style Outpost

Site web pour NexAI, une entreprise spécialisée dans l'automatisation intelligente et l'intégration d'IA pour les entreprises françaises.

## Description

Ce projet est une landing page moderne inspirée du style de Outpost.design, avec des animations Three.js sophistiquées qui réagissent au mouvement de la souris et au défilement de la page.

## Structure du Projet

```
nexai-landing-page/
├── index.html
├── css/
│   ├── main.css
│   ├── animations.css
│   └── responsive.css
├── js/
│   ├── main.js
│   ├── webgl.js
│   ├── scroll.js
│   └── cursor.js
├── assets/
│   ├── fonts/
│   └── images/
│       ├── favicon.ico
│       └── icons/
└── README.md
```

## Technologies Utilisées

- HTML5, CSS3, JavaScript
- Three.js pour l'animation 3D interactive
- GSAP pour les animations de défilement
- Fonctionnalités modernes comme :
  - Curseur personnalisé
  - Effet de grain et de bruit
  - Animation de particules en 3D
  - Effets parallaxe
  - Transitions fluides

## Fonctionnalités Principales

### Animation Three.js
- Réseau de particules 3D interactif qui réagit aux mouvements de la souris et au défilement
- Connexions dynamiques entre les particules proches
- Dégradé de couleurs entre bleu et turquoise pour correspondre à l'identité visuelle
- Effet de profondeur et de parallaxe

### Interface Utilisateur
- Design minimaliste avec thème sombre et accents de couleur vibrants
- Transitions et animations sophistiquées
- Navigation élégante avec effets de survol
- Composants interactifs avec retour visuel

### Contenu
- Présentation claire des services d'automatisation et d'IA
- Méthodologie en étapes avec animation de timeline
- Cas d'usage concrets avec résultats
- Formulaire de contact intégré

## Installation

1. Clonez ce dépôt
```
git clone https://github.com/dallolz/landing-page.git
```

2. Assurez-vous que tous les fichiers sont structurés comme indiqué ci-dessus

3. Ouvrez le fichier `index.html` dans votre navigateur pour un développement local

## Déploiement

Le site est actuellement déployé sur GitHub Pages et est accessible à l'adresse:
https://dallolz.github.io/landing-page/

## Optimisation

Le site a été optimisé pour :
- Des performances fluides sur différents appareils
- Une animation 3D optimisée qui s'adapte à la puissance de l'appareil
- Un design responsive qui fonctionne sur mobile, tablette et desktop
- Un chargement progressif avec écran de chargement

## Personnalisation

### Couleurs
Les couleurs principales peuvent être modifiées en ajustant les variables CSS dans `css/main.css` :
```css
:root {
  --accent-blue: #0063fa;
  --accent-teal: #00d4c8;
  /* autres couleurs... */
}
```

### Animation Three.js
L'animation peut être personnalisée en modifiant les paramètres dans `js/webgl.js` :
```javascript
this.colors = {
  bgColor: 0x080816,
  particleColor1: 0x0063fa, // Blue
  particleColor2: 0x00d4c8, // Teal
};
```

## Licence

Tous droits réservés © NexAI 2025
---
name: Forest & Flour
colors:
  surface: '#fcf9f1'
  surface-dim: '#dcdad2'
  surface-bright: '#fcf9f1'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f6f3eb'
  surface-container: '#f0eee6'
  surface-container-high: '#ebe8e0'
  surface-container-highest: '#e5e2da'
  on-surface: '#1c1c17'
  on-surface-variant: '#40493c'
  inverse-surface: '#31312b'
  inverse-on-surface: '#f3f1e8'
  outline: '#707a6b'
  outline-variant: '#c0cab9'
  surface-tint: '#1e6d1b'
  primary: '#0d600f'
  on-primary: '#ffffff'
  primary-container: '#2d7a27'
  on-primary-container: '#b6ffa5'
  inverse-primary: '#89da7a'
  secondary: '#695c4a'
  on-secondary: '#ffffff'
  secondary-container: '#f2e0c9'
  on-secondary-container: '#706250'
  tertiary: '#923411'
  on-tertiary: '#ffffff'
  tertiary-container: '#b24b27'
  on-tertiary-container: '#ffe8e1'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#a4f793'
  primary-fixed-dim: '#89da7a'
  on-primary-fixed: '#002201'
  on-primary-fixed-variant: '#005305'
  secondary-fixed: '#f2e0c9'
  secondary-fixed-dim: '#d5c4ae'
  on-secondary-fixed: '#231a0c'
  on-secondary-fixed-variant: '#514534'
  tertiary-fixed: '#ffdbd0'
  tertiary-fixed-dim: '#ffb59d'
  on-tertiary-fixed: '#390c00'
  on-tertiary-fixed-variant: '#812804'
  background: '#fcf9f1'
  on-background: '#1c1c17'
  surface-variant: '#e5e2da'
typography:
  display-lg:
    fontFamily: Literata
    fontSize: 56px
    fontWeight: '700'
    lineHeight: 64px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Literata
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
  headline-md:
    fontFamily: Literata
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Literata
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Literata
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-lg:
    fontFamily: Literata
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.01em
  headline-lg-mobile:
    fontFamily: Literata
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 36px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 4px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 64px
  container-max-width: 1280px
---

## Brand & Style
The design system embodies a farm-to-table ethos, blending organic warmth with refined editorial precision. It is designed for an audience that values artisanal quality, sustainability, and transparency in food and lifestyle. 

The visual style is **Corporate Modern with Tactile influences**, focusing on high-quality typography and a grounded, ivory-based palette. It avoids the coldness of typical tech products by using soft surface transitions and a rich, nature-inspired primary green. The emotional response should be one of calm, reliability, and wholesome sophistication.

## Colors
The palette is anchored by a deep, vibrant forest green derived from the provided reference, serving as the primary brand identifier. 

- **Primary (#2D7A27):** Used for key actions, brand moments, and active states.
- **Surface Ivory (#FAF9F2):** The foundational background color, providing a softer, more organic feel than pure white.
- **Secondary (Earth Brown):** Used for supporting elements and subtle accents to reinforce the natural theme.
- **Functional Neutrals:** A range of warm grays are used for text and borders to maintain legibility without the harshness of true black.

## Typography
This design system utilizes **Literata** exclusively across all levels to create a unified, bookish, and authoritative feel. 

Headlines use tighter letter spacing and heavier weights to command attention, while body text is optimized for long-form readability with generous line heights. For mobile, display sizes scale down to ensure headlines remain legible and do not cause excessive line-breaking.

## Layout & Spacing
The layout follows a **Fluid Grid** model with a maximum container width to maintain editorial integrity on large displays. 

- **Desktop:** 12-column grid with 24px gutters and 64px side margins.
- **Tablet:** 8-column grid with 20px gutters and 32px side margins.
- **Mobile:** 4-column grid with 16px gutters and 16px side margins.

A 4px baseline grid governs vertical rhythm, ensuring that spacing between text blocks and components remains consistent (e.g., 8px, 16px, 24px, 32px increments).

## Elevation & Depth
The system uses **Tonal Layers** rather than heavy shadows to signify depth. 

- **Level 0:** Surface Ivory background.
- **Level 1:** Slightly darker cream or white containers used for cards and modular content.
- **Level 2:** High-priority elements (like modals) use a very soft, diffused shadow with a hint of the primary green color in the umbra to maintain the warmth of the palette.
- **Borders:** Low-contrast, 1px solid strokes in a warm neutral are used to define boundaries on Level 1 surfaces.

## Shapes
The shape language is consistently **Rounded**, using a 0.5rem (8px) base radius. This specific choice balances the traditional serif typography with a contemporary, approachable UI feel. 

- **Small Components:** Buttons and inputs use the base `rounded` (0.5rem).
- **Large Components:** Cards and featured containers use `rounded-lg` (1rem).
- **Special Elements:** Search bars and tags may use `rounded-xl` (1.5rem) to provide visual variety.

## Components
- **Buttons:** Primary buttons are filled with the brand green (#2D7A27) with white Literata text. Secondary buttons use an outline style with a 1px stroke in the brand green.
- **Inputs:** Form fields use the Surface Ivory background with a subtle warm-gray border that thickens and changes to the brand green on focus.
- **Cards:** Cards feature a 1rem corner radius and a subtle Level 1 elevation change. Images within cards should always inherit the corner radius of the parent container.
- **Chips:** Used for categories or filters, chips feature a light green tint background with dark green text for high legibility and an organic feel.
- **Lists:** Clean, borderless list items separated by 1px horizontal dividers in a very light neutral.
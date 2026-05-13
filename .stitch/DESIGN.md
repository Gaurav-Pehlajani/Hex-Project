# Design System: Hex Platform Redesign

## 1. Visual Theme & Atmosphere
A highly tactical, "Cockpit Dense" cybersecurity training interface. The atmosphere is clinical, precision-engineered, and strictly asymmetric. It leans heavily into a premium "TryHackMe" or "HackTheBox" vibe, but stripped of all cliché neon slop. Motion is restrained to functional, hardware-accelerated spring physics. It feels like interacting with a high-end terminal on brushed metal hardware. Density is 8 (high), Variance is 7 (asymmetric), Motion is 4 (restrained).

## 2. Color Palette & Roles
- **Canvas Black** (#09090B) — Primary background surface. Absolute void.
- **Surface Slate** (#18181B) — Card and container fill. Used to stack elevation softly.
- **Charcoal Ink** (#FAFAFA) — Primary text. Zinc-50 for high contrast readability against dark backgrounds.
- **Muted Steel** (#A1A1AA) — Secondary text, descriptions, metadata, inactive tabs.
- **Whisper Border** (rgba(255,255,255,0.1)) — Card borders, 1px structural lines.
- **Hacker Emerald** (#10B981) — Single accent for CTAs, active states, focus rings, progress bars, and terminal success states.

## 3. Typography Rules
- **Display:** `Geist` — Track-tight, controlled scale, weight-driven hierarchy. Used for section headers and portal entries.
- **Body:** `Geist` — Relaxed leading, 65ch max-width, neutral secondary color.
- **Mono:** `JetBrains Mono` — For code blocks, terminal outputs, metadata, XP points, timestamps, and high-density numbers.
- **Banned:** Inter, generic system fonts, all Serif fonts. 

## 4. Component Stylings
* **Buttons:** Flat, brutalist corners (4px radius). Tactile -1px translate on active. Emerald fill for primary, ghost/outline with whisper border for secondary. NO outer glows.
* **Cards:** Sharp or slightly rounded corners (8px max). Diffused 10% opacity shadow at most, but primarily relying on border and background color shifts. High-density grids use border-top dividers instead of full cards.
* **Inputs:** Brutalist terminal style. Label above, error below. Focus ring in Hacker Emerald. Monospace placeholder text.
* **Progress Bars / XP:** Sharp edges, flat Emerald fill. No gradients.
* **Loaders:** Skeletal shimmer matching exact layout dimensions. No circular spinners.

## 5. Layout Principles
Grid-first responsive architecture. Asymmetric splits for Hero sections.
Strict single-column collapse below 768px. Max-width containment (1400px).
No flexbox percentage math. Generous internal padding within cards to offset the high density.
Sidebar navigation for dashboards, collapsing to a bottom tab bar on mobile.

## 6. Motion & Interaction
Spring physics for all interactive elements (stiffness: 100, damping: 20).
Staggered cascade reveals for leaderboards and module lists.
Hover states on cards translate Y by -2px with an Emerald top-border reveal.

## 7. Anti-Patterns (Banned)
- NEVER use purple or blue neon glows.
- NEVER use Inter font.
- NEVER use pure black (#000000) for text.
- NEVER use 3-column equal grids.
- NEVER use AI copywriting clichés ("Elevate", "Next-Gen", "Seamless").
- NEVER use generic placeholder names ("John Doe", "Acme").
- NEVER overlap elements. Clean spatial separation is mandatory.
- NEVER use fabricated data (no fake SLAs or metric stats). Use `[metric]` if real data isn't provided.
- NEVER use emojis.

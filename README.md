# Atelier Noir 🎨

Atelier Noir is a high-fidelity frontend prototype for a premium online art gallery. Designed to feel more like an editorial experience than a traditional e-commerce store, the project bridges the gap between digital convenience and the tactile, immersive nature of physical art spaces.

## The Goal

Selling high-end art online is tough. Buyers need to feel the texture of the canvas, understand the scale, and connect with the artist’s story. The goal was to build an interface that feels luxurious, builds deep trust, and makes purchasing art online an intuitive, emotional experience.

## Design Principles

*   **Cinematic Void:** A deep charcoal and warm white palette ("Cinematic Void") allows the artwork to command the room. We avoided sterile "tech" whites in favor of warmer, gallery wall tones.
*   **Invisible Architecture:** The UI gets out of the way. Borders are whisper-thin, buttons are minimalist, and typography (Cormorant Garamond paired with Inter) does the heavy lifting to establish authority.
*   **Tactile Interactions:** Micro-animations and hover states (like the monochromatic artist portraits blooming into color) replicate the feeling of stepping closer to a piece in a real gallery.

## The User Journey

1.  **The Hook (Homepage):** Users land on a striking, full-bleed hero artwork that sets an immediate editorial tone. Instead of overwhelming them with carousels, we guide them through curated collections and featured artist stories.
2.  **Exploration (Collections):** A fluid, masonry-style layout lets artworks breathe. Filtering is instantly responsive and sticky, meaning users never lose context of what they're looking at.
3.  **Connection (Artist Profiles):** We treat artists like authors. Their pages focus heavily on exhibition history, medium styles, and their personal manifesto before hard-selling their pieces.
4.  **Conversion (Product & Context):** The product page includes dynamic architectural framing options and an Augmented Reality (AR) "View in Room" simulator to remove the final barrier of purchase: *scale anxiety*. 

## Tech Stack

This prototype is built entirely with vanilla HTML, CSS, and JS to maintain a lightweight, buttery-smooth experience. It is fully responsive, leverages modern CSS grid frameworks, and relies on native browser APIs like `IntersectionObserver` for scroll reveals—avoiding heavy third-party animation libraries.

Deployed live on Vercel.

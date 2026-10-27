# Zhao Boxuan Portfolio

A bilingual, desktop-first portfolio foundation for an interaction and spatial designer / researcher. Built with React, TypeScript, Vite (via Vinext), and the OpenAI Sites Vite plugin.

## Run locally

```powershell
pnpm run dev
```

Open `http://localhost:3000/`.

## Build

```powershell
pnpm run build
```

If dependencies must be reinstalled while this project remains inside OneDrive, place pnpm's virtual store in a non-OneDrive folder to avoid very slow file synchronization:

```powershell
pnpm install --virtual-store-dir C:\path\outside\OneDrive\zbx-portfolio-pnpm
```

Content is managed in `data/siteData.ts`; design tokens are in `styles/tokens.css`. Replace the clearly marked placeholder media through `public/assets/images` and `public/assets/videos`.

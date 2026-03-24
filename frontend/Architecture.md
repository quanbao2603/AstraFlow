# Frontend Architecture

This document tracks the detailed directory and file structure of the frontend application.
When structural changes are made (adding features, components, pages), this file should be updated accordingly to keep the architecture synchronized.

## Directory Structure

```text
frontend/
├── public/                 # Static assets that don't need compilation
│   └── background.mp4      
├── src/                    # Source code of the application
│   ├── assets/             # Static assets like images, fonts, icons imported in code
│   ├── components/         # Reusable UI components
│   │   ├── layouts/        # Layout Fragments (Header/Footer)
│   │   │   ├── header/     # Header.tsx, HeaderLogo.tsx, HeaderAuth.tsx, HeaderNav.tsx
│   │   │   └── footer/     # Footer.tsx and its sub-parts
│   │   └── ui/             # Atomic/Generic UI components (Typewriter.tsx)
│   ├── config/             # Configuration files
│   │   ├── navigation.ts   # Navigation configuration
│   │   └── routes.ts       # Centralized route constants
│   ├── features/           # Feature-based/Domain modules (Logic & Components)
│   │   ├── auth/           # Login, Register, SocialLogin components
│   │   └── studio/         # Creator Dashboard logic
│   ├── hooks/              # Custom React hooks
│   ├── layouts/            # Page Layout Containers (PublicLayout, AuthLayout, StudioLayout)
│   ├── pages/              # Route entry points (thin wrappers)
│   │   ├── home/           
│   │   ├── auth/           
│   │   └── studio/         
│   ├── store/              # Global state management
│   ├── types/              # TypeScript typings and interfaces
│   ├── utils/              # Utility functions and helpers
│   ├── App.tsx             # Root component (Routing & Layouts)
│   ├── index.css           # Global styles
│   └── main.tsx            # App entry point
├── Architecture.md         # This documentation
├── index.html              # HTML entry point
├── package.json            # Dependencies & Scripts
└── vite.config.ts          # Vite configuration
```

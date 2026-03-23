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
│   │   └── layouts/        # Layout-specific components
│   │       ├── Footer.tsx  
│   │       └── Header.tsx  
│   ├── config/             # Configuration files
│   │   └── navigation.ts   # Navigation configuration
│   ├── features/           # Feature-based modules (each containing its own components, hooks, api, etc.)
│   ├── hooks/              # Custom React hooks
│   ├── layouts/            # Page layout wrappers
│   │   └── PublicLayout.tsx
│   ├── pages/              # Route components/views
│   ├── routes/             # Routing configuration and route definitions
│   ├── store/              # Global state management
│   ├── types/              # TypeScript typings and interfaces
│   ├── utils/              # Utility functions and helpers
│   ├── App.tsx             # Root React component
│   ├── index.css           # Global stylesheet
│   └── main.tsx            # Application entry point
├── .gitignore              # Git ignore rules
├── Architecture.md         # Architecture documentation (this file)
├── eslint.config.js        # ESLint configuration
├── index.html              # HTML entry point (contains root div)
├── package.json            # Project dependencies and scripts
├── package-lock.json       # Dependency lock file
├── tsconfig.json           # Base TypeScript configuration
├── tsconfig.app.json       # TypeScript app-specific configuration
├── tsconfig.node.json      # TypeScript Node environment configuration
└── vite.config.ts          # Vite bundler configuration
```

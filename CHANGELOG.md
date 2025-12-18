# Changelog

All notable changes to Serene Beauty will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.3.0] - 2025-12-18

### Added

#### Frontend
- Login page with email/password form and validation
- Register page with name, username, email, password fields
- Password validation (8+ chars, uppercase, lowercase, number)
- JWT token storage in localStorage on successful auth
- Quiz data persistence (transfers from sessionStorage to localStorage on auth)
- Conditional "Create Account" prompt (hidden when logged in)

### Changed
- Dashboard checks login state to show/hide signup prompt

## [0.2.0] - 2025-12-18

### Added

#### Frontend
- Concern Selection component with skin-type-aware grouping
- Dashboard with personalized routine display
- Sidebar with skin type info, concerns, price filter, step toggles
- AM/PM/Daily routine toggle for skin types with multiple routines
- Collapsible routine steps with application instructions
- Product recommendations per step with scrollable list
- Concern-based treatment recommendations section
- Price range filter (all/budget/mid-range/premium)
- Show/hide individual routine steps

#### Backend
- Added `/api/products/recommend/:skinType/:category/:dayTime` endpoint

### Fixed
- Routine step cards crash when `keyIngredients` undefined
- Empty step cards due to missing dayTime route

### User Flow
- Quiz → Results → Concern Selection → Dashboard (seamless state management)
- Standalone `/concerns` route for updating concerns anytime

## [0.1.0] - 2025-12-18

### Added

#### Backend
- Express + TypeScript + MongoDB setup
- User model with name, username, email, password fields
- Product model with category, suitableFor, targetConcerns, dayTime, priceRange fields
- Routine model with skinType, dayTime, ordered steps
- UserProfile model linking quiz results to user accounts
- Authentication API (register, login, logout with JWT, 24h expiry)
- Quiz API (GET /api/quiz, POST /api/quiz/submit with skin type calculation)
- Routine API (GET /api/routines, GET /api/routines/:skinType)
- Product API (GET /api/products, by category, by skin type, by dayTime)
- Zod validation for auth inputs (password complexity, username format)
- Bcrypt password hashing (12 rounds)

#### Frontend
- React 19.2.2 + Vite + TypeScript setup
- Tailwind CSS v4 with custom design system
- Custom color palette (porcelain, lavender-veil, deep-twilight, midnight, alabaster, wisteria, periwinkle)
- Typography system (Playfair Display headings, Cormorant Garamond body at 600 weight, 18px)
- Auto text color pairing (dark backgrounds get alabaster, light backgrounds get midnight)
- React Router DOM for client-side navigation
- API helper module (src/api/index.ts) with environment-based URL
- Quiz component with progress bar, back/next navigation, answer memory
- Home page with call-to-action

#### Infrastructure
- Monorepo structure (frontend/, backend/)
- Node 24.11.1 LTS, npm 11.6.2
- Tailwind CSS v4.1.18
- Netlify deployment (frontend) at serene-beauty-app.netlify.app
- Render deployment (backend) at serene-beauty-api.onrender.com
- MongoDB Atlas (Frankfurt region)
- Git branching strategy (main ← develop ← feature/*)
- Conventional commits format

### User Flow
- Quiz → Results (skin type) → Concern Selection → Dashboard → Optional registration
- Users see full value before any auth gate

### Data Structure
- 7-question skin assessment quiz
- 8 predefined routines (AM/PM per skin type)
- ~60 products across 6 categories (cleanser, toner, serum, moisturizer, sunscreen, treatment)
- 10 skin concerns with skin type mapping

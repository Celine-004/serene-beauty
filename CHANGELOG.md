# Changelog

All notable changes to Serene Beauty will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).


## [0.7.0] - 2026-01-02

### Added - User Profile
- **Profile Page** (`/profile`) with editable name and username
- **Account Information** displaying email and member since date (read-only)
- **Google Account Management** - link/unlink Google account from profile
- **Set Password** for Google-only users to enable email login
- **Change Password** for users with existing passwords (requires current password)
- **Delete Account** with confirmation dialog (removes user and all profile data)
- **My Account** link in navbar for logged-in users
- Backend endpoints: `GET /api/auth/me`, `PUT /api/auth/me`, `DELETE /api/auth/me`
- Backend endpoints: `POST /api/auth/set-password`, `POST /api/auth/change-password`, `POST /api/auth/unlink-google`

## [0.6.0] - 2026-01-01

### Added - Security & OAuth
- **Helmet.js** security headers (XSS protection, clickjacking prevention, MIME sniffing prevention, HTTPS enforcement)
- **Rate Limiting** - general routes (100 requests/15 min), auth routes (10 requests/15 min)
- **CORS Configuration** - restricted to localhost:5173 and serene-beauty-app.netlify.app
- **Body Size Limit** - 10kb max payload to prevent overflow attacks
- **Error Handling Middleware** - prevents stack trace leaks to clients
- **Google OAuth Authentication** using Passport.js
  - Sign in with Google button on Login and Register pages
  - Automatic account creation for new Google users
  - Account linking for existing users with matching email
  - OAuth callback handler (`/oauth-callback`)
- **Backend Ping** on Home page load to wake up Render server (reduces cold start delay)
- User model updated with `googleId`, `emailVerified`, and optional `password` fields
- Environment variables: `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `FRONTEND_URL`, `BACKEND_URL`

### Security Notes
- OAuth credentials stored in environment variables (never committed to git)
- JWT tokens issued after OAuth with 24-hour expiry
- Google users can set a password to enable email login

## [0.5.0] - 2025-12-19

### Added

#### Backend
- UserProfile model updated with selectedProducts array
- Profile controller with CRUD operations for product selection
- JWT authentication middleware for protected routes
- Profile routes: GET/POST /api/profile, select-product, remove-product, selected-products

#### Frontend
- Product selection for authenticated users
- "Save My Routine" button for first-time users
- "Edit Routine" button in sidebar for returning users
- Selected products persist to backend
- View mode shows only selected products per step
- Edit mode shows all products with selection UI

### Fixed
- Double navbar bug when Quiz flows to ConcernSelection

## [0.4.0] - 2025-12-19

### Added

#### Frontend
- Landing page with hero section, tagline, and CTA
- How It Works section (3-step explanation)
- Benefits section (4 feature cards)
- Coming Soon section (future features preview)
- Final CTA section with dark background
- Navbar component with login state awareness
- Home link added to navbar
- Footer with navigation, copyright, and utility links
- Navbar added to Quiz, ConcernSelection, and Dashboard pages

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

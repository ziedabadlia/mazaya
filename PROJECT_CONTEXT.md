# Mazaya Project Context

**Last Updated:** 2026-06-14

## Project Overview
- **Name:** Mazaya
- **Type:** Next.js 16 multi-tenant restaurant management SaaS
- **Purpose:** Restaurant operations platform with multi-language support (Arabic/English), multi-tenant architecture, role-based access control
- **Runtime:** Node.js (server-side operations required for Prisma, bcrypt, auth)

## Technology Stack

### Core
- **Framework:** Next.js 16.2.9 (App Router)
- **Runtime:** Node.js (NOT Edge compatible for auth/db operations)
- **Language:** TypeScript 5
- **CSS:** Tailwind CSS 4 (via @tailwindcss/postcss)
- **Styling:** PostCSS 4

### Database & ORM
- **ORM:** Prisma 7.8.0
- **Database Driver:** PostgreSQL (`pg` 8.21.0, `@prisma/adapter-pg` 7.8.0)
- **Migrations:** Prisma migrations with multi-tenant schema

### Authentication
- **Auth:** NextAuth 5.0.0-beta.31
- **Adapter:** @auth/prisma-adapter 2.11.2
- **Provider:** Credentials (email/password)
- **Session Strategy:** JWT

### Internationalization
- **i18n:** next-intl 4.13.0
- **Locales:** Arabic (ar), English (en)
- **Default:** Arabic
- **Config:** `i18n.ts`, `.next-intlrc.json`, `/messages/{ar,en}.json`

### UI & Forms
- **Component Library:** shadcn/ui, Radix UI 1.5.0
- **Icons:** lucide-react 1.18.0
- **Forms:** react-hook-form 7.78.0 with Zod 4.4.3 validation
- **Animations:** Custom Tailwind animations (no external plugin)

### Additional
- **Email:** nodemailer 7.0.13 (SMTP-based)
- **Crypto:** bcrypt 6.0.0 (password hashing)
- **QR Codes:** qrcode.react 4.2.0
- **Real-time:** Pusher 5.3.4

## Project Structure

```
/home/ziad/mazaya/
├── app/
│   ├── globals.css                 # Global styles (Tailwind + CSS variables)
│   ├── [locale]/                   # Internationalization route segment
│   │   ├── layout.tsx              # Root layout with i18n & font setup
│   │   ├── dashboard/
│   │   │   ├── layout.tsx          # Dashboard layout with sidebar
│   │   │   └── page.tsx            # Dashboard index (role-based routing)
│   │   ├── register/
│   │   │   ├── page.tsx            # Registration UI
│   │   │   ├── actions.ts          # Server actions (email OTP, account creation)
│   │   │   ├── _components/        # Sub-components
│   │   │   │   ├── register-card.tsx
│   │   │   │   ├── info-form.tsx
│   │   │   │   └── otp-form.tsx
│   │   │   ├── _utils/
│   │   │   │   └── validation.ts   # Zod schemas
│   │   │   └── hooks/
│   │   │       └── use-register-form.ts  # Form state management
│   │   ├── waiting-room/
│   │   │   └── page.tsx            # Tenant approval status page
│   │   └── login/                  # (Inferred from context)
│   └── api/
│       └── auth/
│           └── [...nextauth]/
│               └── route.ts        # NextAuth API route (runtime: nodejs)
├── auth/
│   ├── index.ts                    # NextAuth initialization with Credentials provider
│   ├── config.ts                   # Auth configuration (callbacks, pages)
│   └── actions.ts                  # Auth-related server actions (legacy?)
├── lib/
│   ├── db.ts                       # Prisma singleton with PrismaPg adapter
│   ├── mail.ts                     # Email utilities
│   └── utils.ts                    # General utilities
├── components/
│   ├── layout/
│   │   └── dashboard-sidebar.tsx   # Client component with role-based nav
│   └── ui/
│       └── button.tsx              # UI component
├── config/
│   └── dashboard-nav.ts            # Navigation config by role
├── types/
│   └── next-auth.d.ts              # NextAuth type augmentation
├── prisma/
│   ├── schema.prisma               # Database schema (multi-tenant)
│   └── migrations/                 # Migration history
├── messages/
│   ├── ar.json                     # Arabic translations
│   └── en.json                     # English translations
├── public/                         # Static assets
├── middleware.ts                   # Next.js middleware (auth + i18n)
├── i18n.ts                         # i18n configuration (next-intl)
├── .next-intlrc.json               # next-intl config file
├── next.config.ts                  # Next.js config
├── tailwind.config.ts              # Tailwind CSS config
├── tsconfig.json                   # TypeScript config
├── package.json                    # Dependencies
└── .env.local                      # Environment variables (NOT in repo)
```

## Key Configuration Files

### `next.config.ts`
```typescript
const nextConfig: NextConfig = {
  /* config options here */
};
export default nextConfig;
```
- Minimal config (no special settings needed)

### `tailwind.config.ts`
- Tailwind v4 setup with PostCSS
- Custom animations defined (fadeIn)
- NO external plugins (was trying to use `tailwindcss-animate` but not installed)
- CSS variables mapped to Tailwind theme colors

### `tsconfig.json`
- Path aliases: `@/` → root of project
- `strict: true`

### `.next-intlrc.json` (REQUIRED)
```json
{
  "i18nJs": "./i18n.ts"
}
```
- Tells next-intl where to find configuration
- **This file was missing and caused "Couldn't find next-intl config" error**

## Critical Files & Their Purposes

### `lib/db.ts` — Prisma Client Singleton
**Issue Fixed:** Prisma 7 requires either `adapter` or `accelerateUrl`
```typescript
import { PrismaPg } from "@prisma/adapter-pg";

const prismaClientSingleton = () => {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) throw new Error("DATABASE_URL must be set");
  
  return new PrismaClient({
    adapter: new PrismaPg(databaseUrl),
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });
};
```

### `auth/index.ts` — NextAuth Configuration
**Issue Fixed:** Moved Prisma/bcrypt imports into `authorize()` callback to avoid edge runtime bundling
- Top-level imports removed: `db`, `bcrypt`
- Dynamic imports used in credential provider's `authorize()` function
- `secret` has fallback: `process.env.NEXTAUTH_SECRET ?? process.env.AUTH_SECRET ?? "dev-secret"`

### `auth/config.ts` — Auth Config Object
**Issue Fixed:** Changed Prisma imports to type-only
```typescript
import type { TenantStatus, UserRole } from "@prisma/client";
```

### `app/api/auth/[...nextauth]/route.ts` — Auth API Route
**Issue Fixed:** Added `export const runtime = "nodejs";` to force Node.js runtime (NOT edge)

### `app/[locale]/register/actions.ts` — Registration Server Actions
**Issue Fixed:** 
- Removed `export const runtime = "nodejs";` (conflicts with server action detection)
- Keeps `"use server"` directive
- Exports `initiateRegistration()` and `confirmRegistration()` as named exports

### `app/globals.css` — Global Styles
**Issue Fixed:** Tailwind v4 doesn't recognize CSS variable-based `@apply` directives
```css
/* BEFORE (broken) */
body {
  @apply bg-background text-foreground;
}

/* AFTER (fixed) */
body {
  background-color: var(--background);
  color: var(--foreground);
  font-family: 'Cairo', 'Inter', sans-serif;
  direction: rtl;
}
```

## Environment Variables Required

```bash
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/mazaya

# Authentication
NEXTAUTH_SECRET=your-secret-here
# OR
AUTH_SECRET=your-secret-here

# Email (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=noreply@mazaya.com

# Optional: Prisma Accelerate (if using edge runtime)
PRISMA_ACCELERATE_URL=... (NOT needed with PrismaPg adapter)
```

## Database Schema Highlights

**Multi-tenant structure:**
- `Tenant` (workspace/restaurant)
  - status: PENDING | ACTIVE | SUSPENDED
  - slug: unique URL identifier
- `User` (team member)
  - role: OWNER | BRANCH_MANAGER | KITCHEN_STAFF | CASHIER | SUPER_ADMIN
  - tenantId: required relation to Tenant
- `Branch`, `Table`, `Category`, `MenuItem`, `Order`, `OrderItem`
- `VerificationToken` (for email OTP)
- `StaffInvitation` (for team onboarding)

## Middleware Flow

**`middleware.ts`:**
1. Imports `auth` from `@/auth/index` (wrapped with edge-safe callback)
2. Checks authentication status
3. Redirects based on route + tenant status:
   - Unauthenticated → `/login`
   - PENDING tenant → `/waiting-room`
   - ACTIVE + waiting-room → `/dashboard`
4. Applies i18n middleware (locale prefix)

**Critical:** Must be Node.js runtime (auth uses Prisma internally)

## Known Issues & Fixes Applied

| Issue | Root Cause | Fix |
|-------|-----------|-----|
| Prisma constructor validation error | Prisma 7 requires adapter | Added `PrismaPg` adapter in `lib/db.ts` |
| Edge runtime bundling Prisma | Auth module imported Prisma at module level | Moved db/bcrypt imports to `authorize()` callback |
| MissingSecret error | No AUTH_SECRET defined | Added fallback: `... ?? "dev-secret"` |
| Tailwind unknown utility classes | v4 doesn't support `@apply` with CSS variables | Replaced with direct CSS variable assignment |
| Missing next-intl config | `.next-intlrc.json` not created | Created config file pointing to `i18n.ts` |
| Server action exports not found | `runtime` export disabled detection | Removed `export const runtime` from actions.ts |

## Common Debugging Steps

1. **Clear Next.js cache:**
   ```bash
   rm -rf .next
   npm run dev
   ```

2. **Check TypeScript errors:**
   ```bash
   npx tsc --noEmit
   ```

3. **Verify env vars:**
   ```bash
   cat .env.local | grep DATABASE_URL AUTH_SECRET
   ```

4. **Check Prisma schema:**
   ```bash
   npx prisma validate
   ```

5. **Inspect middleware compilation:**
   - Look for `[middleware-edge]` in `.next/dev/server/edge/chunks/`
   - Should NOT see `db` or `bcrypt` imports at module level

## Testing the Flow

1. **Register:** POST `/api/auth/register` → email OTP sent
2. **Verify OTP:** POST `/api/auth/confirm` → account created, JWT issued
3. **Login:** POST `/api/auth/signin` → session established
4. **Dashboard:** GET `/dashboard` → checks auth + tenant status
5. **Logout:** POST `/api/auth/signout` → session cleared

## Performance Considerations

- **Database:** Single PrismaPg adapter instance (singleton pattern)
- **i18n:** Messages loaded per-request based on locale
- **Auth:** JWT tokens (stateless, no server-side sessions)
- **CSS:** Tailwind v4 with PostCSS (faster than Tailwind v3)

## Deployment Notes

- Requires **Node.js 18+** (Prisma adapter requirement)
- Edge runtime NOT supported for auth routes (use Node.js runtime)
- Environment variables must be set before build
- Database migrations should run before deploy
- `NEXTAUTH_SECRET` is required in production (no "dev-secret" fallback)

---

## Version Info

- Node.js: 18+ (recommended 20+)
- npm: 9+
- Next.js: 16.2.9
- TypeScript: 5.x
- Prisma: 7.8.0


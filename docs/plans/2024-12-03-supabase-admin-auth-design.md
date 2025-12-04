# Supabase Admin Auth Design

**Date:** December 3, 2024
**Status:** Approved

## Overview

Add Supabase Magic Link authentication to protect the CMS admin panel. Only whitelisted email addresses can access the admin.

## Authentication Flow

1. User clicks "Admin Login" in footer
2. Login page appears with email input field
3. User enters email and clicks "Send Magic Link"
4. System checks if email is in `ADMIN_EMAILS` env var
   - If not whitelisted: show error "Email not authorized"
   - If whitelisted: Supabase sends magic link email
5. User clicks link in email → redirected back to site with session
6. Session verified → CRM panel opens

### Session Handling

- Supabase manages tokens automatically (1-hour access, 1-week refresh)
- Session persists across browser refreshes
- "Exit Admin" button logs out and clears session

### Protected Access

- CRM only renders if user has valid session AND email is whitelisted
- Direct attempts to access admin without auth show login page

### Logout

- Click "Exit Admin" in CRM sidebar
- Clears Supabase session
- Returns to homepage

## File Structure

### New Files

```
├── lib/
│   └── supabase.ts          # Supabase client initialization
├── components/
│   └── AdminLogin.tsx       # Magic link login form
├── hooks/
│   └── useAuth.ts           # Auth state hook (session, user, loading)
```

### Modified Files

```
├── App.tsx                  # Add auth check before showing CRM
├── components/CRMSystem.tsx # Add logout handler
```

### Environment Variables (Vercel)

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_ADMIN_EMAILS=you@email.com,partner@email.com
```

## Component Details

### `lib/supabase.ts`

Creates and exports the Supabase client using environment variables.

### `hooks/useAuth.ts`

Returns:
- `user` - Current Supabase user object
- `session` - Current session
- `loading` - Auth state loading
- `isAdmin` - True only if authenticated AND email whitelisted
- `signIn(email)` - Sends magic link
- `signOut()` - Clears session

Behavior:
- Listens to Supabase auth state changes
- Checks user email against `VITE_ADMIN_EMAILS`
- `isAdmin = true` only if authenticated AND email whitelisted

### `components/AdminLogin.tsx`

- Email input with "Send Magic Link" button
- On submit:
  1. Check if email in whitelist → reject early if not (no email sent)
  2. Call `supabase.auth.signInWithOtp({ email })`
  3. Show "Check your email" success message
- Styled to match site aesthetic (brand colors, serif headings)

### `App.tsx` Changes

```typescript
// Current: showCRM state controls CRM visibility
// New: showCRM && isAdmin controls visibility

// Footer button behavior:
// - If not authenticated → show AdminLogin
// - If authenticated + whitelisted → show CRM
// - If authenticated but NOT whitelisted → show "Access Denied"
```

### Magic Link Redirect

- Supabase redirects to: `https://montessorimilestones.com`
- App detects session on load → auto-opens CRM if returning from magic link

## Setup Requirements

1. Create Supabase project at supabase.com
2. Enable Email auth provider in Supabase dashboard
3. Configure Site URL in Supabase: `https://montessorimilestones.com`
4. Add redirect URL: `https://montessorimilestones.com`
5. Add environment variables to Vercel
6. Install `@supabase/supabase-js` package

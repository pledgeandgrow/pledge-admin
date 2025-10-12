# Pledge Admin Portal

This is a [Next.js](https://nextjs.org) project for Pledge & Grow administrative portal with Supabase authentication.

## Features

- 🔐 **Authentication System**: Complete auth flow with Supabase (Sign in, Sign up, Password reset, Email verification)
- 🛡️ **Protected Routes**: Middleware-based route protection
- 👥 **User Management**: Profile management and role-based access
- 📊 **Admin Dashboard**: Comprehensive dashboard with analytics
- 🎨 **Modern UI**: Built with Tailwind CSS and shadcn/ui components

## Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account and project

## Setup

1. **Clone the repository**
```bash
git clone <repository-url>
cd pledge-admin
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**

Copy `.env.example` to `.env.local` and fill in your Supabase credentials:

```bash
cp .env.example .env.local
```

Edit `.env.local` with your Supabase project details:
```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

4. **Run the development server**

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Authentication Flow

The application uses Supabase for authentication with the following features:

### Available Routes

- **Public Routes**:
  - `/` - Landing page
  - `/auth/signin` - Sign in page
  - `/auth/signup` - Sign up page
  - `/auth/forgot-password` - Password reset request
  - `/auth/update-password` - Password update (after reset)
  - `/auth/verify-email` - Email verification page
  - `/auth/callback` - OAuth callback handler

- **Protected Routes**:
  - `/dashboard` - Main dashboard (requires authentication)
  - All other routes require authentication by default

### Authentication Features

1. **Email/Password Authentication**
   - Sign up with email verification
   - Sign in with credentials
   - Password reset via email
   - Session management with cookies

2. **Route Protection**
   - Middleware-based authentication check
   - Automatic redirect to sign-in for protected routes
   - Redirect to dashboard if already authenticated

3. **Session Management**
   - Automatic session refresh
   - Persistent sessions with cookies
   - Auth state synchronization across tabs

### Supabase Setup

Make sure your Supabase project has:

1. **Email Authentication** enabled in Authentication settings
2. **Email Templates** configured for:
   - Confirmation email
   - Password reset email
   - Email change confirmation
3. **Redirect URLs** configured:
   - Add `http://localhost:3000/auth/callback` for development
   - Add your production URL for deployment

## Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # Dashboard pages
│   └── layout.tsx         # Root layout with AuthProvider
├── components/            # React components
│   ├── auth/             # Auth-related components
│   └── ui/               # UI components (shadcn/ui)
├── contexts/             # React contexts
│   └── AuthContext.tsx   # Authentication context
├── hooks/                # Custom React hooks
├── lib/                  # Utility libraries
│   └── supabase.ts       # Supabase client configuration
└── middleware.ts         # Next.js middleware for route protection
```

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

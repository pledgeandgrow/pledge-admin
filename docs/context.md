# Project Context

## Overview
Pledge & Grow Admin is a comprehensive administrative dashboard built with Next.js, React, and Tailwind CSS. It serves as the internal management system for Pledge & Grow, providing tools for managing contacts, projects, finances, and various business operations.

## Purpose
The admin panel is designed to streamline internal operations, provide data visualization, and centralize management of all business aspects in a single, user-friendly interface.

## Architecture
- **Frontend**: Next.js 15.x with App Router, React 19.x, and Tailwind CSS 3.x
- **Backend**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth with custom user profile management
- **Styling**: Tailwind CSS with shadcn/ui components
- **State Management**: React Context API, custom hooks, and Zustand

## Key Features
- User authentication with email verification and password reset
- Dashboard with key metrics and activity overview
- Contact management system with categorization and realtime updates
- Client and lead management
- Financial management including invoices and expenses
- Calendar and scheduling system with event management
- Document management
- Task management

## User Roles
- Administrators: Full access to all features
- Staff Members: Limited access based on role assignments
- Clients: Limited access to specific projects and documents

## Development Approach
The application follows a component-based architecture with:
- Reusable UI components
- Custom hooks for data fetching and business logic
- Context providers for global state management
- Server-side rendering for improved performance and SEO
- Responsive design for all device sizes

## Integration Points
- Supabase for data storage, authentication, and realtime updates
- Email services for notifications and verification
- File storage for documents and assets
- Calendar integration for scheduling

## Authentication Flow
- **Registration**: Creates users in both Supabase Auth and custom users table
- **Email Verification**: Verifies email via auth/callback route
- **Login**: Authenticates users without creating profiles
- **Password Reset**: Secure flow with email confirmation
- **Profile Management**: Separate from authentication process

## Deployment
- **Platform**: Vercel
- **Database**: Supabase
- **Environment Variables**: Managed through Vercel

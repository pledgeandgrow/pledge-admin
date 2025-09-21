# Project Dependencies

## Core Framework
- **Next.js** (v15.5.2): React framework with server-side rendering and static site generation capabilities
- **React** (v19.0.0): JavaScript library for building user interfaces
- **React DOM** (v19.0.0): React package for DOM rendering
- **TypeScript** (v5.4.5): Typed superset of JavaScript

## UI Components and Styling
- **Tailwind CSS** (v3.4.1): Utility-first CSS framework
- **shadcn/ui**: Component library built on Radix UI primitives
- **Radix UI**: Unstyled, accessible UI components:
  - Accordion, Alert Dialog, Avatar, Checkbox, Dialog
  - Dropdown Menu, Label, Popover, Progress, Scroll Area
  - Select, Separator, Slider, Slot, Switch, Tabs
  - Toast, Toggle, Tooltip
- **Lucide React** (v0.358.0): Icon library
- **class-variance-authority** (v0.7.1): For creating variant components
- **clsx** (v2.1.1): Utility for constructing className strings
- **tailwind-merge** (v3.0.0): Merge Tailwind CSS classes without conflicts

## Data Management
- **Supabase** (v2.39.7): Open-source Firebase alternative
  - @supabase/ssr (v0.1.0): Server-side rendering utilities
- **Zustand** (v5.0.5): State management library
- **React Hook Form** (v7.51.0): Form state management
- **Zod** (v3.22.4): TypeScript-first schema validation
- **@hookform/resolvers** (v4.1.3): Form validation resolvers

## Data Visualization
- **Recharts** (v2.12.2): Charting library built on React components
- **@tanstack/react-table** (v8.13.2): Headless UI for building tables

## Calendar and Date Handling
- **FullCalendar** (v6.1.19): Calendar component with various views:
  - @fullcalendar/daygrid: Month view
  - @fullcalendar/timegrid: Week and day views
  - @fullcalendar/list: List view
  - @fullcalendar/interaction: Drag and drop, resizing
  - @fullcalendar/react: React wrapper
- **date-fns** (v4.1.0): Date utility library
- **react-day-picker** (v9.9.0): Flexible date picker component

## Rich Text Editing
- **TipTap** (v2.2.4): Headless, extensible rich text editor:
  - Multiple extensions for code blocks, highlighting, images, links
  - Table support (cells, headers, rows)
  - Task lists and text alignment

## PDF Generation and Document Handling
- **@react-pdf/renderer** (v4.2.2): Create PDFs using React
- **jspdf** (v3.0.1): Client-side PDF generation
- **jspdf-autotable** (v5.0.2): Table plugin for jsPDF
- **html2pdf.js** (v0.10.3): HTML to PDF conversion

## Utilities
- **uuid** (v11.0.0): Generate unique identifiers
- **next-themes** (v0.2.1): Theme management for Next.js

## Development Tools
- **ESLint** (v9.0.0): JavaScript linting utility
- **PostCSS** (v8.4.38): Tool for transforming CSS with JavaScript
- **@types packages**: TypeScript type definitions for various libraries

## Environment Requirements
- **Node.js**: v18.0.0 or higher required
- **npm**: v9.0.0 or higher recommended
- **PostgreSQL**: v14 or higher (via Supabase)

## Browser Support
- Modern evergreen browsers (Chrome, Firefox, Safari, Edge)
- Not optimized for Internet Explorer

## Deployment
- **Vercel**: Recommended deployment platform
- **Supabase**: Database and authentication services

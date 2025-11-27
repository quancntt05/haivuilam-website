# Frontend - Photo Sharing Application

Frontend application built with Next.js 16, TypeScript, Ant Design, and TailwindCSS.

## Getting Started

### Installation

1. Install dependencies:
```bash
cd frontend
npm install
```

2. Setup environment variables:
```bash
cp .env.example .env
```

3. Run development server:
```bash
npm run dev
```

The application will run on `http://localhost:3000`

## Project Structure

```
frontend/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (auth)/             # Authentication routes group
│   │   │   └── login/           # Login page
│   │   ├── (protected)/         # Protected routes group
│   │   │   ├── upload/          # Photo upload page
│   │   │   └── profile/         # User profile page
│   │   ├── photos/              # Public photo routes
│   │   │   └── [id]/            # Photo detail page
│   │   ├── api/                 # Next.js API routes (proxies to backend)
│   │   │   ├── auth/            # Authentication API routes
│   │   │   ├── photos/          # Photo API routes
│   │   │   ├── comments/        # Comment API routes
│   │   │   └── images/          # Image proxy routes
│   │   ├── layout.tsx           # Root layout
│   │   ├── page.tsx            # Home page
│   │   ├── error.tsx           # Global error boundary
│   │   └── not-found.tsx       # 404 page
│   ├── components/              # React components
│   │   ├── auth/               # Authentication components
│   │   │   └── LoginButton.tsx
│   │   ├── comment/            # Comment-related components
│   │   │   ├── CommentForm.tsx
│   │   │   ├── CommentItem.tsx
│   │   │   └── CommentList.tsx
│   │   ├── common/             # Common/reusable components
│   │   │   ├── ErrorBoundary.tsx
│   │   │   ├── ErrorDisplay.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── Header.tsx
│   │   │   ├── Loading.tsx
│   │   │   └── SkeletonLoader.tsx
│   │   └── photo/              # Photo-related components
│   │       ├── PhotoCard.tsx
│   │       ├── PhotoDetail.tsx
│   │       ├── PhotoGrid.tsx
│   │       └── PhotoUpload.tsx
│   ├── hooks/                  # Custom React hooks
│   │   ├── useAuth.ts          # Authentication hook
│   │   ├── useComments.ts      # Comments management hook
│   │   └── usePhotos.ts        # Photos management hook
│   ├── layouts/                # Layout components
│   │   ├── AuthLayout.tsx      # Layout for auth pages
│   │   └── MainLayout.tsx      # Main app layout (with header/footer)
│   ├── lib/                    # Utilities and API clients
│   │   ├── api/                # API client functions
│   │   │   ├── auth.api.ts
│   │   │   ├── client.ts       # Axios instance
│   │   │   ├── comment.api.ts
│   │   │   └── photo.api.ts
│   │   ├── constants/          # Constants
│   │   │   └── api.constants.ts
│   │   └── utils/              # Utility functions
│   │       ├── errorHandler.ts
│   │       └── validation.ts
│   ├── providers/              # Context providers
│   │   └── AuthProvider.tsx    # Authentication context provider
│   ├── styles/                 # Global styles
│   │   └── globals.css         # Global CSS and TailwindCSS
│   └── types/                  # TypeScript type definitions
│       ├── auth.types.ts
│       ├── comment.types.ts
│       ├── form.types.ts
│       ├── photo.types.ts
│       ├── index.ts
│       └── next-auth.d.ts
├── public/                     # Static files
│   └── images/                 # Static images
├── next.config.js              # Next.js configuration
├── tsconfig.json               # TypeScript configuration
└── package.json               # Dependencies and scripts
```


## Deployment

### Build for Production

```bash
npm run build
```

This creates an optimized production build in the `.next` directory.

### Start Production Server

```bash
npm start
```

## License

ISC

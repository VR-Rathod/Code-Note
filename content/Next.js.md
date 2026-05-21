---
seoTitle: Next.js Complete Reference – React Framework Guide
description: "Comprehensive Next.js reference covering App Router, Pages Router, SSR, SSG, ISR, Server Components, API routes, data fetching, middleware, and deployment."
keywords: "nextjs, next.js, react framework, app router, pages router, SSR, SSG, ISR, server components, api routes, data fetching, middleware, vercel, typescript, nextjs notes, nextjs cheatsheet, nextjs guide, react fullstack, VR-Rathod, Code-Note, code note vr, vr book"
---

- # History
	- **Created by**: Guillermo Rauch and the Vercel (formerly Zeit) team in 2016.
	- **Why**: React alone is a client-side library — no SSR, no routing, no file-based pages. Next.js adds all of that on top.
	- **Key releases**:
		- Next.js 9 (2019) — API Routes, dynamic routing.
		- Next.js 13 (2022) — App Router (beta), Server Components, Layouts.
		- Next.js 14 (2023) — App Router stable, Server Actions stable.
		- Next.js 15 (2024) — React 19, improved caching, Turbopack stable.
-
- # Introduction
	- **Next.js** is a React framework for building full-stack web applications.
	- Handles routing, rendering, data fetching, bundling, and optimization out of the box.
	- Two routers: **App Router** (modern, recommended) and **Pages Router** (legacy, still supported).
	- Deployed easily on **Vercel** — also works on any Node.js server or Docker.
	-
	- ## Advantages
		- File-based routing — no router config needed.
		- Multiple rendering modes: SSR, SSG, ISR, CSR — per page.
		- Server Components — run React on the server, zero JS sent to client.
		- Built-in image, font, and script optimization.
		- API routes — build backend endpoints in the same project.
		- TypeScript support out of the box.
		- Excellent DX — fast refresh, error overlay, Turbopack.
	-
	- ## Disadvantages
		- App Router has a learning curve (Server vs Client Components).
		- Caching behavior is complex and sometimes surprising.
		- Vendor lock-in risk with Vercel-specific features.
		- Large bundle size for complex apps.
		- Opinionated — less flexible than plain React + Vite.
- # Setup
  collapsed:: true
	- ## Create New Project
	  collapsed:: true
		- ```bash
		  npx create-next-app@latest my-app
		  # prompts: TypeScript? ESLint? Tailwind? App Router? src/ dir?
		  
		  cd my-app
		  npm run dev      # start dev server (localhost:3000)
		  npm run build    # production build
		  npm run start    # start production server
		  npm run lint     # run ESLint
		  ```
	-
	- ## Project Structure (App Router)
	  collapsed:: true
		- ```
		  my-app/
		  ├── app/
		  │   ├── layout.tsx          ← root layout (wraps all pages)
		  │   ├── page.tsx            ← home page  /
		  │   ├── globals.css
		  │   ├── about/
		  │   │   └── page.tsx        ← /about
		  │   ├── blog/
		  │   │   ├── page.tsx        ← /blog
		  │   │   └── [slug]/
		  │   │       └── page.tsx    ← /blog/:slug
		  │   └── api/
		  │       └── users/
		  │           └── route.ts    ← /api/users
		  ├── components/
		  ├── lib/
		  ├── public/                 ← static files (images, fonts)
		  ├── next.config.js
		  └── package.json
		  ```
- # App Router — Core Concepts
  collapsed:: true
	- ## File Conventions
	  collapsed:: true
		- ```
		  File              Purpose
		  page.tsx          UI for a route — makes route publicly accessible
		  layout.tsx        Shared UI wrapping child routes (persists on navigation)
		  loading.tsx       Loading UI (Suspense boundary) shown while page loads
		  error.tsx         Error UI for the segment (must be Client Component)
		  not-found.tsx     UI for notFound() calls or unmatched routes
		  route.ts          API endpoint (no UI)
		  template.tsx      Like layout but re-mounts on navigation
		  middleware.ts     Runs before requests (at root, not in app/)
		  ```
	-
	- ## page.tsx
	  collapsed:: true
		- ```tsx
		  // app/page.tsx — home route /
		  export default function HomePage() {
		      return <h1>Hello World</h1>;
		  }
		  
		  // app/blog/[slug]/page.tsx — dynamic route /blog/:slug
		  interface Props {
		      params: { slug: string };
		      searchParams: { [key: string]: string };
		  }
		  
		  export default function BlogPost({ params, searchParams }: Props) {
		      return <h1>Post: {params.slug}</h1>;
		  }
		  ```
	-
	- ## layout.tsx
	  collapsed:: true
		- ```tsx
		  // app/layout.tsx — root layout (required)
		  import type { Metadata } from 'next';
		  
		  export const metadata: Metadata = {
		      title: 'My App',
		      description: 'My Next.js application',
		  };
		  
		  export default function RootLayout({
		      children,
		  }: {
		      children: React.ReactNode;
		  }) {
		      return (
		          <html lang="en">
		              <body>
		                  <nav>Navigation</nav>
		                  {children}
		                  <footer>Footer</footer>
		              </body>
		          </html>
		      );
		  }
		  ```
	-
	- ## loading.tsx & error.tsx
	  collapsed:: true
		- ```tsx
		  // app/blog/loading.tsx — shown while page.tsx is loading
		  export default function Loading() {
		      return <div>Loading posts...</div>;
		  }
		  
		  // app/blog/error.tsx — must be Client Component
		  'use client';
		  
		  export default function Error({
		      error,
		      reset,
		  }: {
		      error: Error;
		      reset: () => void;
		  }) {
		      return (
		          <div>
		              <h2>Something went wrong: {error.message}</h2>
		              <button onClick={reset}>Try again</button>
		          </div>
		      );
		  }
		  ```
- # Server vs Client Components
  collapsed:: true
	- ## Comparison
	  collapsed:: true
		- ```
		  Feature                    Server Component       Client Component
		  Default in App Router      Yes                    No (opt-in)
		  Directive                  (none)                 'use client' at top
		  Runs on                    Server only            Browser (+ server hydration)
		  Access DB / secrets        Yes                    No
		  Use useState / useEffect   No                     Yes
		  Use browser APIs           No                     Yes
		  JS sent to client          No                     Yes
		  Can fetch data directly    Yes                    Via useEffect / SWR
		  ```
	-
	- ## Server Component (default)
	  collapsed:: true
		- ```tsx
		  // No 'use client' — this is a Server Component
		  // Can be async, can fetch data, can access DB
		  
		  async function getPosts() {
		      const res = await fetch('https://api.example.com/posts');
		      return res.json();
		  }
		  
		  export default async function BlogPage() {
		      const posts = await getPosts(); // runs on server
		  
		      return (
		          <ul>
		              {posts.map(post => (
		                  <li key={post.id}>{post.title}</li>
		              ))}
		          </ul>
		      );
		  }
		  ```
	-
	- ## Client Component
	  collapsed:: true
		- ```tsx
		  'use client'; // must be first line
		  
		  import { useState } from 'react';
		  
		  export default function Counter() {
		      const [count, setCount] = useState(0);
		  
		      return (
		          <div>
		              <p>Count: {count}</p>
		              <button onClick={() => setCount(c => c + 1)}>
		                  Increment
		              </button>
		          </div>
		      );
		  }
		  ```
	-
	- ## Mixing Server & Client
	  collapsed:: true
		- ```tsx
		  // Server Component — fetches data
		  import LikeButton from './LikeButton'; // Client Component
		  
		  export default async function Post({ id }: { id: string }) {
		      const post = await db.posts.findById(id); // server-only
		  
		      return (
		          <article>
		              <h1>{post.title}</h1>
		              <p>{post.content}</p>
		              {/* Pass serializable data to Client Component */}
		              <LikeButton postId={post.id} initialLikes={post.likes} />
		          </article>
		      );
		  }
		  ```
- # Data Fetching
  collapsed:: true
	- ## fetch in Server Components
	  collapsed:: true
		- ```tsx
		  // Default: cached (like SSG)
		  const data = await fetch('https://api.example.com/data');
		  
		  // No cache (like SSR — fresh every request)
		  const data = await fetch('https://api.example.com/data', {
		      cache: 'no-store',
		  });
		  
		  // Revalidate every N seconds (like ISR)
		  const data = await fetch('https://api.example.com/data', {
		      next: { revalidate: 60 }, // revalidate every 60 seconds
		  });
		  
		  // Tag-based revalidation
		  const data = await fetch('https://api.example.com/posts', {
		      next: { tags: ['posts'] },
		  });
		  ```
	-
	- ## Rendering Modes
	  collapsed:: true
		- ```
		  Mode    How                              When to use
		  SSG     fetch() with cache (default)     Static content, rarely changes
		  SSR     fetch() with cache: 'no-store'   User-specific, real-time data
		  ISR     fetch() with next.revalidate      Mostly static, periodic updates
		  CSR     useEffect / SWR / React Query     Client-only, interactive data
		  ```
	-
	- ## generateStaticParams — Static dynamic routes
	  collapsed:: true
		- ```tsx
		  // app/blog/[slug]/page.tsx
		  
		  // Tell Next.js which slugs to pre-render at build time
		  export async function generateStaticParams() {
		      const posts = await fetch('https://api.example.com/posts').then(r => r.json());
		  
		      return posts.map((post: { slug: string }) => ({
		          slug: post.slug,
		      }));
		  }
		  
		  export default function BlogPost({ params }: { params: { slug: string } }) {
		      return <h1>{params.slug}</h1>;
		  }
		  ```
	-
	- ## Revalidation
	  collapsed:: true
		- ```ts
		  // Revalidate by tag (call from Server Action or API route)
		  import { revalidateTag, revalidatePath } from 'next/cache';
		  
		  revalidateTag('posts');          // invalidate all fetches tagged 'posts'
		  revalidatePath('/blog');         // invalidate specific path
		  revalidatePath('/blog/[slug]', 'page'); // invalidate dynamic path
		  ```
- # API Routes (Route Handlers)
  collapsed:: true
	- ## Basic Route Handler
	  collapsed:: true
		- ```ts
		  // app/api/users/route.ts
		  import { NextRequest, NextResponse } from 'next/server';
		  
		  // GET /api/users
		  export async function GET(request: NextRequest) {
		      const users = await db.users.findAll();
		      return NextResponse.json(users);
		  }
		  
		  // POST /api/users
		  export async function POST(request: NextRequest) {
		      const body = await request.json();
		      const user = await db.users.create(body);
		      return NextResponse.json(user, { status: 201 });
		  }
		  ```
	-
	- ## Dynamic Route Handler
	  collapsed:: true
		- ```ts
		  // app/api/users/[id]/route.ts
		  import { NextRequest, NextResponse } from 'next/server';
		  
		  export async function GET(
		      request: NextRequest,
		      { params }: { params: { id: string } }
		  ) {
		      const user = await db.users.findById(params.id);
		      if (!user) return NextResponse.json({ error: 'Not found' }, { status: 404 });
		      return NextResponse.json(user);
		  }
		  
		  export async function PUT(
		      request: NextRequest,
		      { params }: { params: { id: string } }
		  ) {
		      const body = await request.json();
		      const user = await db.users.update(params.id, body);
		      return NextResponse.json(user);
		  }
		  
		  export async function DELETE(
		      request: NextRequest,
		      { params }: { params: { id: string } }
		  ) {
		      await db.users.delete(params.id);
		      return new NextResponse(null, { status: 204 });
		  }
		  ```
	-
	- ## Request Helpers
	  collapsed:: true
		- ```ts
		  const url = request.nextUrl;
		  const searchParams = url.searchParams;
		  const page = searchParams.get('page') ?? '1';
		  
		  const headers = request.headers;
		  const token = headers.get('authorization');
		  
		  const cookies = request.cookies;
		  const session = cookies.get('session')?.value;
		  
		  // Response with headers/cookies
		  const response = NextResponse.json({ ok: true });
		  response.cookies.set('token', 'abc', { httpOnly: true });
		  response.headers.set('X-Custom', 'value');
		  return response;
		  ```
- # Server Actions
  collapsed:: true
	- ## What Are Server Actions
	  collapsed:: true
		- Functions that run on the server — called directly from Client Components.
		- No need to create an API route for form submissions and mutations.
		- Mark with `'use server'` directive.
	-
	- ## Form with Server Action
	  collapsed:: true
		- ```tsx
		  // app/actions.ts
		  'use server';
		  
		  import { revalidatePath } from 'next/cache';
		  import { redirect } from 'next/navigation';
		  
		  export async function createPost(formData: FormData) {
		      const title = formData.get('title') as string;
		      const content = formData.get('content') as string;
		  
		      await db.posts.create({ title, content });
		  
		      revalidatePath('/blog');
		      redirect('/blog');
		  }
		  ```
		- ```tsx
		  // app/blog/new/page.tsx — Server Component
		  import { createPost } from '../actions';
		  
		  export default function NewPostPage() {
		      return (
		          <form action={createPost}>
		              <input name="title" placeholder="Title" required />
		              <textarea name="content" placeholder="Content" />
		              <button type="submit">Create Post</button>
		          </form>
		      );
		  }
		  ```
	-
	- ## Server Action in Client Component
	  collapsed:: true
		- ```tsx
		  'use client';
		  
		  import { createPost } from '../actions';
		  import { useTransition } from 'react';
		  
		  export default function PostForm() {
		      const [isPending, startTransition] = useTransition();
		  
		      function handleSubmit(formData: FormData) {
		          startTransition(async () => {
		              await createPost(formData);
		          });
		      }
		  
		      return (
		          <form action={handleSubmit}>
		              <input name="title" />
		              <button disabled={isPending}>
		                  {isPending ? 'Creating...' : 'Create'}
		              </button>
		          </form>
		      );
		  }
		  ```
- # Routing
  collapsed:: true
	- ## Dynamic Routes
	  collapsed:: true
		- ```
		  app/blog/[slug]/page.tsx        → /blog/hello-world
		  app/shop/[...slug]/page.tsx     → /shop/a/b/c  (catch-all)
		  app/shop/[[...slug]]/page.tsx   → /shop  AND  /shop/a/b  (optional catch-all)
		  app/(marketing)/about/page.tsx  → /about  (route group — no URL segment)
		  app/@modal/(.)photo/page.tsx    → parallel route / intercepting route
		  ```
	-
	- ## Navigation
	  collapsed:: true
		- ```tsx
		  import Link from 'next/link';
		  import { useRouter } from 'next/navigation'; // App Router
		  
		  // Declarative navigation
		  <Link href="/about">About</Link>
		  <Link href={`/blog/${slug}`}>Post</Link>
		  <Link href="/blog" prefetch={false}>Blog</Link>
		  
		  // Programmatic navigation (Client Component only)
		  const router = useRouter();
		  router.push('/dashboard');
		  router.replace('/login');   // no history entry
		  router.back();
		  router.refresh();           // re-fetch server data for current route
		  
		  // Read current path/params
		  import { usePathname, useSearchParams } from 'next/navigation';
		  const pathname = usePathname();       // '/blog/hello'
		  const searchParams = useSearchParams();
		  const page = searchParams.get('page');
		  ```
	-
	- ## Redirect & notFound
	  collapsed:: true
		- ```ts
		  import { redirect, notFound } from 'next/navigation';
		  
		  // In Server Components / Server Actions
		  if (!user) redirect('/login');
		  if (!post) notFound();  // renders not-found.tsx
		  
		  // Permanent redirect
		  import { permanentRedirect } from 'next/navigation';
		  permanentRedirect('/new-url');
		  ```
- # Middleware
  collapsed:: true
	- ## middleware.ts
	  collapsed:: true
		- Runs at the Edge before every request — before rendering and API routes.
		- Place at project root (same level as `app/`).
		- ```ts
		  // middleware.ts
		  import { NextResponse } from 'next/server';
		  import type { NextRequest } from 'next/server';
		  
		  export function middleware(request: NextRequest) {
		      const token = request.cookies.get('token')?.value;
		      const isAuthPage = request.nextUrl.pathname.startsWith('/login');
		      const isProtected = request.nextUrl.pathname.startsWith('/dashboard');
		  
		      if (isProtected && !token) {
		          return NextResponse.redirect(new URL('/login', request.url));
		      }
		  
		      if (isAuthPage && token) {
		          return NextResponse.redirect(new URL('/dashboard', request.url));
		      }
		  
		      return NextResponse.next();
		  }
		  
		  // Only run middleware on these paths
		  export const config = {
		      matcher: ['/dashboard/:path*', '/login'],
		  };
		  ```
- # Metadata & SEO
  collapsed:: true
	- ## Static Metadata
	  collapsed:: true
		- ```tsx
		  import type { Metadata } from 'next';
		  
		  export const metadata: Metadata = {
		      title: 'My Blog',
		      description: 'A blog about web development',
		      keywords: ['nextjs', 'react', 'typescript'],
		      openGraph: {
		          title: 'My Blog',
		          description: 'A blog about web development',
		          images: ['/og-image.png'],
		      },
		      twitter: {
		          card: 'summary_large_image',
		          title: 'My Blog',
		      },
		  };
		  ```
	-
	- ## Dynamic Metadata
	  collapsed:: true
		- ```tsx
		  // app/blog/[slug]/page.tsx
		  import type { Metadata } from 'next';
		  
		  export async function generateMetadata(
		      { params }: { params: { slug: string } }
		  ): Promise<Metadata> {
		      const post = await getPost(params.slug);
		  
		      return {
		          title: post.title,
		          description: post.excerpt,
		          openGraph: {
		              images: [post.coverImage],
		          },
		      };
		  }
		  ```
- # Built-in Components
  collapsed:: true
	- ## Image Optimization
	  collapsed:: true
		- ```tsx
		  import Image from 'next/image';
		  
		  // Local image (auto width/height from import)
		  import profilePic from './profile.jpg';
		  <Image src={profilePic} alt="Profile" />
		  
		  // Remote image (must specify width + height)
		  <Image
		      src="https://example.com/photo.jpg"
		      alt="Photo"
		      width={800}
		      height={600}
		      priority          // load eagerly (above the fold)
		      placeholder="blur" // show blur while loading
		  />
		  
		  // Fill parent container
		  <div style={{ position: 'relative', height: '400px' }}>
		      <Image src="/hero.jpg" alt="Hero" fill style={{ objectFit: 'cover' }} />
		  </div>
		  ```
	-
	- ## Font Optimization
	  collapsed:: true
		- ```tsx
		  // app/layout.tsx
		  import { Inter, Roboto_Mono } from 'next/font/google';
		  
		  const inter = Inter({
		      subsets: ['latin'],
		      variable: '--font-inter',
		  });
		  
		  export default function RootLayout({ children }) {
		      return (
		          <html lang="en" className={inter.variable}>
		              <body className={inter.className}>{children}</body>
		          </html>
		      );
		  }
		  ```
	-
	- ## Script Loading
	  collapsed:: true
		- ```tsx
		  import Script from 'next/script';
		  
		  // afterInteractive — load after page is interactive (default)
		  <Script src="https://analytics.example.com/script.js" strategy="afterInteractive" />
		  
		  // lazyOnload — load during idle time
		  <Script src="https://widget.example.com/chat.js" strategy="lazyOnload" />
		  
		  // beforeInteractive — load before hydration (use sparingly)
		  <Script src="/critical.js" strategy="beforeInteractive" />
		  ```
- # next.config.js
  collapsed:: true
	- ```js
	  /** @type {import('next').NextConfig} */
	  const nextConfig = {
	      // Allow images from external domains
	      images: {
	          remotePatterns: [
	              { protocol: 'https', hostname: 'images.unsplash.com' },
	              { protocol: 'https', hostname: '**.example.com' },
	          ],
	      },
	  
	      // Redirects
	      async redirects() {
	          return [
	              { source: '/old-blog/:slug', destination: '/blog/:slug', permanent: true },
	          ];
	      },
	  
	      // Rewrites (proxy without redirect)
	      async rewrites() {
	          return [
	              { source: '/api/v1/:path*', destination: 'https://api.example.com/:path*' },
	          ];
	      },
	  
	      // Environment variables exposed to browser
	      env: {
	          NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
	      },
	  
	      // Enable React strict mode
	      reactStrictMode: true,
	  };
	  
	  module.exports = nextConfig;
	  ```
-
- # Environment Variables
  collapsed:: true
	- ```bash
	  # .env.local — never commit
	  DB_URL=postgresql://localhost/mydb
	  JWT_SECRET=supersecret
	  
	  # Exposed to browser — prefix with NEXT_PUBLIC_
	  NEXT_PUBLIC_API_URL=https://api.example.com
	  NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
	  ```
	- ```ts
	  // Server-only (safe)
	  process.env.DB_URL
	  process.env.JWT_SECRET
	  
	  // Client-accessible (public)
	  process.env.NEXT_PUBLIC_API_URL
	  ```
-
- # App Router vs Pages Router
  collapsed:: true
	- ```
	  Feature                App Router (13+)        Pages Router (legacy)
	  Default component      Server Component        Client Component
	  Data fetching          async/await in comp     getServerSideProps / getStaticProps
	  Layouts                layout.tsx (nested)     _app.tsx (single)
	  Loading states         loading.tsx             Manual
	  Error boundaries       error.tsx               Manual
	  API routes             app/api/route.ts        pages/api/*.ts
	  Streaming / Suspense   Built-in                Manual
	  Server Actions         Yes                     No
	  Recommended            Yes (new projects)      Existing projects
	  ```
-
- # Key Takeaways
	- Next.js = React + routing + rendering + optimization in one framework.
	- **App Router** is the modern way — use it for all new projects.
	- Default components are **Server Components** — add `'use client'` only when needed.
	- Three caching strategies: `cache` (SSG), `no-store` (SSR), `revalidate` (ISR).
	- **Server Actions** replace most API routes for mutations.
	- **Middleware** runs at the Edge — perfect for auth redirects.
	- Prefix env vars with `NEXT_PUBLIC_` to expose them to the browser.
-
- # Useful Links
	- Official Docs: https://nextjs.org/docs
	- App Router Docs: https://nextjs.org/docs/app
	- Learn Next.js: https://nextjs.org/learn
	- Vercel Deploy: https://vercel.com
	- Awesome Next.js: https://github.com/unicodeveloper/awesome-nextjs
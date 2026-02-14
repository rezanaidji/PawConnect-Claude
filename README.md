<p align="center">
<h1 align="center">React Supabase Auth with Protected Routes</h1>
</p>

<p align="center">
<img src="remove_me.png" width="450">
</p>

[**`App Demo`**](https://react-supabase-auth-template.vercel.app/)

## Features

- Protected Routes
- Supabase Session Object in Global Context via `useSession`
- User Authentication
- Routing and Route Guards

It's also blazingly fast. [Try it out for yourself.](https://react-supabase-auth-template.vercel.app/)

[We also have a similar template for FIREBASE](https://github.com/mmvergara/react-firebase-auth-template)

---

## Architecture Overview

### High-Level Architecture

```mermaid
flowchart TB
    subgraph Client["Browser Client"]
        UI["React UI Layer"]
        Router["React Router v7"]
        Context["Session Context"]
        SupaClient["Supabase Client"]
    end

    subgraph Supabase["Supabase Backend"]
        Auth["Auth Service"]
        DB["PostgreSQL Database"]
        Storage["Storage"]
    end

    UI --> Router
    Router --> Context
    Context --> SupaClient
    SupaClient <-->|"HTTPS/WebSocket"| Auth
    Auth --> DB

    style Client fill:#2a2a2a,stroke:#3ecf8e,color:#fff
    style Supabase fill:#1c1c1c,stroke:#3ecf8e,color:#fff
```

### Component Hierarchy

```mermaid
flowchart TD
    main["main.tsx<br/><i>Entry Point</i>"]
    router["RouterProvider<br/><i>React Router</i>"]
    providers["Providers.tsx<br/><i>SessionProvider Wrapper</i>"]

    subgraph Public["Public Routes"]
        home["HomePage<br/>/"]
        signin["SignInPage<br/>/auth/sign-in"]
        signup["SignUpPage<br/>/auth/sign-up"]
    end

    subgraph Protected["Protected Routes"]
        authRoute["AuthProtectedRoute<br/><i>Route Guard</i>"]
        protectedPage["ProtectedPage<br/>/protected"]
    end

    notfound["NotFoundPage<br/>/*"]
    loading["LoadingPage<br/><i>Initial Load</i>"]

    main --> router
    router --> providers
    providers --> home
    providers --> signin
    providers --> signup
    providers --> authRoute
    authRoute -->|"session exists"| protectedPage
    authRoute -->|"no session"| notfound
    providers --> notfound
    providers -.->|"isLoading"| loading

    style main fill:#3ecf8e,stroke:#229f65,color:#000
    style providers fill:#3ecf8e,stroke:#229f65,color:#000
    style authRoute fill:#f59e0b,stroke:#d97706,color:#000
    style Protected fill:#2a2a2a,stroke:#f59e0b,color:#fff
    style Public fill:#2a2a2a,stroke:#3ecf8e,color:#fff
```

### Data Flow

```mermaid
flowchart LR
    subgraph Components["React Components"]
        HomePage
        SignInPage
        SignUpPage
        ProtectedPage
    end

    subgraph Context["State Management"]
        SessionProvider["SessionProvider<br/><i>Provides session state</i>"]
        useSession["useSession()<br/><i>Custom Hook</i>"]
    end

    subgraph Supabase["Supabase Auth"]
        signUp["signUp()"]
        signIn["signInWithPassword()"]
        signOut["signOut()"]
        authListener["onAuthStateChange()"]
    end

    SignUpPage -->|"credentials"| signUp
    SignInPage -->|"credentials"| signIn
    HomePage -->|"logout"| signOut

    signUp -->|"triggers"| authListener
    signIn -->|"triggers"| authListener
    signOut -->|"triggers"| authListener

    authListener -->|"updates"| SessionProvider
    SessionProvider -->|"provides"| useSession
    useSession -->|"session data"| Components

    style Context fill:#3ecf8e,stroke:#229f65,color:#000
    style Supabase fill:#1c1c1c,stroke:#3ecf8e,color:#fff
```

### Authentication & Routing Integration

```mermaid
sequenceDiagram
    participant User
    participant App as React App
    participant Router as React Router
    participant Context as SessionContext
    participant Supabase as Supabase Auth

    Note over App,Supabase: Initial Load
    App->>Context: Mount SessionProvider
    Context->>Supabase: Subscribe to onAuthStateChange
    Supabase-->>Context: Return initial session (or null)
    Context->>App: Set isLoading=false

    Note over User,Supabase: Sign In Flow
    User->>App: Navigate to /auth/sign-in
    Router->>App: Render SignInPage
    User->>App: Submit credentials
    App->>Supabase: signInWithPassword(email, password)
    Supabase-->>Context: Emit auth state change
    Context->>App: Update session state
    App->>Router: Navigate to /

    Note over User,Supabase: Accessing Protected Route
    User->>Router: Navigate to /protected
    Router->>App: Render AuthProtectedRoute
    App->>Context: Check useSession()
    alt Has Session
        Context-->>App: Return session
        App->>Router: Render ProtectedPage
    else No Session
        Context-->>App: Return null
        App->>Router: Render NotFoundPage
    end

    Note over User,Supabase: Sign Out Flow
    User->>App: Click Sign Out
    App->>Supabase: signOut()
    Supabase-->>Context: Emit auth state change (null)
    Context->>App: Clear session state
    App->>Router: Re-render (session = null)
```

### Project Structure

```mermaid
flowchart TD
    subgraph Root["Project Root"]
        index["index.html"]
        pkg["package.json"]
        vite["vite.config.ts"]
        env[".env.local"]
    end

    subgraph Src["src/"]
        main["main.tsx"]
        prov["Providers.tsx"]
        config["config.ts"]
        css["index.css"]

        subgraph Pages["pages/"]
            home["HomePage.tsx"]
            protected["ProtectedPage.tsx"]
            loading["LoadingPage.tsx"]
            notfound["404Page.tsx"]

            subgraph AuthPages["auth/"]
                signIn["SignInPage.tsx"]
                signUp["SignUpPage.tsx"]
            end
        end

        subgraph ContextDir["context/"]
            session["SessionContext.tsx"]
        end

        subgraph RouterDir["router/"]
            routerIndex["index.tsx"]
            authProtected["AuthProtectedRoute.tsx"]
        end

        subgraph SupaDir["supabase/"]
            supaIndex["index.ts"]
        end
    end

    main --> prov
    main --> routerIndex
    prov --> session
    routerIndex --> authProtected
    supaIndex --> config

    style Root fill:#1c1c1c,stroke:#4a4a4a,color:#fff
    style Src fill:#2a2a2a,stroke:#3ecf8e,color:#fff
    style Pages fill:#3a3a3a,stroke:#3ecf8e,color:#fff
    style ContextDir fill:#3a3a3a,stroke:#f59e0b,color:#fff
    style RouterDir fill:#3a3a3a,stroke:#3b82f6,color:#fff
    style SupaDir fill:#3a3a3a,stroke:#3ecf8e,color:#fff
```

### Tech Stack

| Layer | Technology |
|-------|------------|
| UI Framework | React 19 |
| Routing | React Router v7.6 |
| State Management | React Context API |
| Backend | Supabase (Auth, PostgreSQL) |
| Build Tool | Vite 6 |
| Language | TypeScript 5.7 |
| Styling | CSS |

---

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Create `.env` using the `.env.example` as a template
```
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```
4. Run the app: `npm run dev`

## What you need to know

- `/router/index.tsx` is where you declare your routes
- `/context/SessionContext.tsx` is where you can find the `useSession` hook
  - This hook gives you access to the `session` object from Supabase globally
- `/Providers.tsx` is where you can add more `providers` or `wrappers`

## Other Supabase Templates

- [React ShadCN Supabase Auth Template](https://github.com/mmvergara/react-supabase-shadcn-auth-template)
- [NextJs ShadCN Supabase Auth Template](https://github.com/mmvergara/nextjs-shadcn-supabase-auth-starter)

## More Starter Templates

- [NextJs MongoDB Prisma Auth Template](https://github.com/mmvergara/nextjs-mongodb-prisma-auth-template)
- [NextJs Discord Bot Template](https://github.com/mmvergara/nextjs-discord-bot-boilerplate)
- [React Firebase Auth Template](https://github.com/mmvergara/react-firebase-auth-template)
- [Golang Postgres Auth Template](https://github.com/mmvergara/golang-postgresql-auth-template)
- [Vue Golang PostgresSql Auth Template](https://github.com/mmvergara/vue-golang-postgresql-auth-starter-template)
- [Vue Supabase Auth Template](https://github.com/mmvergara/vue-supabase-auth-starter-template)
- [Remix Drizzle Auth Template](https://github.com/mmvergara/remix-drizzle-auth-template)

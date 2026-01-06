# Live Poll Pulse

A comprehensive, real-time interactive polling application designed for classrooms and remote learning environments. Built with modern web technologies, it enables seamless interaction between teachers and students through live polls and instant messaging.

## Key Features

### Teacher Persona (Admin)
- **Create Polls**: Intuitive interface to create questions with multiple options.
- **Timer Control**: Set custom durations for polls (30s, 60s, 90s, 120s).
- **Real-time Dashboard**: Watch live voting progress with instant percentage updates.
- **Poll History**: Access a detailed archive of past polls and their results.
- **Classroom Management**: View active participants and remove students if necessary.
- **Chat Management**: Communicate with students via a dedicated chat panel.

### Student Persona
- **Easy Join**: Simple name-entry to join the session.
- **Live Voting**: Real-time poll updates without page refreshes.
- **Interactive UI**: Engaging "Waiting" and "Success" screens.
- **Chat**: Integrated chat feature to ask questions or discuss topics.

##  Technology Stack

- **Frontend**: [React](https://react.dev/) + [Vite](https://vitejs.dev/) - For a blazing fast development experience.
- **Language**: [TypeScript](https://www.typescriptlang.org/) - For type-safe code and better developer tooling.
- **Styling**: 
  - [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework.
  - [Shadcn/UI](https://ui.shadcn.com/) - Reusable components built with Radix UI.
- **Backend & Real-time**: [Supabase](https://supabase.com/) - Used for PostgreSQL database and Realtime subscriptions (WebSockets).
- **State Management**: React Hooks & Custom Hooks (`usePollState`, `usePollTimer`, etc.).

##  Architecture Highlights

- **Custom Hooks**: Logic is strictly separated from UI using hooks like `usePollState` for data synchronization and `useSocket` abstractions.
- **Optimistic UI**: Votes are updated locally for immediate feedback while syncing with the server in the background.
- **Real-time Synchronization**: Leverages Supabase Realtime to push updates (new polls, votes, messages) to all connected clients instantly.
- **Responsive Design**: Fully responsive layout optimized for varied screen sizes (mobile/desktop).

## Installation & Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd live-poll
   ```

2. **Install dependencies**
   Note: This project uses `pnpm`. If you see a `bun.lockb` file, you can safely delete it if you prefer using pnpm.
   ```bash
   pnpm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory and add your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Run the development server**
   ```bash
   pnpm run dev
   ```

5. **Open the app**
   Visit `http://localhost:5173` in your browser.

## Project Structure

```
src/
├── components/         # UI Components
│   ├── poll/          # Poll-specific components (TeacherDashboard, StudentView, etc.)
│   └── ui/            # Generic UI components (Buttons, Inputs, etc.)
├── hooks/             # Custom React hooks (usePollState, usePollHistory, etc.)
├── pages/             # Main page views (TeacherPage, StudentPage)
├── integrations/      # Third-party integrations (Supabase client)
└── lib/               # Utilities and helper functions
```

## Database Schema (Supabase)

The application relies on the following key tables:
- **polls**: Stores question details, active status, duration, and timestamps.
- **poll_options**: Stores options linked to specific polls.
- **votes**: Records student votes, ensuring one vote per student per poll.
- **chat_messages**: specific table for storing chat history.


---

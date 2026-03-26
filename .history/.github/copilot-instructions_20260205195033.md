# Copilot Instructions for NullClassIntern Youtube Project

## Project Overview
- This is a monorepo with a Next.js (TypeScript) frontend in `youtube/` and a Node.js/Express backend in `server/`.
- The frontend uses Tailwind CSS (see `globals.css`), custom CSS variables, and component-based design in `src/components/`.
- The backend provides REST APIs for authentication, comments, and user management (see `server/controller/`, `server/models/`, `server/route/`).

## Key Patterns & Structure
- **Frontend:**
  - All UI logic is in `youtube/src/components/` and `youtube/src/pages/`.
  - State/context is managed via React Context in `youtube/src/lib/` (e.g., `AuthContext.js`, `SidebarContext.tsx`).
  - API calls use Axios (`youtube/src/lib/axiosinstance.ts`).
  - Styles are managed with Tailwind CSS and custom properties in `globals.css`.
  - Responsive design is expected to match YouTube's breakpoints and layout behavior.
- **Backend:**
  - Express app entry: `server/app.js`.
  - MongoDB connection: `server/config/dbConnection.js`.
  - Main routes: `server/route/route.js`.

## Developer Workflows
- **Start frontend:**
  - `cd youtube && npm run dev` (Next.js dev server on port 3000)
- **Start backend:**
  - `cd server && npm start` (or `node app.js`)
- **Build frontend:**
  - `cd youtube && npm run build`
- **Lint:**
  - `cd youtube && npm run lint`

## Responsiveness & UI
- Use Tailwind's responsive utilities (`sm:`, `md:`, `lg:`, `xl:`) in all components.
- Reference YouTube's layout for breakpoints, sidebar behavior, and video grid scaling.
- Use `flex`, `grid`, and `aspect-video` utilities for video layouts.
- Test on mobile, tablet, and desktop widths.

## Integration Points
- Frontend API calls route to `/api` (Next.js) or to the backend server (proxy or direct fetch).
- Auth and comments are handled via backend endpoints (see `server/controller/`).

## Conventions
- Use TypeScript for all new frontend code.
- Use functional React components and hooks.
- Keep business logic out of UI components; use `lib/` for helpers/context.
- Use `.tsx` for React components, `.ts` for utilities.

## Examples
- See `youtube/src/components/VideoGrid.tsx` for responsive video layout.
- See `youtube/src/components/Sidebar.tsx` for sidebar behavior.
- See `youtube/src/components/CustomVideoPlayer.tsx` for video player integration.

---

For any unclear patterns or missing conventions, consult the README or ask for clarification.
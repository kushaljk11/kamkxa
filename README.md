# GoTaskManager 🚀

A modern, responsive, and installable MERN-based Progressive Web Application (PWA) crafted for high-performance daily task, project, deadline, and reminder management.

---

## 🌟 Key Features

### 1. Daily Execution Command Center ("My Day")
- Time-contextual greeting, current date, and live progress bar.
- Reactive metric cards: Due Today, Completed, Overdue items, and Upcoming 7-day forecast.
- 3-second inline task capture and Priority Focus zone for high-impact work.
- Celebratory zero-state animations when daily tasks are cleared.

### 2. Multi-Perspective Task Organization
- **List View**: Multi-attribute filtering (All, Today, Upcoming, Overdue, Completed), debounced instant search, priority filtering, and multi-sort criteria (Due Date, Priority, Title).
- **Kanban Board**: Drag-and-advance pipeline with To Do, In Progress, and Completed columns.
- **Calendar & Timelines**: Full interactive 7-column monthly calendar grid and weekly timeline with day-click quick scheduling and priority color bands.
- **Inbox Zero Engine**: Rapid capture staging area with instant project transition and scheduling shortcuts.

### 3. Projects & Workspaces
- Color-coded project cards with live progress bars (`completed / total tasks * 100`).
- Active and Archived project organization.
- Instant project association directly from creation drawers and inbox dropdowns.

### 4. Productivity Insights & Velocity Engine
- 7-day velocity bar charts with current-day highlights and hover counts.
- Completion rate percentage, consecutive-day streak counter, and overdue hygiene tracker.
- Urgency workload distribution across Urgent, High, Medium, and Low priorities.

### 5. Multi-Channel Reminders & Twilio WhatsApp
- Native Twilio REST API integration for WhatsApp reminders.
- In-App, Email, and WhatsApp toggle switches with international phone formatting.
- Instant test notification trigger and Quiet Hours (10:00 PM – 7:00 AM) protection.

### 6. Power-User Keyboard Navigation & Global Command Palette
- **`Cmd+K` / `Ctrl+K`**: Global Command Palette with search across tasks and projects.
- **`C`**: Rapid 10-second task creation drawer.
- **`?`**: Keyboard shortcuts cheat-sheet dialog.
- **`Esc`**: Dismiss any open drawer, modal, or command palette.
- **Navigation Chords**:
  - `G then M`: Go to My Day
  - `G then T`: Go to Tasks
  - `G then I`: Go to Inbox
  - `G then C`: Go to Calendar
  - `G then P`: Go to Projects
  - `G then B`: Go to Board
  - `G then S`: Go to Settings

### 7. Progressive Web Application (PWA) & Offline Readiness
- Fully installable standalone app on Desktop (Chrome, Edge) and Mobile (iOS, Android).
- Custom vector branding icon (`/icon.svg`) and Web App Manifest (`/manifest.json`).
- Service Worker (`/sw.js`) with cache-first static strategy and network-first API caching.
- Reactive `OfflineBanner` and prompt install triggers.

---

## 🛠️ Architecture & Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 19, Vite, React Router v7, Zustand, Tailwind CSS, Lucide Icons, Zod |
| **Backend** | Node.js, Express, Mongoose (MongoDB Atlas), Helmet, CORS, Cookie-Parser |
| **Authentication** | JWT (15-min access token + 7-day refresh token in HTTP-only secure cookies) + bcrypt |
| **Design Language** | Shadcn/ui restraint: `#F7F8FA` neutral background, `#FFFFFF` surfaces, `#6366F1` indigo primary |

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- MongoDB Atlas database or local MongoDB instance

### 1. Backend Setup
```bash
cd server
npm install
cp .env.example .env
# Ensure MONGODB_URI and JWT secrets are configured in .env
npm run dev
```
Backend runs on `http://localhost:5000`.

### 2. Frontend Setup
```bash
cd client
npm install
npm run dev
```
Frontend runs on `http://localhost:5173`.

### 3. Production Build
```bash
cd client
npm run build
```

---

## 🔒 Security & Data Isolation
- Strict user ownership validation on all task and project mutations (`req.userId` scoped queries).
- HTTP-only, SameSite cookies for tokens to prevent XSS and CSRF exploits.
- Mongoose schema sanitization and regex escape guards on all search inputs.
- Safe fallback demo mode for instant testing without database initialization.

---

## 📄 License
MIT

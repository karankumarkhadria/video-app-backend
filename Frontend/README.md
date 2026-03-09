# VideoTube Frontend — Setup Guide

## Project Structure

```
videotube-frontend/
├── src/
│   ├── components/
│   │   ├── common/
│   │   │   ├── Spinner.jsx          → Loading spinner
│   │   │   ├── ProtectedRoute.jsx   → Redirects to /login if not authenticated
│   │   │   └── GuestRoute.jsx       → Redirects to / if already logged in
│   │   ├── layout/
│   │   │   ├── Layout.jsx           → Main wrapper with sidebar + navbar
│   │   │   ├── Navbar.jsx           → Top navigation bar
│   │   │   └── Sidebar.jsx          → Left sidebar with nav links
│   │   └── video/
│   │       ├── VideoCard.jsx        → Video thumbnail card
│   │       └── CommentSection.jsx   → Comments under a video
│   ├── pages/
│   │   ├── Home.jsx                 → Homepage video feed
│   │   ├── LoginPage.jsx            → Login form
│   │   ├── RegisterPage.jsx         → Register with avatar upload
│   │   ├── VideoPage.jsx            → Watch a video + comments
│   │   ├── UploadVideoPage.jsx      → Upload video form
│   │   ├── ProfilePage.jsx          → Channel profile page
│   │   ├── EditProfilePage.jsx      → Edit profile + change password
│   │   ├── SearchPage.jsx           → Search results
│   │   ├── WatchHistoryPage.jsx     → Watch history
│   │   ├── LikedVideosPage.jsx      → Liked videos
│   │   ├── SubscriptionsPage.jsx    → Subscribed channels
│   │   ├── PlaylistsPage.jsx        → All playlists
│   │   ├── PlaylistDetailPage.jsx   → Single playlist view
│   │   ├── TweetsPage.jsx           → Community posts (tweets)
│   │   ├── DashboardPage.jsx        → Creator dashboard + stats
│   │   └── NotFoundPage.jsx         → 404 page
│   ├── services/
│   │   ├── api.js                   → Axios instance + interceptors
│   │   └── index.js                 → All API functions
│   ├── store/
│   │   ├── store.js                 → Redux store
│   │   └── slices/authSlice.js      → Auth state (login/logout/user)
│   ├── App.jsx                      → All routes defined here
│   ├── main.jsx                     → Entry point
│   └── index.css                    → Tailwind + custom styles
├── index.html
├── vite.config.js                   → Proxy to backend at port 8000
├── tailwind.config.js
├── postcss.config.js
└── package.json
```

---

## Step 1 — Where to Place This Folder

Place `videotube-frontend` NEXT TO your backend folder, like this:

```
Desktop/
├── backend_project/     ← your existing backend
└── videotube-frontend/  ← this frontend folder (place it here)
```

---

## Step 2 — Install Dependencies

Open a NEW terminal, navigate to the frontend folder, and run:

```bash
cd videotube-frontend
npm install
```

This installs: React, Vite, Tailwind, Redux Toolkit, React Router, Axios, React Player, React Hook Form, React Hot Toast, timeago.js

---

## Step 3 — Start Both Servers

You need TWO terminals running at the same time:

**Terminal 1 — Backend (your existing project):**
```bash
cd backend_project
npm run dev
# Runs at http://localhost:8000
```

**Terminal 2 — Frontend:**
```bash
cd videotube-frontend
npm run dev
# Runs at http://localhost:3000
```

Then open http://localhost:3000 in your browser.

---

## How the Connection Works

The `vite.config.js` has a **proxy** configured:
```js
proxy: {
  '/api': {
    target: 'http://localhost:8000',
    changeOrigin: true,
  }
}
```

This means when the frontend calls `/api/v1/users/login`, Vite automatically forwards it to `http://localhost:8000/api/v1/users/login`. You don't need to change any URLs.

---

## What Works Right Now (Backend is Ready)

| Feature | URL | Status |
|---|---|---|
| Register | /register | ✅ Works |
| Login / Logout | /login | ✅ Works |
| View Profile | /channel/:username | ✅ Works |
| Edit Profile | /profile/edit | ✅ Works |
| Change Password | /profile/edit → Security tab | ✅ Works |
| Update Avatar | /profile/edit | ✅ Works |
| Watch History | /history | ✅ Works |

---

## What Shows UI But Needs Backend Routes Added

| Feature | Status |
|---|---|
| Video feed / upload / watch | ⏳ Need video routes in backend |
| Comments | ⏳ Need comment routes in backend |
| Likes | ⏳ Need like routes in backend |
| Playlists | ⏳ Need playlist routes in backend |
| Tweets | ⏳ Need tweet routes in backend |
| Subscriptions (toggle) | ⏳ Need subscription routes |
| Dashboard stats | ⏳ Need dashboard routes |

These pages are fully built — they just gracefully show empty states until the backend routes exist. When you add them, they will work automatically with no frontend changes needed.

---

## Adding Backend Routes (When Ready)

The API URLs the frontend expects are already documented in `src/services/index.js`. For example:

```
GET  /api/v1/videos              → getAllVideos
POST /api/v1/videos              → uploadVideo
GET  /api/v1/videos/:videoId     → getVideoById
GET  /api/v1/comments/:videoId   → getVideoComments
POST /api/v1/comments/:videoId   → addComment
POST /api/v1/likes/toggle/v/:id  → toggleVideoLike
...etc
```

Just create these routes in your backend following the same pattern as your user routes.

---

## Auth Flow Explained

1. User logs in → backend returns `accessToken` + `refreshToken` + `user`
2. Frontend stores tokens in `localStorage`
3. Every API request automatically attaches `Authorization: Bearer <token>` header
4. If a request returns 401, the frontend automatically tries to refresh the token
5. If refresh fails, user is redirected to `/login`
6. On page load, frontend checks localStorage for a token and fetches current user to restore session

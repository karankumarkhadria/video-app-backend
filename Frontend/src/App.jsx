import { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchCurrentUser } from './store/slices/authSlice.js'

import Layout from './components/layout/Layout.jsx'
import ProtectedRoute from './components/common/ProtectedRoute.jsx'
import GuestRoute from './components/common/GuestRoute.jsx'

// Pages
import Home from './pages/Home.jsx'
import LoginPage from './pages/LoginPage.jsx'
import RegisterPage from './pages/RegisterPage.jsx'
import VideoPage from './pages/VideoPage.jsx'
import UploadVideoPage from './pages/UploadVideoPage.jsx'
import ProfilePage from './pages/ProfilePage.jsx'
import EditProfilePage from './pages/EditProfilePage.jsx'
import SearchPage from './pages/SearchPage.jsx'
import WatchHistoryPage from './pages/WatchHistoryPage.jsx'
import LikedVideosPage from './pages/LikedVideosPage.jsx'
import SubscriptionsPage from './pages/SubscriptionsPage.jsx'
import PlaylistsPage from './pages/PlaylistsPage.jsx'
import PlaylistDetailPage from './pages/PlaylistDetailPage.jsx'
import TweetsPage from './pages/TweetsPage.jsx'
import DashboardPage from './pages/DashboardPage.jsx'
import NotFoundPage from './pages/NotFoundPage.jsx'
import Spinner from './components/common/Spinner.jsx'

export default function App() {
  const dispatch = useDispatch()
  const { initializing } = useSelector((s) => s.auth)

  useEffect(() => {
    // on every page load, check if user is already logged in
    if (localStorage.getItem('accessToken')) {
      dispatch(fetchCurrentUser())
    } else {
      // no token = done initializing immediately
      dispatch({ type: 'auth/fetchCurrentUser/rejected' })
    }
  }, [dispatch])

  if (initializing) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    )
  }

  return (
    <Routes>
      {/* Guest only */}
      <Route element={<GuestRoute />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      {/* Main layout */}
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/video/:videoId" element={<VideoPage />} />
        <Route path="/channel/:username" element={<ProfilePage />} />

        {/* Protected */}
        <Route element={<ProtectedRoute />}>
          <Route path="/upload" element={<UploadVideoPage />} />
          <Route path="/profile/edit" element={<EditProfilePage />} />
          <Route path="/history" element={<WatchHistoryPage />} />
          <Route path="/liked" element={<LikedVideosPage />} />
          <Route path="/subscriptions" element={<SubscriptionsPage />} />
          <Route path="/playlists" element={<PlaylistsPage />} />
          <Route path="/playlist/:playlistId" element={<PlaylistDetailPage />} />
          <Route path="/tweets" element={<TweetsPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
        </Route>
      </Route>

      <Route path="/404" element={<NotFoundPage />} />
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  )
}

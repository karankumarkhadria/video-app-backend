import { NavLink } from 'react-router-dom'
import { useSelector } from 'react-redux'

const icons = {
  home: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  search: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>,
  history: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>,
  liked: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"/></svg>,
  subscriptions: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.069A1 1 0 0121 8.87v6.26a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z"/></svg>,
  playlists: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 10h16M4 14h10M4 18h10"/></svg>,
  tweets: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>,
  dashboard: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>,
  upload: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/></svg>,
}

const publicLinks = [
  { to: '/', icon: icons.home, label: 'Home', end: true },
  { to: '/search', icon: icons.search, label: 'Search' },
]

const authLinks = [
  { to: '/subscriptions', icon: icons.subscriptions, label: 'Subscriptions' },
  { to: '/history', icon: icons.history, label: 'Watch History' },
  { to: '/liked', icon: icons.liked, label: 'Liked Videos' },
  { to: '/playlists', icon: icons.playlists, label: 'Playlists' },
  { to: '/tweets', icon: icons.tweets, label: 'Tweets' },
]

const creatorLinks = [
  { to: '/upload', icon: icons.upload, label: 'Upload Video' },
  { to: '/dashboard', icon: icons.dashboard, label: 'Dashboard' },
]

export default function Sidebar({ open, onClose }) {
  const { isAuthenticated } = useSelector((s) => s.auth)

  return (
    <aside
      className={`
        fixed top-16 left-0 h-[calc(100vh-4rem)] w-60 z-40
        bg-dark-900 border-r border-dark-700
        flex flex-col overflow-y-auto
        transition-transform duration-300 ease-in-out
        ${open ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0
      `}
    >
      <nav className="flex-1 py-4 px-3 space-y-0.5">
        <SidebarSection label="Menu">
          {publicLinks.map((link) => (
            <SidebarLink key={link.to} {...link} onClick={onClose} />
          ))}
        </SidebarSection>

        {isAuthenticated && (
          <>
            <SidebarSection label="You">
              {authLinks.map((link) => (
                <SidebarLink key={link.to} {...link} onClick={onClose} />
              ))}
            </SidebarSection>
            <SidebarSection label="Creator">
              {creatorLinks.map((link) => (
                <SidebarLink key={link.to} {...link} onClick={onClose} />
              ))}
            </SidebarSection>
          </>
        )}
      </nav>

      <div className="p-4 border-t border-dark-700">
        <p className="text-xs text-dark-500 font-body">© 2024 VideoTube</p>
      </div>
    </aside>
  )
}

function SidebarSection({ label, children }) {
  return (
    <div className="mb-2">
      <p className="px-3 py-2 text-xs font-display font-semibold text-dark-500 uppercase tracking-widest">
        {label}
      </p>
      {children}
    </div>
  )
}

function SidebarLink({ to, icon, label, end, onClick }) {
  return (
    <NavLink
      to={to}
      end={end}
      onClick={onClick}
      className={({ isActive }) =>
        `nav-link ${isActive ? 'active' : ''}`
      }
    >
      {icon}
      <span>{label}</span>
    </NavLink>
  )
}

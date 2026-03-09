import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../../store/slices/authSlice.js'
import toast from 'react-hot-toast'

const MenuIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
  </svg>
)
const SearchIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
)
const UploadIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
)

export default function Navbar({ onMenuClick }) {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { user, isAuthenticated } = useSelector((s) => s.auth)
  const [query, setQuery] = useState('')
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`)
    }
  }

  const handleLogout = async () => {
    await dispatch(logout())
    toast.success('Logged out successfully')
    navigate('/login')
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-dark-900/95 backdrop-blur-md border-b border-dark-700 h-16 flex items-center px-4 gap-4">
      {/* left */}
      <div className="flex items-center gap-3 min-w-0">
        <button onClick={onMenuClick} className="btn-ghost p-2 lg:hidden">
          <MenuIcon />
        </button>
        <Link to="/" className="flex items-center gap-2 flex-shrink-0">
          <div className="w-8 h-8 bg-brand-500 rounded-lg flex items-center justify-center glow">
            <span className="font-display font-black text-white text-sm">VT</span>
          </div>
          <span className="font-display font-bold text-lg text-dark-50 hidden sm:block">
            Video<span className="text-brand-500">Tube</span>
          </span>
        </Link>
      </div>

      {/* search */}
      <form onSubmit={handleSearch} className="flex-1 max-w-xl mx-auto">
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search videos..."
            className="input-field pr-10 py-2 text-sm"
          />
          <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-400 hover:text-brand-400 transition-colors">
            <SearchIcon />
          </button>
        </div>
      </form>

      {/* right */}
      <div className="flex items-center gap-2 flex-shrink-0">
        {isAuthenticated ? (
          <>
            <Link to="/upload" className="btn-primary text-sm py-2 hidden sm:flex">
              <UploadIcon />
              <span className="hidden md:block">Upload</span>
            </Link>
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 hover:opacity-80 transition-opacity"
              >
                <img
                  src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.fullname}&background=f97316&color=fff`}
                  alt={user?.fullname}
                  className="avatar w-9 h-9 border-2 border-dark-600 hover:border-brand-500 transition-colors"
                />
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 top-12 w-56 card shadow-2xl shadow-black/50 py-1 animate-slide-up">
                  <div className="px-4 py-3 border-b border-dark-600">
                    <p className="font-display font-semibold text-dark-50 text-sm truncate">{user?.fullname}</p>
                    <p className="text-dark-400 text-xs truncate">@{user?.username}</p>
                  </div>
                  <DropdownItem to={`/channel/${user?.username}`} onClick={() => setDropdownOpen(false)}>My Channel</DropdownItem>
                  <DropdownItem to="/dashboard" onClick={() => setDropdownOpen(false)}>Dashboard</DropdownItem>
                  <DropdownItem to="/profile/edit" onClick={() => setDropdownOpen(false)}>Settings</DropdownItem>
                  <div className="border-t border-dark-600 mt-1 pt-1">
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 transition-colors font-body"
                    >
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex items-center gap-2">
            <Link to="/login" className="btn-ghost text-sm py-2">Sign in</Link>
            <Link to="/register" className="btn-primary text-sm py-2">Sign up</Link>
          </div>
        )}
      </div>
    </header>
  )
}

function DropdownItem({ to, onClick, children }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className="block px-4 py-2 text-sm text-dark-200 hover:bg-dark-700 hover:text-dark-50 transition-colors font-body"
    >
      {children}
    </Link>
  )
}

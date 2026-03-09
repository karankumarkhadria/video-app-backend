import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { getUserPlaylists, createPlaylist, deletePlaylist } from '../services/index.js'
import Spinner from '../components/common/Spinner.jsx'

export default function PlaylistsPage() {
  const { user } = useSelector((s) => s.auth)
  const [playlists, setPlaylists] = useState([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const { register, handleSubmit, reset, formState: { errors } } = useForm()

  useEffect(() => {
    getUserPlaylists(user._id)
      .then((res) => setPlaylists(res.data.data || []))
      .catch(() => setPlaylists([]))
      .finally(() => setLoading(false))
  }, [])

  const handleCreate = async (data) => {
    try {
      setCreating(true)
      const res = await createPlaylist(data)
      setPlaylists([res.data.data, ...playlists])
      toast.success('Playlist created!')
      setShowForm(false)
      reset()
    } catch { toast.error('Failed to create playlist') }
    finally { setCreating(false) }
  }

  const handleDelete = async (id) => {
    try {
      await deletePlaylist(id)
      setPlaylists(playlists.filter((p) => p._id !== id))
      toast.success('Playlist deleted')
    } catch { toast.error('Failed') }
  }

  return (
    <div className="animate-fade-in max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="section-title">Playlists</h1>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary text-sm">
          + New Playlist
        </button>
      </div>

      {showForm && (
        <div className="card p-4 mb-5 animate-slide-up">
          <form onSubmit={handleSubmit(handleCreate)} className="space-y-3">
            <div>
              <input {...register('name', { required: 'Name required' })} placeholder="Playlist name" className="input-field" />
              {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>}
            </div>
            <textarea {...register('description', { required: 'Description required' })} placeholder="Description" rows={2} className="input-field resize-none" />
            <div className="flex gap-2">
              <button type="submit" disabled={creating} className="btn-primary text-sm">
                {creating ? <Spinner size="sm" /> : 'Create'}
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="btn-secondary text-sm">Cancel</button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-12"><Spinner /></div>
      ) : playlists.length === 0 ? (
        <div className="text-center py-24 text-dark-500">
          <p>No playlists yet. Create your first one!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {playlists.map((p) => (
            <div key={p._id} className="card p-4 flex items-center gap-4 group">
              <div className="w-20 h-14 bg-dark-700 rounded-lg flex items-center justify-center text-dark-500 flex-shrink-0">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 10h16M4 14h10M4 18h10"/>
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <Link to={`/playlist/${p._id}`} className="font-display font-semibold text-dark-100 hover:text-brand-400 transition-colors">
                  {p.name}
                </Link>
                <p className="text-dark-500 text-xs line-clamp-1 mt-0.5">{p.description}</p>
                <p className="text-dark-600 text-xs mt-0.5">{p.videos?.length || 0} videos</p>
              </div>
              <button onClick={() => handleDelete(p._id)}
                className="opacity-0 group-hover:opacity-100 transition-opacity text-red-500/60 hover:text-red-400 p-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

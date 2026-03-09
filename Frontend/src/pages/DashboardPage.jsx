import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { getChannelStats, getChannelVideos, togglePublishStatus, deleteVideo } from '../services/index.js'
import toast from 'react-hot-toast'
import Spinner from '../components/common/Spinner.jsx'
import { format } from 'timeago.js'

export default function DashboardPage() {
  const { user } = useSelector((s) => s.auth)
  const [stats, setStats] = useState(null)
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      getChannelStats().then((r) => setStats(r.data.data)).catch(() => {}),
      getChannelVideos().then((r) => setVideos(r.data.data || [])).catch(() => setVideos([]))
    ]).finally(() => setLoading(false))
  }, [])

  const handleTogglePublish = async (videoId, current) => {
    try {
      await togglePublishStatus(videoId)
      setVideos(videos.map((v) => v._id === videoId ? { ...v, isPublished: !current } : v))
    } catch { toast.error('Failed') }
  }

  const handleDelete = async (videoId) => {
    if (!confirm('Delete this video?')) return
    try {
      await deleteVideo(videoId)
      setVideos(videos.filter((v) => v._id !== videoId))
      toast.success('Video deleted')
    } catch { toast.error('Failed to delete') }
  }

  if (loading) return <div className="flex justify-center py-24"><Spinner size="lg" /></div>

  const statCards = [
    { label: 'Total Views', value: stats?.totalViews || 0, icon: '👁️' },
    { label: 'Subscribers', value: stats?.totalSubscribers || 0, icon: '👥' },
    { label: 'Videos', value: stats?.totalVideos || 0, icon: '🎬' },
    { label: 'Total Likes', value: stats?.totalLikes || 0, icon: '❤️' },
  ]

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="section-title">Dashboard</h1>
          <p className="text-dark-400 text-sm mt-1">Welcome back, {user?.fullname}</p>
        </div>
        <Link to="/upload" className="btn-primary">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/>
          </svg>
          Upload Video
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((s) => (
          <div key={s.label} className="card p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-2xl">{s.icon}</span>
              <span className="badge-orange">{s.label}</span>
            </div>
            <p className="font-display font-bold text-2xl text-dark-50">
              {s.value.toLocaleString()}
            </p>
          </div>
        ))}
      </div>

      {/* Videos table */}
      <div className="card overflow-hidden">
        <div className="px-5 py-4 border-b border-dark-600 flex items-center justify-between">
          <h3 className="font-display font-semibold text-dark-100">Your Videos</h3>
          <span className="text-dark-500 text-sm">{videos.length} total</span>
        </div>

        {videos.length === 0 ? (
          <div className="text-center py-16 text-dark-500">
            <p>No videos yet.</p>
            <Link to="/upload" className="text-brand-400 hover:underline text-sm mt-2 inline-block">Upload your first video →</Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left border-b border-dark-700">
                  <th className="px-5 py-3 text-xs font-display font-semibold text-dark-400 uppercase tracking-wider">Video</th>
                  <th className="px-5 py-3 text-xs font-display font-semibold text-dark-400 uppercase tracking-wider hidden md:table-cell">Status</th>
                  <th className="px-5 py-3 text-xs font-display font-semibold text-dark-400 uppercase tracking-wider hidden lg:table-cell">Views</th>
                  <th className="px-5 py-3 text-xs font-display font-semibold text-dark-400 uppercase tracking-wider hidden lg:table-cell">Uploaded</th>
                  <th className="px-5 py-3 text-xs font-display font-semibold text-dark-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-700">
                {videos.map((v) => (
                  <tr key={v._id} className="hover:bg-dark-700/30 transition-colors">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-20 aspect-video bg-dark-700 rounded overflow-hidden flex-shrink-0">
                          {v.thumbNail && <img src={v.thumbNail} alt="" className="w-full h-full object-cover" />}
                        </div>
                        <div className="min-w-0">
                          <p className="font-display font-medium text-dark-100 text-sm line-clamp-1">{v.title}</p>
                          <p className="text-dark-500 text-xs line-clamp-1 mt-0.5">{v.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3 hidden md:table-cell">
                      <button
                        onClick={() => handleTogglePublish(v._id, v.isPublished)}
                        className={`badge ${v.isPublished ? 'badge-green' : 'badge bg-dark-600 text-dark-400 border border-dark-500'}`}
                      >
                        {v.isPublished ? 'Published' : 'Private'}
                      </button>
                    </td>
                    <td className="px-5 py-3 text-dark-400 text-sm hidden lg:table-cell">{v.views || 0}</td>
                    <td className="px-5 py-3 text-dark-500 text-xs hidden lg:table-cell">{format(v.createdAt)}</td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <Link to={`/video/${v._id}`} className="btn-ghost text-xs py-1.5 px-2.5">View</Link>
                        <button onClick={() => handleDelete(v._id)}
                          className="text-red-500/60 hover:text-red-400 transition-colors p-1.5 hover:bg-red-500/10 rounded">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

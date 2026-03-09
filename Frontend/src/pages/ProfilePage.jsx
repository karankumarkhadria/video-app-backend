import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import toast from 'react-hot-toast'
import { getUserChannelProfile, toggleSubscription, getAllVideos } from '../services/index.js'
import VideoCard, { VideoCardSkeleton } from '../components/video/VideoCard.jsx'
import Spinner from '../components/common/Spinner.jsx'

const TABS = ['Videos', 'Playlists', 'Community']

export default function ProfilePage() {
  const { username } = useParams()
  const { user: currentUser, isAuthenticated } = useSelector((s) => s.auth)
  const [channel, setChannel] = useState(null)
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)
  const [subscribed, setSubscribed] = useState(false)
  const [tab, setTab] = useState('Videos')

  useEffect(() => {
    fetchChannel()
  }, [username])

  const fetchChannel = async () => {
    try {
      setLoading(true)
      const res = await getUserChannelProfile(username)
      const ch = res.data.data
      setChannel(ch)
      setSubscribed(ch.isSubscribed)
      // fetch this channel's videos
      const vRes = await getAllVideos({ userId: ch._id, limit: 20 })
      setVideos(vRes.data.data?.docs || vRes.data.data || [])
    } catch {
      setChannel(null)
    } finally {
      setLoading(false)
    }
  }

  const handleSubscribe = async () => {
    if (!isAuthenticated) { toast.error('Please login'); return }
    try {
      await toggleSubscription(channel._id)
      setSubscribed(!subscribed)
      setChannel({
        ...channel,
        subscribersCount: subscribed ? channel.subscribersCount - 1 : channel.subscribersCount + 1
      })
    } catch { toast.error('Failed') }
  }

  if (loading) return <div className="flex justify-center py-24"><Spinner size="lg" /></div>

  if (!channel) return (
    <div className="text-center py-24">
      <p className="text-dark-400">Channel not found</p>
      <Link to="/" className="text-brand-400 hover:underline mt-2 inline-block">← Go home</Link>
    </div>
  )

  const isOwner = currentUser?.username === username

  return (
    <div className="animate-fade-in">
      {/* Cover */}
      <div className="relative h-48 md:h-64 bg-dark-800 rounded-2xl overflow-hidden border border-dark-600 mb-16">
        {channel.coverImage ? (
          <img src={channel.coverImage} alt="" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-dark-700 to-dark-800" />
        )}
        {/* Avatar */}
        <div className="absolute -bottom-12 left-6">
          <img
            src={channel.avatar || `https://ui-avatars.com/api/?name=${channel.fullname}&background=f97316&color=fff`}
            alt=""
            className="avatar w-24 h-24 border-4 border-dark-900"
          />
        </div>
      </div>

      {/* Info */}
      <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display font-bold text-2xl text-dark-50">{channel.fullname}</h1>
          <p className="text-dark-400 text-sm">@{channel.username}</p>
          <div className="flex items-center gap-4 mt-1 text-sm text-dark-400">
            <span>{channel.subscribersCount || 0} subscribers</span>
            <span>{channel.channelsSubscribedToCount || 0} subscriptions</span>
            <span>{videos.length} videos</span>
          </div>
        </div>
        <div className="flex gap-2">
          {isOwner ? (
            <Link to="/profile/edit" className="btn-secondary">Edit Channel</Link>
          ) : (
            <button
              onClick={handleSubscribe}
              className={`px-6 py-2 rounded-full font-display font-semibold text-sm transition-all ${
                subscribed ? 'bg-dark-700 text-dark-300 hover:bg-dark-600' : 'bg-brand-500 text-white hover:bg-brand-600 glow'
              }`}
            >
              {subscribed ? 'Subscribed ✓' : 'Subscribe'}
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-dark-700 mb-6">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-3 text-sm font-display font-semibold transition-colors border-b-2 -mb-px ${
              tab === t ? 'border-brand-500 text-brand-400' : 'border-transparent text-dark-400 hover:text-dark-200'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {tab === 'Videos' && (
        videos.length === 0 ? (
          <div className="text-center py-16 text-dark-500">
            {isOwner ? (
              <>
                <p className="mb-3">You haven't uploaded any videos yet.</p>
                <Link to="/upload" className="btn-primary inline-flex">Upload your first video</Link>
              </>
            ) : (
              <p>No videos yet.</p>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {videos.map((v) => <VideoCard key={v._id} video={{ ...v, owner: channel }} />)}
          </div>
        )
      )}

      {tab === 'Playlists' && (
        <div className="text-center py-16 text-dark-500">
          <p>Playlists coming soon.</p>
        </div>
      )}

      {tab === 'Community' && (
        <div className="text-center py-16 text-dark-500">
          <p>Community posts coming soon.</p>
        </div>
      )}
    </div>
  )
}

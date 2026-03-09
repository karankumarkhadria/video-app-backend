import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { getSubscribedChannels, toggleSubscription } from '../services/index.js'
import Spinner from '../components/common/Spinner.jsx'
import toast from 'react-hot-toast'

export default function SubscriptionsPage() {
  const { user } = useSelector((s) => s.auth)
  const [channels, setChannels] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getSubscribedChannels(user._id)
      .then((res) => setChannels(res.data.data || []))
      .catch(() => setChannels([]))
      .finally(() => setLoading(false))
  }, [])

  const handleUnsubscribe = async (channelId) => {
    try {
      await toggleSubscription(channelId)
      setChannels(channels.filter((c) => c._id !== channelId))
      toast.success('Unsubscribed')
    } catch { toast.error('Failed') }
  }

  return (
    <div className="animate-fade-in max-w-2xl">
      <h1 className="section-title mb-6">Subscriptions</h1>
      {loading ? (
        <div className="flex justify-center py-12"><Spinner /></div>
      ) : channels.length === 0 ? (
        <div className="text-center py-24 text-dark-500">
          <p>You haven't subscribed to any channels yet.</p>
          <Link to="/" className="text-brand-400 hover:underline mt-2 inline-block">Browse channels</Link>
        </div>
      ) : (
        <div className="space-y-3">
          {channels.map((ch) => (
            <div key={ch._id} className="card p-4 flex items-center gap-4">
              <Link to={`/channel/${ch.username}`}>
                <img src={ch.avatar || `https://ui-avatars.com/api/?name=${ch.fullname}&background=f97316&color=fff`}
                  alt="" className="avatar w-12 h-12" />
              </Link>
              <div className="flex-1 min-w-0">
                <Link to={`/channel/${ch.username}`} className="font-display font-semibold text-dark-100 hover:text-brand-400 transition-colors">
                  {ch.fullname}
                </Link>
                <p className="text-dark-500 text-xs">@{ch.username}</p>
              </div>
              <button onClick={() => handleUnsubscribe(ch._id)}
                className="btn-secondary text-sm py-1.5">
                Unsubscribe
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

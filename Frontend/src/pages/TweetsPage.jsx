import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { format } from 'timeago.js'
import toast from 'react-hot-toast'
import { getUserTweets, createTweet, deleteTweet, updateTweet } from '../services/index.js'
import Spinner from '../components/common/Spinner.jsx'

export default function TweetsPage() {
  const { user } = useSelector((s) => s.auth)
  const [tweets, setTweets] = useState([])
  const [loading, setLoading] = useState(true)
  const [text, setText] = useState('')
  const [posting, setPosting] = useState(false)

  useEffect(() => {
    getUserTweets(user._id)
      .then((res) => setTweets(res.data.data || []))
      .catch(() => setTweets([]))
      .finally(() => setLoading(false))
  }, [])

  const handlePost = async () => {
    if (!text.trim()) return
    try {
      setPosting(true)
      const res = await createTweet({ content: text })
      setTweets([{ ...res.data.data, owner: user }, ...tweets])
      setText('')
      toast.success('Tweet posted!')
    } catch { toast.error('Failed to post tweet') }
    finally { setPosting(false) }
  }

  const handleDelete = async (id) => {
    try {
      await deleteTweet(id)
      setTweets(tweets.filter((t) => t._id !== id))
      toast.success('Deleted')
    } catch { toast.error('Failed') }
  }

  return (
    <div className="animate-fade-in max-w-2xl">
      <h1 className="section-title mb-6">Community Posts</h1>

      {/* Compose */}
      <div className="card p-4 mb-6">
        <div className="flex gap-3">
          <img src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.fullname}&background=f97316&color=fff`}
            alt="" className="avatar w-10 h-10 flex-shrink-0" />
          <div className="flex-1">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Share something with your community..."
              rows={3}
              maxLength={280}
              className="input-field resize-none w-full"
            />
            <div className="flex items-center justify-between mt-3">
              <span className="text-dark-600 text-xs font-mono">{text.length}/280</span>
              <button onClick={handlePost} disabled={!text.trim() || posting} className="btn-primary text-sm py-2">
                {posting ? <Spinner size="sm" /> : 'Post'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tweets list */}
      {loading ? (
        <div className="flex justify-center py-12"><Spinner /></div>
      ) : tweets.length === 0 ? (
        <div className="text-center py-16 text-dark-500">
          <p>No community posts yet. Share something!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {tweets.map((tweet) => (
            <div key={tweet._id} className="card p-4 group">
              <div className="flex gap-3">
                <img src={tweet.owner?.avatar || `https://ui-avatars.com/api/?name=${tweet.owner?.fullname}&background=f97316&color=fff`}
                  alt="" className="avatar w-9 h-9 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-display font-semibold text-dark-100 text-sm">{tweet.owner?.fullname}</span>
                      <span className="text-dark-600 text-xs">{format(tweet.createdAt)}</span>
                    </div>
                    {tweet.owner?._id === user?._id && (
                      <button onClick={() => handleDelete(tweet._id)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity text-red-500/50 hover:text-red-400 p-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                        </svg>
                      </button>
                    )}
                  </div>
                  <p className="text-dark-300 text-sm mt-1.5 whitespace-pre-line">{tweet.content}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

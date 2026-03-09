import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import ReactPlayer from 'react-player'
import toast from 'react-hot-toast'
import { format } from 'timeago.js'
import { getVideoById, toggleVideoLike, toggleSubscription, getAllVideos } from '../services/index.js'
import CommentSection from '../components/video/CommentSection.jsx'
import VideoCard from '../components/video/VideoCard.jsx'
import Spinner from '../components/common/Spinner.jsx'

export default function VideoPage() {
  const { videoId } = useParams()
  const { user, isAuthenticated } = useSelector((s) => s.auth)
  const [video, setVideo] = useState(null)
  const [related, setRelated] = useState([])
  const [loading, setLoading] = useState(true)
  const [liked, setLiked] = useState(false)
  const [subscribed, setSubscribed] = useState(false)
  const [showDesc, setShowDesc] = useState(false)

  useEffect(() => {
    fetchVideo()
    fetchRelated()
    window.scrollTo(0, 0)
  }, [videoId])

  const fetchVideo = async () => {
    try {
      setLoading(true)
      const res = await getVideoById(videoId)
      setVideo(res.data.data)
    } catch {
      toast.error('Video not found')
    } finally {
      setLoading(false)
    }
  }

  const fetchRelated = async () => {
    try {
      const res = await getAllVideos({ limit: 10 })
      setRelated((res.data.data?.docs || res.data.data || []).filter((v) => v._id !== videoId))
    } catch {
      setRelated([])
    }
  }

  const handleLike = async () => {
    if (!isAuthenticated) { toast.error('Please login'); return }
    try {
      await toggleVideoLike(videoId)
      setLiked(!liked)
    } catch { toast.error('Failed') }
  }

  const handleSubscribe = async () => {
    if (!isAuthenticated) { toast.error('Please login'); return }
    try {
      await toggleSubscription(video.owner._id)
      setSubscribed(!subscribed)
      toast.success(subscribed ? 'Unsubscribed' : 'Subscribed!')
    } catch { toast.error('Failed') }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <Spinner size="lg" />
      </div>
    )
  }

  if (!video) {
    return (
      <div className="text-center py-24">
        <p className="text-dark-400">Video not found or backend not connected yet.</p>
        <Link to="/" className="text-brand-400 hover:underline mt-2 inline-block">← Go home</Link>
      </div>
    )
  }

  return (
    <div className="flex flex-col xl:flex-row gap-6 animate-fade-in">
      {/* Main */}
      <div className="flex-1 min-w-0">
        {/* Player */}
        <div className="relative bg-black rounded-xl overflow-hidden aspect-video">
          <ReactPlayer
            url={video.videoFile}
            width="100%"
            height="100%"
            controls
            playing
            config={{ file: { attributes: { controlsList: 'nodownload' } } }}
          />
        </div>

        {/* Title & actions */}
        <div className="mt-4">
          <h1 className="font-display font-bold text-xl text-dark-50 leading-snug">{video.title}</h1>
          <div className="flex flex-wrap items-center justify-between gap-4 mt-3">
            <div className="flex items-center gap-3">
              <Link to={`/channel/${video.owner?.username}`}>
                <img
                  src={video.owner?.avatar || `https://ui-avatars.com/api/?name=${video.owner?.fullname}&background=f97316&color=fff`}
                  alt=""
                  className="avatar w-10 h-10"
                />
              </Link>
              <div>
                <Link to={`/channel/${video.owner?.username}`} className="font-display font-semibold text-dark-100 hover:text-brand-400 transition-colors">
                  {video.owner?.fullname}
                </Link>
                <p className="text-dark-500 text-xs">{video.owner?.subscribersCount || 0} subscribers</p>
              </div>
              {user?._id !== video.owner?._id && (
                <button
                  onClick={handleSubscribe}
                  className={`ml-2 px-4 py-1.5 rounded-full text-sm font-display font-semibold transition-all ${
                    subscribed
                      ? 'bg-dark-700 text-dark-300 hover:bg-dark-600'
                      : 'bg-brand-500 text-white hover:bg-brand-600'
                  }`}
                >
                  {subscribed ? 'Subscribed' : 'Subscribe'}
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleLike}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-display font-medium transition-all ${
                  liked ? 'bg-brand-500/20 text-brand-400 border border-brand-500/40' : 'bg-dark-700 text-dark-300 hover:bg-dark-600'
                }`}
              >
                <svg className="w-4 h-4" fill={liked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"/>
                </svg>
                {liked ? 'Liked' : 'Like'}
              </button>
              <button
                onClick={() => { navigator.clipboard.writeText(window.location.href); toast.success('Link copied!') }}
                className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-display font-medium bg-dark-700 text-dark-300 hover:bg-dark-600 transition-all"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/>
                </svg>
                Share
              </button>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="mt-4 card p-4">
          <div className="flex items-center gap-4 text-sm text-dark-400 mb-2 font-body">
            <span>{video.views || 0} views</span>
            <span>{video.createdAt ? format(video.createdAt) : ''}</span>
          </div>
          <p className={`text-dark-300 text-sm font-body whitespace-pre-line ${!showDesc ? 'line-clamp-2' : ''}`}>
            {video.description}
          </p>
          {video.description?.length > 100 && (
            <button onClick={() => setShowDesc(!showDesc)} className="text-brand-400 text-sm mt-1 hover:underline font-medium">
              {showDesc ? 'Show less' : 'Show more'}
            </button>
          )}
        </div>

        {/* Comments */}
        <CommentSection videoId={videoId} />
      </div>

      {/* Sidebar - related */}
      <div className="xl:w-80 flex-shrink-0">
        <h3 className="font-display font-bold text-dark-200 mb-3 text-sm uppercase tracking-wider">Up next</h3>
        <div className="space-y-3">
          {related.map((v) => (
            <Link key={v._id} to={`/video/${v._id}`} className="flex gap-3 group">
              <div className="relative w-36 aspect-video bg-dark-700 rounded-lg overflow-hidden flex-shrink-0">
                {v.thumbNail && <img src={v.thumbNail} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-display font-semibold text-dark-200 text-xs line-clamp-2 group-hover:text-brand-400 transition-colors">{v.title}</p>
                <p className="text-dark-500 text-xs mt-1">{v.owner?.fullname}</p>
                <p className="text-dark-600 text-xs">{v.views || 0} views</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

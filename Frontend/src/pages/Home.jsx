import { useState, useEffect } from 'react'
import { getAllVideos } from '../services/index.js'
import VideoCard, { VideoCardSkeleton } from '../components/video/VideoCard.jsx'

const CATEGORIES = ['All', 'Gaming', 'Music', 'Tech', 'Sports', 'News', 'Education', 'Entertainment']

export default function Home() {
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)
  const [category, setCategory] = useState('All')

  useEffect(() => {
    fetchVideos()
  }, [category])

  const fetchVideos = async () => {
    try {
      setLoading(true)
      const res = await getAllVideos({ page: 1, limit: 24, sortBy: 'createdAt', sortType: 'desc' })
      setVideos(res.data.data?.docs || res.data.data || [])
    } catch {
      setVideos([])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="animate-fade-in">
      {/* Category chips */}
      <div className="flex gap-2 overflow-x-auto pb-3 mb-6 scrollbar-none">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-body font-medium transition-all duration-200 ${
              category === cat
                ? 'bg-brand-500 text-white'
                : 'bg-dark-700 text-dark-300 hover:bg-dark-600 hover:text-dark-100'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Videos grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 12 }).map((_, i) => <VideoCardSkeleton key={i} />)}
        </div>
      ) : videos.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {videos.map((video) => <VideoCard key={video._id} video={video} />)}
        </div>
      )}
    </div>
  )
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center animate-fade-in">
      <div className="w-20 h-20 bg-dark-800 rounded-2xl flex items-center justify-center mb-4 border border-dark-600">
        <svg className="w-10 h-10 text-dark-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 10l4.553-2.069A1 1 0 0121 8.87v6.26a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z"/>
        </svg>
      </div>
      <h3 className="font-display font-bold text-xl text-dark-200 mb-2">No videos yet</h3>
      <p className="text-dark-500 text-sm max-w-xs">Upload a video or check back later when content is available.</p>
    </div>
  )
}

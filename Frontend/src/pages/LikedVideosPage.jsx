import { useState, useEffect } from 'react'
import { getLikedVideos } from '../services/index.js'
import VideoCard, { VideoCardSkeleton } from '../components/video/VideoCard.jsx'

export default function LikedVideosPage() {
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getLikedVideos()
      .then((res) => setVideos(res.data.data || []))
      .catch(() => setVideos([]))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="animate-fade-in">
      <h1 className="section-title mb-6">Liked Videos</h1>
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => <VideoCardSkeleton key={i} />)}
        </div>
      ) : videos.length === 0 ? (
        <div className="text-center py-24 text-dark-500">
          <p>No liked videos yet. Start exploring!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {videos.map((v) => <VideoCard key={v._id} video={v} />)}
        </div>
      )}
    </div>
  )
}

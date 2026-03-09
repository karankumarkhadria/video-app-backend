import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { getAllVideos } from '../services/index.js'
import VideoCard, { VideoCardSkeleton } from '../components/video/VideoCard.jsx'

export default function SearchPage() {
  const [searchParams] = useSearchParams()
  const query = searchParams.get('q') || ''
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (query) search()
  }, [query])

  const search = async () => {
    try {
      setLoading(true)
      const res = await getAllVideos({ query, limit: 20 })
      setVideos(res.data.data?.docs || res.data.data || [])
    } catch {
      setVideos([])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h2 className="font-display font-bold text-xl text-dark-100">
          {query ? <>Search results for <span className="text-brand-400">"{query}"</span></> : 'Search Videos'}
        </h2>
        {!loading && videos.length > 0 && (
          <p className="text-dark-500 text-sm mt-1">{videos.length} results</p>
        )}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => <VideoCardSkeleton key={i} />)}
        </div>
      ) : videos.length === 0 ? (
        <div className="text-center py-24 text-dark-400">
          {query ? (
            <>
              <p className="text-lg">No results for "{query}"</p>
              <p className="text-sm mt-2">Try different keywords</p>
            </>
          ) : (
            <p>Enter a search term to find videos</p>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {videos.map((v) => <VideoCard key={v._id} video={v} />)}
        </div>
      )}
    </div>
  )
}

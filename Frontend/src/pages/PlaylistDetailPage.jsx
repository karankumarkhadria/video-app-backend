import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getPlaylistById } from '../services/index.js'
import VideoCard, { VideoCardSkeleton } from '../components/video/VideoCard.jsx'
import Spinner from '../components/common/Spinner.jsx'

export default function PlaylistDetailPage() {
  const { playlistId } = useParams()
  const [playlist, setPlaylist] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getPlaylistById(playlistId)
      .then((res) => setPlaylist(res.data.data))
      .catch(() => setPlaylist(null))
      .finally(() => setLoading(false))
  }, [playlistId])

  if (loading) return <div className="flex justify-center py-24"><Spinner size="lg" /></div>
  if (!playlist) return <div className="text-center py-24 text-dark-400">Playlist not found</div>

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="section-title">{playlist.name}</h1>
        <p className="text-dark-400 text-sm mt-1">{playlist.description}</p>
        <p className="text-dark-500 text-xs mt-1">{playlist.videos?.length || 0} videos</p>
      </div>
      {playlist.videos?.length === 0 ? (
        <div className="text-center py-16 text-dark-500">No videos in this playlist</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {playlist.videos?.map((v) => <VideoCard key={v._id} video={v} />)}
        </div>
      )}
    </div>
  )
}

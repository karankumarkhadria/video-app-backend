import { Link } from 'react-router-dom'
import { format } from 'timeago.js'

function formatViews(n) {
  if (!n) return '0 views'
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M views`
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K views`
  return `${n} views`
}

function formatDuration(seconds) {
  if (!seconds) return ''
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}

export default function VideoCard({ video }) {
  const { _id, title, thumbNail, duration, views, createdAt, owner } = video

  return (
    <Link to={`/video/${_id}`} className="video-card block group">
      {/* thumbnail */}
      <div className="relative aspect-video bg-dark-700 overflow-hidden">
        {thumbNail ? (
          <img
            src={thumbNail}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-dark-500">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"/>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
        )}
        {duration && (
          <span className="absolute bottom-2 right-2 bg-black/80 text-white text-xs font-mono px-1.5 py-0.5 rounded">
            {formatDuration(duration)}
          </span>
        )}
      </div>

      {/* info */}
      <div className="p-3 flex gap-3">
        <Link to={`/channel/${owner?.username}`} onClick={(e) => e.stopPropagation()}>
          <img
            src={owner?.avatar || `https://ui-avatars.com/api/?name=${owner?.fullname}&background=f97316&color=fff`}
            alt={owner?.fullname}
            className="avatar w-9 h-9 mt-0.5 hover:ring-2 hover:ring-brand-500 transition-all"
          />
        </Link>
        <div className="flex-1 min-w-0">
          <h3 className="font-display font-semibold text-dark-100 text-sm line-clamp-2 group-hover:text-brand-400 transition-colors leading-snug">
            {title}
          </h3>
          <Link
            to={`/channel/${owner?.username}`}
            onClick={(e) => e.stopPropagation()}
            className="text-dark-400 text-xs hover:text-dark-200 transition-colors mt-1 block"
          >
            {owner?.fullname}
          </Link>
          <p className="text-dark-500 text-xs mt-0.5">
            {formatViews(views)} • {createdAt ? format(createdAt) : ''}
          </p>
        </div>
      </div>
    </Link>
  )
}

export function VideoCardSkeleton() {
  return (
    <div className="card">
      <div className="skeleton aspect-video" />
      <div className="p-3 flex gap-3">
        <div className="skeleton w-9 h-9 rounded-full flex-shrink-0" />
        <div className="flex-1 space-y-2 pt-1">
          <div className="skeleton h-3 rounded w-full" />
          <div className="skeleton h-3 rounded w-2/3" />
          <div className="skeleton h-2 rounded w-1/2" />
        </div>
      </div>
    </div>
  )
}

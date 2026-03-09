import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { format } from 'timeago.js'
import { getVideoComments, addComment, updateComment, deleteComment, toggleCommentLike } from '../../services/index.js'
import Spinner from '../common/Spinner.jsx'

export default function CommentSection({ videoId }) {
  const { user, isAuthenticated } = useSelector((s) => s.auth)
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(true)
  const [text, setText] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetchComments()
  }, [videoId])

  const fetchComments = async () => {
    try {
      setLoading(true)
      const res = await getVideoComments(videoId, { page: 1, limit: 20 })
      setComments(res.data.data?.docs || res.data.data || [])
    } catch {
      // backend not ready yet - show empty state
      setComments([])
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!text.trim()) return
    if (!isAuthenticated) { toast.error('Please login to comment'); return }
    try {
      setSubmitting(true)
      const res = await addComment(videoId, { content: text })
      const newComment = res.data.data
      setComments([{ ...newComment, owner: user }, ...comments])
      setText('')
      toast.success('Comment added!')
    } catch {
      toast.error('Failed to add comment')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (commentId) => {
    try {
      await deleteComment(commentId)
      setComments(comments.filter((c) => c._id !== commentId))
      toast.success('Comment deleted')
    } catch {
      toast.error('Failed to delete comment')
    }
  }

  return (
    <div className="mt-6">
      <h3 className="font-display font-bold text-lg text-dark-50 mb-4">
        {comments.length} Comments
      </h3>

      {/* Add comment */}
      {isAuthenticated ? (
        <form onSubmit={handleSubmit} className="flex gap-3 mb-6">
          <img
            src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.fullname}&background=f97316&color=fff`}
            alt=""
            className="avatar w-9 h-9 flex-shrink-0"
          />
          <div className="flex-1 flex gap-2">
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Add a comment..."
              className="input-field flex-1 py-2"
            />
            <button type="submit" disabled={!text.trim() || submitting} className="btn-primary py-2">
              {submitting ? <Spinner size="sm" /> : 'Post'}
            </button>
          </div>
        </form>
      ) : (
        <div className="mb-6 p-4 card text-center">
          <p className="text-dark-400 text-sm">
            <Link to="/login" className="text-brand-400 hover:underline">Sign in</Link> to add a comment
          </p>
        </div>
      )}

      {/* Comments list */}
      {loading ? (
        <div className="flex justify-center py-8"><Spinner /></div>
      ) : comments.length === 0 ? (
        <div className="text-center py-8 text-dark-400">
          <p>No comments yet. Be the first!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <CommentItem
              key={comment._id}
              comment={comment}
              currentUser={user}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function CommentItem({ comment, currentUser, onDelete }) {
  const [editing, setEditing] = useState(false)
  const [editText, setEditText] = useState(comment.content)
  const [liked, setLiked] = useState(false)

  const isOwner = currentUser?._id === comment.owner?._id

  const handleUpdate = async () => {
    try {
      await updateComment(comment._id, { content: editText })
      comment.content = editText
      setEditing(false)
      toast.success('Comment updated')
    } catch {
      toast.error('Failed to update')
    }
  }

  const handleLike = async () => {
    try {
      await toggleCommentLike(comment._id)
      setLiked(!liked)
    } catch {
      toast.error('Login to like')
    }
  }

  return (
    <div className="flex gap-3 group">
      <Link to={`/channel/${comment.owner?.username}`}>
        <img
          src={comment.owner?.avatar || `https://ui-avatars.com/api/?name=${comment.owner?.fullname}&background=3c3c3c&color=fff`}
          alt=""
          className="avatar w-8 h-8"
        />
      </Link>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <Link to={`/channel/${comment.owner?.username}`} className="font-display font-semibold text-sm text-dark-200 hover:text-dark-50">
            {comment.owner?.fullname}
          </Link>
          <span className="text-dark-500 text-xs">{format(comment.createdAt)}</span>
        </div>
        {editing ? (
          <div className="flex gap-2">
            <input value={editText} onChange={(e) => setEditText(e.target.value)} className="input-field flex-1 py-1.5 text-sm" />
            <button onClick={handleUpdate} className="btn-primary py-1.5 text-xs">Save</button>
            <button onClick={() => setEditing(false)} className="btn-secondary py-1.5 text-xs">Cancel</button>
          </div>
        ) : (
          <p className="text-dark-300 text-sm">{comment.content}</p>
        )}
        <div className="flex items-center gap-3 mt-1.5">
          <button onClick={handleLike} className={`flex items-center gap-1 text-xs transition-colors ${liked ? 'text-brand-400' : 'text-dark-500 hover:text-dark-300'}`}>
            <svg className="w-3.5 h-3.5" fill={liked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"/>
            </svg>
            Like
          </button>
          {isOwner && !editing && (
            <>
              <button onClick={() => setEditing(true)} className="text-xs text-dark-500 hover:text-dark-300 transition-colors">Edit</button>
              <button onClick={() => onDelete(comment._id)} className="text-xs text-red-500/60 hover:text-red-400 transition-colors">Delete</button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

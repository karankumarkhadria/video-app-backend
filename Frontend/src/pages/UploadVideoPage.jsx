import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { uploadVideo } from '../services/index.js'
import Spinner from '../components/common/Spinner.jsx'

export default function UploadVideoPage() {
  const navigate = useNavigate()
  const [uploading, setUploading] = useState(false)
  const [videoFile, setVideoFile] = useState(null)
  const [thumbFile, setThumbFile] = useState(null)
  const [thumbPreview, setThumbPreview] = useState(null)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [errors, setErrors] = useState({})

  const validate = () => {
    const e = {}
    if (!videoFile) e.videoFile = 'Video file is required'
    if (!thumbFile) e.thumbFile = 'Thumbnail is required'
    if (!title.trim()) e.title = 'Title is required'
    if (title.trim().length < 3) e.title = 'Min 3 characters'
    if (!description.trim()) e.description = 'Description is required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return

    try {
      setUploading(true)
      const formData = new FormData()
      formData.append('title', title)
      formData.append('description', description)
      formData.append('videoFile', videoFile)
      formData.append('thumbNail', thumbFile)

      const res = await uploadVideo(formData)
      toast.success('Video uploaded successfully!')
      navigate(`/video/${res.data.data._id}`)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <div className="mb-6">
        <h1 className="section-title">Upload Video</h1>
        <p className="text-dark-400 text-sm mt-1">Share your content with the world</p>
      </div>

      <div className="card p-6">
        <form onSubmit={onSubmit} className="space-y-5">

          {/* Video file */}
          <div>
            <label className="block text-sm font-body font-medium text-dark-300 mb-2">
              Video File <span className="text-red-400">*</span>
            </label>
            <label className={`flex flex-col items-center justify-center h-36 border-2 border-dashed rounded-xl cursor-pointer transition-colors ${
              videoFile ? 'border-brand-500/60 bg-brand-500/5' : 'border-dark-600 hover:border-dark-400 bg-dark-700/50'
            }`}>
              {videoFile ? (
                <div className="text-center p-4">
                  <div className="w-10 h-10 bg-brand-500/20 rounded-xl flex items-center justify-center mx-auto mb-2">
                    <svg className="w-5 h-5 text-brand-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"/>
                    </svg>
                  </div>
                  <p className="text-sm text-brand-400 font-medium truncate max-w-xs">{videoFile.name}</p>
                  <p className="text-xs text-dark-500 mt-0.5">Click to change</p>
                </div>
              ) : (
                <div className="text-center p-4">
                  <svg className="w-8 h-8 text-dark-500 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
                  </svg>
                  <p className="text-sm text-dark-400">Drop video here or <span className="text-brand-400">browse</span></p>
                  <p className="text-xs text-dark-600 mt-1">MP4, WebM, MOV</p>
                </div>
              )}
              <input
                type="file"
                accept="video/*"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files[0]
                  if (f) { setVideoFile(f); setErrors(prev => ({ ...prev, videoFile: null })) }
                }}
              />
            </label>
            {errors.videoFile && <p className="text-red-400 text-xs mt-1">{errors.videoFile}</p>}
          </div>

          {/* Thumbnail */}
          <div>
            <label className="block text-sm font-body font-medium text-dark-300 mb-2">
              Thumbnail <span className="text-red-400">*</span>
            </label>
            <label className="block cursor-pointer">
              {thumbPreview ? (
                <div className="relative aspect-video w-48 rounded-xl overflow-hidden border-2 border-brand-500/40 hover:border-brand-500 transition-colors">
                  <img src={thumbPreview} alt="" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 flex items-center justify-center transition-opacity">
                    <span className="text-white text-sm">Change</span>
                  </div>
                </div>
              ) : (
                <div className="aspect-video w-48 border-2 border-dashed border-dark-600 hover:border-dark-400 rounded-xl bg-dark-700/50 flex flex-col items-center justify-center transition-colors">
                  <svg className="w-7 h-7 text-dark-500 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                  </svg>
                  <span className="text-xs text-dark-500">Upload thumbnail</span>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files[0]
                  if (f) {
                    setThumbFile(f)
                    setThumbPreview(URL.createObjectURL(f))
                    setErrors(prev => ({ ...prev, thumbFile: null }))
                  }
                }}
              />
            </label>
            {errors.thumbFile && <p className="text-red-400 text-xs mt-1">{errors.thumbFile}</p>}
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-body font-medium text-dark-300 mb-1.5">
              Title <span className="text-red-400">*</span>
            </label>
            <input
              value={title}
              onChange={(e) => { setTitle(e.target.value); setErrors(prev => ({ ...prev, title: null })) }}
              placeholder="Enter an engaging title..."
              className="input-field"
            />
            {errors.title && <p className="text-red-400 text-xs mt-1">{errors.title}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-body font-medium text-dark-300 mb-1.5">
              Description <span className="text-red-400">*</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => { setDescription(e.target.value); setErrors(prev => ({ ...prev, description: null })) }}
              placeholder="Describe your video..."
              rows={4}
              className="input-field resize-none"
            />
            {errors.description && <p className="text-red-400 text-xs mt-1">{errors.description}</p>}
          </div>

          {uploading && (
            <div className="bg-dark-700 rounded-lg p-3">
              <div className="flex items-center gap-3">
                <Spinner size="sm" />
                <span className="text-dark-300 text-sm">Uploading to Cloudinary... this may take a minute</span>
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => navigate(-1)} className="btn-secondary flex-1">
              Cancel
            </button>
            <button type="submit" disabled={uploading} className="btn-primary flex-1">
              {uploading ? <><Spinner size="sm" /> Uploading...</> : 'Upload Video'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { registerUser } from '../services/index.js'
import { useDispatch } from 'react-redux'
import { login } from '../store/slices/authSlice.js'
import Spinner from '../components/common/Spinner.jsx'

export default function RegisterPage() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { register, handleSubmit, formState: { errors } } = useForm()
  const [loading, setLoading] = useState(false)
  const [avatarFile, setAvatarFile] = useState(null)
  const [avatarPreview, setAvatarPreview] = useState(null)
  const [coverPreview, setCoverPreview] = useState(null)
  const [showPass, setShowPass] = useState(false)

  const onSubmit = async (data) => {
    if (!avatarFile) {
      toast.error('Please upload a profile picture!')
      return
    }
    try {
      setLoading(true)
      const formData = new FormData()
      formData.append('fullname', data.fullname)
      formData.append('email', data.email)
      formData.append('username', data.username.toLowerCase())
      formData.append('password', data.password)
      formData.append('avatar', avatarFile)
      if (data.coverImage?.[0]) formData.append('coverImage', data.coverImage[0])

      await registerUser(formData)
      toast.success('Account created! Logging you in...')

      const result = await dispatch(login({ email: data.email, password: data.password }))
      if (login.fulfilled.match(result)) {
        navigate('/')
      } else {
        navigate('/login')
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center p-6">
      <div className="w-full max-w-lg animate-slide-up">

        <div className="mb-8 text-center">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-9 h-9 bg-brand-500 rounded-xl flex items-center justify-center glow">
              <span className="font-display font-black text-white">VT</span>
            </div>
            <span className="font-display font-bold text-xl text-dark-50">VideoTube</span>
          </Link>
          <h2 className="font-display font-bold text-3xl text-dark-50">Create account</h2>
          <p className="text-dark-400 mt-1">Join the VideoTube community</p>
        </div>

        <div className="card p-6">

          {/* ── AVATAR UPLOAD — big and clearly visible ── */}
          <div className="mb-5">
            <label className="block text-sm font-body font-medium text-dark-300 mb-2">
              Profile Picture <span className="text-red-400">* (required)</span>
            </label>
            <label className="cursor-pointer block">
              <div className={`flex items-center gap-4 p-3 rounded-xl border-2 border-dashed transition-all ${
                avatarPreview
                  ? 'border-brand-500/60 bg-brand-500/5'
                  : 'border-red-500/70 bg-red-500/5 hover:border-red-400'
              }`}>
                <div className="w-14 h-14 rounded-full overflow-hidden flex-shrink-0 bg-dark-700 border-2 border-dark-500">
                  {avatarPreview ? (
                    <img src={avatarPreview} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-dark-500">
                      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                      </svg>
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  {avatarPreview ? (
                    <>
                      <p className="text-brand-400 font-display font-semibold text-sm">✓ Photo selected</p>
                      <p className="text-dark-500 text-xs mt-0.5">Click to change photo</p>
                    </>
                  ) : (
                    <>
                      <p className="text-red-400 font-display font-semibold text-sm">👆 Click here to upload your photo</p>
                      <p className="text-dark-500 text-xs mt-0.5">JPG or PNG — required to create account</p>
                    </>
                  )}
                </div>
                <svg className={`w-5 h-5 flex-shrink-0 ${avatarPreview ? 'text-brand-400' : 'text-red-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/>
                </svg>
              </div>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files[0]
                  if (file) {
                    setAvatarFile(file)
                    setAvatarPreview(URL.createObjectURL(file))
                  }
                }}
              />
            </label>
          </div>

          {/* ── COVER IMAGE (optional) ── */}
          <div className="mb-5">
            <label className="block text-sm font-body font-medium text-dark-300 mb-2">
              Cover Image <span className="text-dark-600 text-xs">(optional)</span>
            </label>
            <label className="cursor-pointer block">
              <div className={`h-20 rounded-xl border-2 border-dashed overflow-hidden transition-all ${
                coverPreview ? 'border-dark-500' : 'border-dark-600 hover:border-dark-400 bg-dark-700/50'
              }`}>
                {coverPreview ? (
                  <img src={coverPreview} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-dark-500 text-xs">
                    Click to add a cover banner (optional)
                  </div>
                )}
              </div>
              <input
                {...register('coverImage')}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files[0]
                  if (file) setCoverPreview(URL.createObjectURL(file))
                }}
              />
            </label>
          </div>

          {/* ── FORM FIELDS ── */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-body font-medium text-dark-400 mb-1.5">Full Name *</label>
                <input
                  {...register('fullname', { required: 'Required' })}
                  placeholder="John Doe"
                  className="input-field"
                />
                {errors.fullname && <p className="text-red-400 text-xs mt-1">{errors.fullname.message}</p>}
              </div>
              <div>
                <label className="block text-xs font-body font-medium text-dark-400 mb-1.5">Username *</label>
                <input
                  {...register('username', {
                    required: 'Required',
                    pattern: { value: /^[a-zA-Z0-9_]+$/, message: 'Letters, numbers, _ only' }
                  })}
                  placeholder="johndoe"
                  className="input-field"
                />
                {errors.username && <p className="text-red-400 text-xs mt-1">{errors.username.message}</p>}
              </div>
            </div>

            <div>
              <label className="block text-xs font-body font-medium text-dark-400 mb-1.5">Email *</label>
              <input
                {...register('email', {
                  required: 'Required',
                  pattern: { value: /^\S+@\S+\.\S+$/, message: 'Invalid email' }
                })}
                type="email"
                placeholder="you@example.com"
                className="input-field"
              />
              {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-body font-medium text-dark-400 mb-1.5">Password *</label>
              <div className="relative">
                <input
                  {...register('password', {
                    required: 'Required',
                    minLength: { value: 8, message: 'Min 8 characters' }
                  })}
                  type={showPass ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="input-field pr-10"
                />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-400 hover:text-dark-200">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                  </svg>
                </button>
              </div>
              {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>}
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full py-3 mt-2">
              {loading ? <><Spinner size="sm" /> Creating account...</> : 'Create Account'}
            </button>
          </form>
        </div>

        <p className="text-center text-dark-400 text-sm mt-4">
          Already have an account?{' '}
          <Link to="/login" className="text-brand-400 hover:text-brand-300 font-medium">Sign in</Link>
        </p>
      </div>
    </div>
  )
}
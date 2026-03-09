import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useForm } from 'react-hook-form'
import { login, clearError } from '../store/slices/authSlice.js'
import toast from 'react-hot-toast'
import Spinner from '../components/common/Spinner.jsx'

export default function LoginPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { loading, error } = useSelector((s) => s.auth)
  const { register, handleSubmit, formState: { errors } } = useForm()
  const [showPass, setShowPass] = useState(false)

  const onSubmit = async (data) => {
    dispatch(clearError())
    const result = await dispatch(login(data))
    if (login.fulfilled.match(result)) {
      toast.success(`Welcome back, ${result.payload.fullname}!`)
      navigate('/')
    }
  }

  return (
    <div className="min-h-screen bg-dark-900 flex">
      {/* Left decorative panel */}
      <div className="hidden lg:flex flex-1 bg-dark-800 border-r border-dark-700 items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5" style={{backgroundImage: 'radial-gradient(#f97316 1px, transparent 1px)', backgroundSize: '30px 30px'}} />
        <div className="relative z-10 text-center">
          <div className="w-20 h-20 bg-brand-500 rounded-2xl flex items-center justify-center mx-auto mb-6 glow">
            <span className="font-display font-black text-white text-3xl">VT</span>
          </div>
          <h1 className="font-display font-black text-4xl text-dark-50 mb-4">
            Video<span className="text-brand-500">Tube</span>
          </h1>
          <p className="text-dark-400 text-lg max-w-sm">
            Share your world. Watch theirs. Create without limits.
          </p>
          <div className="mt-8 grid grid-cols-3 gap-4 text-center">
            {[['10K+', 'Videos'], ['50K+', 'Users'], ['1M+', 'Views']].map(([n, l]) => (
              <div key={l} className="bg-dark-700/50 rounded-xl p-3 border border-dark-600">
                <p className="font-display font-bold text-xl text-brand-400">{n}</p>
                <p className="text-dark-500 text-xs">{l}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md animate-slide-up">
          <div className="mb-8">
            <Link to="/" className="flex items-center gap-2 mb-8 lg:hidden">
              <div className="w-8 h-8 bg-brand-500 rounded-lg flex items-center justify-center">
                <span className="font-display font-black text-white text-sm">VT</span>
              </div>
              <span className="font-display font-bold text-lg text-dark-50">VideoTube</span>
            </Link>
            <h2 className="font-display font-bold text-3xl text-dark-50">Welcome back</h2>
            <p className="text-dark-400 mt-1">Sign in to your account to continue</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-body font-medium text-dark-300 mb-1.5">Email or Username</label>
              <input
                {...register('email', { required: 'This field is required' })}
                placeholder="you@example.com"
                className="input-field"
              />
              {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-body font-medium text-dark-300 mb-1.5">Password</label>
              <div className="relative">
                <input
                  {...register('password', { required: 'Password is required' })}
                  type={showPass ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="input-field pr-10"
                />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-400 hover:text-dark-200">
                  {showPass ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/></svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                  )}
                </button>
              </div>
              {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>}
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full py-3 mt-2">
              {loading ? <Spinner size="sm" /> : 'Sign in'}
            </button>
          </form>

          <p className="text-center text-dark-400 text-sm mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-brand-400 hover:text-brand-300 font-medium">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

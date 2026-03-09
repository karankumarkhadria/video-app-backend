import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import {
  updateAccountDetails, updateAvatar, updateCoverImage, changePassword
} from '../services/index.js'
import { setUser } from '../store/slices/authSlice.js'
import Spinner from '../components/common/Spinner.jsx'

const TABS = ['Profile', 'Security']

export default function EditProfilePage() {
  const { user } = useSelector((s) => s.auth)
  const dispatch = useDispatch()
  const [tab, setTab] = useState('Profile')
  const [saving, setSaving] = useState(false)
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar)
  const [coverPreview, setCoverPreview] = useState(user?.coverImage)

  const profileForm = useForm({ defaultValues: { fullname: user?.fullname, email: user?.email } })
  const passwordForm = useForm()

  const handleProfileUpdate = async (data) => {
    try {
      setSaving(true)
      const res = await updateAccountDetails(data)
      dispatch(setUser(res.data.data))
      toast.success('Profile updated!')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update')
    } finally {
      setSaving(false)
    }
  }

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setAvatarPreview(URL.createObjectURL(file))
    try {
      const fd = new FormData()
      fd.append('avatar', file)
      const res = await updateAvatar(fd)
      dispatch(setUser(res.data.data))
      toast.success('Avatar updated!')
    } catch {
      toast.error('Failed to update avatar')
    }
  }

  const handleCoverChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setCoverPreview(URL.createObjectURL(file))
    try {
      const fd = new FormData()
      fd.append('coverImage', file)
      const res = await updateCoverImage(fd)
      dispatch(setUser(res.data.data))
      toast.success('Cover image updated!')
    } catch {
      toast.error('Failed to update cover image')
    }
  }

  const handlePasswordChange = async (data) => {
    if (data.newPassword !== data.confirmPassword) {
      toast.error('Passwords do not match')
      return
    }
    try {
      setSaving(true)
      await changePassword({ oldPassword: data.oldPassword, newPassword: data.newPassword })
      toast.success('Password changed!')
      passwordForm.reset()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change password')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <div className="mb-6">
        <h1 className="section-title">Account Settings</h1>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-dark-700 mb-6">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-3 text-sm font-display font-semibold transition-colors border-b-2 -mb-px ${
              tab === t ? 'border-brand-500 text-brand-400' : 'border-transparent text-dark-400 hover:text-dark-200'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === 'Profile' && (
        <div className="space-y-5">
          {/* Cover image */}
          <div className="card overflow-visible">
            <div className="relative h-40 bg-dark-700">
              {coverPreview ? (
                <img src={coverPreview} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-dark-700 to-dark-600" />
              )}
              <label className="absolute inset-0 bg-black/0 hover:bg-black/40 transition-colors cursor-pointer flex items-center justify-center opacity-0 hover:opacity-100">
                <span className="bg-dark-800/80 text-white text-sm px-3 py-1.5 rounded-lg">Change Cover</span>
                <input type="file" accept="image/*" className="hidden" onChange={handleCoverChange} />
              </label>

              {/* Avatar */}
              <div className="absolute -bottom-10 left-6">
                <div className="relative w-20 h-20 rounded-full border-4 border-dark-800 overflow-hidden">
                  <img src={avatarPreview || `https://ui-avatars.com/api/?name=${user?.fullname}&background=f97316&color=fff`} alt="" className="w-full h-full object-cover" />
                  <label className="absolute inset-0 bg-black/0 hover:bg-black/50 transition-colors cursor-pointer flex items-center justify-center opacity-0 hover:opacity-100">
                    <span className="text-white text-xs">Edit</span>
                    <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                  </label>
                </div>
              </div>
            </div>
            <div className="pt-12 pb-4 px-4">
              <p className="text-dark-500 text-xs">Click cover or avatar to change. Changes save instantly.</p>
            </div>
          </div>

          {/* Details form */}
          <div className="card p-5">
            <h3 className="font-display font-semibold text-dark-100 mb-4">Basic Information</h3>
            <form onSubmit={profileForm.handleSubmit(handleProfileUpdate)} className="space-y-4">
              <div>
                <label className="block text-xs font-body font-medium text-dark-400 mb-1.5">Full Name</label>
                <input {...profileForm.register('fullname', { required: true })} className="input-field" />
              </div>
              <div>
                <label className="block text-xs font-body font-medium text-dark-400 mb-1.5">Email</label>
                <input {...profileForm.register('email', { required: true })} type="email" className="input-field" />
              </div>
              <div>
                <label className="block text-xs font-body font-medium text-dark-400 mb-1.5">Username</label>
                <input value={`@${user?.username}`} disabled className="input-field opacity-50 cursor-not-allowed" />
                <p className="text-dark-600 text-xs mt-1">Username cannot be changed</p>
              </div>
              <button type="submit" disabled={saving} className="btn-primary">
                {saving ? <Spinner size="sm" /> : 'Save Changes'}
              </button>
            </form>
          </div>
        </div>
      )}

      {tab === 'Security' && (
        <div className="card p-5">
          <h3 className="font-display font-semibold text-dark-100 mb-4">Change Password</h3>
          <form onSubmit={passwordForm.handleSubmit(handlePasswordChange)} className="space-y-4">
            <div>
              <label className="block text-xs font-body font-medium text-dark-400 mb-1.5">Current Password</label>
              <input {...passwordForm.register('oldPassword', { required: 'Required' })} type="password" placeholder="••••••••" className="input-field" />
              {passwordForm.formState.errors.oldPassword && <p className="text-red-400 text-xs mt-1">{passwordForm.formState.errors.oldPassword.message}</p>}
            </div>
            <div>
              <label className="block text-xs font-body font-medium text-dark-400 mb-1.5">New Password</label>
              <input {...passwordForm.register('newPassword', { required: 'Required', minLength: { value: 8, message: 'Min 8 chars' } })} type="password" placeholder="••••••••" className="input-field" />
              {passwordForm.formState.errors.newPassword && <p className="text-red-400 text-xs mt-1">{passwordForm.formState.errors.newPassword.message}</p>}
            </div>
            <div>
              <label className="block text-xs font-body font-medium text-dark-400 mb-1.5">Confirm New Password</label>
              <input {...passwordForm.register('confirmPassword', { required: 'Required' })} type="password" placeholder="••••••••" className="input-field" />
            </div>
            <button type="submit" disabled={saving} className="btn-primary">
              {saving ? <Spinner size="sm" /> : 'Update Password'}
            </button>
          </form>
        </div>
      )}
    </div>
  )
}

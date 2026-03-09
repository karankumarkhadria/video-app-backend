import api from './api.js'

// ─── AUTH ────────────────────────────────────────────────
export const registerUser = (formData) =>
  api.post('/users/register', formData, { headers: { 'Content-Type': 'multipart/form-data' } })

export const loginUser = (data) => api.post('/users/login', data)

export const logoutUser = () => api.post('/users/logout')

export const refreshToken = () => api.post('/users/refresh-token')

// ─── USER ────────────────────────────────────────────────
export const getCurrentUser = () => api.get('/users/current-user')

export const changePassword = (data) => api.post('/users/change-password', data)

export const updateAccountDetails = (data) => api.patch('/users/update-account', data)

export const updateAvatar = (formData) =>
  api.patch('/users/avatar', formData, { headers: { 'Content-Type': 'multipart/form-data' } })

export const updateCoverImage = (formData) =>
  api.patch('/users/coverImage', formData, { headers: { 'Content-Type': 'multipart/form-data' } })

export const getUserChannelProfile = (username) => api.get(`/users/c/${username}`)

export const getWatchHistory = () => api.get('/users/history')

// ─── VIDEOS (backend routes to be added) ─────────────────
export const getAllVideos = (params) => api.get('/videos', { params })
// params: { page, limit, query, sortBy, sortType, userId }

export const uploadVideo = (formData) =>
  api.post('/videos', formData, { headers: { 'Content-Type': 'multipart/form-data' } })

export const getVideoById = (videoId) => api.get(`/videos/${videoId}`)

export const updateVideo = (videoId, formData) =>
  api.patch(`/videos/${videoId}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } })

export const deleteVideo = (videoId) => api.delete(`/videos/${videoId}`)

export const togglePublishStatus = (videoId) => api.patch(`/videos/toggle/publish/${videoId}`)

// ─── COMMENTS (backend routes to be added) ───────────────
export const getVideoComments = (videoId, params) =>
  api.get(`/comments/${videoId}`, { params })

export const addComment = (videoId, data) => api.post(`/comments/${videoId}`, data)

export const updateComment = (commentId, data) => api.patch(`/comments/c/${commentId}`, data)

export const deleteComment = (commentId) => api.delete(`/comments/c/${commentId}`)

// ─── LIKES (backend routes to be added) ──────────────────
export const toggleVideoLike = (videoId) => api.post(`/likes/toggle/v/${videoId}`)

export const toggleCommentLike = (commentId) => api.post(`/likes/toggle/c/${commentId}`)

export const toggleTweetLike = (tweetId) => api.post(`/likes/toggle/t/${tweetId}`)

export const getLikedVideos = () => api.get('/likes/videos')

// ─── SUBSCRIPTIONS (backend routes to be added) ──────────
export const toggleSubscription = (channelId) => api.post(`/subscriptions/c/${channelId}`)

export const getUserSubscribers = (channelId) => api.get(`/subscriptions/c/${channelId}`)

export const getSubscribedChannels = (subscriberId) => api.get(`/subscriptions/u/${subscriberId}`)

// ─── PLAYLISTS (backend routes to be added) ──────────────
export const createPlaylist = (data) => api.post('/playlist', data)

export const getUserPlaylists = (userId) => api.get(`/playlist/user/${userId}`)

export const getPlaylistById = (playlistId) => api.get(`/playlist/${playlistId}`)

export const addVideoToPlaylist = (playlistId, videoId) =>
  api.patch(`/playlist/add/${videoId}/${playlistId}`)

export const removeVideoFromPlaylist = (playlistId, videoId) =>
  api.patch(`/playlist/remove/${videoId}/${playlistId}`)

export const deletePlaylist = (playlistId) => api.delete(`/playlist/${playlistId}`)

export const updatePlaylist = (playlistId, data) => api.patch(`/playlist/${playlistId}`, data)

// ─── TWEETS (backend routes to be added) ─────────────────
export const createTweet = (data) => api.post('/tweets', data)

export const getUserTweets = (userId) => api.get(`/tweets/user/${userId}`)

export const updateTweet = (tweetId, data) => api.patch(`/tweets/${tweetId}`, data)

export const deleteTweet = (tweetId) => api.delete(`/tweets/${tweetId}`)

// ─── DASHBOARD (backend routes to be added) ──────────────
export const getChannelStats = () => api.get('/dashboard/stats')

export const getChannelVideos = () => api.get('/dashboard/videos')

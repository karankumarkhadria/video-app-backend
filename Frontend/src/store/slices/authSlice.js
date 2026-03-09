import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { loginUser as loginAPI, logoutUser as logoutAPI, getCurrentUser } from '../../services/index.js'

// ─── Async Thunks ────────────────────────────────────────

export const login = createAsyncThunk('auth/login', async (credentials, { rejectWithValue }) => {
  try {
    const res = await loginAPI(credentials)
    const { accessToken, refreshToken, user } = res.data.data
    localStorage.setItem('accessToken', accessToken)
    localStorage.setItem('refreshToken', refreshToken)
    return user
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Login failed')
  }
})

export const logout = createAsyncThunk('auth/logout', async (_, { rejectWithValue }) => {
  try {
    await logoutAPI()
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Logout failed')
  }
})

export const fetchCurrentUser = createAsyncThunk('auth/fetchCurrentUser', async (_, { rejectWithValue }) => {
  try {
    const res = await getCurrentUser()
    return res.data.data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Not authenticated')
  }
})

// ─── Slice ───────────────────────────────────────────────

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    isAuthenticated: false,
    loading: false,
    initializing: true, // checking if user is already logged in on page load
    error: null,
  },
  reducers: {
    clearError: (state) => { state.error = null },
    setUser: (state, action) => {
      state.user = action.payload
      state.isAuthenticated = !!action.payload
    },
  },
  extraReducers: (builder) => {
    // login
    builder
      .addCase(login.pending, (state) => { state.loading = true; state.error = null })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload
        state.isAuthenticated = true
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

    // logout
    builder
      .addCase(logout.fulfilled, (state) => {
        state.user = null
        state.isAuthenticated = false
      })

    // fetchCurrentUser
    builder
      .addCase(fetchCurrentUser.pending, (state) => { state.initializing = true })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.initializing = false
        state.user = action.payload
        state.isAuthenticated = true
      })
      .addCase(fetchCurrentUser.rejected, (state) => {
        state.initializing = false
        state.user = null
        state.isAuthenticated = false
      })
  }
})

export const { clearError, setUser } = authSlice.actions
export default authSlice.reducer

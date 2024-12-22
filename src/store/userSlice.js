import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'user',
  initialState: {
    userInfo: null,  // Stores user data after login
    token: null,     // Stores the JWT token
  },
  reducers: {
    setUserInfo: (state, action) => {
      // action.payload will contain both user and token
      state.userInfo = action.payload.user;
      state.token = action.payload.token;
    },
    clearUserInfo: (state) => {
      state.userInfo = null;
      state.token = null;
      localStorage.removeItem('token'); // Clear token on logout
    },
  },
});

export const { setUserInfo, clearUserInfo } = userSlice.actions;
export default userSlice.reducer;

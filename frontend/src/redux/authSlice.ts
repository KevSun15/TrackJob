import { createSlice } from '@reduxjs/toolkit';

type UserInfo = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'applicant' | 'recruiter'; 
  phoneNumber?: string;
  location?: { city: string; 
    state: string;
    country: string;
  };
  profile?: {
        bio?: string;
        skills?: string;
        company?: string;
  }
  resume?: string;
  education?:{
            institution: string;
            degree: string;
            field: string;
            startDate: Date;
            endDate: Date;
  }
  avatarURL?: string | undefined;
}

interface AuthState {
  userInfo: UserInfo | null; 
}

const initialState: AuthState = {
  userInfo: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.userInfo = action.payload;

    },
    logout: (state) => {
      state.userInfo = null;
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;

export default authSlice.reducer;

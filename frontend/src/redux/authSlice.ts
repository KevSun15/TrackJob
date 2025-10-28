import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

type UserInfo = {
  _id: string;
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
        company?: [string];
        socialURL?: {
          linkedin?: string;
          github?: string;
          website?: string;
        };
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
    setCredentials: (state, action: PayloadAction<UserInfo>) => {
      state.userInfo = action.payload;

    },
    setAvatar: (state, action: PayloadAction<string | undefined>) => {
      if (state.userInfo) {
        state.userInfo.avatarURL = action.payload;
      }
    },
    setResume: (state, action: PayloadAction<string>) => {
      if (state.userInfo) {
        state.userInfo.resume = action.payload;
      }
    },  
    logout: (state) => {
      state.userInfo = null;
    },
  },
});

export const { setCredentials, setAvatar, setResume, logout } = authSlice.actions;

export default authSlice.reducer;

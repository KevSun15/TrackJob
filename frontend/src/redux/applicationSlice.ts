import { createSlice, type PayloadAction } from '@reduxjs/toolkit';


export interface Application {
  _id: string;
  jobId: {
    _id: string;
    jobType: 'full-time' | 'part-time' | 'contract' | 'internship';
    workType: 'on-site' | 'remote' | 'hybrid';
    company: string;
    title: string;
    recruiterId: string;
    description: string;
    skills: string[];
    salary: string;
    companyId: {
      location: {
        Country: string;
        State: string;
        City: string;
      };
      companyName: string;
      website: string;
      description: string;
      recruiterId: string;
      _id: string;
    };
    postedAt: string;
  }
  applicantId: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber?: string;
    avatarUrl?: string;
    profile:{
      githubUrl?: string;
      linkedinUrl?: string;
      bio: string;
    }
     education?:{
            institution: string;
            degree: string;
            field: string;
            startDate: Date;
            endDate: Date;
  }
  }
  recruiterId:{
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber?: string;
  };
  status: 'pending' | 'hired' | 'rejected';
  resumeUrl?: string;
  appliedAt: Date;
  message?: string;
}

interface ApplicationState {
  allApplications: Application[];
  singleApplication: Application | null;
}

const initialState: ApplicationState = {
  allApplications: [],
  singleApplication: null,
};

const applicationSlice = createSlice({
  name: 'application',
  initialState,
  reducers: {
    setApplications: (state, action: PayloadAction<Application[]>) => {
      state.allApplications = action.payload;
    },
    setSingleApplication: (state, action: PayloadAction<Application | null>) => {
      state.singleApplication = action.payload;
    },
  },
});

export const { setApplications, setSingleApplication} = applicationSlice.actions;

export default applicationSlice.reducer;
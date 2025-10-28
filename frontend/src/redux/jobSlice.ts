import { createSlice, type PayloadAction} from '@reduxjs/toolkit';


export interface Job {
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
    logoUrl: string;
    _id: string;
  }
  postedAt: string;
}

interface JobState {
  allJobs: Job[];
  allAdminJobs: Job[];
  allAppliedJobs: Job[];
  allCompanyJobs: Job[];
  singleJob: Job | null;
  searchQuery?: string;
}

const initialState: JobState = {
  allJobs: [],
  allAdminJobs: [],
  allAppliedJobs: [],
  allCompanyJobs: [],
  singleJob: null,
  searchQuery: "",
};

const jobSlice = createSlice({
    name: 'jobs',
    initialState,
    reducers: {
        setAllJobs: (state, action:PayloadAction<Job[]>) => {
            state.allJobs = action.payload;
        },
        setAllAdminJobs: (state, action:PayloadAction<Job[]>) => {
            state.allAdminJobs = action.payload;
        },
        setAllAppliedJobs: (state, action:PayloadAction<Job[]>) => {
            state.allAppliedJobs = action.payload;
        },
        setSingleJob: (state, action:PayloadAction<Job | null>) => {
            state.singleJob = action.payload;
        },
        setCompanyJobs: (state, action:PayloadAction<Job[]>) => {
            state.allCompanyJobs = action.payload;
        },
        setSearchQuery: (state, action: PayloadAction<string | undefined>) => {
            state.searchQuery = action.payload;
        },
    },
});

export const { setAllJobs, setAllAdminJobs, setAllAppliedJobs, setSingleJob, setCompanyJobs, setSearchQuery } = jobSlice.actions;
export default jobSlice.reducer;
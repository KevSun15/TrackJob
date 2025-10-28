import { apiSlice} from '../apiSlice';
const JOBS_URL = '/api/jobs';

export const jobsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllJobs: builder.mutation({
      query: () => ({
        url: JOBS_URL,
        method: 'GET',
      }),
    }),
    getMyJobs: builder.mutation({
      query: () => ({
        url: `${JOBS_URL}/my-jobs`,
        method: 'GET',
        credentials: 'include',
      }),
    }),
    getJobById: builder.mutation({
      query:(id) => ({
        url: `${JOBS_URL}/${id}`,
        method: 'GET',
      }),
    }),
    createJob: builder.mutation({
      query: (data) => ({
        url: `${JOBS_URL}/my-jobs`,
        method: 'POST',
        credentials: 'include',
        body: data,
      }),
    }),
    updateJob: builder.mutation({
      query: ({id, ...data}) => ({
        url: `${JOBS_URL}/${id}`,
        method: 'PUT',
        credentials: 'include',
        body: data,
      }),
    }),
    deleteJob: builder.mutation({
      query: (id) => ({
        url: `${JOBS_URL}/${id}`,
        credentials: 'include', 
        method: 'DELETE',
      }),
    }),
    getCompanyJobs: builder.mutation({
      query: (companyId) => ({
        url: `${JOBS_URL}/company-jobs/${companyId}`,
        method: 'GET',
      }),
    }), 
  }),
});

export const {
  useGetAllJobsMutation,
  useGetMyJobsMutation,
  useGetJobByIdMutation,
  useCreateJobMutation,
  useUpdateJobMutation,
  useDeleteJobMutation,
  useGetCompanyJobsMutation,
} = jobsApiSlice;
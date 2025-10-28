import { apiSlice } from "../apiSlice";
const APPLICATIONS_URL = '/api/applications';


const applicationsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getMyApplications: builder.mutation({
      query: () => ({
        url: `${APPLICATIONS_URL}/my-applications`,
        method: 'GET',
        credentials: 'include',
      }),
    }),
    createApplication: builder.mutation({
      query: (data) => ({
        url: APPLICATIONS_URL,
        method: 'POST',
        credentials: 'include',
        body: data,
      })
    }),
    updateApplication: builder.mutation({
      query:(data) => ({
        url: `${APPLICATIONS_URL}/update`,
        method: 'PUT',
        credentials: 'include',
        body: data,
      }),
    }),
  }),
});

export const { useGetMyApplicationsMutation, useCreateApplicationMutation, useUpdateApplicationMutation } = applicationsApiSlice;
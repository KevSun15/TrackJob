import type { get } from "http";
import { apiSlice } from "../apiSlice";
const USERS_URL = '/api/user';



export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login:builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/login`,
        method: 'POST',
        body: data,
      }), 
    }),
      logout: builder.mutation({
      query: () => ({
        url: `${USERS_URL}/logout`,
        method: 'POST',
      }),
    }),
    register: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/register`,
        method: 'POST',
        body: data,
      }),
    }),
    updateUser: builder.mutation({
      query: (data) => ({
          url: `${USERS_URL}/profile`,
          method: 'PUT',
          body: data,
          credentials: 'include',
      }),
    }),
    getCompanies: builder.mutation({
      query: () => ({
        url: `${USERS_URL}/companies`,
        method: 'GET',
        credentials: 'include',
      }),
    }),
    uploadResume: builder.mutation({
      query: (file) => {
        const formData = new FormData();
        formData.append("resume", file);
        return{
        url: `${USERS_URL}/profile/resume`,
        method: 'POST',
        body: formData,
        credentials: 'include',
        }
      },
    }),

    updateAvatar: builder.mutation({
      query: (file) => {
        const formData = new FormData();
        formData.append("avatar", file); 
        return{
        url: `${USERS_URL}/profile/avatar`,
        method: 'PUT',
        body: formData,
        credentials: 'include',
        }
      },
    }),
    deleteAvatar: builder.mutation({
      query: () => ({
        url: `${USERS_URL}/profile/avatar`,
        method: 'DELETE',
        credentials: 'include',
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useLogoutMutation,
  useRegisterMutation,
  useUpdateUserMutation,
  useUploadResumeMutation,
  useUpdateAvatarMutation,
  useDeleteAvatarMutation,
  useGetCompaniesMutation,
} = userApiSlice;
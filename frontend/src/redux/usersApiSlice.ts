import { apiSlice } from "./apiSlice";
const USERS_URL = '/api/user';



export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login:builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/login`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['User'],
    }),
      logout: builder.mutation({
      query: () => ({
        url: `${USERS_URL}/logout`,
        method: 'POST',
      }),
      invalidatesTags: ['User'],
    }),
    register: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/register`,
        method: 'POST',
        body: data,
      }),
        invalidatesTags: ['User'],
    }),
    updateUser: builder.mutation({
      query: (data) => ({
          url: `${USERS_URL}/profile`,
          method: 'PUT',
          body: data,
          credentials: 'include',
      }),
        invalidatesTags: ['User'],
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
        invalidatesTags: ['User'],
    }),
    getUser: builder.query({
      query: () => ({
        url: `${USERS_URL}/profile`,
        method: 'GET',
        credentials: 'include',
      }),
      providesTags: ['User'],
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
        invalidatesTags: ['User'],
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
  useGetUserQuery
} = userApiSlice;
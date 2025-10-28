import { apiSlice } from "../apiSlice";
const COMPANY_URL = '/api/companies';


const companyApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createCompany: builder.mutation({
      query: (data) => ({
        url: COMPANY_URL,
        method: 'POST',
        body: data,
        credentials: 'include',
      }),
    }),
    getAllCompanies: builder.mutation({
      query: () => ({
        url: COMPANY_URL,
        method: 'GET',
      }),
    }),
    getCompaniesByRecruiterId: builder.mutation({
      query: (id) => ({
        url: `${COMPANY_URL}/recruiter/${id}`,
        method: 'GET',
        credentials: 'include',
      }), 
    }),
    updateCompany: builder.mutation({
      query: (data) => ({
        url: `${COMPANY_URL}/${data.companyId}`,
        method: 'PUT',
        credentials: 'include',
        body: data,
      })
    }),
    uploadCompanyLogo: builder.mutation({
      query: (file) => {
        const formData = new FormData();
        formData.append("logo", file);
        return{
        url: `${COMPANY_URL}/logo`,
        method: 'PUT',
        body: formData,
        credentials: 'include',
        }
      },
    }), 
  }),
});

export const { useCreateCompanyMutation, useUploadCompanyLogoMutation, useGetAllCompaniesMutation, useGetCompaniesByRecruiterIdMutation, useUpdateCompanyMutation } = companyApiSlice;

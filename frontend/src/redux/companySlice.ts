import {createSlice } from '@reduxjs/toolkit';
import { type PayloadAction } from '@reduxjs/toolkit';

export interface Company {
  _id: string;
  companyName: string;
  location: {
      Country: string,
      State: string,
      City: string,
  }
  website: string;
  logoUrl: string;
  description: string;
  recruiterId: string;
}

 
interface CompanyState {
  allCompanies: Company[];
  adminCompanies: Company[];
  singleCompany: Company | null;
}

const initialState: CompanyState = {
  allCompanies: [],
  adminCompanies: [],
  singleCompany: null,   
};

const companySlice = createSlice({
    name: 'company',
    initialState,
    reducers: {
        setAllCompanies: (state, action: PayloadAction<Company[]>) => {
            state.allCompanies = action.payload;
        },
        setAdminCompanies: (state, action: PayloadAction<Company[]>) => {
            state.adminCompanies = action.payload;
        },
        setSingleCompany: (state, action: PayloadAction<Company | null>) => {
            state.singleCompany = action.payload;
        },
        setCompanyLogo: (state, action: PayloadAction<string>) => {
            if (state.singleCompany) {
                state.singleCompany.logoUrl = action.payload;
            }
        }
    },
});

export const { setCompanyLogo, setAllCompanies, setAdminCompanies, setSingleCompany } = companySlice.actions;

export default companySlice.reducer;  
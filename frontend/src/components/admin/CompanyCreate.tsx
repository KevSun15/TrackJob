import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';
import { ArrowLeft, Building, MapPin, Globe, FileText, UploadCloud, Image as ImageIcon } from 'lucide-react';
import { useCreateCompanyMutation, useUpdateCompanyMutation } from "../../redux/apiSlices/companyApiSlice";
import Navbar from "../Navbar";
import { useNavigate } from 'react-router-dom';
import { toast } from "sonner";
import { Spinner, Avatar } from '@radix-ui/themes';
import type { RootState } from "../../redux/store";
import { useSelector, useDispatch } from 'react-redux';
import { setAdminCompanies } from "../../redux/companySlice";
import { useUploadCompanyLogoMutation } from '../../redux/apiSlices/companyApiSlice';
import { setCompanyLogo } from '../../redux/companySlice';

interface CompanyFormData {
  companyName: string;
  location: { Country: string; State: string; City: string; };
  website: string;
  description: string;
  logoUrl?: string; 
}

const inputStyle = "w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-web/50 focus:border-orange-web outline-none transition-colors duration-200 text-gray-800 placeholder:text-gray-400";

export default function CreateCompany() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [logoFile, setLogoFile] = useState<File | null>(null);

  const [createCompany, { isLoading: isCreating }] = useCreateCompanyMutation();
  const [updateCompany, { isLoading: isUpdating }] = useUpdateCompanyMutation();
  const [uploadCompanyLogo] = useUploadCompanyLogoMutation();
  const { adminCompanies, singleCompany } = useSelector((state: RootState) => state.companies);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<CompanyFormData>({
    defaultValues: singleCompany || {
      companyName: "", location: { Country: "", State: "", City: "" }, website: "", description: ""
    }
  });

  const isEditMode = !!singleCompany?._id;

  const handleLogoChange = async(e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    try {
      const logo = await uploadCompanyLogo(file).unwrap();
      dispatch(setCompanyLogo(logo.logoUrl));
      toast.success("Company logo uploaded successfully");
    } catch (err) {
      toast.error("Logo upload failed");
    }
  };

  const removeLogo = async () => {
    try {
      const url = await uploadCompanyLogo(null).unwrap();
      dispatch(setCompanyLogo(url.logoUrl)); 
      toast.success("Logo removed");
    } catch (err) { toast.error("Failed to remove logo"); }
  };

  useEffect(() => {
    if (isEditMode) {
      const companyData = {
        ...singleCompany,
      }
      reset(companyData);
    }
  }, [singleCompany]);

  
  const onSubmit = async (data: CompanyFormData) => {
    try {
      let company;
      let finalData = { ...data };  
      if (isEditMode) {
        company = await updateCompany({ companyId: singleCompany._id, data: finalData }).unwrap();
      } else {
        company = await createCompany(finalData).unwrap();
        dispatch(setAdminCompanies([...adminCompanies, company]));
      }
      navigate("/admin/companies");
      toast.success(`Company ${isEditMode ? 'updated' : 'created'} successfully!`);
    } catch (error) {
      console.error("Failed to save company:", error);
      toast.error(`Failed to ${isEditMode ? 'update' : 'create'} company`);
    }
  };

  return (
    <div className="min-h-screen bg-platinum">
      <Navbar />
      <main className="container mx-auto px-4 py-10 max-w-3xl">
        <header className="flex items-center gap-4 mb-8">
          <button onClick={() => navigate("/admin/companies")} className="p-2 cursor-pointer hover:bg-white rounded-full transition-colors">
            <ArrowLeft size={24} className="text-oxford-blue" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-oxford-blue">{isEditMode ? 'Edit Company' : 'Create New Company'}</h1>
            <p className="text-oxford-blue/70 mt-1">{isEditMode ? 'Update the details for this company.' : 'Add a new company to the platform.'}</p>
          </div>
        </header>
        <div className="bg-white rounded-xl shadow-sm border border-platinum p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="p-5 rounded-lg bg-oxford-blue/5 border border-platinum">
              <label className="flex items-center gap-2 text-sm font-semibold text-oxford-blue mb-3">
                <ImageIcon size={16} /> Company Logo
              </label>
              <div className="flex items-center gap-6">
                <div className="w-24 h-24 rounded-lg bg-white border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400 relative group">
                  {singleCompany?.logoUrl ? (
                    <Avatar src={singleCompany?.logoUrl} fallback={""} size="7"  />
                  ) : (
                    <Building size={32} />
                  )}
                  <label htmlFor="logo-upload" className="absolute inset-0 flex items-center justify-center bg-black/50 text-white opacity-0 group-hover:opacity-100 rounded-lg cursor-pointer transition-opacity">
                    <UploadCloud size={24} />
                  </label>
                  <input id="logo-upload" type="file" accept="image/png, image/jpeg" className="hidden" onChange={handleLogoChange}/>
                </div>
                <div>
                  <label htmlFor="logo-upload" className="cursor-pointer px-4 py-2 bg-white border border-gray-300 text-oxford-blue rounded-lg hover:bg-gray-50 transition-colors font-semibold text-sm">
                    {logoFile ? 'Change Logo' : 'Upload Logo'}
                  </label>
                  <p className="text-xs text-gray-500 mt-2">PNG or JPG. Recommended size: 400x400px.</p>
                </div>
              </div>
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-oxford-blue mb-2">
                <Building size={16} /> Company Name <span className="text-red-500">*</span>
              </label>
              <input type="text" {...register("companyName", { required: "Company name is required" })}
                className={inputStyle} placeholder="e.g., Acme Inc."/>
              {errors.companyName && <p className="mt-1 text-xs text-red-600">{errors.companyName.message}</p>}
            </div>
            <div className="p-5 rounded-lg bg-oxford-blue/5 border border-platinum">
              <label className="flex items-center gap-2 text-sm font-semibold text-oxford-blue mb-3">
                <MapPin size={16} /> Location <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input type="text" {...register("location.Country", { required: "Country is required" })} className={inputStyle} placeholder="Country"/>
                <input type="text" {...register("location.State", { required: "State is required" })} className={inputStyle} placeholder="State / Province"/>
                <input type="text" {...register("location.City", { required: "City is required" })} className={inputStyle} placeholder="City"/>
              </div>
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-oxford-blue mb-2">
                <Globe size={16} /> Website
              </label>
              <input type="url" {...register("website")} className={inputStyle} placeholder="https://example.com"/>
              {errors.website && <p className="mt-1 text-xs text-red-600">{errors.website.message}</p>}
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-oxford-blue mb-2">
                <FileText size={16} /> Description
              </label>
              <textarea {...register("description")} rows={4} className={inputStyle} placeholder="A brief description of the company..."/>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-platinum">
              <button type="button" onClick={() => navigate("/admin/companies")}
                className="w-full px-4 py-3 bg-white border border-gray-300 text-oxford-blue rounded-lg hover:bg-gray-50 transition-colors font-bold">
                Cancel
              </button>
              <button type="submit" disabled={isCreating || isUpdating}
                className="w-full flex items-center justify-center px-4 py-3 bg-orange-web text-oxford-blue rounded-lg hover:bg-orange-web/90 transition-colors font-bold focus:outline-none focus:ring-2 focus:ring-orange-web/50 disabled:opacity-70">
                {(isCreating || isUpdating) ? <Spinner /> : isEditMode ? 'Save Changes' : 'Create Company'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
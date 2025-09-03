import React, { useEffect, useState } from "react";
import { validatePatientSchema } from "@/utils/dataSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { bloodGroup, formatDate } from "@/utils/constants";
import { useAuth } from "@/store";
import ErrorAlert from "@/components/ErrorAlert";
import { getPatient, updatePatient } from "@/api/patients";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { LazyLoader } from "@/components/LazyLoader";
import { useNavigate } from "react-router";

export default function HealthRecord() {
  const [err, setError] = useState(null);
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    setValue, //it helps to set the value of a specific field, like helping to auto fill the input field
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(validatePatientSchema),
  });
  const { user, accessToken } = useAuth();

  const queryClient = useQueryClient();

  //note,useQuery (from React Query) is a hook for fetching and caching data. It returns an object with useful states:
//isPending → true while the request is in progress.
//isError → true if the request fails.
//data → the successful response (if request worked).
//error → holds the actual error object (if something went wrong).

  const { isPending, isError, data, error } = useQuery({ // we do thid for a get request or fetcthing data , isError is a boolean
    queryKey: ["patient", accessToken],   //The queryKey ["patient", accessToken] is like a label for caching. If accessToken changes, React Query sees it as a new query and refetches.
    queryFn: () => getPatient(accessToken), //because the get patient is  dependent  on paramater so we passed it as a callback function
  });
const patientData = data?.data?.data;

  const gender = ["male", "female", "other"];
  const bloodGroupOptions = Object.entries(bloodGroup).map(([key, value]) => ({
    name: key,
    id: value,
  }));
  useEffect(() => {
    if (user) {
      setValue("fullname", user?.fullname);
      setValue("email", user?.email);
      setValue("phone", user?.phone);
      setValue("dateOfBirth", formatDate(user?.dateOfBirth || "", "input"));
    }
    if (patientData) {
      setValue("gender", patientData?.gender || "");
      setValue("bloodGroup", patientData?.bloodGroup || "");
      setValue("address", patientData?.address || "");
      setValue("emergencyContact", patientData?.emergencyContact || "");
      setValue(
        "emergencyContactPhone",
        patientData?.emergencyContactPhone || ""
      );
      setValue(
        "emergencyContactRelationship",
        patientData?.emergencyContactRelationship || ""
      );
    }
  }, [user, setValue, patientData]);

  const mutation = useMutation({
    mutationFn: updatePatient,
    onSuccess: (res) => {
      if (res.status === 200) {
        toast.success(res.data?.message);
        queryClient.invalidateQueries({ queryKey: ["patient"] });
      }
    },
    onError: (error) => {
      import.meta.env.DEV && console.log(error);
      setError(error?.response?.data?.message || "Error updating your profile");
    },
  });

  if (isPending) {
    return <LazyLoader />;
  }


  const onSubmit = async (formData) => {
    mutation.mutate({ patientId: patientData._id, formData, accessToken });
    
  };
  
// The payload you’re passing is an object with: // patientId: patientData._id → the ID of the patient to update (likely from some earlier query like getPatient line 38).
// formData → the new values from the form.
// // accessToken → the user’s JWT or session token for authorization.




  return (
    <div className="space-y-6">
      <h1 className="font-bold text-2xl border-b border-gray-300 pb-2">
        Health Information
      </h1>
      <>
       
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="md:grid grid-cols-12 gap-4"
          id="/dashboard/settings/health"
        >
        {isError ||
          (err && <ErrorAlert error={error?.response?.data?.message || err} />)}
          <div className="col-span-6">
            <fieldset className="fieldset">
              <legend className="fieldset-legend">Full name</legend>
              <input
                type="text"
                className="input w-full"
                placeholder="Full name"
                {...register("fullname")}
              />
            </fieldset>
            {errors.fullname?.message && (
              <span className="text-xs text-red-500">
                {errors.fullname?.message}
              </span>
            )}
          </div>
          {/* email */}
          <div className="col-span-6">
            <fieldset className="fieldset">
              <legend className="fieldset-legend">Email</legend>
              <input
                type="email"
                className="input w-full"
                placeholder="Email"
                {...register("email")}
              />
            </fieldset>
            {errors.email?.message && (
              <span className="text-xs text-red-500">
                {errors.email?.message}
              </span>
            )}
          </div>
          {/* phone */}
          <div className="col-span-6">
            <fieldset className="fieldset">
              <legend className="fieldset-legend">Phone</legend>
              <input
                type="tel"
                className="input w-full"
                placeholder="Phone"
                {...register("phone")}
              />
            </fieldset>
            {errors.phone?.message && (
              <span className="text-xs text-red-500">
                {errors.phone?.message}
              </span>
            )}
          </div>
          {/* date of birth */}
          <div className="md:col-span-6">
            <fieldset className="fieldset col-span-6">
              <legend className="fieldset-legend">Date of birth</legend>
              <input
                type="date"
                className="input w-full"
                placeholder="dd/mm/yyyy"
                {...register("dateOfBirth")}
              />
            </fieldset>
            {errors.dateOfBirth?.message && (
              <span className="text-xs text-red-500">
                {errors.dateOfBirth?.message}
              </span>
            )}
          </div>
          {/* Gender */}
          <div className="md:col-span-6">
            <fieldset className="fieldset">
              <legend className="fieldset-legend">Gender</legend>
              <select
                defaultValue={""}
                className="select capitalize w-full"
                name="gender"
                {...register("gender")}
                disabled={isSubmitting}
              >
                <option value="">Select Gender</option>
                {gender?.map((option, index) => (
                  <option key={index} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </fieldset>
            {errors.gender?.message && (
              <span className="text-xs text-red-500">
                {errors.gender?.message}
              </span>
            )}
          </div>
          {/* blood group */}
          <div className="md:col-span-6">
            <fieldset className="fieldset">
              <legend className="fieldset-legend">Blood Group</legend>
              <select
                defaultValue={""}
                className="select capitalize w-full"
                name="bloodGroup"
                {...register("bloodGroup")}
                disabled={isSubmitting}
              >
                <option value={""}>Select Blood Group</option>
                {bloodGroupOptions?.map((option, index) => (
                  <option key={index} value={option.id}>
                    {option.name}
                  </option>
                ))}
              </select>
            </fieldset>
            {errors.bloodGroup?.message && (
              <span className="text-xs text-red-500">
                {errors.bloodGroup?.message}
              </span>
            )}
          </div>

          {/* address */}
          <div className="col-span-12">
            <fieldset className="fieldset">
              <legend className="fieldset-legend">Address</legend>
              <input
                type="text"
                className="input w-full"
                placeholder="Address"
                {...register("address")}
              />
            </fieldset>
            {errors.address?.message && (
              <span className="text-xs text-red-500">
                {errors.address?.message}
              </span>
            )}
          </div>
          {/* emergency contact */}
          <div className="col-span-6">
            <fieldset className="fieldset">
              <legend className="fieldset-legend">Emergency contact</legend>
              <input
                type="text"
                className="input w-full"
                placeholder="Emergency contact"
                {...register("emergencyContact")}
              />
            </fieldset>
            {errors.emergencyContact?.message && (
              <span className="text-xs text-red-500">
                {errors.emergencyContact?.message}
              </span>
            )}
          </div>
          {/* emergency phone */}
          <div className="col-span-6">
            <fieldset className="fieldset">
              <legend className="fieldset-legend">
                Emergency contact phone
              </legend>
              <input
                type="tel"
                className="input w-full"
                placeholder="Emergency contact phone"
                {...register("emergencyContactPhone")}
              />
            </fieldset>
            {errors.emergencyContactPhone?.message && (
              <span className="text-xs text-red-500">
                {errors.emergencyContactPhone?.message}
              </span>
            )}
          </div>
          {/* emergency relationship */}
          <div className="col-span-6">
            <fieldset className="fieldset">
              <legend className="fieldset-legend">
                Emergency contact relationship
              </legend>
              <input
                type="text"
                className="input w-full"
                placeholder="Emergency contact relationship"
                {...register("emergencyContactRelationship")}
              />
            </fieldset>
            {errors.emergencyContactRelationship?.message && (
              <span className="text-xs text-red-500">
                {errors.emergencyContactRelationship?.message}
              </span>
            )}
          </div>

          {/* button */}
          <div className=" md:hidden my-6 flex items-center justify-center gap-4">
            <button
              type="button"
              className="btn btn-outline w-[140px] border border-gray-300"
               onClick={() => navigate("/dashboard/settings")}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white font-bold border border-gray-300 p-2 rounded-md cursor-pointer w-[140px]"
              disabled={ mutation.isPending}
            >
             { mutation.isPending ? "Saving..." : " Save"}
            </button>
          </div>
        </form>
      </>
    </div>
  );
}

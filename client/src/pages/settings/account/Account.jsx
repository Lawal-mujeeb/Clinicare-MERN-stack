import UploadImage from "@/features/settings/UploadImage";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { validateUserSchema } from "@/utils/dataSchema";
import { useEffect, useState } from "react";
import { formatDate } from "@/utils/constants";
import ErrorAlert from "@/components/ErrorAlert";
import Delete from "@/components/Delete";
import { useLocation, useNavigate } from "react-router";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { updateUserProfile } from "@/api/auth";
import { toast } from "sonner";
import { useAuth } from "@/store";

export default function Account() {
  const [error, setError] = useState(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm({
    resolver: zodResolver(validateUserSchema),
  });

  const navigate = useNavigate();
  const { user, accessToken } = useAuth();
  const queryClient = useQueryClient();

  const location = useLocation();

  useEffect(() => {
    location.pathname === "/dashboard/settings" &&
      navigate("/dashboard/settings/account");
  }, [location.pathname, navigate]);

  useEffect(() => {
    if (user) {
      setValue("fullname", user?.fullname);
      setValue("email", user?.email);
      setValue("phone", user?.phone);
      setValue("dateOfBirth", formatDate(user?.dateOfBirth));
    }
  }, [user, setValue]);

  const mutation = useMutation({
    mutationFn: updateUserProfile,
    onSuccess: async (response) => {
      if (response.status === 200) {
        toast.success(response?.data?.message);
        queryClient.invalidateQueries({ queryKey: ["auth_user"] });
      }
    },
    onError: (error) => {
     import.meta.env.DEV && console.log(error);
      setError(error?.response?.data?.message || "Error updating Your profile");
    },
  });

  const onSubmit = async (userData) => {
    mutation.mutate({ userData, accessToken });
  };

  return (
    <div className="space-y-6">
      <h1 className="font-bold text-2xl border-b border-gray-300 pb-2">
        Account
      </h1>
      <>
        <UploadImage />

        <form
          className="space-y-6   "
          onSubmit={handleSubmit(onSubmit)}
          id="/dashboard/settings/account"
        >
          {error && <ErrorAlert error={error} />}
          <div className="grid grid-cols-12 gap-4  ">
            <div className=" col-span-12 md:col-span-6">
              <label className="block text-sm font-medium text-gray-700">
                Full name
              </label>
              <input
                type="text"
                placeholder=" Full name "
                {...register("fullname")}
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 "
              />
              {errors?.fullname?.message && (
                <span className="text-xs text-red-500">
                  {errors?.fullname?.message}
                </span>
              )}
            </div>

            <div className="col-span-12 md:col-span-6">
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                placeholder="Email"
                {...register("email")}
                id="email"
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 "
              />
              {errors?.email?.message && (
                <span className="text-xs text-red-500">
                  {errors?.email?.message}
                </span>
              )}
            </div>

            <div className="col-span-12 md:col-span-6">
              <label className="block text-sm font-medium text-gray-700">
                Phone
              </label>
              <input
                type="tel"
                placeholder="Phone"
                {...register("phone")}
                id="phone"
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 "
              />
              {errors?.phone?.message && (
                <span className="text-xs text-red-500">
                  {errors?.phone?.message}
                </span>
              )}
            </div>

            <div className="col-span-12 md:col-span-6 max-w-full  ">
              <label className="block text-sm font-medium text-gray-700">
                Date of birth
              </label>
              <input
                type="date"
                {...register("dateOfBirth")}
                id="date"
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 "
              />
              {errors?.dateOfBirth?.message && (
                <span className="text-xs text-red-500">
                  {errors?.dateOfBirth?.message}
                </span>
              )}
            </div>
          </div>

          <div className="flex md:hidden gap-4 justify-end">
            <button
              type="button"
              className="btn btn-outline w-[140px] border border-gray-300"
              onClick={() => navigate("/")}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white font-bold border border-gray-300 p-2 rounded-md cursor-pointer w-[140px]"
              disabled={mutation.isPending}
            >
              {mutation.isPending ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
        <div className="pt-6 border-t border-gray-200">
          <button
            type="button"
            className="font-bold hover:underline"
            disabled={isSubmitting}
          >
            Delete account
          </button>
          <div className="lg:flex  items-center justify-between   ">
            <p className="mt-1 text-sm text-gray-500  lg:w-[40%]   ">
              When you delete your account, you lose access to medical history
              and appointments. We permanently delete your account and all
              associated data.
            </p>

            <Delete />
          </div>
        </div>
      </>
    </div>
  );
}

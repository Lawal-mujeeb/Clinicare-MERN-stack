import useMetaArgs from "@/hooks/useMeta";
import { useAuth } from "@/store";
import { updatePasswordSchema } from "@/utils/dataSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import  {  useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { updateUserPassword, logout } from "@/api/auth";
import ErrorAlert from "@/components/ErrorAlert";
import { toast } from "sonner";

export default function Password() {
    useMetaArgs({
title: "Password - Clinicare",
description: "Password settings for your Clinicare account.",
 keywords: "Clinicare, password, settings",
    })

  const [isVisible, setIsVisible] = useState(false);
  const [isNewVisible, setIsNewVisible] = useState(false);
  const [isConfirmVisible, setIsConfirmVisible] = useState(false);
  const [error, setError] = useState(null);
  const queryClient = useQueryClient();
  const { accessToken, setAccessToken } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(updatePasswordSchema) });
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: updateUserPassword,
    onSuccess: async (response) => {
      if (response.status === 200) {
        toast.success(response?.data?.message);
        //after password update, logout user
        try {
          const res = await logout(accessToken);
          if (res.status === 200) {
            setAccessToken(null);
            queryClient.invalidateQueries({ queryKey: ["auth_user"] });
          }
        } catch {
          //fall back to local cleanup even if api logout fails
          queryClient.invalidateQueries({ queryKey: ["auth_user"] });
          setAccessToken(null);
          navigate("/account/signin");
        }
      }
    },
    onError: (error) => {
     import.meta.env.DEV && console.log(error);
      setError(error?.response?.data?.message || "Error updating password");
    },
  });

  const togglePassword = () => {
    setIsVisible((prev) => !prev);
  };

  const toggleNewPassword = () => {
    setIsNewVisible((prev) => !prev);
  };

  const toggleConfirmPassword = () => {
    setIsConfirmVisible((prev) => !prev);
  };

  const onSubmit = async (userData) => {
     mutation.mutate({userData,accessToken })
  }

  return (
    <div className="space-y-6">
      <h1 className="font-bold text-2xl border-b border-gray-300 pb-2">
        Update Password
      </h1>
      <div className="md:flex flex-col justify-center items-center">
        {error && <ErrorAlert error={error} />}
        <form  onSubmit={handleSubmit(onSubmit)} id="/dashboard/settings/password" className="max-w-[400px] mx-auto "   >
          <div>
            <fieldset className="fieldset relative">
              <legend className="fieldset-legend">Password</legend>
              <input
                type={isVisible ? "text" : "password"}
                className="input w-full md:w-[450px]"
                placeholder="Password"
                {...register("password")}
              />
              <button
                type="button"
                className="absolute font-semibold cursor-pointer top-1 left-66 md:left-100 inset-0"
                onClick={togglePassword}
              >
                {isVisible ? "Hide" : "Show"}
              </button>
            </fieldset>
            {errors.password?.message && (
              <span className="text-xs text-red-500">
                {errors.password?.message}
              </span>
            )}
          </div>
          <div>
            <fieldset className="fieldset relative">
              <legend className="fieldset-legend">New Password</legend>
              <input
                type={isNewVisible ? "text" : "password"}
                className="input w-full md:w-[450px]"
                placeholder="New Password"
                {...register("newPassword")}
              />
              <button
                type="button"
                className="absolute font-semibold cursor-pointer top-1 left-66 md:left-100 inset-0"
                onClick={toggleNewPassword}
              >
                {isVisible ? "Hide" : "Show"}
              </button>
            </fieldset>
            {errors.password?.message && (
              <span className="text-xs text-red-500">
                {errors.password?.message}
              </span>
            )}
          </div>
          <div>
            <fieldset className="fieldset relative">
              <legend className="fieldset-legend">Confirm Password</legend>
              <input
                type={isConfirmVisible ? "text" : "password"}
                className="input w-full md:w-[450px]"
                placeholder="Confirm Password"
                {...register("confirmPassword")}
              />
              <button
                type="button"
                className="absolute font-semibold cursor-pointer top-1 left-66 md:left-100 inset-0"
                onClick={toggleConfirmPassword}
              >
                {isVisible ? "Hide" : "Show"}
              </button>
            </fieldset>
            {errors.password?.message && (
              <span className="text-xs text-red-500">
                {errors.password?.message}
              </span>
            )}
          </div>
          <p className="text-gray-700 mt-2 text-[15px]">
            Note: You will be logged out after updating your password.
          </p>
          <div className="flex md:hidden gap-10 pt-6">
            <button
              type="button"
              className="btn btn-outline w-[140px] border border-gray-300"
              onClick={() => navigate("/dashboard/settings")}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn bg-blue-500 text-white font-bold border border-gray-300 p-2 rounded-md cursor-pointer w-[140px]"
              disabled={isSubmitting || mutation.isPending}
            >
           {isSubmitting || mutation.isPending ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

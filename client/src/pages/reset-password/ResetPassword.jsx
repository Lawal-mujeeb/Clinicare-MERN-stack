import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { validateResetPasswordSchema } from "@/utils/dataSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import useMetaArgs from "@/hooks/useMeta";
import ErrorAlert from "@/components/ErrorAlert";
import {resetPassword} from "@/api/auth"
import { useMutation,  } from "@tanstack/react-query";
import {toast} from "sonner";
import {useSearchParams, useNavigate} from "react-router";






export default function ResetPassword() {
  useMetaArgs({
    title: "Reset Password-Clincare",
    description: "Welcome to your clinicare user",
    keywords: "Health, Reset, Clinic, Hospital",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
   
  const {
    register,
    handleSubmit,
    formState: { errors,isSubmitting },
  } = useForm({
    resolver: zodResolver(validateResetPasswordSchema),
  });
const [error, setError] = useState(null);
   const [searchParams] = useSearchParams();
//look for values on our url bar
const email = searchParams.get("email");
const token = searchParams.get("token");
// console.log({email, token}) //to test if it working



const mutation = useMutation({
    mutationFn: resetPassword,
    onSuccess: (response) => {
      console.log(response)
      toast.success(response?.data?.message );
      navigate("/account/signin")
    },
    onError: (error) => {
      console.log(error);
      setError(error?.response?.data?.message );
    },
  });

const onSubmit = async (data) => {
  const userData = { ...data, email, token};
     mutation.mutate(userData); 
  }


  const togglePassword = () => {
    setShowPassword((prev) => !prev);
  };
  const toggleConfirmPassword = () => setShowConfirmPassword((prev) => !prev);

  return (
    <>
      <div className=" flex items-center justify-center min-h-[93vh] gap-2 ">
        <form action="" className="mt-20" onSubmit={handleSubmit(onSubmit)}>
          <fieldset className="fieldset bg-white border-base-300 rounded-xl shadow-lg w-[22rem] md:w-sm border p-5  ">
            <div className="flex flex-col items-center gap-2 pb-2">
              <img
                src="/lock-fill.png"
                alt="user"
                className="border-1 border-[#1176DA] rounded-full p-2  bg-white"
              />
              <h1 className="text-2xl font-bold">Create New Password</h1>
              <p className="text-gray-600 text-center text-[0.95rem] ">
                Please enter a new password. Your new password must be different
                from your previous password.
              </p>
            </div>
               {error && <ErrorAlert error={error}   /> }
            <div>
              <label className="label font-bold text-black ">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  className="input w-full"
                  placeholder="Password"
                  {...register("password")}
                  id="password"
                />
                <button
                  type="button"
                  className="absolute top-1/4 right-3  cursor-pointer semi-bold"
                  onClick={togglePassword}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500">{errors.password.message}</p>
              )}
            </div>

            <div>
              <label className="label font-bold text-black ">
                {" "}
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  className="input w-full"
                  placeholder="Confirm Password"
                  {...register("confirmPassword")}
                  id="Password"
                />
                <button
                  type="button"
                  className="absolute top-1/4 right-3  cursor-pointer semi-bold"
                  onClick={toggleConfirmPassword}
                >
                  {showConfirmPassword ? "Hide" : "Show"}
                </button>
              </div>
              {errors.password&& (
                <p className="text-red-500">{errors.password.message}</p>
              )}
            </div>
            <button type="submit"  disabled={isSubmitting || mutation.isPending} className="btn bg-[#2B7FFF] hover:bg-[#1E5FCC] mt-4 text-white">
              {isSubmitting || mutation.isPending ? "Resetting..." : "Reset Password"} 
            </button>
          </fieldset>
        </form>
      </div>
    </>
  );
}

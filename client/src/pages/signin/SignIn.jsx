import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { validateSignInSchema } from "@/utils/dataSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import useMetaArgs from "@/hooks/useMeta";
import { loginUser } from "@/api/auth";
import { useMutation,  } from "@tanstack/react-query";
import {toast} from "sonner"
import { useAuth } from "@/store/index";
import ErrorAlert from "@/components/ErrorAlert";



export default function SignIn() {
  useMetaArgs({
      title: "Login-Clincare",
      description: "Welcome to your clinicare user",
      keywords: "Health, Login, Clinic, Hospital",
    });
    const[showPassword, setShowPassword]= useState(false)
     const [error, setError] = useState(null)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(validateSignInSchema),
  });

const { setAccessToken } = useAuth(); // we are using the useAuth hook to get the setAccessToken function from authprovider

const togglePassword= () => {
    setShowPassword((prev)=> !prev)
}

const mutation = useMutation({
    mutationFn: loginUser,
    onSuccess: (response) => {
      //what to do if our api call was successful
      // console.log(response);
      toast.success(response?.data?.message || "Login successful");
      //save accessToken
      setAccessToken(response?.data?.data?.accessToken)
    },
    onError: (error) => {
      console.log(error);
      setError(error?.response?.data?.message || "Login Failed"  );
    },
  });

const onSubmit = async (data) => {
     mutation.mutate(data); 
  }



  return (
    <>
      <div className=" flex items-center justify-center min-h-[93vh] gap-2 ">
        <form action="" className="mt-20"  onSubmit={handleSubmit(onSubmit)} >
          <fieldset className="fieldset bg-white border-base-300 rounded-xl shadow-lg w-[22rem] md:w-sm border p-5  ">
            <div className="flex flex-col items-center gap-2">
              <img
                src="/user.png"
                alt="user"
                className="border-1 border-[#1176DA] rounded-full p-2  bg-white"
              />
              <h1 className="text-2xl font-bold">Welcome Back</h1>
              <p className="text-gray-600 text-[0.99rem] text-center mb-3">
                Glad to see you again. Log in to your account.
              </p>
            </div>
                {error && <ErrorAlert error={error}   /> }
            <label className="label font-bold  text-black ">Email</label>
            <input
              type="email"
              className="input w-full"
              placeholder="Email"
              {...register("email")}
              id="email"
            />
            {errors.email && (
              <p className="text-red-500">{errors.email.message}</p>
            )}

            <label className="label font-bold text-black ">Password</label>
            <div className="relative">
            <input
              type={showPassword? "text" :"password" }
              className="input w-full"
              placeholder="Password"
              {...register("password")}
              id="password"
            />
            
            <button type="button" className="absolute top-1/4 right-3" onClick={togglePassword} >
              {showPassword ? "Hide" : "Show" }
            </button>
            </div>
            {errors.password && (
              <p className="text-red-500">{errors.password.message}</p>
            )}
<a className="text-blue-500 font-bold text-sm" href="/account/forgot-password" >Forgot Password?</a>
            <button
              className="btn bg-[#2B7FFF] hover:bg-[#1E5FCC] mt-4 text-white"
              disabled={isSubmitting || mutation.isPending}
            >
               {isSubmitting || mutation.isPending ? "Signing in..." : "Sign in"}
            </button>
            <p className="text-sm text-gray-600 text-center">
              Don't have an account?{" "}
              <a className="text-blue-500 font-bold" href="/account/signup">
                Sign Up
              </a>
            </p>
          </fieldset>
        </form>
      </div>
    </>
  );
}

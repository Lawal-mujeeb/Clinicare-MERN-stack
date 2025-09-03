import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { validateSignUpSchema } from "@/utils/dataSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import useMetaArgs from "@/hooks/useMeta";
import { registerUser } from "@/api/auth";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import ErrorAlert from "@/components/ErrorAlert";
import { useAuth } from "@/store/index";
import { useNavigate } from "react-router";

export default function SignUp() {
  useMetaArgs({
    title: "Register-Clincare",
    description: "Welcome to your clinicare user",
    keywords: "Health, Register, Clinic, Hospital",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(validateSignUpSchema),
  });
  const { setAccessToken, user } = useAuth(); // we are using the useAuth hook to get the setAccessToken function from authprovider
  const navigate = useNavigate();

  const togglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  //we are going to use react query to make our api call not the normal fetch api because of bugs
  // const queryClient = useQueryClient(); //intializing our queryClient from tanstack
  // Mutations are for creating/updating/deleting data while we use const queryClient = useQueryClient() to get data
  const mutation = useMutation({
    mutationFn: registerUser,
    onSuccess: (response) => {
      //what to do if our api call was successful
      toast.success(response?.data?.message || "Registration successful");
      //save accessToken
      setAccessToken(response?.data?.data?.accessToken);
       if (!user?.isVerified) {
        navigate("/verify-account")
      }
    },
    onError: (error) => {
     import.meta.env.DEV && console.log(error);
      // toast.error(error?.response?.data?.message || "Registration Failed"  );
      setError(error?.response?.data?.message || "Registration Failed");
    },
  });

  const onSubmit = async (data) => {
    mutation.mutate(data); //submiting our form to our mutation fuction to help us make the api call using the registerUser api
  };

  return (
    <>
      <div className=" flex items-center justify-center min-h-[93vh] gap-2  w-full md:max-w-[350px] mx-auto ">
        <form
          action=""
          className="mt-20 max-w-[400px]"
          onSubmit={handleSubmit(onSubmit)}
        >
          <fieldset className="fieldset bg-white border-base-300 rounded-xl shadow-lg w-[22rem] md:w-sm border p-5  ">
            <div className="flex flex-col items-center gap-2">
              <img
                src="/user.png"
                alt="user"
                className="border-1 border-[#1176DA] rounded-full p-2  bg-white"
              />

              <h1 className="text-2xl font-bold">Create Account</h1>
              <p className="text-gray-600 text-[1.05rem] mb-3">
                Enter your details to sign up
              </p>
              {error && <ErrorAlert error={error} />}
            </div>
            <label className="label font-bold  text-black ">Full name</label>
            <input
              type="text"
              className="input w-full"
              placeholder="Full name"
              {...register("fullname")}
              id="fullname"
            />
            {errors.fullname && (
              <p className="text-red-500">{errors.fullname.message}</p>
            )}

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

            <button
              className="btn bg-[#2B7FFF] hover:bg-[#1E5FCC] mt-4 text-white"
              disabled={isSubmitting || mutation.isPending}
            >
              {isSubmitting || mutation.isPending
                ? "Creating Account..."
                : "Create Account"}
            </button>
            <p className="text-sm text-gray-600 text-center">
              Already have an account?{" "}
              <a class="text-blue-500 font-bold" href="/account/signin">
                Login
              </a>
            </p>
          </fieldset>
        </form>
      </div>

      {/* w-xs */}
    </>
  );
}

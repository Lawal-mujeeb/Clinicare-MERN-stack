import { useForm } from "react-hook-form";
import { forgotPasswordSchema } from "@/utils/dataSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { forgotPassword } from "@/api/auth";
import { toast } from "sonner";
import ErrorAlert from "@/components/ErrorAlert";





export default function ForgetPassword() {
  const [error, setError] = useState(null)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting  },
  } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const mutation = useMutation({
    mutationFn: forgotPassword,
    onSuccess: (response) => {
    
      toast.success(response?.data?.message || "Password reset link sent");
    
    },
    onError: (error) => {
      import.meta.env.DEV && console.log(error);
      setError(error?.response?.data?.message || "Failed to send password link"  );
    },
  });

const onSubmit = async (data) => {
     mutation.mutate(data); 
  }


  return (
    <>
      <div className=" flex items-center justify-center min-h-[93vh] gap-2 ">
        <form action="" className="mt-20"  onSubmit={handleSubmit(onSubmit)}  >
          <fieldset className="fieldset bg-white border-base-300 rounded-xl shadow-lg w-[22rem] md:w-sm border p-5  ">
            <div className="flex flex-col items-center gap-2 pb-2">
              <img
                src="/lock-fill.png"
                alt="user"
                className="border-1 border-[#1176DA] rounded-full p-2  bg-white"
              />
              <h1 className="text-2xl font-bold">Forgot Password</h1>
             <p className="text-gray-600 text-center text-[1rem] ">Enter your email address and we'll send you a code to reset your password.</p>
            </div>
  {error && <ErrorAlert error={error}   /> }
            <label className="label font-semibold text-black ">Email</label>
            <input
              type="email"
              className="input w-full"
              placeholder="Email"
              id="email"
              {...register("email")}
            
            />
             {errors.email && (
                  <p className="text-red-500">{errors.email.message}</p>
                )}

            <button  type="submit" className="btn bg-[#2B7FFF] hover:bg-[#1E5FCC] mt-4 text-white" 
             disabled={isSubmitting || mutation.isPending}
            >
             {isSubmitting || mutation.isPending ? "Sending..." : "Send Reset Token"}
            </button>
          </fieldset>
        </form>
       
      </div>
    </>
  );
}

import useMetaArgs from "@/hooks/useMeta";
import React, { useEffect, useState } from "react";
import PinField from "react-pin-field";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { verifyAccount, resendVerificationCode } from "@/api/auth";
import { toast } from "sonner";
import ErrorAlert from "@/components/ErrorAlert";
import { useAuth } from "@/store";
import { useNavigate } from "react-router";

export default function Verify() {
  useMetaArgs({
    title: "Verify Account - Clincare",
    description: "Verify your Clincare account.",
    keywords: "Clinicare, verify, account",
  });
  const [verificationToken, setVerificationToken] = useState("");
  // because we are not using the useform we are going to do the validation manually using the react pinfield
  // const [isSubmitting, setisSubmitting] = useState(false);
  const [timer, setTimer] = useState(0);
  const [isResendDisabled, setIsResendDisabled] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const { accessToken } = useAuth();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { user } = useAuth();

  const TIMER_STORAGE_KEY = "verification_time_end";

  useEffect(() => {
    const savedEndTime = localStorage.getItem(TIMER_STORAGE_KEY);
    if (savedEndTime) {
      const endTime = parseInt(savedEndTime, 10);
      const now = Math.floor(Date.now() / 1000);
      const remaining = Math.max(0, endTime - now);

      if (remaining > 0) {
        setTimer(remaining);
        setIsResendDisabled(true);
      } else {
        localStorage.removeItem(TIMER_STORAGE_KEY);
      }
    }
  }, []);

  useEffect(() => {
    let interval;
    // Stop the timer if verification was successful
    if (timer > 0) {
      setIsResendDisabled(true);
      interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1 && interval !== null) {
            setIsResendDisabled(false);
            clearInterval(interval);
            localStorage.removeItem(TIMER_STORAGE_KEY);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval !== null) {
        clearInterval(interval);
      }
    };
  }, [timer]);
  // this function would be called when the user clicks the resend code button

  const mutation = useMutation({
    mutationFn: verifyAccount,
    onSuccess: (response) => {
      toast.success(response?.data?.message || "Account verified");
      //clear old userdata and refetch the key auth_user is coming from authprovider which is the key
      queryClient.invalidateQueries({ queryKey: ["auth_user"] });
      setSuccess(true);
      // navigate("/dashboard", { replace: true }); // {replace: true} is to remove the previous history
    },
    onError: (error) => {
      setError(error);
      setError(error?.response?.data?.message || "Account verification failed");
    },
  });

  //this is the second mutation function is used to resend the verification code
  const sendResendToken = useMutation({
    mutationFn: resendVerificationCode,
    onSuccess: (response) => {
      toast.success(response?.data?.message || "Verification token sent");
    },
    onError: (error) => {
      console.log(error);
      setError(error?.response?.data?.message || "Verification code failed");
    },
  });

  const onSubmit = async (e) => {
    e.preventDefault();
    mutation.mutate({ verificationToken, accessToken });
  };

  //this for resend code button
  const handleResendCode = async (e) => {
    e.preventDefault();
    const newTimer = 300;
    setTimer(newTimer);
    const endTime = Math.floor(Date.now() / 1000) + newTimer;
    localStorage.setItem(TIMER_STORAGE_KEY, endTime.toString());
    if (!accessToken) {
      toast.error("Session expired. Please refresh the page and try again.");
      return;
    }
    sendResendToken.mutate(accessToken);
  };

  return (
    <>
   
      <div className=" flex items-center justify-center min-h-[85vh] gap-2  ">
         {success || user?.isVerified ? <><div className="p-4 max-w-[800px] mx-auto text-center">
            <img src="/Success.svg" alt="success" className="w-full h-full" />
            <h1 className="text-2xl font-bold">Congratulations!</h1>
            <p className="text-gray-600">
              {user?.isVerified
                ? "Your account has already been verified."
                : "Your account has been verified successfully."}
            </p>
            <button
              className=" btn my-4 bg-blue-500  hover:bg-blue-600 text-white cursor-pointer"
              size="lg"
              onClick={() => navigate("/", { replace: true })}
            >
              Go back to home
            </button>
          </div></> : 
        <form
          action=""
          className="mt-10 max-w-[350px]  md:max-w-[400px] w-full"
          onSubmit={onSubmit}
        >
          <fieldset className="fieldset bg-white border-base-300 rounded-xl shadow-lg w-[22rem] md:w-sm border p-5  ">
            <div className="flex flex-col items-center gap-2">
              <img
                src="/mail-fill.png"
                alt="user"
                className="border-1 border-[#1176DA] rounded-full p-2  bg-white"
              />
              <h1 className="text-2xl font-bold">OTP Verification</h1>
              <p className="text-gray-600 text-[0.99rem] text-center mb-3">
                We have sent a verification code to your email. Please enter it
                below.
              </p>
              {error && <ErrorAlert error={error} />}
              <div>
                <PinField
                  length={6}
                  autoComplete="one-time-code"
                  autoCorrect="off"
                  dir="ltr"
                  pattern="[0-9]"
                  type="text"
                  value={verificationToken}
                  onChange={(value) => {
                    setVerificationToken(value);
                  }}
                  className="w-[50px] sm:w-[57px] text-center border border-gray-300 rounded-md p-2 font-bold my-2  "
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn bg-blue-500 mt-4 text-white  "
              disabled={verificationToken.length !== 6 || mutation.isPending}
            >
              {mutation.isPending ? "Verifying..." : "verify"}
            </button>

            <button className="mt-2">
              {" "}
              Did not receive a code? or code expired
            </button>
            <div className="flex items-center justify-center">
              <button
                onClick={handleResendCode}
                disabled={isResendDisabled}
                className="btn bg-[#2B7FFF] hover:bg-[#1E5FCC] mt-4 text-white w-[36%] "
              >
                {isResendDisabled ? `Resend in ${timer}s` : "Resend Code"}
              </button>
            </div>
          </fieldset>
        </form>
          }
      </div>
    </>
  );
}

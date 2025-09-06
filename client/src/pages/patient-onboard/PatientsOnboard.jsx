import useMetaArgs from "@/hooks/useMeta";
import { useForm } from "react-hook-form";
import { validatePatientSchema } from "@/utils/dataSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { bloodGroup } from "@/utils/constants";
import { useEffect, useMemo, useState } from "react"; //use memos are used to avoid re-rendering of components when their props change. saying it would optimize a value when nothing changes
import { formatDate } from "@/utils/constants";
import { useAuth } from "@/store";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { registerPatient } from "@/api/patients";
import { toast } from "sonner";
import { useNavigate } from "react-router";
import ErrorAlert from "@/components/ErrorAlert";

export default function PatientsOnboard() {
  useMetaArgs({
    title: "Patient Onboard - Clincare",
    description: "Complete your patient profile",
    keywords: "Health, Register, Clinic, Hospital",
  });
  const { user, accessToken } = useAuth(); //we want to get the user from the context
  const [currentStep, setCurrentStep] = useState(
    user?.isCompletedOnboard ? 3 : 1
  );
  const [field, setField] = useState(false); //we want to keep track of the input field
  const [error, setError] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue, //responsible helping us fill the autofill field with the values we have when they register
    watch, // we use it to watchout if the input field is empty or not
  } = useForm({
    resolver: zodResolver(validatePatientSchema),
  });

  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const gender = ["male", "female", "other"]; //we want to get the blood group options from the constants file
  const bloodGroupOptions = Object.entries(bloodGroup).map(([key, value]) => ({
    name: key,
    id: value,
  }));

  //we are setting the values of the input field with the values we have in the user state
  useEffect(() => {
    if (user) {
      setValue("fullname", user?.fullname);
      setValue("email", user?.email);
      setValue("phone", user?.phone);
      setValue("dateOfBirth", formatDate(user?.dateOfBirth));
    }
  }, [user, setValue]);

  const requiredFields1 = useMemo(
    () => ["fullname", "email", "phone", "dateOfBirth", "gender", "bloodGroup"],
    []
  );

  const requiredFields2 = useMemo(
    () => [
      "address",
      "emergencyContact",
      "emergencyContactPhone",
      "emergencyContactRelationship",
    ],
    []
  );

  const formValues = watch(); //we are invoking the watch hook to watch out for the changes in the input fields

  //we are using to automate the function and look out for the fieldss that are empty or not
  //we are using the errors and the formValues to check if the field is empty or not
  useEffect(() => {
    //check
    const currentRequiredFiends =
      currentStep === 1 ? requiredFields1 : requiredFields2;
    const hasEmptyFields = currentRequiredFiends.some(
      //some would give us true or false .some() checks if at least one item in the array passes the condition.
      (field) => !formValues[field] || formValues[field] === "" //checking to see if the field is empty or not
    );
    const hasErrors = currentRequiredFiends.some((field) => errors[field]); //checking to see if the field has an error based on our validation

    setField(hasEmptyFields || hasErrors);
  }, [currentStep, errors, formValues, requiredFields1, requiredFields2]);
  // This effect is basically a real-time form validator for multi-step forms: Look at the current step.Identify required fields for that step.
  // Check if any are empty.Check if any have validation errors.Update state (setField) so you can control UI (e.g., disable/enable buttons).

  const mutation = useMutation({
    mutationFn: registerPatient,
    onSuccess: (response) => {
      if (response.status === 201) {
        toast.success(response?.data?.message);
        //clear old user data
        queryClient.invalidateQueries({ queryKey: ["auth_user"] });
         setCurrentStep(3);
      }
    },
    onError: (error) => {
     import.meta.env.DEV && console.log(error);
      setError(
        error?.response?.data?.message || "Error registering your details"
      );
    },
  });

  //function that would would help us swap between our forms
  const handleStep = () => {
    if (currentStep === 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setCurrentStep(currentStep - 1);
    }
  };

  const onSubmit = async (formData) => {
    mutation.mutate({ formData, accessToken });
  };

  return (
    <>
      <div className=" flex items-center justify-center min-h-[85vh] gap-2  ">
        <form
          className=" w-full max-w-[600px] px-2 "
          onSubmit={handleSubmit(onSubmit)}
        >
          <h1 className="text-center mb-5 text-2xl font-bold">
            Patients Onboard
          </h1>
          <fieldset className="fieldset bg-white border-base-300 rounded-box border gap-7 p-4">
            <p className=" text-base text-center font-medium">
              Hello <span className="font-bold">{user?.fullname}</span>,{" "}
              {user?.isCompletedOnboard
                ? "Onboarding completed"
                : "please complete your patient profile"}
            </p>
            {error && <ErrorAlert error={error} />}
            {/* this is the steps part when we move to each page */}
            <ul className="steps">
              <li
                className={`step w-full ${
                  currentStep === 1 ? "step-primary" : ""
                }`}
              >
                Details
              </li>
              <li
                className={`step w-full ${
                  currentStep === 2 ? "step-primary" : ""
                }`}
              >
                Contact
              </li>
              <li
                className={`step w-full ${
                  currentStep === 3 ? "step-primary" : ""
                }`}
              >
                Save
              </li>
            </ul>
            {/* part-1 */}
            {currentStep === 1 && (
              <>
                <div className=" md:flex gap-5">
                  <div className="flex flex-col w-full ">
                    <label className="label mb-2   text-black font-bold ">
                      Full name
                    </label>
                    <input
                      type="text"
                      className="input w-full mb-1"
                      placeholder=" Full name "
                      {...register("fullname")}
                    />
                    {errors?.fullname?.message && (
                      <span className="text-xs text-red-500">
                        {errors?.fullname?.message}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col w-full ">
                    <label className="label mb-2 text-black font-bold">
                      Email
                    </label>
                    <input
                      type="email"
                      className="input w-full mb-1"
                      placeholder="Email"
                      {...register("email")}
                      id="email"
                    />
                    {errors?.email?.message && (
                      <span className="text-xs text-red-500">
                        {errors?.email?.message}
                      </span>
                    )}
                  </div>
                </div>

                {/* part-2 */}

                <div className=" md:flex gap-5">
                  <div className="flex flex-col w-full ">
                    <label className="label mb-2 text-black font-bold">
                      Phone
                    </label>
                    <input
                      type="tel"
                      className="input w-full mb-1"
                      placeholder="Phone"
                      {...register("phone")}
                      id="phone"
                    />
                    {errors?.phone?.message && (
                      <span className="text-xs text-red-500">
                        {errors?.phone?.message}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col w-full ">
                    <label className="label mb-2 text-black font-bold">
                      Date of birth
                    </label>
                    <input
                      type="date"
                      className="input w-full mb-1"
                      placeholder=""
                      {...register("dateOfBirth")}
                      id="date"
                    />
                    {errors?.dateOfBirth?.message && (
                      <span className="text-xs text-red-500">
                        {errors?.dateOfBirth?.message}
                      </span>
                    )}
                  </div>
                </div>

                {/* part 3 */}

                <div className=" md:flex gap-5">
                  <div className="flex flex-col w-full ">
                    <label className="label mb-2 text-black font-bold">
                     Role
                    </label>
                    <select
                      defaultValue={""}
                      className="select capitalize w-full mb-1"
                      name="gender"
                      {...register("gender")}
                      disabled={isSubmitting}
                      id="gender"
                    >
                      <option value="">Select gender</option>
                      {gender?.map((option, index) => (
                        <option key={index} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                    {errors.gender?.message && (
                      <span className="text-xs text-red-500">
                        {errors?.gender?.message}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-col w-full  mb-1">
                    <label className="label mb-2 text-black font-bold">
                      Blood group
                    </label>
                    <select
                      defaultValue={""}
                      className="select capitalize w-full mb-1"
                      name="bloodGroup"
                      {...register("bloodGroup")}
                      disabled={isSubmitting}
                      id="bloodGroup"
                    >
                      <option value="">Select Blood Group</option>
                      {bloodGroupOptions?.map((option, index) => (
                        <option key={index} value={option.id}>
                          {option.name}
                        </option>
                      ))}
                    </select>
                    {errors.bloodGroup?.message && (
                      <span className="text-xs text-red-500">
                        {errors?.bloodGroup?.message}
                      </span>
                    )}
                  </div>
                </div>
              </>
            )}

            {/* adress */}
            {currentStep === 2 && (
              <>
                <div className="flex flex-col w-full ">
                  <label className="label mb-2 text-black font-bold">
                    Address
                  </label>
                  <input
                    type="text"
                    className="input w-full mb-1"
                    placeholder=" Address "
                    {...register("address")}
                    id="address"
                  />
                  {errors.address?.message && (
                    <span className="text-xs text-red-500">
                      {errors?.address?.message}
                    </span>
                  )}
                </div>
                {/* after adress */}
                <div className=" md:flex gap-5">
                  <div className="flex flex-col w-full ">
                    <label className="label mb-2 text-black font-bold">
                      Emergency contact
                    </label>

                    <input
                      type="text"
                      className="input w-full mb-1"
                      placeholder=" Emergency contact name "
                      {...register("emergencyContact")}
                      id="text"
                    />
                    {errors.emergencyContact?.message && (
                      <span className="text-xs text-red-500">
                        {errors?.emergencyContact?.message}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col w-full ">
                    <label className="label mb-2 text-black font-bold">
                      Emergency contact phone
                    </label>
                    <input
                      type="text"
                      className="input w-full mb-1"
                      placeholder="Emergency contact phone"
                      {...register("emergencyContactPhone")}
                      id="text"
                    />
                    {errors.emergencyContactPhone?.message && (
                      <span className="text-xs text-red-500">
                        {errors?.emergencyContactPhone?.message}
                      </span>
                    )}
                  </div>
                </div>
                {/* Emergency contact relationship */}

                <div className="flex flex-col  ">
                  <label className="label mb-2 text-black font-bold">
                    Emergency contact relationship
                  </label>
                  <input
                    type="text"
                    className="input w-full md:w-[49%] mb-1 "
                    placeholder=" Emergency contact relationship "
                    {...register("emergencyContactRelationship")}
                  />
                  {errors.emergencyContactRelationship?.message && (
                    <span className="text-xs text-red-500">
                      {errors?.emergencyContactRelationship?.message}
                    </span>
                  )}
                </div>
              </>
            )}

            {currentStep === 3 && (
              <div className=" p-4 text-center">
                <img
                  src="/Success.svg"
                  alt="success"
                  className="w-full h-[200px]"
                />
                <h1 className="text-2xl font-bold">Congratulations!</h1>
                <p className="text-gray-600">
                  "Your account has been verified successfully."
                </p>
                <button
                  className="btn my-4 bg-blue-500 hover:bg-blue-600 text-white cursor-pointer"
                  size="lg"
                  onClick={() => navigate("/dashboard", { replace: true })}
                >
                  Continue to dashboard
                </button>
              </div>
            )}

            <div className=" flex md:justify-end gap-4">
              {currentStep === 1 && (
                <button
                  onClick={handleStep}
                  className="btn bg-zinc-800 text-white font-bold p-2 cursor-pointer w-full md:w-[140px]"
                  disabled={field}
                >
                  Next
                </button>
              )}
              {currentStep === 2 && (
                <div className=" flex md:justify-end gap-4">
                  <button
                    className="btn bg-zinc-800 text-white  p-2 w-full md:w-[140px]"
                    onClick={handleStep}
                  >
                    Previous
                  </button>
                  <button
                    className="btn  bg-[#2B7FFF] hover:bg-[#1E5FCC] text-white  w-full md:w-[140px]"
                    type="submit"
                    disabled={mutation.isPending || field}
                  >
                    {mutation.isPending ? "Submitting..." : "Submit"}
                  </button>
                </div>
              )}
            </div>
          </fieldset>
        </form>
      </div>
    </>
  );
}

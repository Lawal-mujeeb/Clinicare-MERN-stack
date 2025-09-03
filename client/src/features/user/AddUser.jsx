import Modal from "@/components/Modal";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { validateSignUpSchema } from "@/utils/dataSchema";
import { RiCloseLine } from "@remixicon/react";
import ErrorAlert from "@/components/ErrorAlert";
import { createUserAdmins } from "@/api/auth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/store";

export default function AddUser() {
  const [isOpen, setIsOpen] = useState(false);

  const [showSuccess, setShowSuccess] = useState(false);
  const [msg, setMsg] = useState(null);
  const [error, setError] = useState(null);
  const { accessToken } = useAuth();
  const queryClient = useQueryClient();
  const [showPassword, setShowPassword] = useState(false);
  const [showDoctor, setShowDoctor] = useState(false);

  const {
    register,
    handleSubmit,
    // reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(validateSignUpSchema),
    defaultValues: {
      fullname: "",
      email: "",
      password: "Techstudio!!",
      role: "staff",
    },
  });

  const roles = ["admin", "staff", "doctor", "nurse", "patient"];
  const availability = ["available", "unavailable", "on leave", "sick"];
  const specialization = [
    "Cardiology",
    "Dermatology",
    "Gastroenterology",
    "Neurology",
    "Orthopedics",
    "Pediatrics",
    "Psychiatry",
    "Urology",
  ];

  const fieldWatch = watch("role");
  useEffect(() => {
    if (fieldWatch === "doctor") {
      setShowDoctor(true);
    } else {
      setShowDoctor(false);
    }
  }, [fieldWatch]);

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };
  const toggleDrawer = () => {
    setIsOpen(!isOpen);
  };

  const mutation = useMutation({
    mutationFn: createUserAdmins,
    onSuccess: (response) => {
      if (response.status === 201) {
        setMsg(response?.data?.message);
        setShowSuccess(true);
      }
    },
    onError: (error) => {
      console.error(error);
      setError(error?.response?.data?.message || "Error updating user role");
    },
  });

  const resetModal = async () => {
    await queryClient.invalidateQueries({ queryKey: ["getAllUsers"] });
    setIsOpen(false);
    setShowSuccess(false);
  };

  const onSubmit = (data) => {
    if (
      (data.role === "doctor" && !data.specialization) ||
      (data.role === "doctor" && !data.availability)
    ) {
      setError("Please select doctors specialization and availability");
      return;
    }
    mutation.mutate({ userData: data, accessToken });
  };

  return (
    <>
      <button
        className="btn btn-outline w-[140px] bg-blue-500 hover:bg-blue-600 hover:rounded-full text-white border border-gray-300"
        onClick={() => setIsOpen(true)}
      >
        Add New User
      </button>

      <Modal
        id="Add user"
        isOpen={isOpen}
        classname="bg-white p-4 rounded-xl shadow  w-[90%] md:w-[100%]  mx-auto"
      >
        <h1 className="text-2xl font-bold  text-start mb-4 ">Create User </h1>
        {showSuccess ? (
          <>
            <div className="p-4 text-center">
              <img
                src="/Success.svg"
                alt="success"
                className="w-full h-[200px]"
              />
              <h1 className="text-2xl font-bold">Congratulations!</h1>
              <p className="text-gray-600">{msg}</p>
              <button
                className="btn my-4 bg-blue-500 hover:bg-blue-600 text-white cursor-pointer"
                size="lg"
                onClick={resetModal}
              >
                Continue to Users
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="flex flex-col  gap-2 w-full">
              <form
                className="space-y-6   "
                onSubmit={handleSubmit(onSubmit)}
                // id="/dashboard/settings/account"
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
                      Password
                    </label>

                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        className="input w-full pr-12" // add padding-right so text doesn't overlap button
                        placeholder="Password"
                        {...register("password")}
                        id="password"
                      />

                      <button
                        type="button"
                        className="absolute inset-y-0 right-3 flex items-center text-sm font-semibold"
                        onClick={togglePassword}
                      >
                        {showPassword ? "Hide" : "Show"}
                      </button>
                    </div>

                    {errors.password && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.password.message}
                      </p>
                    )}
                  </div>

                  <div className=" col-span-12 md:col-span-6 ">
                    <label className="block text-sm font-medium text-gray-700">
                      Role
                    </label>
                    <select
                      defaultValue={"staff"}
                      className="select capitalize w-full "
                      name="role"
                      {...register("role")}
                      disabled={isSubmitting}
                      id=" role"
                    >
                      <option value="">Select Role</option>
                      {/* we are removing patient from here , we dont want to add  patient*/}
                      {roles?.filter((role) => role !== "patient")
                        .map((option, index) => (
                        <option key={index} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                    {errors.role?.message && (
                      <span className="text-xs text-red-500">
                        {errors?.role?.message}
                      </span>
                    )}
                  </div>

                  

                  {showDoctor && (
  <>
    <div className="col-span-12 md:col-span-6">
      <label className="block text-sm font-medium text-gray-700">
        Specialization
      </label>
      <select
        defaultValue=""
        className="select capitalize w-full"
        {...register("specialization")}
        disabled={isSubmitting}
      >
        <option value="">Select Specialization</option>
        {specialization?.map((option, index) => (
          <option key={index} value={option}>
            {option}
          </option>
        ))}
      </select>
      {errors.specialization?.message && (
        <span className="text-xs text-red-500">
          {errors.specialization?.message}
        </span>
      )}
    </div>

    <div className="col-span-12 md:col-span-6">
      <label className="block text-sm font-medium text-gray-700">
        Availability
      </label>
      <select
        defaultValue=""
        className="select capitalize w-full"
        {...register("availability")}
        disabled={isSubmitting}
      >
        <option value="">Select Availability</option>
        {availability?.map((option, index) => (
          <option key={index} value={option}>
            {option}
          </option>
        ))}
      </select>
      {errors.availability?.message && (
        <span className="text-xs text-red-500">
          {errors.availability?.message}
        </span>
      )}
    </div>
  </>
)}

                </div>
                <button
                  className="btn btn-sm btn-circle btn-ghost absolute right-2 top-4 "
                  type="button"
                  onClick={toggleDrawer}
                >
                  <RiCloseLine size={24} />
                </button>
                <div className=" flex justify-end gap-4  ">
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="mt-4 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="mt-4 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white hover:text-white font-bold   rounded-lg"
                    disabled={mutation.isPending || isSubmitting}
                  >
                    {mutation.isPending ? "Creating..." : " Create"}
                  </button>
                </div>
              </form>
            </div>
          </>
        )}
      </Modal>
    </>
  );
}

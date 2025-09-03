import Modal from "@/components/Modal";
import { useEffect, useState } from "react";
import { RiCloseLine, RiEditLine } from "@remixicon/react";
import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import ErrorAlert from "@/components/ErrorAlert";
import { validateDoctorAvailabilitySchema } from "@/utils/dataSchema";
import { updateDoctors } from "@/api/doctor";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/store";

export default function EditDoctors({ doctor }) {
  const [isOpen, setIsOpen] = useState(false);

  const [error, setError] = useState(null);
  const [success, ShowSuccess] = useState(false);
  const [msg, setMsg] = useState("");
  const {accessToken} = useAuth();


  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(validateDoctorAvailabilitySchema),
  });

 

const mutation = useMutation({
    mutationFn: updateDoctors,
    onSuccess: (response) => {
      
      if (response.status === 200) {
        setMsg(response?.data?.message);
        ShowSuccess(true);
        reset();
      }
    },
    onError: (error) => {
      console.error(error);
      setError(error?.response?.data?.message || "Error updating doctor");
    },
  });



  useEffect(() => {
    if (doctor) {
      setValue("availability", doctor?.availability || "");
    }
  }, [doctor, setValue]);

  const toggleDrawer = () => {
    setIsOpen(!isOpen);
  };

  const availability = ["available", "unavailable", "on leave", "sick"];

  const onSubmit = async (formData) => {
    mutation.mutate({ doctorId: doctor._id, formData, accessToken });
  };
  const handleClose = async () => {
    await queryClient.invalidateQueries({ queryKey: ["getAllDoctors"] });
    setIsOpen(false);
    ShowSuccess(false);
  };

  return (
    <>
      <RiEditLine className="text-blue-500" onClick={() => setIsOpen(true)} />

      <Modal
        id="updateUserModal"
        isOpen={isOpen}
        classname="bg-white p-4 rounded-xl shadow w-[90%] md:max-w-[600px]   max-w-[400px] mx-auto"
      >
        {error && <ErrorAlert error={error} />}
        <h1 className="text-2xl font-bold  text-start mb-4 ">
          Edit Doctor Status
        </h1>
        {success ? (
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
                onClick={handleClose}
              >
                Continue to Doctors
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="flex flex-col  gap-2 w-full">
              <form className="space-y-6   " onSubmit={handleSubmit(onSubmit)}>
                {error && <ErrorAlert error={error} />}
                <div className="grid grid-cols-12 gap-4  ">
                  <div className=" col-span-12  ">
                    <label className="block text-sm font-medium text-gray-700">
                      Role
                    </label>
                    <select
                      defaultValue={""}
                      className="select capitalize w-full "
                      name="availability"
                      {...register("availability")}
                      disabled={isSubmitting}
                      id=" availability"
                    >
                      <option value="">Select Status</option>
                      {availability?.map((option, index) => (
                        <option key={index} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                    {errors.availability?.message && (
                      <span className="text-xs text-red-500">
                        {errors?.availability?.message}
                      </span>
                    )}
                  </div>
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
                    className="mt-4 px-4 py-2 border border-gray-300 hover:bg-gray-300 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="mt-4 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white hover:text-white font-bold   rounded-md"
                    disabled={mutation.isPending || isSubmitting}
                  >
                    {mutation.isPending || isSubmitting
                      ? "Updating..."
                      : "Update"}
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

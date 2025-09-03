import Modal from "@/components/Modal";
import {  useEffect, useState } from "react";
import { RiCloseLine } from "@remixicon/react";
import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import ErrorAlert from "@/components/ErrorAlert";
import { validateUpdateUserRoleSchema } from "@/utils/dataSchema";
import { useAuth } from "@/store";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUserRole } from "@/api/auth";

export default function EditModal({ item }) {
  const [isOpen, setIsOpen] = useState(false);

  const [error, setError] = useState(null);
  const [success, ShowSuccess] = useState(false);
  const [msg, setMsg] = useState("");
  const [showDoctor, setShowDoctor] = useState(false);
  const { accessToken } = useAuth();
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm({
    resolver: zodResolver(validateUpdateUserRoleSchema),
  });

  const mutation = useMutation({
    mutationFn: updateUserRole,
    onSuccess: (response) => {
      if (response.success) {
        setMsg(response?.message);
        ShowSuccess(true);
      }
    },
    onError: (error) => {
      console.error(error);
      setError(error?.response?.data?.message || "Error updating user role");
    },
  });

  useEffect(() => {
    if (item) {
      setValue("role", item?.role);
    }
  }, [item, setValue]);

  const fieldWatch = watch("role");
  useEffect(() => {
    if (fieldWatch === "doctor") {
      setShowDoctor(true);
    } else {
      setShowDoctor(false);
    }
  }, [fieldWatch]);

  const toggleDrawer = () => {
    setIsOpen(!isOpen);
  };

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


  const onSubmit = async (role) => {
    mutation.mutate({ userId: item._id, role, accessToken });
  };
  const handleClose = async () => {
    await queryClient.invalidateQueries({ queryKey: ["getAllUsers"] });
    setIsOpen(false);
    ShowSuccess(false);
  };

  return (
    <>
      <button
        className="btn btn-outline border border-gray-300    mt-5 "
        onClick={() => setIsOpen(true)}
         disabled={item.role === "patient"} //we disabled admin from editing patient edit
      >
        Edit
      </button>

      <Modal
        id="updateUserModal"
        isOpen={isOpen}
        classname="bg-white p-4 rounded-xl shadow w-[90%] md:max-w-[600px]   max-w-[400px] mx-auto"
        >
        {error && <ErrorAlert error={error} />}
        <h1 className="text-2xl font-bold  text-start mb-4 ">
          Update user Role{" "}
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
                Continue to Users
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="flex flex-col  gap-2 w-full">
              <form
                className="space-y-6"
                onSubmit={handleSubmit(onSubmit)}
                // id="/dashboard/settings/account"
              >
                <div className="grid grid-cols-12 gap-4  w-full ">
                  <div className=" col-span-12  ">
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Role
                    </label>
                    <select
                      defaultValue={""}
                      className="select capitalize w-full "
                      name="role"
                      {...register("role")}
                      // disabled={isSubmitting}
                      id=" role"
                    >
                      <option value="">Select Role</option>
                      {roles
                        ?.filter((role) => role !== "patient")
                        ?.map((option, index) => (
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

                <div className="mt-4 mb-2 flex justify-end gap-2">
                  <button
                    type="button"
                    className="btn btn-outline w-[120px] border-[0.2px] border-gray-500    "
                    onClick={() => setIsOpen(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn bg-blue-500 hover:bg-blue-600 text-white w-[120px]   "
                    disabled={mutation.isPending}
                    // onClick=
                  >
                    {mutation.isPending ? "Updating..." : " Yes, Update"}    {" "}
                
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

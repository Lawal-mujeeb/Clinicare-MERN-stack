import {  useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/store";
// import { getRoomMeta } from "@/api/room";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { validateRoomSchema } from "@/utils/dataSchema";
import Modal from "@/components/Modal";
import { RiCloseLine } from "@remixicon/react";
import ErrorAlert from "@/components/ErrorAlert";
import { createRoom } from "@/api/room";

export default function AddRoom() {
  const [isOpen, setIsOpen] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [msg, setMsg] = useState(null);
  const [err, setErr] = useState(null);
  const { accessToken } = useAuth();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(validateRoomSchema),
  });

  const mutation = useMutation({
      mutationFn: createRoom,
      onSuccess: async (response) => {
        if (response.status === 201) {
          setMsg(response?.data?.message);
          setShowSuccess(true);
        }
      },
      onError: (error) => {
        console.error(error);
        setErr(error?.response?.data?.message || "Error updating user role");
      },
    });

  // const { isPending, isError, data, error } = useQuery({
  //     queryKey: ["getRoomMeta", accessToken],
  //     queryFn: () => getRoomMeta( accessToken),
  //   });

  const toggleDrawer = () => {
    setIsOpen(!isOpen);
  };

  const resetModal = async () => {
    await queryClient.invalidateQueries({ queryKey: ["getAllRooms"] }); 
    setIsOpen(false);
    setShowSuccess(false);
    setErr(null);
 reset()
  };

 

  const roomType = ["Regular", "VIP", "ICU", "Deluxe", "Suite"];
  const roomStatus = ["available", "occupied", "maintenance"];

  const onSubmit = async (formData) => {
    mutation.mutate({ formData, accessToken });
  };

  return (
    <>
      <button
        className="btn btn-outline w-[140px] bg-blue-500 hover:bg-blue-600 hover:rounded-full text-white border border-gray-300"
        onClick={() => setIsOpen(true)}
      >
        Add Rooms
      </button>

      <Modal
        id="Add Rooms"
        isOpen={isOpen}
        classname="bg-white p-4 rounded-xl shadow  w-[90%] md:w-[100%]  mx-auto"
      >
        <h1 className="text-2xl font-bold  text-start mb-4 ">Add New Room </h1>
        
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
                Continue to Rooms
              </button>
            </div>
          </>
        ) : (
       

        <>
          <div className="flex flex-col  gap-2 w-full">
            <form
              className="space-y-6   "
              onSubmit={handleSubmit(onSubmit)}
            >
              {err && <ErrorAlert error={err} />}
              <div className="grid grid-cols-12 gap-4  ">
                <div className=" col-span-12 md:col-span-6">
                  <label className="block text-sm font-medium text-gray-700">
                    Room Number
                  </label>
                  <input
                    type="text"
                    placeholder="Room Number (1-20) "
                    {...register("roomNumber")}
                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 "
                  />

                  {errors?.roomNumber?.message && (
                    <span className="text-xs text-red-500">
                      {errors?.roomNumber?.message}
                    </span>
                  )}
                </div>

                <div className=" col-span-12 md:col-span-6   ">
                  <label className="block text-sm font-medium text-gray-700">
                    Room Type
                  </label>
                  <select
                    defaultValue={"Room Type"}
                    className="select capitalize w-full mt-1 "
                    name="roomType"
                    {...register("roomType")}
                    disabled={isSubmitting}
                    id=" roomType"
                  >
                    <option value="">Room Type</option>
                    {roomType?.map((option, index) => (
                      <option key={index} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                  {errors.roomType?.message && (
                    <span className="text-xs text-red-500">
                      {errors?.roomType?.message}
                    </span>
                  )}
                </div>

                <div className="col-span-12 md:col-span-6">
                  <label className="block text-sm font-medium text-gray-700">
                    Room Price
                  </label>
                  <input
                    type="text"
                    placeholder="Room Price"
                    {...register("roomPrice")}
                    id="roomPrice"
                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 "
                  />
                  {errors?.roomPrice?.message && (
                    <span className="text-xs text-red-500">
                      {errors?.roomPrice?.message}
                    </span>
                  )}
                </div>
                <div className=" col-span-12 md:col-span-6   ">
                  <label className="block text-sm font-medium text-gray-700">
                   Room Status
                  </label>
                  <select
                    defaultValue={"Room Status"}
                    className="select capitalize w-full mt-1 "
                    name="roomStatus"
                    {...register("roomStatus")}
                    disabled={isSubmitting}
                    id="roomStatus"
                  >
                    <option value="">Room Status</option>
                    {roomStatus?.map((option, index) => (
                      <option key={index} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                  {errors.roomStatus?.message && (
                    <span className="text-xs text-red-500">
                      {errors?.roomStatus?.message}
                    </span>
                  )}
                </div>
                <div className="col-span-12 ">
                  <label className="block text-sm font-medium text-gray-700">
                   Room Description
                  </label>
                  <input
                    type="text"
                    placeholder="Room Description"
                    {...register("roomDescription")}
                    id="roomDescription"
                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 "
                  />
                  {errors?.roomDescription?.message && (
                    <span className="text-xs text-red-500">
                      {errors?.roomDescription?.message}
                    </span>
                  )}
                </div>
                <div className="col-span-12 md:col-span-6">
                  <label className="block text-sm font-medium text-gray-700">
                   Room Capacity
                  </label>
                  <input
                    type="text"
                    placeholder="Room Capacity (1-5)"
                    {...register("roomCapacity")}
                    id="roomCapacity"
                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 "
                  />
                  {errors?.roomCapacity?.message && (
                    <span className="text-xs text-red-500">
                      {errors?.roomCapacity?.message}
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
                  disabled= {mutation.isPending || isSubmitting}
                  // disabled={isSubmitting}
                >
             {mutation.isPending ? "Adding..." : "  Add Rooms"}
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

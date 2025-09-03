
import Modal from "./Modal";
import { useState } from "react";
import { RiDeleteBinLine } from "@remixicon/react";
import React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useAuth } from "@/store";
import { deleteAccount } from "@/api/auth";
import ErrorAlert from "./ErrorAlert";

export default function  Delete() {
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();
  const { accessToken , setAccessToken} = useAuth();
  const [error, setError] = useState(null)

  

const mutation = useMutation({
    mutationFn: deleteAccount,
    onSuccess: async (response) => {
      if (response.status === 200) {
        toast.success(response?.data?.message);
        //clears all cacched keys from tanstack query
        queryClient.clear();
        setAccessToken(null);
       
      }
    },
    onError: (error) => {
       import.meta.env.DEV && console.log(error);
      setError(error?.response?.data?.message || "Error deleting your account");
    },
  });

  const onDelete = async () => {
    mutation.mutate(accessToken);
  };

  return (
    <>
      <button
       
        className="btn btn-outline btn-error bg-red-500 hover:bg-red-600 text-white w-full    md:w-[150px] mt-5  "
        onClick={() => setIsOpen(true)}
      >
      Delete Account
        {/* using the useLocation for conditional rendering by tracking the path */}
      </button>
      {/* when dealing with daisyUi you must make sure to pass an id and it must be a diff id anything you are using the modal, mx-auto is to center items */}
      <Modal
        id="DeleteModal"
        isOpen={isOpen}
        classname="bg-white p-4 rounded-xl shadow w-[90%] max-w-[400px] mx-auto"
      >
        <div className="flex flex-col items-center gap-2 w-full">
          <RiDeleteBinLine size={40} className="text-red-500" />
          <h1 className="text-2xl font-bold">Delete Account</h1>
          <p className="text-center">
            Are you sure you want to delete your account?
          </p>
          {error && <ErrorAlert message={error} />}
          <div className="mt-4 mb-2 flex gap-2">
            <button
              type="button"
              className="btn btn-outline w-[150px] border-[0.2px] border-gray-500    "
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn bg-red-500 hover:bg-red-600 text-white w-[150px]   "
              disabled={mutation.isPending}
              onClick={onDelete}
            >
             
             {mutation.isPending ? "Deleting..." : " Yes, Delete"}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}


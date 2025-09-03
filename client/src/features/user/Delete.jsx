
import Modal from "@/components/Modal";
import { useState } from "react";
import { RiDeleteBinLine } from "@remixicon/react";
import React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useAuth } from "@/store";
import { deleteAccountAdmins } from "@/api/auth";
import ErrorAlert from "@/components/ErrorAlert";

export default function  Delete({item}) {
  const [isOpen, setIsOpen] = useState(false);
  const [success, showSuccess] = useState(false);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState(null);
  const queryClient = useQueryClient();
  const {accessToken} = useAuth();
  

 const mutation = useMutation({
    mutationFn: deleteAccountAdmins,
    onSuccess: (response) => {
      if (response.status === 200) {
        setMsg(response?.data?.data?.message);
        showSuccess(true);
        queryClient.invalidateQueries({ queryKey: ["getAllUsers"] });
      }
    },
    onError: (error) => {
      console.error(error);
      setError(error?.response?.data?.message || "Error deleting user");
    },
  });

  const onDelete = async () => {
    mutation.mutate({  userId: item._id, accessToken});
  };
  



  

  return (
    <>
   
      <button
         

        className=" btn btn-error bg-red-500 hover:bg-red-600 text-white    mt-5   "
        onClick={() => setIsOpen(true)}
      >
      Delete 
       
      </button>
    
      <Modal
        id="DeleteModal-2"
        isOpen={isOpen}
        classname="bg-white p-4 rounded-xl shadow w-[90%] max-w-[400px] mx-auto"
      >
          {error && <ErrorAlert message={error} />}
        {success ?  (
            <>
            <div className=" p-4 text-center">
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
                onClick={() => setIsOpen(false)}
              >
                Continue to Users
              </button>
            </div>
            </>
         ) : (
        <div className="flex flex-col items-center gap-2 w-full">
          <RiDeleteBinLine size={40} className="text-red-500" />
          <h1 className="text-2xl font-bold"> Confirm   Delete </h1>
          <p className="text-center">
            Are you sure you want to delete  <b>{item?.fullname}</b> account 
          </p>
        
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
        ) }
        
      </Modal>
    </>
  );
}


import { RiErrorWarningLine } from "@remixicon/react";
import { useEffect } from "react";
import { useNavigate } from "react-router";

//note our access token is saved in memory not in state  we are using useeffect to automatically load the page we checking the type of error if it a jwt, then it automataically refresh the access token

export default function ErrorAlert({ error }) {
  const navigate = useNavigate();

  useEffect(() => {
    if (error === "jwt expired") {
      navigate(0);
    }
  }, [error, navigate]);

  //we want to render the error only when it not jwt type of error
  return (
    <>
      {error !== "jwt expired" && (
        <div role="alert" className="alert bg-red-400 text-white w-full ">
          <RiErrorWarningLine className="text-white" />
          <span className="text-sm">Error! {error}</span>
        </div>
      )}
    </>
  );
}

import { RiErrorWarningLine } from "@remixicon/react";

export default function ErrorAlert({ error }) {
  return (
    <>
      <div role="alert" className="alert bg-red-400 text-white w-full ">
        <RiErrorWarningLine className="text-white" />
        <span className="text-sm">Error! {error}</span>
      </div>
    </>
  );
}
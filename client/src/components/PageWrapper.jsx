import React from "react";

export default function PageWrapper({ children, classname }) {
  return (
    <div
      className={`container pt-20 md:pt-24 lg:pt-10 pb-6 md:px-4
         mx-auto ${classname}   `}
    >
      {children}
    </div>
  );
}
//note there was  px-4 istead of 0

import Logo from "@/components/Logo";
import { RiCopyrightFill } from "@remixicon/react";
import { NavLink, Outlet } from "react-router";

export default function RootLayout() {
  return (
   <div className="bg-slate-100">
    <div className=" fixed top-0 left-0 right-0 z-50">
      <div className="container mx-auto py-5 px-4 flex justify-between items-center  ">
        <Logo  />
      
      </div>
      </div>
      
      <Outlet />
      <div className="container mx-auto py-5 px-4">
        {/* hr line css -divider */}
     
        <div className="flex justify-center md:justify-start  ">
          <RiCopyrightFill size={18} />
          <span className="text-sm">
            {new Date().getFullYear()} Clinicare. All rights reserved.
          </span>
        </div>
      </div>
    </div>
  );
}

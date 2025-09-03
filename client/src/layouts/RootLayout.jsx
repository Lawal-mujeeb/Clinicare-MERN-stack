import Logo from "@/components/Logo";
// import MobilePhase from "@/components/MobilePhase";
import { RiCopyrightFill } from "@remixicon/react";
import { NavLink, Outlet, useLocation } from "react-router";

export default function RootLayout() {
   const location = useLocation();

  return (
    <div  className={location.pathname === "/contact" ? "max-h-[60vh] " : ""}
  >
      <div className=" fixed top-0 left-0 right-0 z-50 bg-[#F3F7FF] border-b-[1px] border-[#DAD7D7E5]   ">
       {/* conditional rendering */}
        <div className="container mx-auto py-5 px-4  lg:py-[20px] lg:px-[100px] flex justify-between items-center  ">
          <Logo classname="" />


          <ul className={`${
        location.pathname === "/" 
          ? "hidden md:flex justify-center items-center gap-[64px]" 
          : "hidden"
      }`}>
            <li className="cursor-pointer">Features</li>
            <a href="#how-it-works">
              <li className="cursor-pointer">How It Works</li>
            </a>
            <a href="/contact">
              {" "}
              <li>Contact Us</li>
            </a>
          </ul>
          {/* <MobilePhase /> */}

          <NavLink to="/account/signin"  className="  rounded-md py-1 px-2 md:py-[18px] md:px-[18px] text-[#FFFCFC]  font-bold  md:font-semibold   md:text-[20px]  bg-[#2465FF]">
            Get Started
          </NavLink>
        </div>
      </div>

      <Outlet />
     
      <div className="bg-[#0232A2] ">
        <div className="container mt-50 mx-auto py-5 px-4  ">
          {/* hr line css -divider */}
          {/* <div className="divider"></div> */}
          <div className="flex items-center">
            <p className=" text-[15px]   md:text-[24px] font-bold text-white ">
              Copyright
            </p>
            <RiCopyrightFill  className="text-white" size={18} />
            <span className=" text-[13px]  md:text-[24px] font-bold text-white ">
              {new Date().getFullYear()} 2025 Clinicare. All rights reserved.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

//  <nav className="flex justify-between items-center">
//       {/* ✅ Show only on homepage */}
//       {location.pathname === "/" && (
//         <ul className="hidden md:flex justify-center items-center gap-[64px]">
//           <li className="cursor-pointer">Features</li>
//           <a href="#how-it-works">
//             <li className="cursor-pointer">How It Works</li>
//           </a>
//           <a href="/contact">
//             <li className="cursor-pointer">Contact Us</li>
//           </a>
//         </ul>
//       )}
//     </nav>
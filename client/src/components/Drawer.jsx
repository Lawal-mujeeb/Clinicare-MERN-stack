import { RiMenuLine, RiCloseLine } from "@remixicon/react";
import { useEffect, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router";
import { getTimeBasedGreeting, navLinks, roleBasedPathPermissions } from "@/utils/constants";
import Logout from "./Logout";


export default function Drawer({ user }) {
  const [open, setOpen] = useState(false);
  const greeting = getTimeBasedGreeting();
  const  navigate  = useNavigate();

  const toggleDrawer = () => setOpen(!open);

  const location = useLocation();
  const path = location.pathname;

  const roles = ["patient", "doctor", "admin", "nurse", "staff"];
  //match our user roles based of our roles array using the find method
  const userRole = roles.find((role) => role === user?.role); // find and returns the first value
  const isAuthorized =
    (userRole === "admin" && roleBasedPathPermissions.admin.allowedSubpaths) ||
    (userRole === "doctor" &&
      roleBasedPathPermissions.doctor.allowedSubpaths) ||
    (userRole === "patient" &&
      roleBasedPathPermissions.patient.allowedSubpaths) ||
    (userRole === "nurse" && roleBasedPathPermissions.nurse.allowedSubpaths) ||
    (userRole === "staff" && roleBasedPathPermissions.staff.allowedSubpaths);

   useEffect(() => {
    const allowedPaths =
      roleBasedPathPermissions[userRole]?.allowedSubpaths || [];
    const isPathAllowed = allowedPaths.includes(path);
    if (!isAuthorized || !isPathAllowed) {
      navigate("/dashboard");
    }
  }, [isAuthorized, navigate, path, userRole]);

  return (
    <div className="lg:hidden">
      <button onClick={toggleDrawer}>
        <RiMenuLine size={24} />
      </button>
      <div
        className={`drawer fixed top-0 left-0 z-50 ${
          open ? "drawer-open" : ""
        }`}
      >
        <input
          type="checkbox"
          className="drawer-toggle"
          checked={open}
          onChange={toggleDrawer}
        />
        <div className="drawer-side">
          <label
            className="drawer-overlay"
            onClick={() => setOpen(false)}
          ></label>
          <div className="menu bg-base-200 text-base-content min-h-full w-[100vw] p-4 ">
            <button
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-4 "
              type="button"
              onClick={toggleDrawer}
            >
              <RiCloseLine size={24} />
            </button>
            <div className="mb-4 flex gap-2 items-center ">
             
              <div className="w-12 h-12 border  rounded-full  ">
                {user?.avatar ? (
                  <img
                    src={user?.avatar}
                    alt={user?.fullname}
                    referrerPolicy="no-referrer"
                    loading="lazy"
                    priority="high"
                     className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  <span className="text-sm  flex  mt-3 items-center justify-center   ">
                    {user?.fullname
                      ?.split(" ")
                      .map((name) => name[0])
                      .join("")
                      .toUpperCase()}
                  </span>
                )}
              </div>

              <div className="flex justify-start flex-col">
                <h2 className="text-lg font-semibold text-zinc-800   ">
                  {greeting}, {user?.fullname}! 👋
                </h2>
                <p>{user?.role}</p>
              </div>
            </div>


            
 <div className="overflow-y-auto h-[calc(100vh-150px)] space-y-4 p-1">
        {navLinks.map((section) => (
          <div key={section.title}>
            <p className="text-xs font-semibold text-gray-500 my-2">
              {section.title === "Management" && userRole === "patient" ? "" : section.title }
            </p>
            <div className="space-y-1">
              {section.links.filter((subPaths)=> {
                 if (roleBasedPathPermissions[userRole] && isAuthorized.includes(subPaths.to)
                ) {
                  return true;
                 }
                 return false
              }).map((link) => (
                <NavLink
                  key={link.id}
                  to={link.to}
                   onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-2 p-4 lg:p-2 transition-all hover:text-blue-500 ${
                      isActive || path.split("/")[2] === link.to
                      //here we making the path into an array using the split method and separating it using / so the settings active styling can also be applied on it by saying if the path
                        ? "text-blue-500 font-bold bg-blue-100 rounded-full"
                        : "text-black"
                    }`
                  }
                  viewTransition
                  end
                >
                  <link.Icon className="w-5 h-5" />
                  <span>{link.label}</span>
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </div>


            {/* <div className=" h-[calc(100vh-150px)] space-y-4 p-1">
              {navLinks.map((section) => (
                <div key={section.title}>
                  <p className="text-xs font-semibold text-gray-500 my-2">
                    {section.title}
                  </p>
                  <div className="space-y-1">
                    {section.links.map((link) => (
                      <NavLink
                        key={link.id}
                        to={link.to}
                         onClick={() => setOpen(false)}
                        className={({ isActive }) =>
                          ` ${
                            isActive
                              ? "text-blue-500 font-bold bg-blue-100 rounded-full"
                              : ""
                          }  px-2 py-2 flex items-center gap-2 hover:text-blue-500 transition-all duration-300`
                        }
                      >
                        <link.Icon className="w-5 h-5" />
                        <span>{link.label}</span>
                      </NavLink>
                    ))}
                  </div>
                </div>
              ))}
            </div> */}
            <Logout />
          </div>
        </div>
      </div>
    </div>
  );
}

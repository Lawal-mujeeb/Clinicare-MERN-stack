import Logo from "./Logo";
import { NavLink, useLocation, useNavigate } from "react-router";
import { navLinks, roleBasedPathPermissions } from "@/utils/constants";
import Logout from "./Logout";
import { useEffect } from "react";

export default function Sidebar({ user }) {
  const location = useLocation();
  const path = location.pathname;
  const  navigate  = useNavigate();

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
    <div className="hidden lg:block fixed z-50 min-h-screen w-[200px] bg-slate-100 pt-5 px-2">
      <Logo classname="mt-2" />

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
                  className={({ isActive }) =>
                    `flex items-center gap-2 p-4 lg:p-2 transition-all hover:text-blue-500 ${
                      isActive || path.split("/")[2] === link.to.split("/")[2]
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
      <Logout />
    </div>
  );
}

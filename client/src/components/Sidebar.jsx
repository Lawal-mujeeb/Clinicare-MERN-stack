import Logo from "./Logo";
import { NavLink } from "react-router";
import { navLinks } from "@/utils/constants";
import Logout from "./Logout";

export default function Sidebar() {
  return (
    <div className="hidden lg:block fixed z-50 min-h-screen w-[200px] bg-slate-100 pt-5 px-2">
      <Logo classname="mt-2" />

      
      <div className="overflow-y-auto h-[calc(100vh-150px)] space-y-4 p-1">
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
                  className={({ isActive }) =>
                    ` ${
                      isActive
                        ? "text-blue-500 font-bold bg-blue-100 rounded-full"
                        : ""
                    }  px-2 py-2 flex items-center gap-2 hover:text-blue-500 transition-all duration-300`
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
<Logout/>
   
    </div>
  );
}

import { RiMenuLine, RiCloseLine } from "@remixicon/react";
import { useState } from "react";
import { NavLink } from "react-router";
import { navLinks } from "@/utils/constants";
// import LogoutModal from "./LogoutModal";

export default function Drawer() {
  const [open, setOpen] = useState(false);

  const toggleDrawer = () => setOpen(!open);
  

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
            <div className="mb-4 flex gap-2 items-center">
              <div className="avatar gap-2  ">
                <div className="w-12 rounded-full">
                  <img src="https://img.daisyui.com/images/profile/demo/wonderperson@192.webp" />
                </div>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-zinc-800">
                  Dizzy Gilepsy!
                </h2>
                <p>Admin</p>
              </div>
            </div>

            <div className=" h-[calc(100vh-150px)] space-y-4 p-1">
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
                      >
                        <link.Icon className="w-5 h-5" />
                        <span>{link.label}</span>
                      </NavLink>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            {/* <LogoutModal /> */}
          </div>
        </div>
      </div>
    </div>
  );
}

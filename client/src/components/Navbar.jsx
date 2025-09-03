import { RiSearchLine } from "@remixicon/react";
import { getTimeBasedGreeting } from "@/utils/constants";

export default function Navbar({ user }) {
  const greeting = getTimeBasedGreeting();
  return (
    <div className="hidden lg:block sticky top-2 left-[200px] z-30 right-0 bg-white/50 backdrop-blur supports-[backdrop-filter]:bg-white/60 border border-zinc-200 rounded-full mx-4  ">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-[60px]">
        {/* Left section - optional */}
        <h2 className="text-lg font-semibold text-zinc-800">
          {greeting}, {user?.fullname}! 👋
        </h2>

        {/* Right section - icons or avatar */}
        <div className="flex items-center gap-4">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500">
              <RiSearchLine />
            </span>
            <input
              type="text"
              placeholder="Search..."
              className="pl-10 pr-4 py-1 border border-gray-300 rounded focus:outline-none"
            />
          </div>
        

          <div className="avatar">
            <div className="w-12 border-1  rounded-full">
              {user?.avatar ? (
                <img
                  src={user?.avatar}
                  alt={user?.fullname}
                  referrerPolicy="no-referrer"
                  loading="lazy"
                  priority="high"
                />
              ) : (
                <span className="text-sm  flex  mt-3  justify-center   ">
                  {user?.fullname
                    ?.split(" ")
                    .map((name) => name[0])
                    .join("")
                    .toUpperCase()}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

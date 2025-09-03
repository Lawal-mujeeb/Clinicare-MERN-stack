import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import { Outlet } from "react-router";
import MobileNav from "@/components/MobileNav";
import { useAuth } from "@/store";

export default function DashboardLayout() {
  const {user} = useAuth()
  return (
    <>
    <div className="min-h-[100dvh] bg-slate-100 flex">
      {/* Sidebar */}
      <Sidebar user={user} />

      {/* Main Content */}
      <div className=" px-4 lg:px-0 py-5 lg:py-0  lg:ml-[200px] flex-1">
        <Navbar user={user} />
        <MobileNav user={user}/>
        <Outlet />
      </div>
    </div>
    </>
  );
}

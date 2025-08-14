import Logo from "@/components/Logo";
import Drawer from "./Drawer";



export default function MobileNav() {
  return (
    <>
     <div className=" lg:hidden  fixed top-0 left-0 right-0 z-50 bg-[#F3F7FF] border-b-[1px] border-[#DAD7D7E5]  ">
        <div className="container mx-auto py-5 px-4  lg:py-[20px] lg:px-[100px] flex justify-between items-center  ">
          <Logo classname="" />
          <ul className=" hidden     lg:flex justify-center items-center gap-[64px]   ">
            <li className="cursor-pointer">Features</li>
            <a href="#how-it-works">
              <li className="cursor-pointer">How It Works</li>
            </a>
            <a href="/contact">
              {" "}
              <li>Contact Us</li>
            </a>
          </ul>
          <Drawer/>
        </div>
      </div>

    </>
  )
}

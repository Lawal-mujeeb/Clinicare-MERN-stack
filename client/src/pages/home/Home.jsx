import { RiContactsBook2Line, RiUserLine } from "@remixicon/react";
import useMetaArgs from "@/hooks/useMeta";
import { Link } from "react-router";

export default function Home() {
  useMetaArgs({
    title: "Home, Clinicare",
    description: "welcome to your clinicare",
    keywords: "health , Clinic, Hospital",
  });
  return (
    <>
      <div className="bg-gradient-to-b from-[#E2EBFF] to-[#E5EDFF]">
        <div className="   pt-50  px-4 max-w-[1440px]  min-h-[750px]  flex flex-col justify-end items-center mx-auto ">
          <h1 className="text-[30px] md:text-[38px]  font-bold text-center">
            Welcome to <br />
            <span className="text-[#FF5703] text-6xl md:text-[70px]">
              Clinicare
            </span>
          </h1>
          <p className="mt-8 text-[#000000] md:w-[680px] lg:w-[790px] h-[58px] text-center md:text-[24px]">
            Manage your hospital operations, patient records, and more with our
            powerful hospital management system.
          </p>
          <div className="mt-20 flex gap-4 items-center">
            <button
              className="border rounded-lg py-[10px] px-[10px] md:py-[18px] md:px-[25px] 
             bg-[#2465FF] text-white font-semibold md:text-[20px] 
             transition-all duration-500 ease-in-out 
             hover:bg-blue-500 hover:rounded-full 
             hover:scale-105 "
            >
              <a href="/account/signup">New Patient</a>
            </button>
            <button className="border-[1px] border-[#2465FF]  font-semibold  text-[#2465FF] hover:bg-slate-300 rounded-lg py-[10px] px-[10px] md:py-[18px] md:px-[25px]">
              <a href="/account/signin">Login to Clinicare</a>
            </button>
          </div>
          <div className=" max-w-[867px] md:w-[700px]  lg:w-[867px]  pt-20 ">
            <img
              src="Free iPad Pro mockup on a dark podium (Mockuuups Studio).png"
              alt="hero-icon"
            />
          </div>
        </div>
      </div>

      <Link
        to="/contact"
        className="fixed bottom-5 right-5 md:hidden z-50 bg-blue-600 text-white p-4 py-2 rounded-full gap-2 shadow flex"
      >
        <RiContactsBook2Line />
        <p>Contact Us</p>
      </Link>

      <div className=" my-10 container mx-auto py-12 px-4    ">
        <div className=" md:max-w-[865px] mx-auto ">
          <h1 className="text-2xl md:text-[36px] text-[#130A5C] font-bold text-center">
            Key Features to Simplify Hospital Management
          </h1>
          <p className="pt-2 text-center md:text-[22px] ">
            Comprehensive tools designed to enhance efficiency, improve patient
            care, and streamline hospital operations.
          </p>
        </div>

        <div className="max-w-[1280px] mx-auto px-4">
          <div className="mt-8 grid grid-cols-12 gap-4">
            {/* <!-- Card 1 --> */}
            <div className="col-span-12 md:col-span-6   lg:col-span-4 bg-white p-[40px] pb-4 gap-[24px] min-h-[296px] w-full border-[1px] border-[#C7C4C4] rounded-lg   flex flex-col items-start justify-start text-start">
              <div>
                <img src="appointment.png" alt="user" />
              </div>
              <h2 className="text-[24px] font-semibold">
                Appointment Scheduling
              </h2>
              <p className="text-zinc-800 mb-4">
                Let patients book and reschedule appointments easily online with
                real-time availability and automated confirmations.
              </p>
            </div>

            {/* <!-- Card 2 --> */}
            <div className="col-span-12  md:col-span-6   lg:col-span-4 bg-white p-[40px] pb-4 gap-[24px] min-h-[296px] w-full border-[1px] border-[#C7C4C4] rounded-lg  flex flex-col items-start justify-start text-start">
              <div>
                <img src="love.png" alt="user" />
              </div>
              <h2 className="text-[24px] font-semibold">
                Doctor & Department Management
              </h2>
              <p className="text-zinc-800 mb-4">
                Manage staff availability, departmental organization, and
                resource allocation efficiently.
              </p>
            </div>

            {/* <!-- Card 3 --> */}
            <div className="col-span-12  md:col-span-6   lg:col-span-4 bg-white p-[40px] pb-4 gap-[24px] min-h-[296px] w-full border-[1px] border-[#C7C4C4] rounded-lg  flex flex-col items-start justify-start text-start">
              <div>
                <img src="Analytics.png" alt="user" />
              </div>
              <h2 className="text-[24px] font-semibold">Analytics Dashboard</h2>
              <p className="text-zinc-800 mb-4">
                Get real-time insights into bookings, patient visits, revenue,
                and operational performance.
              </p>
            </div>

            {/* <!-- Card 4 --> */}
            <div className="col-span-12  md:col-span-6   lg:col-span-4 bg-white p-[40px] pb-4 gap-[24px] min-h-[296px] w-full border-[1px] border-[#C7C4C4] rounded-lg  flex flex-col items-start justify-start text-start">
              <div>
                <img src="Billing.png" alt="user" />
              </div>
              <h2 className="text-[24px] font-semibold">Billing & Invoicing</h2>
              <p className="text-zinc-800 mb-4">
                Generate invoices, track payments, and integrate with insurance
                providers seamlessly.
              </p>
            </div>

            {/* <!-- Card 5 --> */}
            <div className="col-span-12  md:col-span-6   lg:col-span-4 bg-white p-[40px] pb-4 gap-[24px] min-h-[296px] w-full border-[1px] border-[#C7C4C4] rounded-lg  flex flex-col items-start justify-start text-start">
              <div>
                <img src="Bell.png" alt="user" />
              </div>
              <h2 className="text-[24px] font-semibold">Automated Reminders</h2>
              <p className="text-zinc-800 mb-4">
                Send SMS and email alerts for appointments, follow-ups, and
                medication reminders automatically.
              </p>
            </div>

            {/* <!-- Card 6 --> md:col-span-4 */}
            <div className="col-span-12  md:col-span-6   lg:col-span-4 bg-white p-[40px] pb-4 gap-[24px] min-h-[296px] w-full border-[1px] border-[#C7C4C4] rounded-lg  flex flex-col items-start justify-start text-start">
              <div>
                <img src="Electronics.png" alt="user" />
              </div>
              <h2 className="text-[22px] font-semibold">
                Electronic Medical Records
              </h2>
              <p className="text-zinc-800 mb-4">
                Store, access, and update patient records securely with
                comprehensive digital health documentation.
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* how it works */}
      <div id="how-it-works" className="container mx-auto py-5 px-4 my-14">
        <div className="text-center">
          <h1 className="text-2xl md:text-3xl font-bold text-[#130A5C]">
            How It Works{" "}
          </h1>
          <p className="text-black mt-4 text-sm md:text-xl ">
            Simple steps to transform your hospital management and improve
            patient experience
          </p>
        </div>
        <div className="grid grid-cols-12 gap-6 lg:gap-8 mt-8 relative">
          <div className="hidden md:block lg:absolute left-1/2 top-0 h-full w-px bg-gray-300 transform -translate-x-1/2 z-0" />
          {/* hospital profile */}
          <div className="md:flex justify-center items-center gap-8 bg-white col-span-12 rounded-xl shadow-2xl lg:shadow-none p-2 md:p-3   ">
            {/* text */}
            <div className=" max-w-xl">
              <div className="flex items-center gap-2">
                <div className="bg-[#1055F8] rounded-full w-10 h-10 flex justify-center items-center mb-2">
                  <h1 className="font-bold text-white text-xl">1</h1>
                </div>
                <h2 className="text-xl font-semibold mb-2">
                  Sign Up and Set Up Your Hospital Profile
                </h2>
              </div>
              <p className="text-zinc-800 mb-4 ">
                Add departments, doctors, rooms, and schedules to create a
                comprehensive hospital management system tailored to your
                facility.
              </p>
            </div>
            {/* img */}
            <div className="">
              <img src="section1.png" alt="img-1" className="w-full" />
            </div>
          </div>

          {/* online booking */}
          <div className="md:flex flex-row-reverse justify-center items-center  gap-25 bg-white col-span-12 rounded-xl shadow-2xl lg:shadow-none p-2 md:p-3 ">
            <div className=" max-w-xl">
              <div className="flex items-center gap-2">
                <div className="bg-[#1055F8] rounded-full w-10 h-10 flex justify-center items-center mb-2">
                  <h1 className="font-bold text-white text-xl">2</h1>
                </div>
                <h2 className="text-xl font-semibold mb-2">
                  Enable Online Booking
                </h2>
              </div>
              <p className="text-zinc-800 mb-4">
                Patients can view doctor availability and schedule appointments
                online through an intuitive booking interface available 24/7.
              </p>
            </div>
            {/* img */}
            <div>
              <img src="section 2.png" alt="img of doctor" className="w-full" />
            </div>
          </div>
          {/* appointment */}
          <div className="md:flex justify-center items-center gap-8 bg-white col-span-12 rounded-xl shadow-2xl lg:shadow-none p-2 md:p-3">
            <div className=" max-w-xl">
              <div className="flex items-center gap-2">
                <div className="bg-[#1055F8] rounded-full w-10 h-10 flex justify-center items-center mb-2">
                  <h1 className="font-bold text-white text-xl">3</h1>
                </div>
                <h2 className="text-xl font-semibold mb-2">
                  Manage Appointments And Record
                </h2>
              </div>
              <p className="text-zinc-800 mb-4">
                Hospital staff can efficiently manage patient queues, update
                medical records, and send automated reminders from a centralized
                dashboard.
              </p>
            </div>

            {/* img */}
            <div>
              <img
                src="sectionthree.png"
                alt="img of nurse"
                className="w-full"
              />
            </div>
          </div>
          {/* track everything */}
          <div className="md:flex flex-row-reverse justify-center items-center gap-25 bg-white col-span-12 rounded-xl shadow-2xl lg:shadow-none p-2 md:p-3">
            <div className=" max-w-[520px]">
              <div className="flex items-center gap-2">
                <div className="bg-[#1055F8] rounded-full w-10 h-10 flex justify-center items-center mb-2">
                  <h1 className="font-bold text-white text-xl">4</h1>
                </div>
                <h2 className="text-xl font-semibold mb-2">
                  Track Everything In One Dashboard
                </h2>
              </div>
              <p className="text-zinc-800 mb-4">
                View comprehensive analytics including appointments, patient
                data, revenue metrics, and performance insights to optimize
                hospital operations.
              </p>
            </div>
            {/* img */}
            <div>
              <img
                src="section4.png"
                alt="img of computer"
                className="w-full"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="my-25 py-2 px-4 bg-[#044FFE] ">
        <div className="container mx-auto grid grid-cols-12 gap-4 lg:gap-8">
          <div className="col-span-12 md:col-span-3 text-white p-4 flex flex-col items-center justify-center h-[100px] md:h-[200px] text-center">
            <h1 className="text-4xl font-bold mb-2">100+</h1>
            <p>Hospitals</p>
          </div>
          <div className="col-span-12 md:col-span-3 text-white p-4 flex flex-col items-center justify-center h-[100px] md:h-[200px] text-center">
            <h1 className="text-4xl font-bold mb-2">1000+</h1>
            <p>Healthcare Professionals</p>
          </div>
          <div className="col-span-12 md:col-span-3 text-white p-4 flex flex-col items-center justify-center h-[100px] md:h-[200px] text-center">
            <h1 className="text-4xl font-bold mb-2">1M+</h1>
            <p>Patients Served</p>
          </div>
          <div className="col-span-12 md:col-span-3 text-white p-4 flex flex-col items-center justify-center h-[100px] md:h-[200px] text-center">
            <h1 className="text-4xl font-bold mb-2">99.9%</h1>
            <p>System Uptime</p>
          </div>
        </div>
      </div>
      {/* hospital transformation */}
    </>
  );
}

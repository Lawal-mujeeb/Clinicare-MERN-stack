export default function Contact() {
  return (
    <>
     
      <div className=" flex items-center justify-center min-h-[86vh] ">
        <div className="w-full max-w-md text-center bg-white p-4  ">
          <img src="Contact-us.svg" alt="contact us"  />
          <h1 className="text-2xl md:text-3xl font-bold mb-2 text-center">Contact Us</h1>
          <div className="flex flex-col gap-1 text-center">
            <a href="mailto:clinicare@gmail.com"  className="hover:text-blue-500 cursor-pointer">Email: clinicare@gmail.com</a>
            <a href="tel:+234 123 456 789"  className="hover:text-blue-500 cursor-pointer">Phone: +234 123 456 789</a>
          </div>
        </div>
      </div>

     
    </>
  );
}

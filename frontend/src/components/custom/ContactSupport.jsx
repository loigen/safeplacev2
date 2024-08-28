import React from "react";
import support from "../../images/support.gif";
import MoveToInboxIcon from "@mui/icons-material/MoveToInbox";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import QuestionMarkIcon from "@mui/icons-material/QuestionMark";
const ContactSupport = () => {
  return (
    <div className="contact-support h-full">
      <nav className="h-[8%] flex  items-center px-10 text-3xl font-bold font-sans">
        Contact Support
      </nav>
      <section className="flex h-1/3 flex-row overflow-hidden items-center justify-around bg-[#2c6975]">
        <div className="h-full flex gap-2 items-center flex-row">
          <img
            className="h-1/2 rounded-full bg-[#68b2a0]"
            src={support}
            alt=""
          />
          <div className="flex flex-col gap-2">
            <strong className="text-2xl text-white font-sans">
              Support Team
            </strong>
            <p className="bg-[#68b2a0] w-fit rounded-md px-2 py-1">
              24/7 Support
            </p>
            <p className="text-white">
              We are here to assist you with any queries or issues.
            </p>
          </div>
        </div>
        <div className="flex items-center">
          <p className="border-2 px-10 rounded-lg text-white py-2 ">FAQs</p>
        </div>
      </section>
      <section className="flex flex-col items-center p-5 w-full gap-10">
        <h1 className="text-center text-3xl font-bold">Contact Options</h1>
        <div className="w-3/4 flex flex-row justify-between">
          <div className="flex flex-col items-center gap-2">
            <div className="bg-gray-400 p-2 rounded-full">
              <MoveToInboxIcon
                className="text-[#2c6975]"
                style={{ fontSize: "4rem" }}
              />
            </div>
            <p>safeplacesupport@gmail.com</p>
            <p>Email us for assistance</p>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="bg-gray-400 p-2 rounded-full">
              <LocalPhoneIcon
                className="text-[#000]"
                style={{ fontSize: "4rem" }}
              />
            </div>
            <p>safeplacesupport@gmail.com</p>
            <p>Email us for assistance</p>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="bg-gray-400 p-2 rounded-full">
              <QuestionMarkIcon
                className="text-red-800"
                style={{ fontSize: "4rem" }}
              />
            </div>
            <p>safeplacesupport@gmail.com</p>
            <p>Email us for assistance</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactSupport;

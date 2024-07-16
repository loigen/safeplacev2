import React from "react";

const Home = () => {
  return (
    <div className="home h-lvh">
      <div className="sort flex flex-row justify-between w-full p-10">
        <div></div>
        <div className="flex flex-row gap-1 items-center">
          <p>Data Range</p>
          <select name="" id="" className="border-2 border-black px-2 py-1">
            <option value="">Week</option>
            <option value="">Month</option>
            <option value="">Year</option>
          </select>
        </div>
      </div>
      <div className="w-full">
        <div className="flex flex-col gap-2 w-1/2">
          <div className="flex flex-row gap-4">
            <div className="w-full shadow-xl p-2 rounded-md">
              <div className="flex justify-end w-full">+10%</div>
              <div className="flex flex-row gap-3 px-10 items-center">
                <div>icon</div>
                <div className="flex justify-items-center flex-col">
                  <b className="num text-5xl">80</b>
                  <p className="text-2xl capitalize">patients</p>
                </div>
              </div>
            </div>
            <div className="w-full shadow-xl p-2 rounded-md">
              <div className="flex justify-end w-full">-3%</div>
              <div className="flex flex-row gap-3 px-10 items-center">
                <div>icon</div>
                <div>
                  <b className="text-5xl">5</b>
                  <p>Weekly Appointment</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex w-1/2"></div>
      </div>
    </div>
  );
};

export default Home;

import React from "react";

const TeacherCard = () => {
  return (
      <div className="flex flex-col items-center m-8 w-4/12 p-8 bg-cover rounded-xl shadow-lg hover:shadow-2xl">
        {/* Background and profile */}
        <div
          className="relative mt-4 bg-slate-500 flex h-20 w-full justify-center rounded-xl bg-cover"
          style={{ backgroundImage: `url(TSAPP\ts-app\src\components\assets\mountain.jpg)` }}
        >
          <div className="dark:border-navy-700 absolute -bottom-12 flex h-[87px] w-[87px] items-center justify-center rounded-full border-4 border-white bg-pink-400">
            <img
              className="h-full w-full rounded-full"
              src=""  
              alt="Profile"
            />
          </div>
        </div>

        {/* Name and position */}
        <div className="mt-16 flex flex-col items-center">
          <h4 className="text-navy-700 text-xl font-bold dark:text-white">
            Adela Parkson
          </h4>
          <h5 className="text-base font-normal text-gray-600">Product Manager</h5>
        </div>

        {/* Post followers */}
        <div className="mt-6 mb-3 flex gap-4 md:gap-14">
          <div className="flex flex-col items-center justify-center">
            <h4 className="text-navy-700 text-2xl font-bold dark:text-white">
              17
            </h4>
            <p className="text-sm font-normal text-gray-600">Posts</p>
          </div>
          <div className="flex flex-col items-center justify-center">
            <h4 className="text-navy-700 text-2xl font-bold dark:text-white">
              9.7K
            </h4>
            <p className="text-sm font-normal text-gray-600">Followers</p>
          </div>
          <div className="flex flex-col items-center justify-center">
            <h4 className="text-navy-700 text-2xl font-bold dark:text-white">
              434
            </h4>
            <p className="text-sm font-normal text-gray-600">Following</p>
          </div>
        </div>
      </div>
  );
}

export default TeacherCard;

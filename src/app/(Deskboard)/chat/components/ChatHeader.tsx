import { ArrowLeft, Phone } from "lucide-react";
import Image from "next/image";
import React from "react";

const ChatHeader = () => {
  return (
    <div className="flex items-center justify-between p-3 border-b-2 border-gray-100">
      {/* Back Button */}
      {/* <button className="p-2 rounded-full hover:bg-gray-200">
        <ArrowLeft className="w-6 h-6 text-gray-700" />
      </button> */}

      {/* Profile Section */}
      <div className="flex items-center gap-3">
        <Image
          src="https://ui-avatars.com/api/?name=J+D"
          alt="profile"
          width={50}
          height={50}
          className="rounded-full border"
        />
        <div>
          <h2 className="text-md font-semibold">John Doe</h2>
          <p className="text-xs font-semibold text-green-600">Online</p>
        </div>
      </div>

      {/* Call Button */}
      {/* <button className="bg-blue-100 flex gap-2 px-4 rounded-md text-lg items-center text-blue-800 font-semibold py-2 cursor-pointer">
        <Phone className="w-6 h-6" />
        <span>Call</span>
      </button> */}
    </div>
  );
};

export default ChatHeader;

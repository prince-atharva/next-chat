import Image from "next/image";
import React from "react";

interface ChatHeaderProps {
  from: string;
  subject: string;
  profileImage: string;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ from, subject, profileImage }) => {
  return (
    <div className="flex items-center justify-between p-3 border-b-2 border-gray-100">
      {/* Profile Section */}
      <div className="flex items-center gap-3">
        {profileImage && <Image
          src={profileImage}
          alt="profile"
          width={50}
          height={50}
          className="rounded-full border"
        />}
        <div>
          <h2 className="text-md font-semibold">{from}</h2>
          <p className="text-xs text-gray-500">{subject}</p>
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;

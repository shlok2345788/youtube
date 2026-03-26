import React, { useState } from "react";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Button } from "./ui/button";

const ChannelHeader = ({ channel, user }: any) => {
  const [isSubscribed, setisSubscribed] = useState(false);

  return (
    <div>
      <div className="h-40 bg-gradient-to-r from-blue-400 to-purple-500">
        <div className="flex ml-5 gap-6 align- ">
          <Avatar className="rounded-full bg-black w-20 h-20">
            <AvatarFallback className="text-2xl">
              {channel?.username[0]}
            </AvatarFallback>
          </Avatar>
          <div className="">
            <h1 className="font-bold text-3xl">{channel?.username}</h1>
            <div>
              <span>
                @{channel?.username.toLowerCase().replace(/\s+/g, "")}
              </span>
            </div>
            {channel?.description && <p>{channel?.description}</p>}
          </div>
          {user && user?._id !== channel?._id && (
            <div className="flex gap-2">
              <Button
                onClick={() => setisSubscribed(!isSubscribed)}
                variant={isSubscribed ? "outline" : "default"}
                className={
                  isSubscribed ? "bg-gray-100" : "bg-red-600 hover:bg-red-700"
                }
              >
                {isSubscribed ? "Subscribed" : "Subscribe"}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChannelHeader;

import React, { useState } from "react";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Button } from "./ui/button";

const ChannelHeader = ({ channel, user }: any) => {
  const [isSubscribed, setisSubscribed] = useState(false);

  return (
    <div>
      <div className="headerImage"></div>
      <div>
        <div>
          <Avatar className="border-ra">
            <AvatarFallback>{channel?.username[0]}</AvatarFallback>
          </Avatar>
          <div>
            <h1>{channel?.username}</h1>
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

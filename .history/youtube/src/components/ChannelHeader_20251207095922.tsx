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
          <Avatar>
            <AvatarFallback>{channel?.username[0]}</AvatarFallback>
          </Avatar>
          <div>
            <h1>{channel?.username}</h1>
            <div>
              <span>
                @{channel?.username.toLowerCase().replace(/\s+/g, "")}
              </span>
            </div>
            {
                channel?.description && (
                    
                )
            }
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChannelHeader;

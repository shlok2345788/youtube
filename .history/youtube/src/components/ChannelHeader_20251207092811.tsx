import React, { useState } from "react";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Button } from "./ui/button";

const ChannelHeader = ({channel, user}: {channel: any, user: any}) => {
  const [isSubscribed, setisSubscribed] = useState(false);

  return (
    <div>
      <div className="headerImage"></div>
      <div>
        <div>
          <Avatar>
            <AvatarFallback>{channel.name[0]}</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </div>
  );
};

export default ChannelHeader;

import React, { useState } from "react";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Button } from "./ui/button";
import { channel } from "diagnostics_channel";

const ChannelHeader = () => {
  const [isSubscribed, setisSubscribed] = useState(false);


  return <div>
    <div className="headerImage">
    </div>
    <div>
        <div>
            <Avatar>
                <AvatarFallback>
                    {channel.name}
                </AvatarFallback>
            </Avatar>
        </div>
    </div>
  </div>;
};

export default ChannelHeader;

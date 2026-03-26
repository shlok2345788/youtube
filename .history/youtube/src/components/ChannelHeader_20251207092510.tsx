import React, { useState } from "react";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Button } from "./ui/button";

const ChannelHeader = () => {
  const [isSubscribed, setisSubscribed] = useState(false);


  return <div>
    <div className="headerImage">
    </div>
  </div>;
};

export default ChannelHeader;

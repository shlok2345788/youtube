import { useState } from "react";
import { Button } from "./ui/button";
const tabs = [
  { id: "home", label: "Home" },
  { id: "videos", label: "Videos" },
  { id: "shorts", label: "Shorts" },
  { id: "playlists", label: "Playlists" },
  { id: "community", label: "Community" },
  { id: "about", label: "About" },
];

const ChannelTabs = () => {
  const [selectedtab, setselectedtab] = useState([]);

  return (
    <div>
      <div>{
        }</div>
    </div>
  );
};

export default ChannelTabs;

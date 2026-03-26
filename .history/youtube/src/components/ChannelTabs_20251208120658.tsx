import { useState } from "react";

const tabs = [
  { id: "home", label: "Home" },
  { id: "videos", label: "Videos" },
  { id: "shorts", label: "Shorts" },
  { id: "playlists", label: "Playlists" },
  { id: "community", label: "Community" },
  { id: "about", label: "About" },
];

const ChannelTabs = () => {
  const [selectedtab, setselectedtab] = useState<string>("home");

  return (
    <div className="border-b border-gray-200">
      <div className="ml-6 flex gap-5">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setselectedtab(tab.id)}
            className={`
              relative px-1 py-4 text-sm font-medium transition-colors
              ${
                selectedtab === tab.id
                  ? "text-black text"
                  : "text-gray-600 hover:text-black"
              }
            `}
          >
            {tab.label}
            {/* Active indicator line */}
            {selectedtab === tab.id && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-black" />
            )}
            {/* Hover indicator line */}
            <span
              className={`
                absolute bottom-0 left-0 right-0 h-0.5 bg-black transition-opacity
                ${
                  selectedtab === tab.id
                    ? "opacity-0"
                    : "opacity-0 hover:opacity-100"
                }
              `}
            />
          </button>
        ))}
      </div>
    </div>
  );
};

export default ChannelTabs;

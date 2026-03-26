"use client";

import React, { useState } from "react";
import { X } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

interface ChannelDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onChannelCreated: (channelName: string) => void;
}

const ChannelDialog = ({
  isOpen,
  onClose,
  onChannelCreated,
}: ChannelDialogProps) => {
  const [channelName, setChannelName] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!channelName.trim()) return;

    setIsCreating(true);

    // 🔹 Simulate API call (replace with backend later)
    setTimeout(() => {
      onChannelCreated(channelName);
      setChannelName("");
      setIsCreating(false);
      onClose();
    }, 1000);
  };

  const handleClose = () => {
    setChannelName("");
    onClose();
  };

  // ❗ Important
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* BACKDROP */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={handleClose}
      />

      {/* MODAL */}
      <div className="relative z-50 bg-white rounded-lg shadow-lg w-full max-w-md mx-4">
        {/* HEADER */}
        <div className="flex items-center justify-between p-5 border-b">
          <h2 className="text-lg font-semibold">Create Channel</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* BODY */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <Label htmlFor="channelName">Channel Name</Label>
            <Input
              id="channelName"
              value={channelName}
              onChange={(e) => setChannelName(e.target.value)}
              placeholder="Enter your channel name"
              disabled={isCreating}
            />
          </div>

          {/* FOOTER */}
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isCreating}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isCreating || !channelName.trim()}
            >
              {isCreating ? "Creating..." : "Create Channel"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChannelDialog;

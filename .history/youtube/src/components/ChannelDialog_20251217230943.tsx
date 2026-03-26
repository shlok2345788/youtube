"use client";

import React, { useState } from "react";
import { X } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import axiosInstance from "../lib/axiosinstance";

interface ChannelDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onChannelCreated: (channelName: string) => void;
  userId: string;
}

const ChannelDialog = ({
  isOpen,
  onClose,
  onChannelCreated,
  userId,
}: ChannelDialogProps) => {
  const [channelName, setChannelName] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!channelName.trim()) return;

    setIsCreating(true);
    setError("");

    try {
      const response = await axiosInstance.post("/create-channel", {
        userId,
        channelName: channelName.trim(),
      });

      if (response.data.result) {
        onChannelCreated(channelName);
        setChannelName("");
        setIsCreating(false);
        onClose();
      }
    } catch (err: any) {
      console.error("Error creating channel:", err);
      setError(err.response?.data?.message || "Failed to create channel");
      setIsCreating(false);
    }
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
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
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

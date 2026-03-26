import React, { useState } from "react";
import { X } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { toast } from "@/lib/toast";

interface ChannelDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onChannelCreated: (channelName: string) => void;
}

const ChannelDialog = ({ isOpen, onClose, onChannelCreated }: ChannelDialogProps) => {
  const [channelName, setChannelName] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!channelName.trim()) {
      toast.error("Please enter a channel name");
      return;
    }

    setIsCreating(true);
    
    // Simulate API call - replace with actual API call
    setTimeout(() => {
      setIsCreating(false);
      toast.success(`Channel "${channelName}" created successfully!`);
      onChannelCreated(channelName);
      setChannelName("");
      onClose();
    }, 1000);
  };

  const handleClose = () => {
    setChannelName("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50"
        onClick={handleClose}
      />
      
      {/* Dialog */}
      <div className="relative z-50 bg-white rounded-lg shadow-lg w-full max-w-md mx-4">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold">Create Channel</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClose}
            className="h-6 w-6"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <Label htmlFor="channelName">Channel Name</Label>
            <Input
              id="channelName"
              value={channelName}
              onChange={(e) => setChannelName(e.target.value)}
              placeholder="Enter your channel name"
              className="mt-1"
              disabled={isCreating}
              autoFocus
            />
            <p className="text-xs text-gray-500 mt-1">
              This will be your channel's display name
            </p>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isCreating}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isCreating || !channelName.trim()}>
              {isCreating ? "Creating..." : "Create Channel"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChannelDialog;



import { useState } from "react";
import { useRoom } from "@/context/RoomContext";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { toast } from "sonner";

export default function VideoUrlInput() {
  const { isHost, changeVideo } = useRoom();
  const [url, setUrl] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!url.trim()) {
      toast.error("Please enter a valid URL");
      return;
    }

    // Check if it's a valid YouTube URL (basic check)
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+/;
    if (!youtubeRegex.test(url)) {
      toast.error("Please enter a valid YouTube URL");
      return;
    }

    // Change the video for everyone
    changeVideo(url);
    setUrl("");
    toast.success("Video changed for all participants");
  };

  // Only show for hosts
  if (!isHost) return null;

  return (
    <form
      onSubmit={handleSubmit}
      className="p-4 bg-card border rounded-lg mb-4"
    >
      <h3 className="text-sm font-medium mb-2">Change Video (Host Only)</h3>
      <div className="flex space-x-2">
        <Input
          type="text"
          placeholder="Paste YouTube URL here"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="flex-1"
        />
        <Button type="submit" size="sm">
          Change
        </Button>
      </div>
    </form>
  );
}

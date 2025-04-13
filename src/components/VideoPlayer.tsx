
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { useRoom } from '@/context/RoomContext';
import { toast } from 'sonner';

export default function VideoPlayer() {
  const [isPlaying, setIsPlaying] = useState(true);
  const { isHost } = useRoom();
  
  // Mock video player controls
  const togglePlayback = () => {
    setIsPlaying(!isPlaying);
    // In a real implementation, this would sync with other clients
    toast.info(isPlaying ? 'Video paused' : 'Video playing');
  };
  
  const syncVideo = () => {
    toast.info('Syncing video with all participants');
    // In a real implementation, this would force sync all clients
  };
  
  return (
    <div className="w-full h-full flex flex-col">
      <div className="relative w-full bg-black overflow-hidden rounded-xl aspect-video">
        {/* Video embed placeholder */}
        <iframe
          src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&mute=1&controls=0"
          className="absolute inset-0 w-full h-full"
          allowFullScreen
          title="Video player"
        ></iframe>
        
        {/* Overlay controls that would normally appear on hover */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
          <div className="flex items-center justify-between">
            <div className="flex space-x-2">
              <Button 
                size="icon" 
                variant="ghost" 
                onClick={togglePlayback}
                className="text-white hover:bg-white/20"
              >
                {isPlaying ? <Pause size={20} /> : <Play size={20} />}
              </Button>
            </div>
            
            {isHost && (
              <Button 
                size="sm" 
                variant="ghost" 
                onClick={syncVideo}
                className="text-white hover:bg-white/20 flex items-center gap-1"
              >
                <RotateCcw size={16} />
                <span className="hidden sm:inline">Sync All</span>
              </Button>
            )}
          </div>
        </div>
      </div>
      
      <div className="p-4 bg-card rounded-b-xl border-x border-b">
        <h3 className="text-lg font-medium">Now Playing</h3>
        <p className="text-sm text-muted-foreground">
          Rick Astley - Never Gonna Give You Up (Official Music Video)
        </p>
      </div>
    </div>
  );
}

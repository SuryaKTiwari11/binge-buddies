import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { useRoom } from '@/context/RoomContext';
import { toast } from 'sonner';

export default function VideoPlayer() {
  const { videoState, isHost, updateVideoState, forceSync } = useRoom();
  const [localIsPlaying, setLocalIsPlaying] = useState(videoState.isPlaying);
  const [videoUrl, setVideoUrl] = useState(videoState.videoUrl);
  const playerRef = useRef<HTMLIFrameElement>(null);
  const lastSyncTime = useRef(Date.now());
  const syncIntervalRef = useRef<number | null>(null);

  // Update local state when videoState changes from the server
  useEffect(() => {
    setLocalIsPlaying(videoState.isPlaying);
    setVideoUrl(videoState.videoUrl);
  }, [videoState]);

  // Process YouTube URL to get proper embed URL with parameters
  const getEmbedUrl = (url: string) => {
    // Extract video ID from various YouTube URL formats
    let videoId = '';
    const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(youtubeRegex);
    
    if (match && match[1]) {
      videoId = match[1];
    } else {
      // If no match, use the URL as is (might be already an embed URL)
      return url;
    }
    
    // Construct embed URL with parameters
    const params = new URLSearchParams({
      autoplay: '1',
      mute: '1',
      enablejsapi: '1',
      modestbranding: '1',
      rel: '0',
      controls: '0',
    });
    
    return `https://www.youtube.com/embed/${videoId}?${params.toString()}`;
  };

  // Toggle local playback and notify server
  const togglePlayback = () => {
    const newPlayingState = !localIsPlaying;
    setLocalIsPlaying(newPlayingState);
    
    // Get current timestamp (in seconds) from the YouTube player if possible
    // In a real implementation, you would use the YouTube API to get the current time
    // For now, we'll use a mock timestamp
    const currentTimestamp = Math.floor(Date.now() / 1000) % 600; // Mock timestamp (0-599 seconds)
    
    // Update videoState in context/server
    updateVideoState({
      isPlaying: newPlayingState,
      timestamp: currentTimestamp
    });
    
    toast.info(newPlayingState ? 'Video playing' : 'Video paused');
  };
  
  // Force sync with all participants
  const syncVideo = () => {
    if (isHost) {
      forceSync();
      toast.info('Syncing video with all participants');
    }
  };
  
  // Set up periodic sync check
  useEffect(() => {
    // Check for sync every 10 seconds
    syncIntervalRef.current = window.setInterval(() => {
      const now = Date.now();
      // If last sync was more than 20 seconds ago and we're playing, request a sync
      if (videoState.isPlaying && now - lastSyncTime.current > 20000) {
        lastSyncTime.current = now;
        console.log('Requesting sync check due to time elapsed');
        // In a real implementation, you would request a sync from the server
      }
    }, 10000);
    
    return () => {
      if (syncIntervalRef.current) {
        clearInterval(syncIntervalRef.current);
      }
    };
  }, [videoState.isPlaying]);
  
  return (
    <div className="w-full h-full flex flex-col">
      <div className="relative w-full bg-black overflow-hidden rounded-xl aspect-video">
        {/* Video embed with YouTube URL */}
        <iframe
          ref={playerRef}
          src={getEmbedUrl(videoUrl)}
          className="absolute inset-0 w-full h-full"
          allowFullScreen
          title="Video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
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
                {localIsPlaying ? <Pause size={20} /> : <Play size={20} />}
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
          {videoUrl.includes('dQw4w9WgXcQ') 
            ? 'Rick Astley - Never Gonna Give You Up (Official Music Video)'
            : 'Current video'}
        </p>
      </div>
    </div>
  );
}


import { useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { useRoom } from '@/context/RoomContext';
import VideoPlayer from '@/components/VideoPlayer';
import ChatBox from '@/components/ChatBox';
import ChatInput from '@/components/ChatInput';
import ParticipantList from '@/components/ParticipantList';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';

const WatchRoom = () => {
  const { roomId: urlRoomId } = useParams<{ roomId: string }>();
  const { roomId, joinRoom } = useRoom();
  
  // If room ID from URL doesn't match context, join the room
  useEffect(() => {
    if (urlRoomId && urlRoomId !== roomId) {
      joinRoom(urlRoomId);
    }
  }, [urlRoomId, roomId, joinRoom]);
  
  // Handle case where there's no room ID
  if (!roomId) {
    if (urlRoomId) {
      // Attempt to join with URL room ID
      joinRoom(urlRoomId);
      return <div className="flex items-center justify-center h-screen">Joining room...</div>;
    } else {
      // No room ID available, redirect to home
      toast.error('No room ID found. Please join a room.');
      return <Navigate to="/" replace />;
    }
  }
  
  return (
    <div className="min-h-[calc(100vh-8rem)] flex flex-col">
      <div className="flex-1 flex flex-col lg:flex-row">
        {/* Video player side */}
        <div className="w-full lg:w-[68%] p-4 flex flex-col">
          <VideoPlayer />
        </div>
        
        {/* Chat side */}
        <div className="w-full lg:w-[32%] border-t lg:border-t-0 lg:border-l flex flex-col">
          <div className="p-4 border-b">
            <h2 className="text-lg font-semibold">Chat</h2>
            <p className="text-sm text-muted-foreground">
              Talk with others in this watch party
            </p>
          </div>
          
          <ChatBox />
          <Separator />
          <ParticipantList />
          <ChatInput />
        </div>
      </div>
    </div>
  );
};

export default WatchRoom;


import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useRoom } from '@/context/RoomContext';
import { toast } from 'sonner';

export default function RoomForm() {
  const [roomIdInput, setRoomIdInput] = useState('');
  const { createRoom, joinRoom } = useRoom();
  
  const handleJoinRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomIdInput.trim()) {
      toast.error('Please enter a room ID');
      return;
    }
    joinRoom(roomIdInput.trim());
  };
  
  return (
    <div className="w-full max-w-md p-6 bg-card/80 backdrop-blur-sm border rounded-2xl shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center">Join a Watch Party</h2>
      
      <form onSubmit={handleJoinRoom} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="roomId" className="text-sm font-medium">
            Enter Room ID
          </label>
          <Input
            id="roomId"
            value={roomIdInput}
            onChange={(e) => setRoomIdInput(e.target.value)}
            placeholder="e.g. ABC123"
            className="bg-background/70"
            autoComplete="off"
          />
        </div>
        
        <div className="flex flex-col space-y-2">
          <Button type="submit" className="w-full">
            Join Room
          </Button>
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">or</span>
            </div>
          </div>
          
          <Button 
            variant="outline" 
            type="button" 
            onClick={() => createRoom()}
            className="w-full bg-background/70"
          >
            Create New Room
          </Button>
        </div>
      </form>
    </div>
  );
}

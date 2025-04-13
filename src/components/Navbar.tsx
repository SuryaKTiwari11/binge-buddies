
import { Button } from '@/components/ui/button';
import { ClipboardCopy, Home, Users } from 'lucide-react';
import { useRoom } from '@/context/RoomContext';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';

export default function Navbar() {
  const { roomId, leaveRoom } = useRoom();
  
  const copyRoomId = () => {
    if (roomId) {
      navigator.clipboard.writeText(roomId);
      toast.success('Room ID copied to clipboard');
    }
  };
  
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-sm">
      <div className="container flex h-16 items-center justify-between py-4">
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5">
            <Users size={24} className="text-primary" />
            <span className="font-bold text-xl tracking-tight">BingeBuddies</span>
          </span>
          
          {roomId && (
            <div className="hidden md:flex items-center gap-1 ml-6 text-sm text-muted-foreground">
              <span>Room:</span>
              <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm">
                {roomId}
              </code>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={copyRoomId}
              >
                <ClipboardCopy size={14} className="text-muted-foreground" />
                <span className="sr-only">Copy room ID</span>
              </Button>
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          {roomId ? (
            <Button variant="outline" size="sm" onClick={leaveRoom}>
              <Home size={16} className="mr-1" />
              Exit Room
            </Button>
          ) : (
            <Link to="/">
              <Button variant="outline" size="sm">
                <Home size={16} className="mr-1" />
                Home
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

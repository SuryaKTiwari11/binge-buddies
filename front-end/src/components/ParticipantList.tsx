
import { useRoom } from '@/context/RoomContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Crown } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function ParticipantList() {
  const { participants } = useRoom();
  
  return (
    <div className="border-t py-2 px-4">
      <h3 className="text-sm font-medium mb-2">In this room ({participants.length})</h3>
      <ScrollArea className="w-full">
        <div className="flex gap-3 pb-1">
          {participants.map((participant) => (
            <div key={participant.id} className="flex flex-col items-center">
              <div className="relative">
                <Avatar className="h-10 w-10">
                  <AvatarImage 
                    src={`https://api.dicebear.com/6.x/fun-emoji/svg?seed=${participant.name}`} 
                    alt={participant.name} 
                  />
                  <AvatarFallback>
                    {participant.name.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                {participant.isHost && (
                  <span className="absolute -top-1 -right-1 bg-accent rounded-full p-0.5">
                    <Crown size={12} className="text-accent-foreground" />
                  </span>
                )}
              </div>
              <span className="text-xs mt-1 max-w-16 truncate">{participant.name}</span>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}


import { useRef, useEffect } from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useRoom } from '@/context/RoomContext';
import { cn } from '@/lib/utils';

export default function ChatBox() {
  const { messages, username } = useRoom();
  const scrollRef = useRef<HTMLDivElement>(null);
  
  // Auto scroll to bottom when new messages are added
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);
  
  // Format timestamp to display time only
  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };
  
  return (
    <ScrollArea className="flex-1 p-4">
      <div className="space-y-4">
        {messages.map((message) => (
          <div 
            key={message.id}
            className={cn(
              "flex items-start gap-2",
              message.senderName === username ? "flex-row-reverse" : ""
            )}
          >
            <Avatar className="h-8 w-8 flex-shrink-0">
              <AvatarImage src={`https://api.dicebear.com/6.x/fun-emoji/svg?seed=${message.senderName}`} />
              <AvatarFallback>
                {message.senderName.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            
            <div 
              className={cn(
                "rounded-2xl px-4 py-2.5 text-sm",
                message.senderName === username 
                  ? "bg-primary text-primary-foreground" 
                  : "bg-muted"
              )}
            >
              <div className="flex items-center gap-1 mb-1">
                <span className="font-medium">{message.senderName}</span>
                <span className="text-xs opacity-70">
                  {formatTime(message.timestamp)}
                </span>
              </div>
              <p>{message.content}</p>
            </div>
          </div>
        ))}
        <div ref={scrollRef} />
      </div>
    </ScrollArea>
  );
}

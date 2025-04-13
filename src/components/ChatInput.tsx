
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send } from 'lucide-react';
import { useRoom } from '@/context/RoomContext';

export default function ChatInput() {
  const [message, setMessage] = useState('');
  const { sendMessage } = useRoom();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      sendMessage(message);
      setMessage('');
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="p-4 border-t flex gap-2">
      <Input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message..."
        className="flex-1"
      />
      <Button type="submit" size="icon">
        <Send size={18} />
        <span className="sr-only">Send message</span>
      </Button>
    </form>
  );
}

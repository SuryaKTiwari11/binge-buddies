
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

// Mock participant data
export interface Participant {
  id: string;
  name: string;
  avatar?: string;
  isHost?: boolean;
}

// Message interface
export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: Date;
}

interface RoomContextType {
  roomId: string | null;
  username: string;
  participants: Participant[];
  messages: ChatMessage[];
  isHost: boolean;
  createRoom: () => void;
  joinRoom: (roomId: string) => void;
  leaveRoom: () => void;
  sendMessage: (content: string) => void;
  setUsername: (name: string) => void;
}

const RoomContext = createContext<RoomContextType | undefined>(undefined);

export function useRoom() {
  const context = useContext(RoomContext);
  if (!context) {
    throw new Error('useRoom must be used within a RoomProvider');
  }
  return context;
}

const mockParticipants: Participant[] = [
  { id: '1', name: 'MovieBuff42', isHost: true },
  { id: '2', name: 'CinemaLover' },
  { id: '3', name: 'FilmCritic101' },
  { id: '4', name: 'ScreenMaster' },
  { id: '5', name: 'PopcornFiend' },
];

const mockMessages: ChatMessage[] = [
  {
    id: '1',
    senderId: '1',
    senderName: 'MovieBuff42',
    content: 'Hey everyone, welcome to the watch party!',
    timestamp: new Date(Date.now() - 120000),
  },
  {
    id: '2',
    senderId: '2',
    senderName: 'CinemaLover',
    content: 'Thanks for the invite! This movie looks awesome.',
    timestamp: new Date(Date.now() - 90000),
  },
  {
    id: '3',
    senderId: '3',
    senderName: 'FilmCritic101',
    content: 'I heard great reviews about this one.',
    timestamp: new Date(Date.now() - 60000),
  },
  {
    id: '4',
    senderId: '4',
    senderName: 'ScreenMaster',
    content: 'The director\'s previous work was amazing.',
    timestamp: new Date(Date.now() - 30000),
  },
  {
    id: '5',
    senderId: '5',
    senderName: 'PopcornFiend',
    content: 'Does anyone need snack recommendations? 🍿',
    timestamp: new Date(Date.now() - 10000),
  },
];

export function RoomProvider({ children }: { children: ReactNode }) {
  const [roomId, setRoomId] = useState<string | null>(null);
  const [username, setUsername] = useState<string>('Guest' + Math.floor(Math.random() * 1000));
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isHost, setIsHost] = useState(false);
  
  const navigate = useNavigate();

  // Generate random room ID
  const generateRoomId = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  // Create a new room
  const createRoom = () => {
    const newRoomId = generateRoomId();
    setRoomId(newRoomId);
    setParticipants([...mockParticipants]);
    setMessages([...mockMessages]);
    setIsHost(true);
    navigate(`/room/${newRoomId}`);
    toast.success(`Room created: ${newRoomId}`);
  };

  // Join an existing room
  const joinRoom = (id: string) => {
    setRoomId(id);
    setParticipants([...mockParticipants]);
    setMessages([...mockMessages]);
    setIsHost(false);
    navigate(`/room/${id}`);
    toast.success(`Joined room: ${id}`);
  };

  // Leave current room
  const leaveRoom = () => {
    setRoomId(null);
    setParticipants([]);
    setMessages([]);
    setIsHost(false);
    navigate('/');
  };

  // Send a message in the room
  const sendMessage = (content: string) => {
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      senderId: 'user',
      senderName: username,
      content,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, newMessage]);
  };

  const value = {
    roomId,
    username,
    participants,
    messages,
    isHost,
    createRoom,
    joinRoom,
    leaveRoom,
    sendMessage,
    setUsername,
  };

  return <RoomContext.Provider value={value}>{children}</RoomContext.Provider>;
}

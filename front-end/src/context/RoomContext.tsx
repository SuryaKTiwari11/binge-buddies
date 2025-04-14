import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  useCallback,
  useRef,
} from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { io, Socket } from "socket.io-client";

// Participant interface
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

// Video state interface
export interface VideoState {
  videoUrl: string;
  isPlaying: boolean;
  timestamp: number;
  lastUpdated?: number;
}

interface RoomContextType {
  roomId: string | null;
  username: string;
  participants: Participant[];
  messages: ChatMessage[];
  isHost: boolean;
  socket: Socket | null;
  videoState: VideoState;
  createRoom: () => void;
  joinRoom: (roomId: string) => void;
  leaveRoom: () => void;
  sendMessage: (content: string) => void;
  setUsername: (name: string) => void;
  updateVideoState: (state: Partial<VideoState>) => void;
  changeVideo: (url: string) => void;
  forceSync: () => void;
  userId: string | null;
}

const RoomContext = createContext<RoomContextType | undefined>(undefined);

export function useRoom() {
  const context = useContext(RoomContext);
  if (!context) {
    throw new Error("useRoom must be used within a RoomProvider");
  }
  return context;
}

// Server URL - change this to your actual backend URL
const SERVER_URL = "http://localhost:3001";

export function RoomProvider({ children }: { children: ReactNode }) {
  const [roomId, setRoomId] = useState<string | null>(null);
  const [username, setUsername] = useState<string>(
    "Guest" + Math.floor(Math.random() * 1000)
  );
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isHost, setIsHost] = useState(false);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [videoState, setVideoState] = useState<VideoState>({
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    isPlaying: false,
    timestamp: 0,
  });

  const navigate = useNavigate();
  const socketRef = useRef<Socket | null>(null);

  // Initialize socket connection
  useEffect(() => {
    const newSocket = io(SERVER_URL);

    // Setup socket event listeners
    newSocket.on("connect", () => {
      console.log("Connected to server with ID:", newSocket.id);
      setUserId(newSocket.id);
    });

    newSocket.on("disconnect", () => {
      console.log("Disconnected from server");
      toast.error("Disconnected from server. Trying to reconnect...");
    });

    newSocket.on("connect_error", (error) => {
      console.error("Connection error:", error);
      toast.error(
        "Failed to connect to server. Please check your internet connection."
      );
    });

    setSocket(newSocket);
    socketRef.current = newSocket;

    // Cleanup on unmount
    return () => {
      if (newSocket) {
        newSocket.disconnect();
      }
    };
  }, []);

  // Setup room event listeners when socket and roomId change
  useEffect(() => {
    const currentSocket = socketRef.current;
    if (!currentSocket || !roomId) return;

    // Handle room joined event
    const handleRoomJoined = (data: {
      roomId: string;
      participants: Participant[];
      videoState: VideoState;
      userId: string;
    }) => {
      setParticipants(data.participants);
      setVideoState(data.videoState);

      // Check if this user is the host
      const isUserHost = data.participants.some(
        (p) => p.id === data.userId && p.isHost
      );
      setIsHost(isUserHost);

      toast.success(`Joined room: ${data.roomId}`);
    };

    // Handle participant joined event
    const handleParticipantJoined = (data: { participant: Participant }) => {
      setParticipants((prevParticipants) => [
        ...prevParticipants,
        data.participant,
      ]);
      toast.info(`${data.participant.name} joined the room`);
    };

    // Handle participant left event
    const handleParticipantLeft = (data: { participantId: string }) => {
      setParticipants((prevParticipants) =>
        prevParticipants.filter((p) => p.id !== data.participantId)
      );

      const participant = participants.find((p) => p.id === data.participantId);
      if (participant) {
        toast.info(`${participant.name} left the room`);
      }
    };

    // Handle host changed event
    const handleHostChanged = (data: {
      newHostId: string;
      newHostName: string;
    }) => {
      setParticipants((prevParticipants) =>
        prevParticipants.map((p) => ({
          ...p,
          isHost: p.id === data.newHostId,
        }))
      );

      setIsHost(data.newHostId === userId);
      toast.info(`${data.newHostName} is now the host`);
    };

    // Handle new message event
    const handleReceiveMessage = (data: { message: ChatMessage }) => {
      setMessages((prevMessages) => [...prevMessages, data.message]);
    };

    // Handle video state changed event
    const handleVideoStateChanged = (data: {
      isPlaying: boolean;
      timestamp: number;
      userId: string;
      username: string;
    }) => {
      setVideoState((prev) => ({
        ...prev,
        isPlaying: data.isPlaying,
        timestamp: data.timestamp,
        lastUpdated: Date.now(),
      }));

      toast.info(
        `${data.username} ${data.isPlaying ? "played" : "paused"} the video`
      );
    };

    // Handle video URL changed event
    const handleVideoChanged = (data: {
      videoUrl: string;
      userId: string;
      username: string;
    }) => {
      setVideoState((prev) => ({
        ...prev,
        videoUrl: data.videoUrl,
        timestamp: 0,
        isPlaying: false,
        lastUpdated: Date.now(),
      }));

      toast.info(`${data.username} changed the video`);
    };

    // Handle sync required event
    const handleSyncRequired = (data: { videoState: VideoState }) => {
      setVideoState(data.videoState);
      toast.info("Syncing video with host");
    };

    // Set up event listeners
    currentSocket.on("room_joined", handleRoomJoined);
    currentSocket.on("participant_joined", handleParticipantJoined);
    currentSocket.on("participant_left", handleParticipantLeft);
    currentSocket.on("host_changed", handleHostChanged);
    currentSocket.on("receive_message", handleReceiveMessage);
    currentSocket.on("video_state_changed", handleVideoStateChanged);
    currentSocket.on("video_changed", handleVideoChanged);
    currentSocket.on("sync_required", handleSyncRequired);

    // Cleanup listeners on unmount or when roomId/socket changes
    return () => {
      currentSocket.off("room_joined", handleRoomJoined);
      currentSocket.off("participant_joined", handleParticipantJoined);
      currentSocket.off("participant_left", handleParticipantLeft);
      currentSocket.off("host_changed", handleHostChanged);
      currentSocket.off("receive_message", handleReceiveMessage);
      currentSocket.off("video_state_changed", handleVideoStateChanged);
      currentSocket.off("video_changed", handleVideoChanged);
      currentSocket.off("sync_required", handleSyncRequired);
    };
  }, [roomId, socket, userId, participants]);

  // Generate random room ID
  const generateRoomId = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  // Create a new room
  const createRoom = useCallback(() => {
    if (!socket) {
      toast.error("Not connected to server");
      return;
    }

    const newRoomId = generateRoomId();
    setRoomId(newRoomId);

    // Join the room as the host
    socket.emit("join_room", { roomId: newRoomId, username });

    navigate(`/room/${newRoomId}`);
  }, [socket, username, navigate]);

  // Join an existing room
  const joinRoom = useCallback(
    (id: string) => {
      if (!socket) {
        toast.error("Not connected to server");
        return;
      }

      setRoomId(id);

      // Join the room
      socket.emit("join_room", { roomId: id, username });

      navigate(`/room/${id}`);
    },
    [socket, username, navigate]
  );

  // Leave current room
  const leaveRoom = useCallback(() => {
    if (socket && roomId) {
      socket.emit("leave_room", { roomId });
    }

    setRoomId(null);
    setParticipants([]);
    setMessages([]);
    setIsHost(false);
    setVideoState({
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      isPlaying: false,
      timestamp: 0,
    });

    navigate("/");
  }, [socket, roomId, navigate]);

  // Send a message in the room
  const sendMessage = useCallback(
    (content: string) => {
      if (!socket || !roomId) return;

      const newMessage: ChatMessage = {
        id: Date.now().toString(),
        senderId: userId || "unknown",
        senderName: username,
        content,
        timestamp: new Date(),
      };

      socket.emit("send_message", { roomId, message: newMessage });
    },
    [socket, roomId, userId, username]
  );

  // Update video state (play/pause/seek)
  const updateVideoState = useCallback(
    (state: Partial<VideoState>) => {
      if (!socket || !roomId) return;

      const newState = { ...videoState, ...state };

      setVideoState(newState);

      socket.emit("video_state_update", {
        roomId,
        isPlaying: newState.isPlaying,
        timestamp: newState.timestamp,
        userId,
      });
    },
    [socket, roomId, videoState, userId]
  );

  // Change the video URL
  const changeVideo = useCallback(
    (url: string) => {
      if (!socket || !roomId || !isHost) return;

      socket.emit("change_video", {
        roomId,
        videoUrl: url,
        userId,
      });
    },
    [socket, roomId, userId, isHost]
  );

  // Force sync all clients with host's video state
  const forceSync = useCallback(() => {
    if (!socket || !roomId || !isHost) return;

    socket.emit("force_sync", { roomId });
  }, [socket, roomId, isHost]);

  const value = {
    roomId,
    username,
    participants,
    messages,
    isHost,
    socket,
    videoState,
    createRoom,
    joinRoom,
    leaveRoom,
    sendMessage,
    setUsername,
    updateVideoState,
    changeVideo,
    forceSync,
    userId,
  };

  return <RoomContext.Provider value={value}>{children}</RoomContext.Provider>;
}

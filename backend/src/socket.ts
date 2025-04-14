import { Server, Socket } from "socket.io";

// Interfaces for strongly typed events
interface RoomData {
  roomId: string;
  username: string;
}

interface MessageData {
  roomId: string;
  message: {
    id: string;
    senderId: string;
    senderName: string;
    content: string;
    timestamp: Date;
  };
}

interface VideoStateData {
  roomId: string;
  videoUrl: string;
  isPlaying: boolean;
  timestamp: number;
  userId: string;
}

interface VideoUrlData {
  roomId: string;
  videoUrl: string;
  userId: string;
}

// In-memory data store for rooms
// In a real app, you'd use a database like Redis/MongoDB
const rooms = new Map<
  string,
  {
    participants: Map<string, { id: string; name: string; isHost?: boolean }>;
    videoState: {
      videoUrl: string;
      isPlaying: boolean;
      timestamp: number;
      lastUpdated: number;
    };
  }
>();

export const setupSocketHandlers = (io: Server) => {
  io.on("connection", (socket: Socket) => {
    console.log(`Socket connected: ${socket.id}`);

    // Create/join room handler
    socket.on("join_room", ({ roomId, username }: RoomData) => {
      // Create room if it doesn't exist
      if (!rooms.has(roomId)) {
        rooms.set(roomId, {
          participants: new Map(),
          videoState: {
            videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
            isPlaying: false,
            timestamp: 0,
            lastUpdated: Date.now(),
          },
        });
        // First person to join is host
        rooms.get(roomId)!.participants.set(socket.id, {
          id: socket.id,
          name: username,
          isHost: true,
        });
      } else {
        // Add user to existing room
        rooms.get(roomId)!.participants.set(socket.id, {
          id: socket.id,
          name: username,
        });
      }

      // Join the socket.io room
      socket.join(roomId);

      // Get current room state
      const roomState = rooms.get(roomId)!;
      const participants = Array.from(roomState.participants.values());
      const { videoState } = roomState;

      // Send room state to new participant
      socket.emit("room_joined", {
        roomId,
        participants,
        videoState,
        userId: socket.id,
      });

      // Notify other participants that someone joined
      socket.to(roomId).emit("participant_joined", {
        participant: {
          id: socket.id,
          name: username,
        },
      });

      console.log(`User ${username} (${socket.id}) joined room ${roomId}`);
      console.log(`Room ${roomId} now has ${participants.length} participants`);
    });

    // Leave room handler
    socket.on("leave_room", ({ roomId }: { roomId: string }) => {
      leaveRoom(socket, roomId);
    });

    // Video state update (play/pause/seek)
    socket.on(
      "video_state_update",
      ({ roomId, isPlaying, timestamp, userId }: VideoStateData) => {
        if (!rooms.has(roomId)) return;

        const room = rooms.get(roomId)!;
        const participant = room.participants.get(socket.id);

        // Update room's video state
        room.videoState.isPlaying = isPlaying;
        room.videoState.timestamp = timestamp;
        room.videoState.lastUpdated = Date.now();

        // Broadcast video state to all other participants
        socket.to(roomId).emit("video_state_changed", {
          isPlaying,
          timestamp,
          userId,
          username: participant?.name,
        });
      }
    );

    // Change video URL
    socket.on("change_video", ({ roomId, videoUrl, userId }: VideoUrlData) => {
      if (!rooms.has(roomId)) return;

      const room = rooms.get(roomId)!;
      const participant = room.participants.get(socket.id);

      // Only host can change the video
      if (participant?.isHost) {
        room.videoState.videoUrl = videoUrl;
        room.videoState.timestamp = 0;
        room.videoState.isPlaying = false;

        // Broadcast new video to everyone (including sender)
        io.to(roomId).emit("video_changed", {
          videoUrl,
          userId,
          username: participant.name,
        });
      }
    });

    // Chat message handler
    socket.on("send_message", ({ roomId, message }: MessageData) => {
      // Broadcast message to everyone in the room (including sender for consistency)
      io.to(roomId).emit("receive_message", { message });
    });

    // Force sync handler (host can force everyone to sync)
    socket.on("force_sync", ({ roomId }: { roomId: string }) => {
      if (!rooms.has(roomId)) return;

      const room = rooms.get(roomId)!;
      const participant = room.participants.get(socket.id);

      // Only host can force sync
      if (participant?.isHost) {
        io.to(roomId).emit("sync_required", {
          videoState: room.videoState,
        });
      }
    });

    // Handle disconnection
    socket.on("disconnect", () => {
      // Find which room this socket was in
      for (const [roomId, room] of rooms.entries()) {
        if (room.participants.has(socket.id)) {
          leaveRoom(socket, roomId);
          break;
        }
      }
    });
  });

  // Helper function to handle leaving a room
  function leaveRoom(socket: Socket, roomId: string): void {
    if (!rooms.has(roomId)) return;

    const room = rooms.get(roomId)!;
    const participant = room.participants.get(socket.id);

    if (participant) {
      // Remove participant from room
      room.participants.delete(socket.id);

      // Notify others that participant left
      socket.to(roomId).emit("participant_left", {
        participantId: socket.id,
      });

      console.log(
        `User ${participant.name} (${socket.id}) left room ${roomId}`
      );

      // If room is empty, delete it
      if (room.participants.size === 0) {
        rooms.delete(roomId);
        console.log(`Room ${roomId} deleted (empty)`);
      }
      // If host left, assign new host
      else if (participant.isHost) {
        const nextHost = Array.from(room.participants.entries())[0];
        if (nextHost) {
          nextHost[1].isHost = true;
          io.to(roomId).emit("host_changed", {
            newHostId: nextHost[0],
            newHostName: nextHost[1].name,
          });
        }
      }
    }

    // Leave the socket.io room
    socket.leave(roomId);
  }
};

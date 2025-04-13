
// Generate a random room ID (6 characters, alphanumeric)
export const generateRoomId = (): string => {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
};

// TODO: In the future, this will handle WebRTC connections
export const initializeRoomConnection = (roomId: string): void => {
  console.log(`Room connection initialized for room: ${roomId}`);
  // This would connect to WebRTC service
};

// TODO: In the future, this will handle WebRTC disconnections
export const cleanupRoomConnection = (): void => {
  console.log('Room connection cleaned up');
  // This would disconnect from WebRTC service
};

// Format timestamp to display
export const formatMessageTime = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

// Get avatar URL based on username
export const getAvatarUrl = (username: string): string => {
  return `https://api.dicebear.com/6.x/fun-emoji/svg?seed=${username}`;
};

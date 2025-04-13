# 🎬 BingeBuddies – Watch Together, Laugh Together!

BingeBuddies is a **real-time co-watching platform** where you and your friends can:
- 📺 **Watch shows together in sync**
- 🎤 **Use mic and camera (like a mini Google Meet)**
- 💬 **Chat in real-time**
- 🔒 **Join private or public rooms**

---

## ✨ Purpose of the Project

I created BingeBuddies as a personal learning project with two major goals:

1. 📡 **Understand and implement WebRTC**  
    Learn how real-time peer-to-peer audio/video streaming works in modern web apps (e.g., Google Meet, Discord, etc.)

2. ⚡ **Master real-time communication using Socket.IO**  
    Build a deep understanding of how real-time apps sync actions (like video play/pause, chat messages, room updates) using websockets.

---

## 🧠 Features (Planned & Built)

### ✅ MVP Features
- [x] Public rooms with unique Room ID
- [x] Embedded stream (YouTube/Twitch iframe)
- [x] Real-time chat using Socket.IO
- [x] Show current participants in a room

### 🔁 Core Experience (In Progress)
- [ ] WebRTC-based Mic + Camera support
- [ ] Sync video player state (play/pause/timestamp) across all users
- [ ] Private / password-protected rooms
- [ ] Host/admin room controls (pause for all, mute others, etc.)

### 🎨 UI Features
- Clean responsive UI built with **ShadCN + TailwindCSS**
- Dark/light mode support
- Toast notifications and user feedback

---

## 🛠️ Tech Stack

### 🧱 Frontend
- ⚛️ **React** (via Vite) – UI Framework
- 🎨 **TailwindCSS + ShadCN** – Modern styling and UI components
- 🧠 **TypeScript** – Safer and smarter development
- 🔌 **Socket.IO Client** – Real-time communication
- 📹 **WebRTC (Simple-Peer)** – For peer-to-peer video/audio

### 🔙 Backend
- 🟢 **Node.js + Express** – Server logic & WebSocket gateway
- 🔌 **Socket.IO Server** – For syncing room events & messaging
- 🧠 **TypeScript** – Strongly typed backend
- 🔐 (Planned) **Redis or MongoDB** – Room/session persistence
- 🌐 **CORS Enabled** – For seamless local development

---

## 🗂️ Folder Structure

```bash
📁 BingeBuddies/
├── frontend/       # Vite + React + ShadCN
└── backend/        # Express + Socket.IO + WebRTC signaling
```

---

## 📸 Why This Project Is Cool

I didn't want to use prebuilt services like Hyperbeam or daily.co — I wanted to build it myself to truly understand what powers modern platforms like:

- Discord's screen share
- Google Meet
- WatchParty / Teleparty
- Any real-time co-watching experience

BingeBuddies is my hands-on journey into WebRTC, Socket.IO, and fullstack real-time apps.

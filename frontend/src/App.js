import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:3001");

function App() {
  const [roomId, setRoomId] = useState(null);
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);

  useEffect(() => {
    socket.on("waiting", () => {
      setChat([{ sender: "System", text: "Waiting for a stranger..." }]);
    });

    socket.on("match-found", (roomId) => {
      setRoomId(roomId);
      setChat([{ sender: "System", text: "Stranger connected!" }]);
    });

    socket.on("message", (msg) => {
      setChat((prev) => [...prev, { sender: "Stranger", text: msg }]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const sendMessage = () => {
    if (message.trim() && roomId) {
      socket.emit("message", { roomId, message });
      setChat((prev) => [...prev, { sender: "You", text: message }]);
      setMessage("");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Stranger Chat</h1>
      <div style={{ height: 300, overflowY: "scroll", border: "1px solid gray", marginBottom: 10, padding: 10 }}>
        {chat.map((msg, i) => (
          <div key={i}><b>{msg.sender}:</b> {msg.text}</div>
        ))}
      </div>
      <input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}

export default App;
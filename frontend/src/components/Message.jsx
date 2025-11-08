import React from "react";

export default function Message({ message }) {
  const isUser = message.role === "user";
  const time = message.ts ? new Date(message.ts).toLocaleTimeString() : "";

  return (
    <div className={`message-row ${isUser ? "user-row" : "bot-row"}`}>
      <div className={`bubble ${isUser ? "user-bubble" : "bot-bubble"}`}>
        <div className="bubble-content">{message.content}</div>
        <div className="bubble-meta">{time}</div>
      </div>
    </div>
  );
}

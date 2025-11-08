import React, { useState } from "react";

export default function InputBar({ onSend }) {
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);

  const send = () => {
    if (!text.trim()) return;
    setSending(true);
    onSend(text);
    setText("");
    // small delay to allow streaming to begin
    setTimeout(() => setSending(false), 400);
  };

  const onKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <div className="input-bar-global">
      <textarea
        className="input-text"
        placeholder="Type your message..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={onKey}
        rows={1}
      />
      <button className="send-btn" onClick={send} aria-label="Send">
        <svg width="18" height="18" viewBox="0 0 24 24"><path fill="white" d="M2 21l21-9L2 3v7l15 2-15 2z"/></svg>
      </button>
    </div>
  );
}

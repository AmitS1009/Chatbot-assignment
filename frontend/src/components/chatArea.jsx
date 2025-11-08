import React, { useState, useEffect, useRef } from "react";
import Message from "./Message";
import InputBar from "./InputBar";

export default function ChatArea({ chat = { messages: [] }, onSend, onUpdateTitle, onClear }) {
  const [title, setTitle] = useState(chat?.title || "New Chat");
  const scrollRef = useRef(null);

  useEffect(() => {
    setTitle(chat?.title || "New Chat");
  }, [chat]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chat?.messages]);

  const handleTitleBlur = () => {
    onUpdateTitle(title.trim() || "Untitled Chat");
  };

  return (
    <main className="chat-area">
      <div className="chat-header">
        <input
          className="chat-title-input"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={handleTitleBlur}
        />
        <div className="chat-actions">
          <button className="clear-btn" onClick={onClear}>Clear</button>
        </div>
      </div>

      <div className="messages" ref={scrollRef}>
        {chat?.messages?.length === 0 ? (
          <div className="empty-state">
            <h3>Let's chat! What's on your mind?</h3>
            <p>Try: "Explain reinforcement learning in 2 minutes", "How to fix a model overfitting"</p>
          </div>
        ) : (
          chat.messages.map((m, i) => <Message key={i} message={m} />)
        )}
      </div>

      <InputBar onSend={onSend} />
    </main>
  );
}

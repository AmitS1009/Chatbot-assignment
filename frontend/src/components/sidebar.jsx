import React from "react";

export default function Sidebar({ chats, activeId, onSelect, onNew, onDelete }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-top">
        <h2>Chat</h2>
        <button className="new-btn" onClick={onNew}>+ New</button>
      </div>

      <div className="chat-list">
        {chats.map((c) => (
          <div
            key={c.id}
            className={`chat-item ${c.id === activeId ? "active" : ""}`}
            onClick={() => onSelect(c.id)}
          >
            <div className="chat-title">{c.title}</div>
            <button className="del-btn" onClick={(e) => { e.stopPropagation(); onDelete(c.id); }}>✕</button>
          </div>
        ))}
      </div>

      <div className="sidebar-bottom">
        <small>Built with Gemini • FastAPI</small>
      </div>
    </aside>
  );
}

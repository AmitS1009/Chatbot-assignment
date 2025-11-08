import { useEffect, useRef, useState } from "react";
import "./App.css";
import { WS_URL } from "./api";
import Sidebar from "./components/Sidebar";
import ChatArea from "./components/ChatArea";

export default function App() {
  const [chats, setChats] = useState([
    { id: "new", title: "New Chat", messages: [] },
  ]);
  const [activeChatId, setActiveChatId] = useState("new");

  const ws = useRef(null);

  useEffect(() => {
    ws.current = new WebSocket(WS_URL);
    ws.current.onopen = () => console.log("WS open");
    ws.current.onmessage = (e) => {
      const text = e.data;
      setChats((prev) =>
        prev.map((c) => {
          if (c.id !== activeChatId) return c;
          // if last message is bot, append streaming text
          const last = c.messages[c.messages.length - 1];
          if (last && last.role === "bot") {
            const updated = [...c.messages];
            updated[updated.length - 1] = {
              ...last,
              content: last.content + text,
            };
            return { ...c, messages: updated };
          }
          return { ...c, messages: [...c.messages, { role: "bot", content: text, ts: Date.now() }] };
        })
      );
    };
    ws.current.onclose = () => console.log("WS closed");
    ws.current.onerror = (err) => console.error("WS err", err);
    return () => ws.current.close();
  }, [activeChatId]);

  const sendMessage = (text) => {
    if (!text?.trim()) return;
    const msg = { role: "user", content: text, ts: Date.now() };
    setChats((prev) =>
      prev.map((c) => (c.id === activeChatId ? { ...c, messages: [...c.messages, msg, { role: "bot", content: "" }] } : c))
    );
    ws.current.send(text);
  };

  const createChat = (title = "New Chat") => {
    const id = Date.now().toString();
    const newChat = { id, title, messages: [] };
    setChats((prev) => [newChat, ...prev]);
    setActiveChatId(id);
  };

  const updateChatTitle = (id, title) => {
    setChats((prev) => prev.map((c) => (c.id === id ? { ...c, title } : c)));
  };

  const clearChat = (id) => {
    setChats((prev) => prev.map((c) => (c.id === id ? { ...c, messages: [] } : c)));
  };

  const activeChat = chats.find((c) => c.id === activeChatId);

  return (
    <div className="root-app">
      <Sidebar
        chats={chats}
        activeId={activeChatId}
        onSelect={(id) => setActiveChatId(id)}
        onNew={() => createChat()}
        onDelete={(id) => setChats((prev) => prev.filter((c) => c.id !== id))}
      />
      <ChatArea
        chat={activeChat}
        onSend={sendMessage}
        onUpdateTitle={(title) => updateChatTitle(activeChatId, title)}
        onClear={() => clearChat(activeChatId)}
      />
    </div>
  );
}

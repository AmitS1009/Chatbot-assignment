
# 🤖 Real-Time Chatbot with Memory

A full-stack **AI chatbot** that streams real-time responses from **Google Gemini 2.5 Flash**, built with  
**FastAPI**, **React (Vite)**, and **FAISS vector memory** for conversational context.

---

## 🧠 Overview

This project demonstrates a complete AI chatbot pipeline:
- **Frontend:** Built with React + Vite for a clean, modern chat interface.
- **Backend:** FastAPI WebSocket server enabling real-time streaming responses.
- **LLM Engine:** Google Gemini 2.5 Flash via `google-generativeai` SDK.
- **Memory:** FAISS-based semantic memory to maintain conversational context.
- **Extras:** Informal language filter, message logging, and persistent recall.

---

## 🧩 Tech Stack

| Layer | Technology | Description |
|-------|-------------|-------------|
| **Frontend** | React + Vite + Tailwind | Chat UI, WebSocket client, real-time display |
| **Backend** | FastAPI (Python) | WebSocket server handling Gemini responses |
| **AI Model** | Google Gemini 2.5 Flash | Large language model for text generation |
| **Memory** | FAISS + SentenceTransformers | Semantic recall of past user-bot messages |
| **Transport** | WebSocket | Enables real-time, token-by-token streaming |
| **Logging** | Python file logging | Saves chat transcripts to `/backend/logs` |

---

## ⚙️ Setup and Run Instructions

### 1️⃣ Clone the project
```bash
git clone <your_repo_url>
cd ChatBott
````

### 2️⃣ Backend setup

```bash
cd backend
python -m venv env
env\Scripts\activate      # (Windows)
pip install -r requirements.txt
```

Create a `.env` file in `/backend`:

```
GEMINI_API_KEY=your_google_gemini_api_key_here
```

Then run:

```bash
uvicorn main:app --reload
```

✅ You should see:

```
Uvicorn running on http://127.0.0.1:8000
```

---

### 3️⃣ Frontend setup

```bash
cd ../frontend
npm install
npm run dev
```

✅ Open browser at [http://localhost:5173](http://localhost:5173)

If backend runs on another port, update this line in `frontend/src/api.js`:

```javascript
export const WS_URL = "ws://localhost:8000/ws/chat";
```

---

## ⚡ How “Real-Time” Streaming Works

1. Frontend connects to the backend via **WebSocket** (`/ws/chat`).
2. Each user message is sent instantly — no waiting for full response.
3. Backend sends Gemini’s generated text **token-by-token** as it streams.
4. React updates the chat UI **in real time**, rendering each token as it arrives.
5. Result: smooth, continuous typing-effect output like ChatGPT.

> Implemented using `chat.send_message(prompt, stream=True)` from the Gemini SDK.

---

## 🧠 Conversational Memory (FAISS)

Unlike a stateless chatbot, this version **remembers previous context**.

* Every message (user + bot) is embedded using `SentenceTransformer("all-MiniLM-L6-v2")`.
* Embeddings are stored in a **FAISS index**.
* When a new question arrives, similar past messages are retrieved and added to the prompt.
* Gemini receives both context + new message → replies with awareness of prior conversation.

Example:

```
User: My name is Amit.
User: What is my name?
→ Bot: Your name is Amit.
```

---

## 📁 Project Structure

```
ChatBott/
│
├── backend/
│   ├── main.py
│   ├── .env
│   ├── utils/
│   │   ├── gemini_client.py
│   │   ├── memory.py
│   │   └── filters.py
│   ├── logs/chat_logs.txt
│   └── requirements.txt
│
└── frontend/
    ├── src/
    │   ├── App.jsx
    │   ├── api.js
    │   ├── main.jsx
    │   ├── assets/
    │   └── index.css
    ├── package.json
    └── vite.config.js
```

---

## 🔁 Improvements if Given More Time

If more time were available, I’d enhance this project with:

| Improvement                    | Description                                                                          |
| ------------------------------ | ------------------------------------------------------------------------------------ |
| **Multi-session Memory**       | Each user gets a separate FAISS store, persisting across sessions.                   |
| **“Clear Chat” API**           | Button to reset memory instantly for fresh conversations.                            |
| **Streaming Typing Indicator** | UI bubble that says *“Gemini is thinking...”* while streaming.                       |
| **Persistent Database**        | Save chat history in SQLite or MongoDB instead of text logs.                         |
| **Auth System**                | Simple login & personalized memory per user.                                         |
| **Deployment**                 | Host backend on Render / Railway and frontend on Vercel with `wss://` WebSocket URL. |

---

## 🧪 Example Commands Summary

```bash
# Terminal 1 – backend
cd backend
uvicorn main:app --reload

# Terminal 2 – frontend
cd frontend
npm run dev
```

Then open: **[http://localhost:5173](http://localhost:5173)**

---

## 🏁 Credits

Developed by **Amit Kushwaha**
B.Tech (CSE), IIIT Ranchi

Built with using:

* FastAPI
* React + Vite
* FAISS + SentenceTransformers
* Google Gemini API

```



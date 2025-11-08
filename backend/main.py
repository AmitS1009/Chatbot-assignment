from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime
import os
import traceback

# Import custom utilities
from utils.gemini_client import stream_gemini_response
from utils.filters import is_informal
from utils.memory import ChatMemory

# Initialize semantic memory
memory = ChatMemory()

# Initialize FastAPI app
app = FastAPI(title="Gemini Real-Time Chatbot with Memory")

# Allow frontend (Vite React) access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Ensure logs directory exists
os.makedirs("logs", exist_ok=True)

# Root route (to check if backend is alive)
@app.get("/")
async def root():
    return {"message": "Gemini Chatbot backend running with FAISS memory!"}

@app.get("/health")
async def health():
    return {"status": "ok"}

# ---- WEBSOCKET ENDPOINT ---- #
@app.websocket("/ws/chat")
async def websocket_chat(websocket: WebSocket):
    await websocket.accept()
    chat_history = []  # stores local conversation context for this session

    try:
        while True:
            # Receive message from frontend
            user_message = await websocket.receive_text()
            user_message = user_message.strip()

            # Filter informal/slang words
            if is_informal(user_message):
                await websocket.send_text(" Please use formal language.")
                continue

            # Add user message to FAISS memory
            memory.add_message(f"User: {user_message}")

            # Retrieve similar past messages for contextual recall
            context_snippets = memory.search(user_message, k=3)
            context_text = "\n".join(context_snippets)

            # Combine context + current message for better Gemini response
            enhanced_prompt = f"""
You are a helpful, formal AI assistant.
Use the following previous conversation context if relevant:
{context_text}

Now respond to this user message:
{user_message}
            """

            # Save user message to logs
            with open("logs/chat_logs.txt", "a", encoding="utf-8") as f:
                f.write(f"[{datetime.now()}] USER: {user_message}\n")

            # Stream Gemini response token by token
            bot_response = ""
            try:
                for token in stream_gemini_response(enhanced_prompt, history=chat_history):
                    bot_response += token
                    await websocket.send_text(token)
            except Exception:
                err = traceback.format_exc()
                print("Gemini Streaming Error:", err)
                await websocket.send_text(" Gemini API error. Check backend logs.")
                continue

            # Append bot reply to both FAISS and chat history
            memory.add_message(f"Bot: {bot_response}")
            chat_history.append({"role": "model", "parts": [bot_response]})

            # Save bot message to logs
            with open("logs/chat_logs.txt", "a", encoding="utf-8") as f:
                f.write(f"[{datetime.now()}] BOT: {bot_response}\n")

    except WebSocketDisconnect:
        print(" Client disconnected.")

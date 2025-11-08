import os
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

def stream_gemini_response(prompt, history=None):
    """Streams real-time response from Gemini 2.5"""
    model = genai.GenerativeModel("gemini-2.5-flash")
    chat = model.start_chat(history=history or [])
    stream = chat.send_message(prompt, stream=True)

    for chunk in stream:
        if getattr(chunk, "text", None):
            yield chunk.text

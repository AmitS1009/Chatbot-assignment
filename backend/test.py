import os
from dotenv import load_dotenv
import google.generativeai as genai

load_dotenv()  
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

MODEL_NAME = "gemini-2.5-flash"  
prompt = "Explain artificial intelligence in one short paragraph."

print(f"Using model: {MODEL_NAME}")

model = genai.GenerativeModel(MODEL_NAME)
response = model.generate_content(prompt)

print("\nResponse:\n")
print(response.text)

import faiss
import numpy as np
from sentence_transformers import SentenceTransformer

class ChatMemory:
    def __init__(self, dimension=384):
        self.model = SentenceTransformer("all-MiniLM-L6-v2")
        self.index = faiss.IndexFlatL2(dimension)
        self.texts = []

    def add_message(self, text):
        """Embed and store a message"""
        embedding = self.model.encode([text])
        self.index.add(np.array(embedding, dtype="float32"))
        self.texts.append(text)

    def search(self, query, k=3):
        """Return the most similar past messages"""
        if len(self.texts) == 0:
            return []
        embedding = self.model.encode([query])
        D, I = self.index.search(np.array(embedding, dtype="float32"), k)
        return [self.texts[i] for i in I[0] if i < len(self.texts)]

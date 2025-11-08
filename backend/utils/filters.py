INFORMAL_WORDS = ["bro", "bruh", "dude", "lol", "omg", "btw", "gonna", "wanna", "yaar", "abe"]

def is_informal(text):
    text_lower = text.lower()
    return any(word in text_lower for word in INFORMAL_WORDS)

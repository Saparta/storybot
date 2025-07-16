import re

def clean_text(text: str, max_length=300) -> str:
    text = re.sub(r'[*[]()_`#>+]', '', text)  # Remove markdown
    text = re.sub(r'httpS+', '', text)  # Remove links
    text = re.sub(r'\n+', ' ', text)  # Flatten newlines
    return text.strip()[:max_length] + ("..." if len(text) > max_length else "")

def format_caption(title: str, body: str) -> str:
    return f"{title.strip().upper()}\n\n{clean_text(body)}"
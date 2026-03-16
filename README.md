# Storybot 🎥🤖

Storybot is a full-stack web application that automatically transforms Reddit stories into short-form videos, complete with AI voiceovers, background gameplay clips, and captions.  

Designed for creators who want to publish consistent, engaging content on platforms like Instagram Reels, TikTok, and YouTube Shorts — Storybot handles the entire pipeline from scraping to rendering.

---

## 🚀 Features

- **Reddit Scraper** → Pulls trending or custom Reddit posts (title + body) via Reddit API.  
- **AI Voiceover** → Converts text to natural-sounding narration.  
- **Background Video Selector** → Automatically fetches gameplay or stock clips (e.g., GTA ramps, Minecraft parkour, FailArmy).  
- **Video Composition** → Merges voiceover + background + captions into a polished vertical short (1080x1920).  
- **Content Cleaning** → Removes unwanted text (usernames, links, profanity if configured).  
- **Batch Mode** → Queue and generate multiple stories at once.  
- **Web Interface** → Dashboard to start jobs, preview results, and download videos.

---

## 🛠️ Tech Stack

**Frontend**  
- React + Vite + TailwindCSS  
- Custom color palette:  
  - `#2ba7d0` (blue)  
  - `#793200` (brown)  
  - `#ffeace` (cream)  
  - `#8f7158` (tan)  
- Authentication (planned) for managing queues and downloads  

**Backend**  
- Node.js + Express  
- REST APIs for each pipeline stage:  
  - `/fetch-posts` → Reddit scraper  
  - `/text-to-speech` → AI voiceover  
  - `/search-video` → Background clips  
  - `/compose-video` → Final rendering  

**Other Components**  
- **Reddit API (OAuth)** for fetching posts  
- **FFmpeg** for audio/video processing  
- **Docker Compose** for containerized frontend + backend  
- (Optional) Python CLI for local experiments  

---

## 📂 Project Structure

storybot/
│
├── backend/ # Express API services
│ ├── routes/ # Reddit, TTS, Video, Compose endpoints
│ ├── services/ # Core logic for scraping and processing
│ └── Dockerfile
│
├── frontend/ # React + Vite app
│ ├── src/
│ │ ├── components # UI widgets
│ │ ├── pages # Dashboard views
│ │ └── assets # Logo, styles
│ └── Dockerfile
│
├── docker-compose.yml
└── README.md

---

## ⚡ Getting Started

### Prerequisites
- Node.js (>= 18)  
- Docker & Docker Compose  
- Reddit API credentials (Client ID + Secret)  
- FFmpeg installed locally (for testing outside Docker)

### Setup

1. Clone the repository:

### 🖥️ Dedicated website launcher + shortcut

You can now run Storybot like a desktop app launcher (similar to an `.exe`/`.dmg` experience):

1. Install dependencies:
   ```bash
   npm run setup
   ```
2. Start both backend + frontend and auto-open the website:
   ```bash
   npm run desktop
   ```

Shortcut files are included in `shortcuts/`:
- `start-storybot.sh` (Linux/macOS terminal launcher)
- `start-storybot.bat` (Windows launcher)
- `Storybot.desktop` (Linux desktop shortcut)

This launcher starts both services and opens `http://127.0.0.1:5173`.

   ```bash
   git clone https://github.com/your-username/storybot.git
   cd storybot


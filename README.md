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
   ```bash
   git clone https://github.com/your-username/storybot.git
   cd storybot


## 📈 Manager Next Steps for Scaling Reddit-to-Video Automation

If Storybot is already converting Reddit posts into videos successfully, the next management priorities are reliability, growth, and monetization.

### 1) Stabilize Operations (Weeks 1-2)
- Define key SLAs: generation success rate, average render time, and failed job recovery time.
- Add centralized monitoring and alerting for each pipeline stage (scrape → TTS → clip fetch → compose → publish).
- Build retry and dead-letter handling for failed jobs so creators don't lose throughput.

### 2) Protect Platform Compliance (Weeks 1-3)
- Add policy checks for subreddit/source eligibility, content safety, and platform-specific posting rules.
- Formalize rights usage for background footage, music, and voice models.
- Create an incident playbook for takedowns, strikes, or API suspension events.

### 3) Improve Content Quality with Data (Weeks 2-6)
- Track hook quality (first 3 seconds), retention checkpoints, watch completion, and CTR by niche.
- Run A/B tests on voice style, subtitle templates, pacing, and clip categories.
- Establish a weekly quality review loop with clear accept/reject criteria.

### 4) Increase Throughput and Cost Efficiency (Weeks 3-8)
- Introduce queue prioritization (high-value channels first) and autoscaling workers.
- Cache reusable assets (intro/outro, caption themes, common clips) to reduce render time.
- Set cost budgets per video and alert when API or compute spend exceeds target.

### 5) Build a Distribution Flywheel (Weeks 4-10)
- Add one-click multi-platform scheduling (YouTube Shorts, TikTok, Reels).
- Standardize metadata generation (titles, descriptions, hashtags) per platform.
- Repackage top performers into derivative assets (compilations, reposts, alt hooks).

### 6) Move from Tool to Business (Weeks 6-12)
- Define packaging: internal studio tool vs SaaS offer vs agency service.
- Create a KPI dashboard for MRR, customer acquisition cost, gross margin, and churn.
- Assign ownership by function: product, reliability engineering, content ops, growth, and compliance.

### Suggested Operating Cadence
- Daily: pipeline health + failed jobs + publishing queue.
- Weekly: experiment results + top/bottom performers + cost/performance review.
- Monthly: roadmap reset based on revenue, retention, and platform changes.

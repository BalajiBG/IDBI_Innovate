# WealthSeva AI — IDBI Innovate Hackathon 2026

> Avatar-driven, vernacular-first AI Wealth Advisory Platform for IDBI Bank.
> Powered by AWS Bedrock (Claude), Amazon Polly, and D-ID.

## Quick Start

### 1. Install Dependencies

```bash
# Backend
cd server
npm install

# Frontend
cd ../client
npm install
```

### 2. Configure Environment

Copy `server/.env.example` to `server/.env` and add your AWS credentials:

```env
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your-key
AWS_SECRET_ACCESS_KEY=your-secret
```

> **Note:** The app works without AWS credentials — it uses intelligent fallback responses.

### 3. Run the App

```bash
# Terminal 1 — Backend
cd server
npm run dev

# Terminal 2 — Frontend
cd client
npm run dev
```

Open http://localhost:5173

### 4. Demo Login

- Customer ID: `IDBI-2024-RK001` (or any text)
- PIN: `1234` (or any 4+ digits)

## Demo Flow (for Judges)

1. Login → Dashboard loads with WealthVitals score animating to 61
2. Nudge notification appears after 5 seconds (proactive AI)
3. Navigate to **Chat** → Tap "Mera paisa kahan ja raha hai?"
4. Avatar responds in Hinglish with spending insight
5. Navigate to **Spending** → Charts show behavioral analysis
6. Navigate to **Goals** → Shows child education gap
7. Navigate to **Products** → SIP recommendation with urgency

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React (Vite) + Tailwind CSS |
| Backend | Node.js + Express |
| AI Brain | AWS Bedrock (Claude Sonnet) |
| Voice | Amazon Polly (Aditi/hi-IN) |
| Avatar | D-ID REST API |
| Charts | Recharts |
| Data | In-memory mock JSON |

## Key Differentiators

- **Vernacular-First**: Natural Hinglish responses for Tier 2/3 accessibility
- **Behavioral Archetypes**: AI classifies spending patterns (Family Builder, etc.)
- **WealthVitals Score**: Gamified financial health metric (0-100)
- **Proactive Nudges**: Context-aware notifications (salary day, overspending)
- **Avatar UX**: Conversational avatar makes it feel like personal RM

## Team

IDBI Innovate 2026 × Hack2Skill × AWS

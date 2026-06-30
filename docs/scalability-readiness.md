# WealthSeva AI — Scalability & Integration Readiness

## Current Architecture (Hackathon Demo)

```
┌────────────────┐     REST API      ┌─────────────────────┐
│  React SPA     │ ──────────────── │  Express Server      │
│  (Vite build)  │                   │                     │
│                │                   │  /api/auth          │ → Auth logic
│  - Pages       │                   │  /api/chat          │ → Bedrock AI
│  - Components  │                   │  /api/data          │ → Data layer
│  - Context     │                   │  /api/avatar        │ → Polly/D-ID
│                │                   │  /api/help          │ → Help AI
└────────────────┘                   └─────────┬───────────┘
                                               │
                                    ┌──────────▼──────────┐
                                    │  Service Layer       │
                                    │  - bedrockService.js │
                                    │  - pollyService.js   │
                                    │  - didService.js     │
                                    └──────────┬───────────┘
                                               │
                                    ┌──────────▼──────────┐
                                    │  Data Layer          │
                                    │  - mockData.js       │
                                    │  - In-memory store   │
                                    └─────────────────────┘
```

## Why This is Scale-Ready

### 1. API-First Design
Every feature communicates through well-defined REST endpoints. The frontend doesn't know or care if the backend is Express, Lambda, or Java Spring — it just calls `/api/chat`.

**To scale:** Replace Express routes with API Gateway + Lambda. Zero frontend changes.

### 2. Domain-Separated Routes
```
/api/auth      → Authentication (swap to Cognito)
/api/chat      → AI Advisory (swap to dedicated Lambda)
/api/data      → Customer data (swap to DynamoDB)
/api/avatar    → Voice/Video (swap to dedicated service)
/api/help      → Help system (merge into chat)
```

Each route file is an independent domain. Split into microservices = move each file to its own Lambda/container.

### 3. Service Abstraction
```
bedrockService.js  → Only file that talks to AWS Bedrock
pollyService.js    → Only file that talks to Polly
didService.js      → Only file that talks to D-ID
```

**To change AI provider:** Edit ONE file. Frontend and routes don't change.
**To add OpenAI as fallback:** Add `openaiService.js`, update `bedrockService.js` to try Bedrock first, fall back to OpenAI.

### 4. Data Layer Independence
Currently: In-memory JavaScript objects.
To migrate to DynamoDB/PostgreSQL: 
- Replace `mockData.js` with database queries
- Replace in-memory arrays with DB calls in `data.js` route
- Frontend: ZERO changes (same API contracts)

### 5. Frontend is a Static Build
`npm run build` → produces static HTML/JS/CSS.
- Host on S3 + CloudFront for global CDN
- Or embed in mobile app WebView
- Or serve from any backend (Express, Nginx, Lambda@Edge)

---

## Integration Points (External Systems)

| Integration | Current | Production Path |
|-------------|---------|-----------------|
| Core Banking (account data) | Mock JSON | REST API adapter to bank's CBS |
| KYC/Aadhaar | Not needed (demo) | DigiLocker API / eKYC |
| Account Aggregator | Simulated | RBI-approved AA framework (Setu/Onemoney) |
| UPI/Payments | "Pay Now" button (UI only) | NPCI UPI SDK |
| Credit Bureau | Mock score | CIBIL/Experian API |
| Insurance Aggregator | Manual entry | IIB/Policybazaar API |
| Stock Brokers | Manual entry | Broker APIs (Zerodha Kite, etc.) |
| Push Notifications | Nudge card (in-app) | AWS SNS → FCM/APNs |
| SMS/WhatsApp | "Reach Us" links | AWS SNS / WhatsApp Business API |

---

## Microservices Migration Path

### Phase 1 (Week 1-2): Split Backend
```
Express Monolith → API Gateway + 5 Lambdas

/api/auth     → Lambda (auth-service)
/api/chat     → Lambda (ai-advisory-service)
/api/data/*   → Lambda (data-service)
/api/avatar   → ECS Fargate (avatar-service) — needs persistent connections
/api/help     → Merge into chat Lambda
```

### Phase 2 (Week 3-4): Add Database
```
In-memory store → DynamoDB

Tables:
- customers (profile, preferences)
- transactions (from core banking sync)
- goals (custom savings plans)
- portfolioLinked (external accounts)
- insurances
- assets
- otherIncome
- conversations (chat history, TTL 24h)
```

### Phase 3 (Week 5-6): Add Event-Driven
```
Direct calls → EventBridge + Async Processing

Events:
- salary_credited → trigger nudge
- goal_created → recalculate score
- investment_added → update portfolio view
- bill_overdue → send notification
```

---

## Technology Swap Guide

| Current Tech | Can Swap To | Impact |
|-------------|-------------|--------|
| Express.js | FastAPI (Python), Spring Boot (Java) | Rewrite routes, keep API contracts |
| React | React Native, Flutter | Rewrite UI, keep all APIs |
| AWS Bedrock | Azure OpenAI, Google Vertex AI | Change ONE service file |
| In-memory store | DynamoDB, PostgreSQL, MongoDB | Change data.js route file |
| JWT auth | AWS Cognito, Auth0, IDBI SSO | Change auth.js route |
| Single server | Kubernetes, ECS, Lambda | Deploy artifacts differently |

**Key principle:** The API contract between frontend and backend NEVER changes. Swap anything behind it.

---

## What Judges Should Take Away

1. **Demo works today** — fully functional prototype
2. **Architecture is clean** — separation of concerns, no spaghetti
3. **Scale path is clear** — documented migration from monolith → microservices
4. **Integration-ready** — well-defined API boundaries for core banking, AA, KYC
5. **Technology-agnostic** — can swap any layer without rebuilding everything
6. **Production document exists** — `docs/production-architecture.md` has the full blueprint

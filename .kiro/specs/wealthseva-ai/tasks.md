# WealthSeva AI — Implementation Tasks

## Task 1: Project Scaffolding & Configuration
- [ ] Initialize client with Vite + React
- [ ] Configure Tailwind CSS with custom theme (IDBI colors, fonts)
- [ ] Initialize server with Express
- [ ] Set up project scripts (dev, build, start)
- [ ] Create `.env.example` with all required variables
- [ ] Configure Vite proxy for API calls during development
- [ ] Add Google Fonts (Inter + Noto Sans Devanagari) to index.html

## Task 2: Mock Data Layer
- [ ] Create `server/data/mockData.js` with customer profile
- [ ] Generate 80-100 transaction entries across 6 months
- [ ] Add portfolio summary data
- [ ] Add product recommendations data
- [ ] Add WealthVitals score breakdown
- [ ] Add monthly spend breakdown aggregation
- [ ] Create data API routes (GET /api/customer, /api/transactions, /api/portfolio, /api/products)

## Task 3: Login Page
- [ ] Build LoginPage component with IDBI branding
- [ ] Add Customer ID + PIN inputs (mock validation)
- [ ] Create AuthContext provider
- [ ] Implement route protection (redirect to login if not authenticated)
- [ ] Style with IDBI red/navy color scheme

## Task 4: Dashboard Page
- [ ] Build Header component (greeting + avatar icon + status pill)
- [ ] Build WealthVitalsGauge (SVG circular gauge with animation)
- [ ] Build sub-score horizontal bars
- [ ] Build QuickStatsRow (4 stat cards)
- [ ] Build BottomNav tab navigation
- [ ] Integrate Seva comment below score
- [ ] Wire up data from API

## Task 5: Proactive Nudge Component
- [ ] Build NudgeNotification floating component
- [ ] Add 5-second delay timer on dashboard mount
- [ ] Implement "Haan, Karo" success animation
- [ ] Implement "Baad Mein" dismiss behavior
- [ ] Style as floating notification card

## Task 6: Chat with Seva — UI
- [ ] Build ChatPage layout (70/30 split)
- [ ] Build AvatarDisplay component (circular with pulse animation)
- [ ] Build SoundWave animation component
- [ ] Build TypewriterText component
- [ ] Build ChatInput (text field + mic icon + send button)
- [ ] Build QuickPromptChips (4 suggestion buttons)
- [ ] Create ChatContext provider for conversation state

## Task 7: Chat with Seva — Backend (Bedrock Integration)
- [ ] Create bedrockService.js with AWS SDK setup
- [ ] Implement buildSystemPrompt() with customer context
- [ ] Implement getSevaResponse() calling Claude Sonnet
- [ ] Create POST /api/chat route
- [ ] Add conversation history management
- [ ] Add fallback response if Bedrock is unavailable

## Task 8: Avatar & Voice (Optional Enhancement)
- [ ] Create didService.js (D-ID API integration)
- [ ] Create POST /api/avatar route
- [ ] Create pollyService.js (Amazon Polly integration)
- [ ] Create POST /api/polly route
- [ ] Wire AvatarDisplay to show D-ID video when available
- [ ] Add audio playback for Polly responses
- [ ] Graceful fallback when APIs unavailable

## Task 9: Spending Insights Page
- [ ] Build SpendingPage layout
- [ ] Build ArchetypeBadge component
- [ ] Build DonutChart with Recharts (Indian color palette)
- [ ] Build TrendLineChart (6-month, top 3 categories)
- [ ] Build InsightCards (3 cards, horizontal scroll)
- [ ] Wire chart data from transactions API

## Task 10: Goals Tracker Page
- [ ] Build GoalsPage layout
- [ ] Build GoalCard component (icon, progress bar, SIP, Seva comment, CTA)
- [ ] Render Child Education card with data
- [ ] Render Emergency Fund card with data
- [ ] Render Retirement card with data
- [ ] Build "Add New Goal" button (UI only)
- [ ] Calculate required monthly SIP for each goal

## Task 11: Products Recommendations Page
- [ ] Build ProductsPage layout
- [ ] Build ProductCard component (icon, priority badge, reason, benefit, CTA)
- [ ] Render 4 product cards with personalized data
- [ ] Style priority badges (color-coded: red/amber/blue)
- [ ] Add CTA button interactions (toast/modal confirmation)

## Task 12: Polish & Demo Flow
- [ ] Add page transition animations
- [ ] Ensure responsive layout (mobile-first)
- [ ] Test full demo flow (Login → Dashboard → Chat → Spending → Goals → Products)
- [ ] Add loading states and error handling
- [ ] Verify Indian currency formatting throughout
- [ ] Final visual pass against design system colors/typography

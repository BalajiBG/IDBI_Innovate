# WealthSeva AI — Production Architecture (AWS-Native Microservices)

> This document describes the production-scale architecture for deploying WealthSeva AI
> as an enterprise-grade platform for IDBI Bank's 10 Cr+ customer base.

---

## 1. High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                          CLIENTS                                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐                  │
│  │ IDBI Mobile  │  │ Web App      │  │ WhatsApp Bot │                  │
│  │ App (React   │  │ (React SPA)  │  │ (Future)     │                  │
│  │ Native)      │  │              │  │              │                  │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘                  │
└─────────┼──────────────────┼──────────────────┼─────────────────────────┘
          │                  │                  │
          ▼                  ▼                  ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                     AWS CLOUDFRONT (CDN)                                  │
│  - Static React assets served from S3                                    │
│  - Edge caching for API responses (short TTL)                           │
│  - DDoS protection via AWS Shield                                       │
└──────────────────────────────┬──────────────────────────────────────────┘
                               │
┌──────────────────────────────▼──────────────────────────────────────────┐
│                     AWS API GATEWAY (REST)                                │
│  - Request routing to microservices                                      │
│  - JWT validation (Cognito / IDBI SSO)                                  │
│  - Rate limiting (per customer, per endpoint)                           │
│  - Request/response transformation                                       │
│  - AWS WAF integration (SQL injection, XSS protection)                  │
│  - Usage plans (free tier vs premium customers)                          │
└──────────────────────────────┬──────────────────────────────────────────┘
                               │
          ┌────────────────────┼────────────────────┐
          │                    │                    │
          ▼                    ▼                    ▼
┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│  AUTH SERVICE   │ │  AI ADVISORY    │ │  AVATAR/VOICE   │
│  (Lambda)       │ │  SERVICE        │ │  SERVICE        │
│                 │ │  (Lambda)       │ │  (ECS Fargate)  │
│ - Cognito      │ │                 │ │                 │
│ - IDBI SSO     │ │ - Bedrock       │ │ - Polly (TTS)   │
│ - MFA          │ │ - Conv. memory  │ │ - D-ID stream   │
│ - Token mgmt   │ │ - Intent detect │ │ - WebSocket     │
└────────┬────────┘ └────────┬────────┘ └────────┬────────┘
         │                   │                   │
         ▼                   ▼                   ▼
┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│  CUSTOMER       │ │  SPENDING       │ │  GOALS & SIP    │
│  PROFILE        │ │  INTELLIGENCE   │ │  ENGINE         │
│  (ECS Fargate)  │ │  (Lambda)       │ │  (Lambda)       │
│                 │ │                 │ │                 │
│ - Core Banking  │ │ - Transaction   │ │ - Goal CRUD     │
│   API adapter   │ │   analysis      │ │ - SIP calc      │
│ - Profile cache │ │ - Archetype ML  │ │ - Projections   │
│ - Preferences   │ │ - Anomaly det.  │ │ - Reminders     │
└────────┬────────┘ └────────┬────────┘ └────────┬────────┘
         │                   │                   │
         ▼                   ▼                   ▼
┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│  PRODUCT        │ │  NUDGE ENGINE   │ │  ANALYTICS &    │
│  RECOMMENDATION │ │  (EventBridge   │ │  REPORTING      │
│  (Lambda)       │ │   + Lambda)     │ │  (Kinesis +     │
│                 │ │                 │ │   Redshift)     │
│ - Gap analysis  │ │ - Event-driven  │ │                 │
│ - Personalize   │ │ - Scheduled     │ │ - Behavioral    │
│ - Scoring       │ │ - Push notif.   │ │ - Dashboards    │
└─────────────────┘ └─────────────────┘ └─────────────────┘
```

---

## 2. Service Breakdown

### 2.1 Auth Service (AWS Lambda + Cognito)

| Aspect | Detail |
|--------|--------|
| **Compute** | Lambda (Node.js 20.x) |
| **Auth Provider** | Amazon Cognito User Pool + IDBI SSO Federation |
| **MFA** | SMS OTP via Amazon SNS |
| **Token** | JWT (RS256), 15-min access + 7-day refresh |
| **Storage** | Cognito managed (no separate DB) |
| **Scale** | Cognito supports 40M+ users natively |

### 2.2 AI Advisory Service (AWS Lambda + Bedrock)

| Aspect | Detail |
|--------|--------|
| **Compute** | Lambda (Node.js 20.x, 512MB, 30s timeout) |
| **AI Model** | AWS Bedrock — Claude Sonnet (anthropic.claude-sonnet-4-6) |
| **Conversation Memory** | DynamoDB (TTL: 24 hours per session) |
| **System Prompt** | Assembled per-request from customer context |
| **Guardrails** | Bedrock Guardrails (no stock tips, no crypto, PII filtering) |
| **Fallback** | Pre-computed responses from DynamoDB if Bedrock times out |
| **Cost Control** | Max 300 tokens/response, rate limit 20 req/min/customer |
| **Multi-language** | Language code in request → switches system prompt language |

### 2.3 Avatar & Voice Service (ECS Fargate)

| Aspect | Detail |
|--------|--------|
| **Compute** | ECS Fargate (2 vCPU, 4GB RAM) — needs persistent connections |
| **TTS** | Amazon Polly Neural (Aditi-hi-IN, Raveena-en-IN, future: Kannada) |
| **Avatar** | D-ID streaming API or Amazon Bedrock multimodal (future) |
| **Delivery** | WebSocket via API Gateway for real-time streaming |
| **Caching** | ElastiCache Redis — cache common phrase audio (greetings, etc.) |
| **Fallback** | If D-ID down → Polly audio + CSS lip-sync animation |

### 2.4 Customer Profile Service (ECS Fargate)

| Aspect | Detail |
|--------|--------|
| **Compute** | ECS Fargate (always-on, connection pooling to core banking) |
| **Integration** | IDBI Core Banking API (REST/SOAP adapter) |
| **Cache** | ElastiCache Redis (5-min TTL for profile, 1-min for balance) |
| **Storage** | DynamoDB (preferences, language, archetype, score history) |
| **Why Fargate?** | Persistent connection pool to bank's internal APIs, not Lambda-friendly |

### 2.5 Spending Intelligence Service (AWS Lambda)

| Aspect | Detail |
|--------|--------|
| **Compute** | Lambda (triggered by API + scheduled EventBridge) |
| **Data Source** | DynamoDB (transaction mirror from core banking) |
| **ML** | SageMaker endpoint for archetype classification (batch retrain weekly) |
| **Analysis** | Category aggregation, MoM trends, anomaly detection |
| **Output** | Insight cards, archetype badge, spending alerts |

### 2.6 Goals & SIP Engine (AWS Lambda)

| Aspect | Detail |
|--------|--------|
| **Compute** | Lambda |
| **Storage** | DynamoDB (goals table, partitioned by customerId) |
| **Calculations** | SIP projection, compound interest, step-up SIP |
| **Events** | Publishes to EventBridge on goal creation/milestone |
| **Notifications** | Triggers nudge engine when goal deadline < 3 months |

### 2.7 Product Recommendation Engine (AWS Lambda + Personalize)

| Aspect | Detail |
|--------|--------|
| **Compute** | Lambda |
| **ML** | AWS Personalize (collaborative filtering on customer segments) |
| **Rules Engine** | Gap analysis (missing insurance, no equity, no PPF) |
| **Scoring** | Match score based on age, income, risk profile, goals |
| **Priority** | Rules-based urgency (no insurance = URGENT, no PPF = MEDIUM) |
| **Storage** | DynamoDB (product catalog, interaction history) |

### 2.8 Nudge Engine (Amazon EventBridge + Lambda)

| Aspect | Detail |
|--------|--------|
| **Trigger Sources** | EventBridge rules (scheduled + event-driven) |
| **Events** | salary_credited, goal_deadline_near, overspend_detected, sip_missed |
| **Delivery** | Amazon SNS → Push notification (FCM/APNs) |
| **Personalization** | Bedrock generates nudge text in customer's preferred language |
| **Frequency Control** | Max 2 nudges/day, cooldown per category (DynamoDB tracking) |
| **A/B Testing** | Multiple nudge variants, track open/action rates |

### 2.9 Analytics & Reporting (Kinesis + Redshift)

| Aspect | Detail |
|--------|--------|
| **Ingestion** | Kinesis Data Streams (all user interactions) |
| **Processing** | Kinesis Data Firehose → S3 (raw) + Redshift (aggregated) |
| **Dashboards** | Amazon QuickSight (ops team visibility) |
| **ML Pipeline** | SageMaker (retrain archetype model, recommendation model) |
| **Metrics** | DAU, nudge conversion rate, SIP starts, score improvements |

---

## 3. Data Architecture

### 3.1 DynamoDB Tables

| Table | Partition Key | Sort Key | Purpose |
|-------|--------------|----------|---------|
| `customers` | customerId | — | Profile, preferences, language |
| `transactions` | customerId | date#txnId | Transaction history |
| `conversations` | sessionId | timestamp | Chat history (TTL: 24h) |
| `goals` | customerId | goalId | Financial goals |
| `scores` | customerId | date | WealthVitals score history |
| `nudges` | customerId | nudgeId | Nudge delivery log |
| `products` | productId | — | Product catalog |
| `interactions` | customerId | timestamp#productId | User-product interactions |

### 3.2 Data Flow

```
Core Banking ──► Transaction Sync (EventBridge) ──► DynamoDB [transactions]
                                                          │
                                                          ▼
                                                   Spending Intelligence
                                                          │
                                                          ▼
                                                   WealthVitals Score ──► DynamoDB [scores]
                                                          │
                                                          ▼
                                                   Nudge Engine ──► SNS ──► Push Notification
```

---

## 4. Security & Compliance (Banking Grade)

### 4.1 Data Protection

| Layer | Mechanism |
|-------|-----------|
| **In Transit** | TLS 1.3 everywhere (CloudFront → API GW → Services) |
| **At Rest** | AES-256 via AWS KMS (all DynamoDB, S3, Redshift) |
| **PII Fields** | Field-level encryption (Aadhaar, PAN, phone — encrypted column in DynamoDB) |
| **Data Residency** | All resources in ap-south-1 (Mumbai). No cross-region replication. |
| **Key Management** | Customer-managed KMS keys, auto-rotation every 365 days |

### 4.2 Access Control

| Layer | Mechanism |
|-------|-----------|
| **Customer Auth** | Cognito + IDBI SSO (SAML 2.0 federation) |
| **Service-to-Service** | IAM roles (no hardcoded credentials, ever) |
| **API Access** | API Gateway resource policies + Lambda authorizers |
| **Admin Access** | AWS SSO, MFA enforced, least-privilege IAM policies |
| **Secrets** | AWS Secrets Manager (D-ID key, external API keys) |

### 4.3 Audit & Compliance

| Requirement | Solution |
|-------------|----------|
| **RBI Data Localization** | All data in India (ap-south-1 only) |
| **Audit Trail** | CloudTrail (all API calls), Bedrock invocation logs to S3 |
| **AI Explainability** | Every Bedrock call logged with input/output for audit |
| **Consent Management** | DynamoDB consent table (DPDP Act compliance) |
| **Right to Erasure** | Lambda function to purge all customer data across tables |
| **SOC 2 / ISO 27001** | AWS services are pre-certified; application layer audited separately |

### 4.4 AI Safety Guardrails

| Risk | Mitigation |
|------|-----------|
| **Investment advice liability** | System prompt: "informational only, not SEBI-registered advice" |
| **Hallucination** | Ground all responses in actual customer data (no speculation) |
| **Prompt injection** | Bedrock Guardrails + input sanitization Lambda |
| **Bias** | Regular audit of recommendations across demographics |
| **PII leakage** | Bedrock Guardrails PII filter (auto-mask Aadhaar, PAN in output) |

---

## 5. Scalability Estimates

| Metric | Capacity |
|--------|----------|
| **Concurrent users** | 500,000+ (Lambda auto-scales) |
| **Chat requests/sec** | 10,000+ (Bedrock provisioned throughput) |
| **Transaction ingestion** | 1M+ events/hour (Kinesis) |
| **Avatar sessions** | 5,000 concurrent (ECS auto-scaling) |
| **Storage** | Unlimited (DynamoDB on-demand) |
| **Nudge delivery** | 10M pushes/day (SNS) |

### Auto-Scaling Strategy

```
API Gateway → No scaling needed (managed)
Lambda      → 0 to 10,000 concurrent in seconds
ECS Fargate → Min 2 tasks, max 50 tasks (CPU-based scaling)
DynamoDB    → On-demand mode (pay per request, auto-scales)
Kinesis     → Shard splitting based on throughput
```

---

## 6. Cost Estimation (Monthly)

| Service | Usage Assumption | Estimated Cost |
|---------|-----------------|---------------|
| Lambda | 50M invocations, 128-512MB | ₹25,000 |
| Bedrock (Claude) | 5M chat calls, avg 500 tokens | ₹3,00,000 |
| DynamoDB | 100M reads, 20M writes (on-demand) | ₹40,000 |
| ECS Fargate | 4 tasks × 2vCPU × 24/7 | ₹60,000 |
| Polly | 2M speech requests | ₹15,000 |
| D-ID | 500K video minutes | ₹2,50,000 |
| CloudFront | 500GB transfer | ₹5,000 |
| ElastiCache | r6g.large (1 node) | ₹20,000 |
| Other (KMS, SNS, EventBridge) | — | ₹10,000 |
| **Total** | | **~₹7,25,000/month** |

> Cost reduces significantly with reserved capacity and Bedrock batch inference for nudges.

---

## 7. Deployment & CI/CD

```
GitHub → AWS CodePipeline → CodeBuild → Deploy
                                           │
                    ┌──────────────────────┼──────────────────────┐
                    │                      │                      │
              Lambda (SAM)         ECS (Docker)          React (S3)
              
Environments: dev → staging → production (blue-green for ECS)
IaC: AWS CDK (TypeScript) for all infrastructure
```

### Infrastructure as Code (AWS CDK)

```typescript
// Example: AI Advisory Service Stack
const aiAdvisoryFn = new lambda.Function(this, 'AIAdvisory', {
  runtime: lambda.Runtime.NODEJS_20_X,
  handler: 'index.handler',
  memorySize: 512,
  timeout: Duration.seconds(30),
  environment: {
    BEDROCK_MODEL: 'anthropic.claude-sonnet-4-6-20250514-v1:0',
    CONVERSATIONS_TABLE: conversationsTable.tableName,
  },
});

bedrockPolicy.attachToRole(aiAdvisoryFn.role);
conversationsTable.grantReadWriteData(aiAdvisoryFn);
```

---

## 8. Monitoring & Observability

| Layer | Tool |
|-------|------|
| **Metrics** | CloudWatch (latency, errors, throttles per service) |
| **Logs** | CloudWatch Logs (structured JSON, 30-day retention) |
| **Traces** | AWS X-Ray (end-to-end request tracing across services) |
| **Alerts** | CloudWatch Alarms → SNS → PagerDuty/Slack |
| **Dashboards** | CloudWatch Dashboard (real-time ops view) |
| **AI Monitoring** | Bedrock invocation metrics (latency, token usage, errors) |

### Key Alarms

- Bedrock latency > 5s → alert
- Error rate > 1% on any Lambda → alert
- DynamoDB throttling → alert
- ECS task count < min → alert
- Nudge delivery failure rate > 5% → alert

---

## 9. Migration Path (Hackathon → Production)

| Phase | Timeline | Scope |
|-------|----------|-------|
| **Phase 1** | Month 1-2 | Deploy current monolith on ECS, add Cognito auth, connect real core banking API |
| **Phase 2** | Month 2-3 | Split into Lambda microservices, add DynamoDB, real transaction sync |
| **Phase 3** | Month 3-4 | Add Nudge Engine (EventBridge), Product ML (Personalize), Analytics (Kinesis) |
| **Phase 4** | Month 4-5 | Multi-language expansion (Tamil, Telugu, Marathi), WhatsApp channel |
| **Phase 5** | Month 5-6 | Production hardening — penetration testing, load testing, RBI compliance audit |

---

## 10. Differentiators for IDBI

| Feature | Why It Matters |
|---------|---------------|
| **Vernacular-first** | 70% of India doesn't prefer English for financial decisions |
| **Behavioral intelligence** | Not just data display — understands WHY customers spend |
| **Proactive, not reactive** | Nudges at the right moment (salary day, overspend detected) |
| **Avatar UX** | Makes financial advice feel human and trustworthy |
| **Gamified score** | Drives engagement and repeat usage |
| **AWS-native** | No vendor lock-in within AWS; leverages managed services for compliance |
| **Zero-server ops** | Bank's IT team manages configs, not servers |

---

*Document Version: 1.0 | Created: June 2026 | For: IDBI Innovate Hackathon Submission*

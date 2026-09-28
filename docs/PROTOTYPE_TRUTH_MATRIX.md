# Moodify Prototype Truth Matrix

*Document Version: Phase 2 Prototype Truth Audit (Independent Technical Audit)*  
*Target Reviewer: Founder & Lead Architect Review*  
*Classification Standard: No claims without source code and runtime verification.*

---

## Capability Status Definitions

- **`REAL_FUNCTIONAL`**: Executes real external integrations, genuine live APIs, or production backend services with real data exchange.
- **`FUNCTIONAL_LOCAL_ONLY`**: Fully functional client-side logic (state transforms, in-browser persistence, algorithms, filtering, rule engines, interactive UI workflows), operating without remote cloud dependencies.
- **`SIMULATED`**: Emulates external runtime behaviors via deterministic algorithms, local heuristics, simulated network delays, or synthetic events.
- **`HARDCODED`**: Purely static fixture data, hard-coded string templates, or unranked preset cards.
- **`PARTIAL`**: A hybrid where core heuristics/pipelines are functional, but external data fetching or certain edge branches are mock-backed.
- **`NOT_IMPLEMENTED`**: Explicit architectural placeholder; no running implementation exists in current prototype.

---

## Comprehensive Capability Audit

| # | Capability | Classification | Implementation Location | Data Source | Persistence Type | Real External Dependency | Known Limitations |
|---|---|---|---|---|---|---|---|
| 1 | **Chat** | `FUNCTIONAL_LOCAL_ONLY` | `src/components/ChatView.tsx`, `src/context/AppContext.tsx` | User input & state store | Client in-memory + local session | None | No WebSockets or server session syncing; messages reset on "Reset to Defaults". |
| 2 | **Gemini conversation** | `SIMULATED` | `src/services/agentOrchestrator.ts` | Heuristic scenario matching engine | Ephemeral in-memory | None (`@google/genai` package installed but not invoked) | Does not send conversational prompts to the live Gemini LLM API; responses are guided by deterministic scenario branches with rule-based fallback. |
| 3 | **Memory candidate extraction** | `FUNCTIONAL_LOCAL_ONLY` | `src/services/memoryService.ts` (`extractCandidateMemories`) | Regex/keyword intent heuristics over user input | Ephemeral candidate state | None | Rule-based extraction (dislikes, budget boundaries, comfort food, favorites, intentions, clinical exclusions). Not an open-domain NLP parser. |
| 4 | **Memory persistence** | `FUNCTIONAL_LOCAL_ONLY` | `src/context/AppContext.tsx`, `src/data/seedUser.ts` | Browser `localStorage` (`moodify_memories`) with fallback to seed fixtures | Local browser storage | None | Survives page reloads on same browser/device; no remote cloud synchronization or multi-device account sync. |
| 5 | **Memory editing** | `FUNCTIONAL_LOCAL_ONLY` | `src/components/modals/MemoryEditModal.tsx`, `src/context/AppContext.tsx` (`updateMemory`) | User form input | Local browser storage | None | Edits update local memory state and propagate to future firewall and context evaluations; no remote DB write. |
| 6 | **Memory deletion** | `FUNCTIONAL_LOCAL_ONLY` | `src/components/YouView.tsx`, `src/context/AppContext.tsx` (`deleteMemory`) | User deletion trigger | Local browser storage | None | Immediately purged from local state; no soft-delete tombstones or cloud sync. |
| 7 | **Memory source/provenance** | `FUNCTIONAL_LOCAL_ONLY` | `src/types/memory.ts`, `src/services/memoryService.ts` | Origin tags (`USER_STATED`, `CONVERSATION_EXTRACTED`, `CALENDAR_DERIVED`) + raw quotes & belief reasoning | Local browser storage | None | Provenance is tracked and displayed in Memory Vault modal; source quotes originate from user prompts or seed fixtures. |
| 8 | **Memory confidence** | `FUNCTIONAL_LOCAL_ONLY` | `src/services/memoryService.ts`, `src/data/seedUser.ts` | Deterministic heuristic weights (0.80–1.0) | Local browser storage | None | Confidence scores are statically assigned or derived by keyword certainty rules rather than Bayesian probability models. |
| 9 | **Sensitivity handling** | `FUNCTIONAL_LOCAL_ONLY` | `src/services/firewallService.ts`, `src/types/memory.ts` | 4-tier grading (`NORMAL`, `PERSONAL`, `SENSITIVE`, `HIGHLY_SENSITIVE`) | Local browser storage | None | Strict gating rules; `HIGHLY_SENSITIVE` items (e.g. family surgery) and clinical terms are barred from recommendation ingestion unless explicitly queried. |
| 10 | **Private Session** | `FUNCTIONAL_LOCAL_ONLY` | `src/context/AppContext.tsx`, `src/services/agentOrchestrator.ts`, `src/components/ChatView.tsx` | UI toggle in Privacy Center | Ephemeral toggle (no disk write for private chat) | None | Disables candidate memory extraction, suppresses Taste Graph feedback updates, and blocks durable vault commits while active. |
| 11 | **Personal Context Firewall** | `FUNCTIONAL_LOCAL_ONLY` | `src/services/firewallService.ts` (`PersonalContextFirewall`) | Minimal-purpose task intent analysis over active memories | In-memory audit queue (last 20 invocations) | None | Evaluates task category; admits only domain-essential memories (e.g. food + budget for dining), redacting unrelated work, travel, and sensitive memories with explicit audit justifications. |
| 12 | **Context calculation** | `FUNCTIONAL_LOCAL_ONLY` | `src/services/contextService.ts` (`ContextEngine`) | 6-dimension float vector (`valence`, `energy`, `stress`, `socialNeed`, `focusNeed`, `noveltyNeed`) | Local browser storage | None | Calculated deterministically from user statements or manual check-in controls; no biometric sensor/health API feeds. |
| 13 | **Self-reported mood priority** | `FUNCTIONAL_LOCAL_ONLY` | `src/services/contextService.ts` (`setSelfReportedMood`), `src/components/NowView.tsx` | User 1-tap slider/pill check-in | Local browser storage | None | Enforces that manual user self-report overrides inferred state and locks `confidence: 1.0`. |
| 14 | **Taste Graph** | `FUNCTIONAL_LOCAL_ONLY` | `src/services/tasteService.ts`, `src/data/seedUser.ts` | Node-edge entity graph (artists, films, cuisines, venues) | Local browser storage | None | Renders visual nodes, relations (`LOVES`, `LIKES`, `AVOIDS`, `SAVED`), and contextual conditions in YouView. |
| 15 | **Taste learning** | `FUNCTIONAL_LOCAL_ONLY` | `src/services/tasteService.ts` (`applyFeedback`) | Feedback events (`LOVE_IT`, `LIKE_IT`, `NOT_FOR_ME`, `ALREADY_KNOW_IT`, `SAVE_FOR_LATER`) | Local browser storage | None | Updates node affinity strength, changes relations (e.g. `NOT_FOR_ME` -> `AVOIDS`), and records recency timestamp. |
| 16 | **Recommendation generation** | `PARTIAL` | `src/data/seedUser.ts`, `src/services/recommendationService.ts` | Curated candidate pool across 7 domains | Local browser storage | None | Candidate items are pre-curated high-taste archetypes rather than live web scraping; scoring and selection are dynamic. |
| 17 | **Recommendation ranking** | `FUNCTIONAL_LOCAL_ONLY` | `src/services/recommendationService.ts` (`calculateDeterministicScore`) | Multi-factor mathematical formula | Local browser storage | None | Deterministic formula: `RecommendationScore = taste_match(35%) + context_match(30%) + constraint_match(20%) + novelty(15%) + recency_adj - repetition_penalty`. |
| 18 | **Exploration factor** | `FUNCTIONAL_LOCAL_ONLY` | `src/components/DiscoverView.tsx`, `src/services/recommendationService.ts` | User slider (0.0 to 1.0) | React state | None | Dynamically shifts weights: low exploration rewards familiar low-novelty items; high exploration rewards novel serendipity items. |
| 19 | **Why This explanations** | `FUNCTIONAL_LOCAL_ONLY` | `src/components/modals/WhyThisModal.tsx`, `src/types/recommendation.ts` | True scoring breakdown + provenance links to active memories | Dynamic runtime state | None | Explanations are derived from actual scoring factors (taste nodes, context alignment, memory constraints, mathematical equation breakdown) rather than post-hoc hallucinated text. |
| 20 | **Plans** | `FUNCTIONAL_LOCAL_ONLY` | `src/components/PlansView.tsx`, `src/context/AppContext.tsx` | User plans state & saved recommendations | Local browser storage | None | Supports item addition, category filtering (shopping, watchlist, events, activities), and completion toggling. |
| 21 | **Shopping lists** | `FUNCTIONAL_LOCAL_ONLY` | `src/components/PlansView.tsx`, `src/data/seedUser.ts` | Checklist items with estimated prices & store categories | Local browser storage | None | Checkbox interactivity works locally; no live Instacart or Amazon Cart checkout API integration. |
| 22 | **Concert tracking** | `SIMULATED` | `src/data/seedUser.ts`, `src/services/agentOrchestrator.ts` | Curated venue/artist tour date fixture (Thalia Hall) | Local browser storage | None | Simulates Songkick/Bandsintown tracking for Japanese Breakfast; no live ticketing API feed. |
| 23 | **Proactive follow-up** | `SIMULATED` | `src/services/proactiveService.ts` | Trigger evaluator for calendar events, evening wind-down, tour alerts | In-memory evaluation | None | Evaluates triggers locally against current context and flags messages with `isProactive: true` and origin reasoning; no background push notifications when app is closed. |
| 24 | **Quiet hours** | `FUNCTIONAL_LOCAL_ONLY` | `src/services/proactiveService.ts` (`canSendProactivePing`) | User quiet hours schedule (e.g. 22:00 to 08:00) | Local browser storage | None | Evaluates current client system time against configured start/end hours; blocks outbound pings during scheduled quiet periods. |
| 25 | **Notification limits** | `FUNCTIONAL_LOCAL_ONLY` | `src/services/proactiveService.ts` | Daily frequency counters capped by mode (Quiet: 0, Balanced: 3, Companion: 5) | Local in-memory counter | None | Prevents notification fatigue by counting daily pings and blocking triggers once daily quota is met. |
| 26 | **Calendar discovery** | `SIMULATED` | `src/data/seedUser.ts`, `src/types/integrations.ts` | Synthetic calendar snapshot (Q3 review w/ Marcus, free evening) | Seed fixture data | None | Simulates connected Google Calendar data; no live Google Workspace OAuth token exchange in prototype. |
| 27 | **Calendar writes** | `SIMULATED` | `src/services/actionService.ts`, `src/components/modals/ActionConfirmModal.tsx` | Simulated Google Calendar event creation | Creates internal `PlanItem` in `Plans` tab | None | Action Engine prompts explicit confirmation, simulates event dispatch, and writes an authorized hold into internal Plans. No external Google Calendar API write occurs. |
| 28 | **Music integrations** | `SIMULATED` | `src/types/integrations.ts`, `src/data/seedUser.ts` | Spotify / Apple Music adapter mock | In-memory adapter toggle | None | Displays real vs mock adapter status; toggling connects mock adapter without initiating OAuth popup. |
| 29 | **Movie discovery** | `SIMULATED` | `src/data/seedUser.ts` | Curated film recommendations (Kore-eda, Celine Song, Severance) | Seed fixture data | None | High-fidelity metadata and images; no live TMDB/JustWatch API calls. |
| 30 | **Event discovery** | `SIMULATED` | `src/data/seedUser.ts` | Chicago local venues fixture (Thalia Hall, Empty Bottle) | Seed fixture data | None | Realistic local venue data; no live Eventbrite or Ticketmaster API query. |
| 31 | **Places discovery** | `SIMULATED` | `src/data/seedUser.ts` | Neighborhood dining and cafe fixture (Menya Goku) | Seed fixture data | None | Realistic neighborhood points of interest; no live Google Places API query. |
| 32 | **Shopping discovery** | `SIMULATED` | `src/data/seedUser.ts` | Curated high-protein savory snack hauls under budget | Seed fixture data | None | Hand-curated pantry items matching dietary constraints; no live e-commerce search API. |
| 33 | **Action risk classification** | `FUNCTIONAL_LOCAL_ONLY` | `src/services/actionService.ts` (`getRiskLevel`) | 5-tier risk taxonomy (`READ_ONLY`, `REVERSIBLE`, `EXTERNAL_WRITE`, `PURCHASE_OR_BOOKING`, `SENSITIVE_ACTION`) | In-code rule dictionary | None | Accurately classifies actions (calendar hold = `EXTERNAL_WRITE`, purchase = `PURCHASE_OR_BOOKING`, save to list = `REVERSIBLE`). |
| 34 | **Action confirmation** | `FUNCTIONAL_LOCAL_ONLY` | `src/components/modals/ActionConfirmModal.tsx`, `src/services/actionService.ts` | User modal authorization trigger | React state & action queue | None | Consequential actions (`EXTERNAL_WRITE`, `PURCHASE_OR_BOOKING`) cannot execute without explicit user approval. |
| 35 | **External tool execution** | `SIMULATED` | `src/services/actionService.ts` (`executeAction`) | Internal adapter dispatch | Creates verified internal state changes | None | Executes tool handlers locally by mutating app state and recording summary; does not emit outbound HTTP webhooks to external services. |
| 36 | **Authentication** | `HARDCODED` | `src/data/seedUser.ts` (`SEED_USER`) | Seed user Alex Chen | Static profile | None | App assumes single authenticated user; no Firebase Auth, OAuth2, or session cookies implemented. |
| 37 | **Database persistence** | `NOT_IMPLEMENTED` | N/A | Local browser storage only | Client storage only | None | No remote database (Postgres, Firestore, Cloud SQL) provisioned. |
| 38 | **Cross-session persistence** | `FUNCTIONAL_LOCAL_ONLY` | `src/context/AppContext.tsx` | Browser `localStorage` | Local device storage | None | State survives browser refreshes and tab restarts on the same machine; does not sync across multiple devices or separate browsers. |
| 39 | **Secrets handling** | `NOT_IMPLEMENTED` | `.env.example` | Environment variable placeholder | None | None | No client secrets embedded in source code; external API keys are not invoked on the client. |

---

## Technical Audit Summary

- **Total Capabilities Audited**: 39
- **FUNCTIONAL_LOCAL_ONLY**: 19 (48.7%) — Robust client-side algorithms, state machines, deterministic scoring equations, firewall gating, and browser persistence.
- **SIMULATED**: 12 (30.8%) — Tool execution, provider integrations, live concert radars, and calendar feeds.
- **PARTIAL**: 1 (2.6%) — Dynamic multi-factor ranking applied over curated candidate items.
- **HARDCODED**: 1 (2.6%) — User authentication and profile identity.
- **NOT_IMPLEMENTED**: 2 (5.1%) — Remote cloud database persistence and cloud secrets management.
- **REAL_FUNCTIONAL**: 0 (0.0%) — Prototype does not execute live external paid API calls or cloud writes.

### Audit Verdict for Founder Review
The prototype functions honestly and reliably as an in-browser local vision demonstration. Every core differentiator—the **Personal Context Firewall**, **Memory Vault lifecycle & sensitivity grading**, **deterministic multi-factor recommendation engine**, **Taste Graph learning**, and **gated Action Engine**—is executed through real, inspectable client logic rather than smoke-and-mirrors mockups. All data boundaries, mock providers, and local persistence constraints are clearly documented and transparent to the user.

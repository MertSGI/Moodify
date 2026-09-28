# Moodify Phase 2 Review

*Document Version: Phase 2-R2 Final Prototype Trust Alignment*  
*Target Reviewer: Founder & Lead Architect Review*  
*Standard: Exact-SHA source code and runtime behavior verification.*

---

## EXECUTIVE SUMMARY

Moodify has completed an independent Prototype Trust Alignment and hardening pass. The objective was not to expand scope, build production backends, or connect third-party APIs, but to independently verify every technical claim, eliminate prototype-level truth defects, seal ephemeral session boundaries, establish honest documentation boundaries, and calibrate source truth for founder evaluation.

The application stands confirmed as an honest, fully disclosed, client-side functional vision prototype. All core pillars—**Personal Context Calculation**, **Personal Context Firewall**, **Memory Vault Lifecycle**, **Deterministic Recommendation Scoring**, and **Gated Action Execution**—operate with verifiable local logic. Every external integration is truthfully tagged `MOCK`, calendar sync is strictly verified as local-only (`isCalendarSynced = false`), proactive settings are persisted and capped, private sessions cannot contaminate durable context, encryption truth is honestly stated (`APPLICATION_LEVEL_ENCRYPTION_IMPLEMENTED = false`), and no live Gemini API calls are fabricated (`LIVE_GEMINI_CALL_COUNT = 0`).

---

## WHAT IS ACTUALLY FUNCTIONAL

1. **Local State Management**: Complete multi-tab reactive state machine across Now, Chat, Discover, Plans, and You views via `AppContext.tsx`.
2. **Memory Extraction**: Deterministic rule-based extraction in `MemoryService.ts` detecting dislikes, comfort foods, explicit favorites, budget constraints, intentions, and discarding clinical/medical inputs.
3. **Memory Editing & Deletion**: Interactive inspection modal allowing in-place edits to content, sensitivity, importance, personalization authorization, and permanent deletion.
4. **Personal Context Firewall**: Minimal-purpose category gating and sensitivity evaluation in `FirewallService.ts`. Selects relevant domains per task, redacts unrelated domains, blocks sensitive health data, and records 6 structured audit fields.
5. **Context Calculation & Self-Report**: 6-dimension vector calculation with 1-tap manual self-report controls taking absolute priority (`confidence: 1.0`).
6. **Taste Graph Feedback Loop**: `TasteGraphService.ts` updates node relations (`LOVES`, `LIKES`, `AVOIDS`, `SAVED`, `HAS_TRIED`), adjusts strength weights, and records recency dates based on recommendation feedback.
7. **Deterministic Recommendation Scoring**: Explainable mathematical formula in `RecommendationService.ts` evaluating taste match (35%), context match (30%), constraint match (20%), exploration novelty (15%), recency adjustment, and repetition penalties.
8. **Exploration Factor Slider**: Runtime slider (0.0 to 1.0) dynamically shifting recommendation ranking between familiar comfort items and novel serendipity items.
9. **Private Session Enforcement & Context Isolation**: When enabled, candidate extraction is disabled, durable memory writes are blocked, taste learning is suppressed, and durable `localStorage['moodify_context']` is shielded from private session mutations. Pre-private context is restored upon exit.
10. **Action Risk Taxonomy & Confirmation**: 5-tier risk taxonomy requiring explicit user authorization for consequential actions (`EXTERNAL_WRITE`, `PURCHASE_OR_BOOKING`, `SENSITIVE_ACTION`).
11. **Plans Interactivity**: Item creation, category filtering, and interactive checklist toggling in `PlansView.tsx`.
12. **Local Browser Persistence**: Six-key `localStorage` synchronization ensuring user modifications survive browser refreshes.

---

## WHAT IS SIMULATED

1. **Conversational Responses**: `AgentOrchestrator.ts` generates structured assistant replies with cards and suggested replies via heuristic scenario routing.
2. **Agent "Thinking" Latency**: 500ms `setTimeout` delay emulating network and model inference pacing.
3. **Integration Adapters**: Google Calendar, Spotify, Apple Music, Instacart, and Bandsintown adapters operate in `MOCK` mode with synthetic status indicators.
4. **External Action Execution**: Action plans run in `MOCK_EXECUTION` mode, mutating local internal state (`PlanItem`) without invoking external third-party HTTP endpoints.
5. **Calendar Writes**: Action creates a local `PlanItem` with `isCalendarSynced: false` and explicitly reports local simulation without external Google Calendar sync.
6. **Proactive Follow-ups**: In-session evaluation checking quiet hours and calendar triggers to simulate proactive pings.

---

## WHAT IS HARDCODED

1. **User Identity & Profile**: User account (`Alex Chen`, Product Designer) in `src/data/seedUser.ts`.
2. **Seed Memory Vault**: 13 initial baseline memory records providing realistic onboarding context.
3. **Seed Taste Graph**: 9 initial entity nodes and 3 directed affinity edges.
4. **Recommendation Candidate Pool**: Curated candidate items across 7 domains (`SEED_RECOMMENDATIONS`).
5. **Synthetic Weather & Calendar Snapshot**: 62°F rainy weather and 4.5 hours free evening time from `MOCK_CALENDAR_FIXTURE`.

---

## WHAT SURVIVES REFRESH

Because browser `localStorage` persistence has been implemented in `src/context/AppContext.tsx`, the following state survives browser reloads and tab restarts on the same machine across 6 persistent keys:
- All Memory Vault records (`moodify_memories` — including newly committed candidates, edited values, sensitivity adjustments, and deletions).
- Personal Taste Graph nodes, relations, and feedback updates (`moodify_taste_nodes`).
- Saved Plans, checklist items, completion checkboxes, and simulated calendar holds (`moodify_plans`).
- Privacy Center settings (`moodify_privacy_settings` — Private Session toggle, Master Personalization toggle, category blocks).
- Proactive Companion settings (`moodify_proactive_settings` — intensity mode, quiet hours schedule, daily max pings, category toggles).
- Context snapshot state (`moodify_context` — including manual 1-tap self-reported mood adjustments). Note: During Private Session, ephemeral context updates are isolated in memory and never written to `moodify_context`.

---

## WHAT DOES NOT SURVIVE REFRESH

- Active Chat conversation history (resets to initial welcome scenario messages).
- In-memory Firewall audit decision queue (last 20 logs re-populate dynamically as new chat turns or tasks execute).
- Cross-device or cross-browser persistence (data is strictly local to the evaluator's current browser profile).
- Data after clicking "Reset to Seed Defaults" (which intentionally clears all six `localStorage` keys and re-seeds factory defaults).

---

## WHERE GEMINI IS REALLY USED

```
LIVE_GEMINI_CALL_COUNT = 0
```

`@google/genai` is listed in `package.json`, but **no live Gemini API calls are made anywhere in the application**. 

All conversational responses, why-this reasoning displays, context updates, and memory candidate extractions are driven by deterministic local TypeScript logic.

---

## HOW MEMORY CURRENTLY WORKS

1. **Extraction**: User messages pass through `MemoryService.extractCandidateMemories`. Heuristic rules flag explicit favorites, comfort food, dislikes, budget limits, or intentions.
2. **Safety Exclusions**: Health, psychiatric, or clinical diagnostic mentions are immediately classified as `DO_NOT_STORE` and discarded.
3. **User Inspection & Commit**: Extracted candidates appear in Chat under a "Noticed Candidate Memory" card; clicking "Keep in Vault" commits them to active memories.
4. **Vault Management**: The "Memory Vault" tab in YouView lists all records with search, domain filtering, sensitivity tags, and provenance quotes.
5. **Lifecycle Actions**: Users can edit memory text (e.g., *ramen* -> *udon*), adjust sensitivity, toggle personalization on/off, or permanently delete items. Changes update local state and `localStorage`.

---

## HOW PRIVACY CURRENTLY WORKS

1. **Personal Context Firewall**: When a task executes, `PersonalContextFirewall.filterContextForTask` evaluates the task intent against candidate memories.
2. **Minimal-Purpose Assembly**: Only domain-essential memories are admitted (e.g. food + budget for dining). Unrelated domains (work, travel, relationships, music) are excluded with explicit justifications.
3. **Sensitivity Gating**: `HIGHLY_SENSITIVE` records are blocked unless explicitly queried.
4. **Private Session & Context Isolation**: Toggleable in Privacy Center or header; when active, candidate extraction is disabled, vault commits are blocked, taste learning is bypassed, and durable context in `localStorage` is guarded from leakage.
5. **Developer Audit Log**: The Context Firewall tab displays the live audit trail with the exact 6 fields: `TASK`, `REQUESTED_CONTEXT_CATEGORIES`, `SELECTED_MEMORIES`, `EXCLUDED_MEMORIES`, `EXCLUSION_REASON`, and `SENSITIVE_DATA_BLOCKED`.
6. **Application Encryption Disclosure**: UI explicitly discloses `APPLICATION_LEVEL_ENCRYPTION_IMPLEMENTED = false` as `NOT IMPLEMENTED IN LOCAL PROTOTYPE`.

---

## HOW RECOMMENDATIONS CURRENTLY WORK

1. **Candidate Selection**: Recommendations are filtered by category from `SEED_RECOMMENDATIONS`.
2. **Dynamic Mathematical Ranking**: `RecommendationService.calculateDeterministicScore` computes an exact score:
   $$\text{Score} = \text{taste\_match}(35\%) + \text{context\_match}(30\%) + \text{constraint\_match}(20\%) + \text{novelty}(15\%) + \text{recency\_adj} - \text{repetition\_penalty}$$
3. **Exploration Factor**: Slider shifts the novelty weight—low values reward safe familiar comfort; high values reward serendipitous discovery.
4. **Why-This Transparency**:
   - **Scoring Breakdown** (`FUNCTIONAL_LOCAL_ONLY`): Dynamically computed and displayed in `WhyThisModal.tsx`.
   - **Narrative Content** (`PARTIAL`): Explanatory text blocks remain partly seeded fixtures.

---

## HOW PROACTIVITY CURRENTLY WORKS

1. **Date-Aware Daily Limit**: Starts at `0`, tracks current calendar date, and automatically resets count when the date advances.
2. **Authoritative Max Limit**: Strictly enforces `effectiveMax = min(settings.maxPingsPerDay, modeSafetyCap)` where QUIET=0, BALANCED=3, COMPANION=5. User maximum cannot be exceeded.
3. **Quiet Hours**: Compares client system time against configured schedule (e.g. 22:00 to 08:00); outbound pings are blocked during quiet hours.
4. **Settings Persistence**: User customizations persist across reloads in `moodify_proactive_settings`.
5. **Category Toggles**: Distinct logic checks for Meeting Follow-ups, Concert Alerts, and Evening Wind-Down.
6. **Live Inspector**: YouView displays a Live Proactivity Status card showing whether pings are permitted right now, the active gate reason, and today's frequency count.

---

## HOW ACTIONS CURRENTLY WORK

1. **Risk Classification**: Actions are assigned a risk level (`READ_ONLY`, `REVERSIBLE`, `EXTERNAL_WRITE`, `PURCHASE_OR_BOOKING`, `SENSITIVE_ACTION`).
2. **Confirmation Gate**: High-risk actions require explicit confirmation via `ActionConfirmModal.tsx`.
3. **Execution Invariant**: Action execution mode is explicitly `MOCK_EXECUTION`. Result text states: *"Mock calendar action completed locally. No external Google Calendar event was created."*
4. **State Transition**: Creates an internal `PlanItem` in the Plans tab with `isCalendarSynced: false` and adds a system confirmation message in Chat.

---

## CURRENT ARCHITECTURAL LIMITATIONS

1. **No Backend Database**: Data is stored in browser `localStorage`; clearing browser data resets state.
2. **No Live Gemini Calls**: Conversational intelligence is heuristic and bounded to demo scenarios.
3. **No External API Integrations**: Google Calendar, Spotify, TMDB, and Ticketmaster are local mock abstractions.
4. **Partly Seeded Why-This Narratives**: Mathematical scoring is dynamic, but narrative bullet text is partly pre-authored.
5. **Single-Device Isolation**: No cloud sync across devices or multi-user support.
6. **No Application-Level Encryption**: Stored as plaintext JSON in browser localStorage.
7. **No Automated Crisis Response**: Clinical disclosures filtered out from storage, but no crisis routing flow.

---

## HIGH-SEVERITY ISSUES FIXED

1. **Calendar Truth Defect**: Corrected Google Calendar integration status from `LIVE` to `MOCK` in `seedUser.ts`.
2. **Calendar Write Truth Defect**: Fixed `actionService.ts` to execute as `MOCK_EXECUTION`, set `isCalendarSynced = false`, and remove false external success messages.
3. **Action Execution State Model**: Implemented explicit `ActionStatus` union (`PROPOSED`, `AWAITING_CONFIRMATION`, `CONFIRMED`, `MOCK_EXECUTION`, `SUCCEEDED`, `FAILED`, `CANCELLED`).
4. **Proactive Daily Limit**: Reset daily count to 0, added date-aware reset on calendar day change, and enforced `min(userConfigured, modeSafetyCap)`.
5. **Why-This Classification**: Corrected truth matrix to distinguish `Recommendation Scoring Breakdown` (`FUNCTIONAL_LOCAL_ONLY`) from `Why-This Narrative` (`PARTIAL`).
6. **Positive Taste Extraction**: Enhanced memory extraction to capture comfort foods, favorites, and positive affinity statements.
7. **Travel Memory Added**: Added `kyoto_japan_trips` to seed memories, satisfying all 6 required domains.
8. **Factory Reset Control**: Added "Reset to Seed Defaults" button in YouView clearing all 6 storage keys.
9. **Encryption Truth Alignment**: Corrected `APPLICATION_LEVEL_ENCRYPTION_IMPLEMENTED = false`, updated `DEFAULT_PRIVACY_SETTINGS`, and labeled UI honestly as `NOT IMPLEMENTED IN LOCAL PROTOTYPE`.
10. **Private Session Context Leak Sealed**: Preserved pre-private context in memory, prevented `moodify_context` writes during private sessions, and restored durable context on exit.
11. **Proactive Settings Persistence**: Persisted proactive settings to `moodify_proactive_settings`.
12. **Mock Calendar Provenance Alignment**: Relabeled seed calendar references to `MOCK_CALENDAR_FIXTURE`.
13. **Truth Matrix Arithmetic Calibration**: Exactly counted 40 capability rows (24 `FUNCTIONAL_LOCAL_ONLY` / 60%, 11 `SIMULATED` / 27.5%, 2 `PARTIAL` / 5%, 1 `HARDCODED` / 2.5%, 2 `NOT_IMPLEMENTED` / 5%), summing to 100.0%.
14. **Privacy Model Truth Separation**: Distinctly separated current prototype truth from future production architecture in `PRIVACY_MODEL.md`.

---

## REMAINING TECHNICAL DEBT

1. **Live Gemini Integration**: Wire `@google/genai` on server proxy routes for open-domain dialog.
2. **Server-Side Context Firewall**: Port firewall logic to server-side pre-inference middleware.
3. **Database Migration**: Migrate `localStorage` schemas to PostgreSQL with pgvector.
4. **Real OAuth 2.0 Flows**: Implement Google Workspace OAuth for calendar synchronization.
5. **Dynamic Narrative Generation**: Synthesize Why-This narrative bullet points using LLM grounded in scoring components.
6. **Application-Level Encryption**: Implement envelope encryption with cloud KMS keys.
7. **Crisis Intervention Flow**: Implement dedicated crisis response pipeline (988 Lifeline).

---

## PROTOTYPE READINESS

```
PHASE_2_STATE = HOLD
```

*State explanation: Awaiting independent hosted verification; all local prototype trust alignment items and documentation invariants are verified and closed.*

---

## RECOMMENDED NEXT PHASE

**Phase 3: Server-Side Foundation & Real LLM Integration**
1. Implement Express server entry point (`server.ts`) with Vite dev middleware.
2. Connect server-side `@google/genai` SDK using `GEMINI_API_KEY`.
3. Implement Server-Side Personal Context Firewall middleware before LLM calls.
4. Migrate memory and taste schemas to PostgreSQL database.
5. Implement real Google Workspace OAuth for calendar availability discovery.

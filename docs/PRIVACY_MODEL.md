# Moodify — Privacy & Trust Model

## 1. Privacy as a Core Feature

Consumer AI products frequently treat privacy as an afterthought—hidden behind dense legal terms of service while telemetry and memory embeddings are harvested invisibly.

**Moodify elevates privacy to a primary consumer-facing product feature.**

Trust is earned through technical transparency, real-time auditability, and mathematical minimization.

---

## 2. The Personal Context Firewall

The **Personal Context Firewall** is Moodify's flagship privacy innovation.

### The Problem It Solves
When a typical AI assistant is asked: *"Where should I get dinner?"*, the entire user vector or full system prompt containing work stress, family issues, finances, and sensitive boundaries is forwarded to the LLM or third-party search tool.

### How the Firewall Operates
Before any AI request or external tool invocation executes, the Firewall executes a 6-step evaluation:

1. **Task Intent Classification:** Determines the exact functional objective (e.g. food discovery vs. evening decompression).
2. **Minimal-Purpose Context Assembly:** Identifies which categories are strictly relevant (e.g., for snacks: `food`, `dislikes`, `budget_preferences`). All unrelated domains (`work`, `relationships`, `life_events`) are stripped.
3. **Sensitivity Check:** High-sensitivity memories (e.g. family medical events) are blocked automatically unless the user explicitly refers to them.
4. **Tool Authorization Audit:** Verifies whether `allowedForExternalTools` or `allowedForPersonalization` flags are enabled for each record.
5. **Redaction Logging:** Produces an immutable, user-inspectable audit trail detailing why each piece of information was either admitted or withheld.
6. **Payload Sanitization:** Sends only the clean, minimal context to the generative reasoning layer.

---

## 3. The Private Session ("Incognito Mode")

Users can activate a **Private Session** at any time from the Navigation bar or Privacy Center:

- **No Durable Memory Commit:** No statements made during the session are extracted into the permanent vault.
- **Taste Graph Freeze:** Recommendation feedback and selections do not alter long-term preference weights.
- **Ephemeral Scratchpad:** Temporary context is wiped when the private session ends.

---

## 4. Security & Cryptographic Posture

- **No Client Secrets:** All API keys and model credentials reside securely in server-side environment variables (`.env`). No tokens are exposed to the browser.
- **Application-Level Encryption Model:** Sensitive and highly sensitive memory categories are isolated with cryptographic envelopes. Keys can be client-derived to prevent server-side introspection.
- **Zero Third-Party Ad Telemetry:** Listening history, location coordinates, and dietary preferences are never sold, syndicated, or shared with advertising networks.

---

## 5. Medical & Clinical Non-Pathologization Boundary

Moodify strictly enforces safety boundaries regarding mental health and medical conditions:
- **No Diagnostic Claims:** Moodify never labels a user as "depressed," "bipolar," or "anxious."
- **Everyday Support Only:** Moodify provides practical life support (music, quiet films, hot baths, organizing schedules).
- **Crisis Response:** If severe self-harm or distress is detected, conversational curation is paused and supportive crisis resources (e.g., 988 Lifeline) are surfaced with empathy and dignity.

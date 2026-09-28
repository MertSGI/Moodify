# Moodify — Personal Context, Taste & Life Action Agent

> **Working Product Title:** Moodify (temporary working title; see [`docs/BRAND_NOTES.md`](./docs/BRAND_NOTES.md) for 20 alternative brand candidates including *Kith*, *Cura*, and *Onda*).

Moodify is a serious functional vision prototype for a next-generation consumer AI companion. It is **not** a chatbot, a medical mood tracker, or an advertising feed. It is a **Personal Context + Taste + Life Action Agent** designed to gradually understand a person well enough to make everyday life feel easier, richer, more personal, and less cognitively demanding.

---

## The Core Loop

```
KNOW ME ➔ UNDERSTAND CURRENT CONTEXT ➔ CURATE ➔ HELP ME ACT ➔ LEARN ➔ KNOW ME BETTER
```

---

## 5 Architectural Pillars

1. **Personal Memory Vault ("What I Know About You"):** Structured memory records across 25 domains with sensitivity classification (NORMAL, PERSONAL, SENSITIVE, HIGHLY_SENSITIVE), candidate extraction tiering, provenance tracking, and full user inspection and editing.
2. **Mood & Context Engine:** Real-time awareness of valence (-1.0 to 1.0), energy (0.0 to 1.0), stress (0.0 to 1.0), focus need, and schedule availability. Self-reported state always takes precedent over weak inferences.
3. **Personal Taste Graph:** Multi-domain affinity model (music, artists, movies, food, places, products, events) connecting entities with contextual conditions (*"ambient when stressed; indie rock at small live rooms"*).
4. **Action & Discovery Engine:** Multi-domain curation with transparent **"Why this?"** breakdowns and risk-tiered tool execution (READ_ONLY, REVERSIBLE, EXTERNAL_WRITE, PURCHASE_OR_BOOKING). Consequential external writes require explicit user confirmation.
5. **Personal Context Firewall:** Inspectable privacy gate that enforces **Minimal-Purpose Context Assembly**, stripping sensitive or unrelated memory records before AI reasoning or tool invocation.

---

## 6 Interactive Demo Scenarios (1-Click Evaluation)

The top of the prototype features a **Scenario Drawer** allowing evaluators to trigger all 6 canonical test flows with one tap:

| Scenario | Trigger / User Context | What Moodify Demonstrates |
|---|---|---|
| **Scenario A: Rough Day** | *"Today was awful. I don't really want to think."* | Recognizes depleted battery (energy 0.15, stress 0.8), skips long lectures, and returns 3 low-friction options: 1 ambient music piece, 1 gentle cinema watch, and 1 offline bath/stretch reset. Feedback updates taste graph. |
| **Scenario B: Friday Night** | Free calendar evening detected. | Identifies user's passion for intimate indie rock, recommends a Japanese Breakfast secret show at Thalia Hall, explains the venue and acoustic match, and proposes an **Add to Google Calendar** action. |
| **Scenario C: Product Discovery** | *"I need snacks for work but trying not to eat junk all day."* | Enforces $25 workday food budget constraint, respects dislike of sugary crash bars, and returns a high-protein savory snack haul saving to Plans. |
| **Scenario D: Meeting Follow-Up** | Follow-up on 2:00 PM design review with VP Marcus. | Proactively checks in on a high-stakes meeting previously flagged in memory, validates emotional closure, and suggests an authentic celebratory ramen dinner. |
| **Scenario E: Movie Night** | *"Pick something for tonight. I'm tired but don't want something boring."* | Returns 3 genuinely differentiated options matching current cognitive load: Japanese slow cinema (*After the Storm*), sharp dark satire (*Severance*), and poignant drama (*Past Lives*). |
| **Scenario F: Concert Watch** | Artist radar check for Japanese Breakfast. | Explains tour tracking, venue acoustic rating, and places presale alerts into Plans > Tracked Events. |

---

## Project Structure & Documentation

Detailed architectural and design specifications are cataloged in `docs/`:

- [`docs/BRAND_NOTES.md`](./docs/BRAND_NOTES.md) — 20 brand name candidates, trademark analysis, and top 5 recommendations.
- [`docs/PRODUCT_THESIS.md`](./docs/PRODUCT_THESIS.md) — Core job-to-be-done, target user, retention loop, and positioning.
- [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md) — System diagram, component interactions, and Gemini orchestration.
- [`docs/MEMORY_MODEL.md`](./docs/MEMORY_MODEL.md) — Structured schema, 25 domains, sensitivity grading, and extraction tiering.
- [`docs/PRIVACY_MODEL.md`](./docs/PRIVACY_MODEL.md) — Personal Context Firewall, minimal-purpose assembly, and private sessions.
- [`docs/INTEGRATION_MATRIX.md`](./docs/INTEGRATION_MATRIX.md) — Real vs. mock status, provider adapters, and risk hierarchy.
- [`docs/ROADMAP.md`](./docs/ROADMAP.md) — Strategic release horizons (MVP, V1, V2, Later).

---

## Technical Stack

- **Frontend:** React 19 + TypeScript + Vite
- **Styling:** Tailwind CSS (warm, calm, premium aesthetic with subtle ambient state glowing)
- **Icons:** Lucide React
- **Orchestration:** Gemini API TypeScript SDK ready with local intelligent fallback engine for instant evaluation

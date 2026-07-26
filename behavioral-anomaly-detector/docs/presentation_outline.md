# Presentation Outline (Slide Deck Content)

*Note: Use the official Honeywell template for the slides. Drop these bullets into the corresponding sections.*

## Slide 1: Title & Concept
- **Title:** AI-Powered Behavioral Anomaly Detection
- **Concept:** Moving beyond static rules to dynamic, sequence-aware behavioral profiling for near real-time intrusion detection.

## Slide 2: The Problem
- **Imbalance:** Real attacks are needles in a haystack of benign traffic.
- **Context:** A single event (e.g., login from a new IP) isn't enough; context and sequence matter.
- **Alert Fatigue:** SOC analysts are overwhelmed by false positives lacking context.

## Slide 3: Our Architecture
- **Data Pipeline:** Streams access events through a FastAPI ingestion layer.
- **Sequence Encoder:** PyTorch GRU model processes the chronological sequence of user/device actions.
- **Classification Head:** Identifies not just anomaly presence, but *type* (e.g., Brute Force vs. Lateral Movement).

## Slide 4: Key Innovations
- **Explainability Layer:** Attention weights map directly to human-readable text (e.g., "Geo-velocity anomaly detected...").
- **Active Learning Loop:** Analyst Accept/Reject feedback instantly recalibrates confidence, adapting to concept drift without full retraining.
- **Cold-Start Handling:** Fallback population-level baselines protect against unknowns while safely gating confidence scores.

## Slide 5: Results & Evaluation
- **Alert Budgeting:** Show F1/FPR metrics specifically at the top 1% alert budget.
- **Baseline Comparison:** Sequence model significantly outperforms the statistical Isolation Forest baseline on stateful attacks (Lateral Movement, Low-and-Slow).

## Slide 6: Demo Overview (Live Demo Setup)
- We will stream live synthetic data.
- We will inject a targeted attack.
- Watch the dashboard instantly rank the alert, classify it, and explain it in plain English.

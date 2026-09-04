# 🎬 DunningPilot — 5-Minute Demo Video Walkthrough & Voiceover Script

This document provides a timed, section-by-section script with **visual screen actions** and **exact voiceover dialogue** so you can easily record your screen, speak your voiceover, and merge them in your video editor.

---

## ⏱️ Video Timeline Breakdown

| Timestamp | Section | Visual Focus | Key Message |
| :--- | :--- | :--- | :--- |
| **0:00 – 0:45** | **1. The Hook & The Problem** | Title Slide / Live App Landing | The multi-billion dollar involuntary churn problem |
| **0:45 – 1:30** | **2. Introducing DunningPilot** | Command Center Overview | 2-Tier Hybrid AI & Deterministic Engine |
| **1:30 – 2:30** | **3. Live Command Center Walkthrough** | KPI Cards & Taxonomy Breakdown | Real-time failure pipeline tracking |
| **2:30 – 3:30** | **4. AI Diagnosis & Case Drawer** | Inspecting Case Details & Outreach Copy | Tailored AI playbooks, stop rules, & dynamic copy |
| **3:30 – 4:15** | **5. Running Batch Recovery** | Clicking "Run Demo Recovery Batch" | Automated recovery workflow execution |
| **4:15 – 4:45** | **6. Immutable Audit Trail** | `/audit` Page & Expanding JSON Payload | Enterprise decision lineage & compliance |
| **4:45 – 5:00** | **7. Summary & Wrap-up** | GitHub Repo & Live App Badge | Tech stack summary & closing CTA |

---

## 🎙️ Step-by-Step Script & Screen Actions

### **Part 1: The Hook & The Problem (0:00 – 0:45)**

- **🖥️ Screen Action**: Start on your browser showing the live app (`https://dunningpilot-eight.vercel.app` or `http://localhost:3000`). Keep the mouse steady on the header.
- **🗣️ Voiceover**:
  > *"Hi everyone! My name is Sachin, and today I’m excited to present **DunningPilot** — an autonomous AI-powered subscription payment recovery platform.*
  >
  > *In the subscription SaaS economy, between 20% to 40% of customer churn isn't voluntary — it's caused by failed recurring payments like expired cards, temporary bank downtimes, or authentication challenges.*
  >
  > *Most companies handle this with naive, 'dumb' retry cron jobs that blast customer cards at random times. This triggers fraud blocks, frustrates customers, and risks getting merchant accounts penalized. DunningPilot was built to fix this by replacing brute-force retries with intelligent, AI-guided payment recovery."*

---

### **Part 2: What is DunningPilot & How It Works (0:45 – 1:30)**

- **🖥️ Screen Action**: Smoothly hover over the top bar badges and the left navigation menu.
- **🗣️ Voiceover**:
  > *"DunningPilot acts as an autonomous financial copilot for your billing stack.*
  >
  > *At its core is a **2-Tier Hybrid Diagnosis Engine**:*
  > - ***Tier 1*** *uses a zero-latency deterministic rule engine to instantly catch terminal hard declines and card expirations.*
  > - ***Tier 2*** *leverages advanced LLM intelligence powered by NVIDIA NIM and Anthropic Claude within a strict 2.5-second SLA to analyze ambiguous gateway errors and design targeted recovery playbooks.*
  >
  > *Let's jump into the live application to see it in action."*

---

### **Part 3: Command Center & Real-Time Metrics (1:30 – 2:30)**

- **🖥️ Screen Action**: Slowly scroll down past the 4 KPI cards (`Total Failed Revenue`, `Recovery Rate`, `Recovered Revenue`, `Active Recovery Workflows`). Hover over each card, then hover over the 4 Taxonomy categories (`SOFT_DECLINE`, `CARD_EXPIRATION`, `AUTH_CHALLENGE`, `HARD_DECLINE`).
- **🗣️ Voiceover**:
  > *"Here on the **Recovery Command Center**, finance and engineering teams get a single pane of glass into every failed subscription payment.*
  >
  > *At the top, we see real-time metrics: our total at-risk revenue, current recovery rate against target SLAs, and active recovery workflows.*
  >
  > *Right below, DunningPilot categorizes failure events across an automated taxonomy:*
  > - ***Soft Declines*** *for temporary insufficient funds or gateway timeouts.*
  > - ***Card Expirations*** *requiring customer self-serve update portals.*
  > - ***Authentication Challenges*** *where 3D Secure OTP verification is required.*
  > - *And crucially, ***Hard Declines***, where our smart stopping rules enforce an immediate stop with zero retries to protect merchant reputation."*

---

### **Part 4: Inspecting AI Playbooks & Dynamic Customer Outreach (2:30 – 3:30)**

- **🖥️ Screen Action**: 
  1. Click **"Inspect Case"** on the first customer row (*Rajesh Kumar - INSUFFICIENT_FUNDS*).
  2. Scroll down the drawer to show the AI Diagnosis score, Recommended Action, and the generated Customer Outreach Copy.
  3. Close the drawer.
  4. Click **"Inspect Case"** on *Vikramaditya Rao (AUTH_CHALLENGE)* or *Ananya Sharma (CARD_EXPIRATION)* for 5 seconds, then close.
- **🗣️ Voiceover**:
  > *"Let's inspect a case. Clicking 'Inspect Case' opens our diagnostic drawer.*
  >
  > *Here, DunningPilot provides the full error breakdown, calculated confidence score, and an automated playbook. Notice that rather than immediately spamming the card, it recommends a smart delay retry window.*
  >
  > *Even better, the AI dynamically generates contextual, personalized email and SMS copy with clear call-to-actions and secure payment links ready for the customer — removing manual overhead for support teams."*

---

### **Part 5: Running Autonomous Batch Recovery (3:30 – 4:15)**

- **🖥️ Screen Action**: Scroll to the top right and click the green **"Run Demo Recovery Batch"** button. Pause 3-4 seconds as the batch processes and the metrics update.
- **🗣️ Voiceover**:
  > *"Now, let's trigger the recovery workflows. When I click **'Run Demo Recovery Batch'**, DunningPilot's orchestrator evaluates each case simultaneously:*
  >
  > - *It automatically executes gateway retry schedules for soft declines.*
  > - *It dispatches secure update links for expired cards.*
  > - *And it enforces terminal hard stops on lost/stolen accounts.*
  >
  > *Everything updates in real time without human intervention."*

---

### **Part 6: Immutable Audit Trail & Decision Lineage (4:15 – 4:45)**

- **🖥️ Screen Action**: Click **"Audit Trail"** on the left sidebar navigation (`/audit`). Scroll down the chronological event timeline. Click **"View Raw Audit JSON Payload"** on one of the items to reveal the formatted JSON data.
- **🗣️ Voiceover**:
  > *"For financial and compliance teams, explainability is everything. Clicking over to the **Audit Trail**, we have an immutable, chronological ledger of every single decision.*
  >
  > *We can see whether a diagnosis came from Tier 1 deterministic rules or Tier 2 AI reasoning, the exact timestamp, and by expanding the raw JSON payload, the complete cryptographic execution lineage."*

---

### **Part 7: Summary, Tech Stack & Wrap-Up (4:45 – 5:00)**

- **🖥️ Screen Action**: Navigate back to the Command Center or show the GitHub repository page.
- **🗣️ Voiceover**:
  > *"DunningPilot is built with **Next.js 15 App Router, TypeScript, Tailwind CSS, Supabase PostgreSQL, NVIDIA NIM, Anthropic Claude, and Razorpay**.*
  >
  > *It turns involuntary churn from a revenue leak into an automated recovery engine.*
  >
  > *Check out the live demo link and source code in the description below. Thank you for watching!"*

---

## 🛠️ Recommended Recording & Editing Workflow:

1. **Screen Recording (Free & High Quality)**:
   - Use **OBS Studio** or **Loom** (or `Win + G` on Windows).
   - Set resolution to **1080p (1920x1080)** at **60fps**.
   - Follow the mouse movements and clicks described in the script above.
2. **Audio Recording**:
   - Use your phone voice recorder, Audacity, or your microphone to record the voiceover tracks following the timestamps.
3. **Merging & Editing**:
   - Use **CapCut (Desktop/Web)**, **Canva**, **DaVinci Resolve**, or **Premiere Pro**.
   - Drop the screen recording on Video Track 1.
   - Drop your voice audio on Audio Track 1.
   - Sync the video cuts to match your voice narration.

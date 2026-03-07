# DEMO_STORY.md — Varo AI Demo Script
**Version:** 1.0 | **Owner:** Hi Kim, CEO

---

## The Demo in One Sentence

"I'm going to show you what happens when an OT security alert hits a plant — with Varo AI, and without it."

---

## Before You Start

**Setup (do this 10 minutes before):**
- Open varoai.app in Chrome — logged in
- Screen is on the alert input page (blank, clean)
- Demo Scenario 1 text is copied to your clipboard
- Browser DevTools closed
- Notifications silenced
- If presenting on a second screen, font size at 125%

**What you have loaded and ready:**
- Scenario 1 (Modbus) — your clipboard
- Scenario 2 (Historian) — in a text file, ready to copy
- Scenario 3 (HMI Brute Force) — in a text file, ready to copy

---

## The 5-Minute Demo Script

### Opening (30 seconds)

> "It's 2:14 in the morning. Your OT security team gets an alert. It says: Modbus Function Code 06 on PLC-07, from an IP outside the approved range, writing a value of 3,400 RPM to a motor speed register."

*[Pause]*

> "What does that mean? Who knows? Most analysts — even experienced ones — would need to call a control engineer, pull up documentation, cross-reference the asset inventory. That takes hours. At $2 million an hour in downtime, that's a $4 million problem."

> "This is what Varo AI changes."

---

### Demo Part 1 — The Incident Report (2 minutes)

*[Screen: alert input page]*

> "I'm going to paste that exact alert into Varo AI right now."

*[Paste Demo Scenario 1 text. Select facility type: Energy. Mode: COPILOT. Click Analyse Alert.]*

> "The Varo AI Analyst is processing this. It knows Modbus. It knows what Function Code 06 means. It knows what register 40011 is. Watch what comes back."

*[Report appears — point to the Operational Impact field first]*

> "Look at this. Not 'anomalous Modbus traffic detected.' This: 'The motor speed setpoint on the cooling pump has been forced to 3,400 RPM — nearly three times the safe limit. At this speed, the pump bearing overheats within 8 to 12 minutes, triggering an emergency shutdown on production Line 3.'"

*[Point to financial exposure]*

> "And here's the business impact: $1.8 to $4.2 million, based on industry benchmarks and the estimated recovery window."

*[Point to response steps]*

> "And here's exactly what to do. Step one: isolate PLC-07 from the engineering workstation VLAN immediately. Step two: verify the register value at the physical panel. Step three: initiate incident response protocol."

> "My analyst doesn't need to call anyone. They don't need to read documentation. They have a decision they can act on in 90 seconds."

---

### Demo Part 2 — COPILOT Mode (1 minute)

*[Point to the APPROVE / MODIFY / SKIP buttons]*

> "This is COPILOT mode. The AI recommends. The analyst approves. Every action is logged with a timestamp — which matters for compliance and for post-incident review."

*[Click APPROVE on Step 1]*

> "Approved. Logged. The analyst is still in control. They're just not starting from scratch."

*[Point to AUTOPILOT toggle]*

> "AUTOPILOT mode is for pre-approved playbooks — when your team has validated the response and wants the system to execute automatically. We've hardcoded a safety override: any alert that could affect a physical process always stays in COPILOT. The AI can never autonomously act on something that touches physical equipment."

---

### Demo Part 3 — Engineer Copilot (1 minute)

*[Point to the chat panel]*

> "Here's the other half of the product. A control engineer — the person who actually understands the plant — can ask questions in plain language."

*[Type in the chat: "What happens to my cooling system if I don't act on this?"]*

> "The Varo AI Analyst answers in operational terms — not CVE numbers, not MITRE technique IDs. Which valve. Which line. How long."

*[AI response appears]*

> "This is the translation layer that has never existed in OT security before. Security teams and engineering teams speaking the same language, in real time, during an incident."

---

### Closing (30 seconds)

> "What you just saw takes analysts between 2 and 6 hours to do manually today — if they can do it at all. Varo AI does it in 90 seconds."

> "We're in conversations with a Tier 1 US energy operator as our design partner. We're in the Lighthouse Virginia 2026 cohort. And we're looking for our first strategic partners."

> "The category we're building is called Cyber-Physical Consequence Intelligence. The incumbents detect. We explain, simulate, and respond. That's a new category — and we're building it."

*[Stop. Don't fill the silence. Let them ask questions.]*

---

## Questions They Will Ask — And How to Answer

### "How is this different from Dragos?"

> "Dragos is exceptional at detection — they're one of our data sources. They surface the alert. Varo AI is the reasoning layer that sits on top: it tells you what the alert means in your specific industrial context and what to do about it. We're not replacing Dragos. We're making their data actionable for the 99% of industrial operators who don't have a team of OT security experts on call."

### "What stops this from being wrong and causing more damage?"

> "Two things. First, COPILOT mode means a human approves every action — the AI recommends, the analyst decides. Second, we've hardcoded a safety override: any alert that could touch a physical process is permanently locked to COPILOT, regardless of settings. The AI cannot autonomously act on anything with physical consequence. That's an architectural decision, not a configuration option."

### "Why would a company trust AI with this?"

> "They already trust AI with less context and less industrial knowledge. What they don't have today is AI that understands OT protocols. Our system prompt has been trained on Modbus, DNP3, IEC 61850 — it understands what an FC06 write to register 40011 means in an energy facility context. That's the moat. That industrial protocol knowledge is what separates us from a generic AI assistant."

### "What's your go-to-market?"

> "Energy sector first — NextEra as design partner, then expand to the top 20 US utilities. Then manufacturing. The buyer is the CISO or OT Security Manager. The champion is the analyst who uses it daily and tells their CISO they can't live without it. Pricing: outcome-based SaaS, $2,500–$5,000/month for mid-market, $50K+ ACV for enterprise."

### "How long until you have paying customers?"

> "We're targeting first pilot agreement within 30 days of this demo. First paid contract within 90 days. The product exists. The pain is validated. The conversation with our design partner is in progress."

---

## If Something Breaks During the Demo

**Scenario: AI takes longer than 90 seconds**
> "The system is processing a particularly complex alert — you can see it's still working. While it processes, let me show you what the output looks like from a previous analysis."
*[Open a pre-saved incident report in a second browser tab]*

**Scenario: API call fails entirely**
> "We've hit an intermittent connection issue — this happens occasionally with cloud APIs. Let me show you a saved analysis that demonstrates the full output."
*[Switch to pre-saved report tab — have this ready before every demo]*

**Scenario: Browser crashes**
> "Let me switch to my backup device."
*[Always have a second device with varoai.app open and a pre-saved report visible]*

---

## The One Thing That Wins Every Demo

**Point to the Operational Impact field and say:**

> "This sentence right here — 'the pump bearing overheats within 8 to 12 minutes' — this is the sentence that does not exist anywhere in the world right now when an OT alert fires. No existing tool produces it. This is what Varo AI does."

That sentence is the product.

---

*References: UI_DESIGN.md, UX_FLOW.md, system_prompt.md*

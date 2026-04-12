---
title: "Measuring what matters in the age of AI"
date: "2026-04-08"
slug: "measuring-what-matters"
excerpt: "How stochastic testing, per-capability cost tracking, and process telemetry create trust in automated systems."
tags: ["testing", "reliability", "AI operations"]
---

## The trust problem with AI agents

Here's a question every company shipping AI-powered software should be asking: how reliable is your agent, exactly?

Not anecdotally. Not "it works pretty well." A number. Per capability. With cost attached.

Most can't answer this. Traditional testing assumes deterministic behavior — the same input always produces the same output. LLM-based agents violate this assumption fundamentally. A test that passes 85% of the time looks identical to one that passes 100% on any given run.

## Stochastic testing as a discipline

At Haderach, we built a testing framework designed specifically for nondeterministic systems. Every agent capability is tagged, tested across multiple runs, and scored for reliability and cost.

The output isn't "pass/fail" — it's a reliability profile. Vendor management: 96% pass rate at $0.002 per interaction. Spend analytics: 92% at $0.003. Column visibility control: 88% at $0.001.

This changes the conversation with stakeholders from "the AI works" to "here's exactly how well it works, where it's weak, and what it costs." That's the kind of transparency that builds real trust.

## Three audiences, three metrics

The framework serves three distinct audiences, each with different needs:

**Developers** use it to validate before shipping. Run the stochastic suite against your branch, get a capability-by-capability reliability delta. Did your change improve spend analysis but regress vendor search? You'll know before it merges.

**Platform operators** use it to quantify regression risk. When a model provider ships an update, run the full suite and compare. If GPT-4.1 drops your vendor management reliability from 96% to 89%, you have a concrete business case for staying on the previous version — or switching providers.

**Stakeholders** use it to make informed decisions about automation. When a capability passes 98% of the time at $0.001 per call, the risk calculus is different from one that passes 75% at $0.05. Cost and reliability together tell the full story.

## Per-capability cost tracking

Reliability without cost context is incomplete. An agent that's 99% reliable but costs $0.50 per interaction might be less useful than one that's 95% reliable at $0.002.

Every test run in our framework captures both the reliability score and the actual LLM cost. This creates a cost-per-capability map that drives real engineering decisions: which capabilities to optimize, where to invest in model fine-tuning, and when the economics favor a different approach entirely.

## Process telemetry in production

Testing is pre-deployment. But what about production? We instrument every agent interaction with the same capability tags used in testing, creating continuous telemetry that validates whether production behavior matches test expectations.

When test-time reliability and production-time reliability diverge, that's a signal worth investigating. Maybe the test scenarios don't represent real usage patterns. Maybe production data has edge cases the tests didn't cover. Either way, the divergence itself is the valuable insight.

## The bigger picture

The age of AI in enterprise software is not about replacing human judgment — it's about giving humans better data to make judgment calls. Stochastic testing, cost tracking, and process telemetry are the foundation for informed trust in automated systems.

Without them, you're flying blind. With them, you can say with precision: this capability works this well, costs this much, and here's how it's trending. That's measurable, auditable, and trustworthy.

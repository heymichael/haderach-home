---
title: "Loops, not flowcharts"
date: "2026-04-09"
slug: "loops-not-flowcharts"
excerpt: "Real work is iterative. Agent-driven conversations model actual business processes better than rigid automation."
tags: ["process", "agent architecture", "iteration"]
---

## The flowchart fallacy

Enterprise software loves flowcharts. Linear processes with defined inputs, decision points, and outputs. If this, then that. Neat, predictable, automatable.

The problem is that almost no real work actually looks like a flowchart.

Real work is messy, iterative, and context-dependent. A vendor onboarding process doesn't flow cleanly from step A to step B. It loops back when documentation is incomplete, branches when a compliance question surfaces, pauses when a key stakeholder is unavailable, and adapts when the vendor turns out to be different from what was expected.

## Why rigid automation breaks

Traditional automation tools try to capture this complexity in increasingly elaborate workflow definitions. More branches, more conditions, more exception handling. The result is brittle systems that work for the happy path and break everywhere else.

When they break, someone has to step in manually — which defeats the purpose of automation. Worse, the manual intervention usually isn't captured by the system, so the workflow definition drifts further from reality over time.

## Conversations as process models

Agent-driven conversations handle iteration naturally. A conversation doesn't have a fixed path — it responds to what the other party says. When new information surfaces, the conversation adapts. When a step needs to be revisited, you just go back to it.

This maps directly to how business processes actually work. The agent maintains context across the full conversation, remembers what was decided and why, and can pick up where things left off after an interruption.

There's no workflow designer to maintain, no branching logic to debug, no exception handling to enumerate upfront. The process emerges from the conversation, guided by the agent's understanding of the domain and the user's intent.

## The development process as prototype

At Haderach, we use this model internally. Our own development process — discovery, prioritization, implementation, communication — runs through agent-facilitated conversations. Every capability in the platform went through this loop before reaching users.

This means the development process is the product prototype. The same loop that drives internal iteration will eventually be the interface for external users. A practitioner interacts with a PM agent that drives the full cycle on their behalf — they don't just receive release notes, they participate in the cycle.

## Six atomic steps, not one monolith

The loop breaks down into six atomic components: discover, prioritize, implement, verify, communicate, reflect. Each component can be at a different level of automation — from fully manual to fully autonomous — and the maturity level advances independently based on demonstrated reliability.

This staged approach means you don't have to trust the agent with everything at once. It earns its place at each step, proving reliability through repetition before moving to the next level of autonomy. Loops, not leaps.

---
key: epic-3
title: Use a clearer app without losing capabilities
column: dev
origin: full
blockedBy: [epic-2]
feature: quero-uma-revisao-na-ui-e-ux-do-app-e-ta
workflow: build
auto: true
labels: [feature, gym-console]
specs: [3-1-understand-the-day-and-plan-quickly, 3-2-register-with-focus-using-one-hand, 3-3-review-and-protect-history-clearly]
context: Juarez can use a visually modernized dark Gym Console interface across all five tabs and the timer panel while retaining every established workout, history, export, privacy, and offline behavior. This issue starts only after the EPIC-2 full-week gate passes.
criteria:
  - id: c1
    text: Every EPIC-3 story spec is implemented in order and its acceptance criteria pass.
  - id: c2
    text: FR27, FR29, and FR30 are delivered across all five tabs and the fixed timer panel without capability loss.
  - id: c3
    text: Portrait Android evidence shows no smaller touch targets, no lower text contrast, no hidden essential action, no horizontal overflow, and fewer touches or scrolling for the measured registration path than the recorded baseline.
links:
  epics: ".nexus/features/quero-uma-revisao-na-ui-e-ux-do-app-e-ta/epics.md"
  ux: ".nexus/features/quero-uma-revisao-na-ui-e-ux-do-app-e-ta/ux.md"
  readiness: ".nexus/features/quero-uma-revisao-na-ui-e-ux-do-app-e-ta/implementation-readiness-report.md"
comments:
  - who: "agent:sm"
    at: 2026-08-20T15:05:17.8122666-03:00
    text: Sprint Planning created this issue behind epic-2. The approved visual direction is Gym Console; production implementation must encode it as native CSS and must not depend on the temporary companion screen.
  - who: "agent:sm"
    at: 2026-08-20T15:24:38.0984337-03:00
    text: Planning validation passed for all three declared specs with zero structural or traceability defects. Implementation remains blocked by epic-2 and its signed Spec 2.5 full-week gate.
---

## Context

Juarez can use a visually modernized dark Gym Console interface across all five tabs and the timer panel while retaining every established workout, history, export, privacy, and offline behavior. This issue starts only after the EPIC-2 full-week gate passes.
## Acceptance Criteria

1. Every EPIC-3 story spec is implemented in order and its acceptance criteria pass.
2. FR27, FR29, and FR30 are delivered across all five tabs and the fixed timer panel without capability loss.
3. Portrait Android evidence shows no smaller touch targets, no lower text contrast, no hidden essential action, no horizontal overflow, and fewer touches or scrolling for the measured registration path than the recorded baseline.

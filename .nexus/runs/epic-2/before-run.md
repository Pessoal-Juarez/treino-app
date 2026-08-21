---
key: epic-2
title: Train with focus without losing progress
column: review
origin: full
blockedBy: [epic-1]
feature: quero-uma-revisao-na-ui-e-ux-do-app-e-ta
workflow: build
auto: true
labels: [feature, focused-workout]
specs: [2-1-recover-an-interrupted-workout, 2-2-navigate-one-exercise-at-a-time, 2-3-advance-safely-while-rest-stays-visible, 2-4-finish-without-hiding-pending-work, 2-5-validate-a-full-week-without-losing-progress]
context: Juarez can work through one exercise at a time, skip and return, recover an interrupted workout, and finish or save partially without losing values, confirmations, pending work, or timer continuity. This issue starts only after the EPIC-1 validation gate passes and owns the Phase 2 full-week gate.
criteria:
  - id: c1
    text: Every EPIC-2 story spec is implemented in order and its acceptance criteria pass.
  - id: c2
    text: FR19 through FR26 and FR28 are delivered with draft state kept separate from final History.
  - id: c3
    text: The full-week validation spec records zero lost values, draft leakage, hidden pending exercises, silent completions, or navigation-caused timer interruptions before EPIC-3 starts.
links:
  epics: ".nexus/features/quero-uma-revisao-na-ui-e-ux-do-app-e-ta/epics.md"
  readiness: ".nexus/features/quero-uma-revisao-na-ui-e-ux-do-app-e-ta/implementation-readiness-report.md"
comments:
  - who: "agent:sm"
    at: 2026-08-20T15:05:17.8122666-03:00
    text: Sprint Planning created this issue behind epic-1. Spec 2.5 is the explicit Phase 2 full-week gate required by the PRD and readiness assessment.
  - who: "agent:sm"
    at: 2026-08-20T15:24:38.0984337-03:00
    text: Planning validation passed for all five declared specs with zero structural or traceability defects. Implementation remains blocked by epic-1 and its signed Spec 1.6 full-week gate.
---

## Context

Juarez can work through one exercise at a time, skip and return, recover an interrupted workout, and finish or save partially without losing values, confirmations, pending work, or timer continuity. This issue starts only after the EPIC-1 validation gate passes and owns the Phase 2 full-week gate.
## Acceptance Criteria

1. Every EPIC-2 story spec is implemented in order and its acceptance criteria pass.
2. FR19 through FR26 and FR28 are delivered with draft state kept separate from final History.
3. The full-week validation spec records zero lost values, draft leakage, hidden pending exercises, silent completions, or navigation-caused timer interruptions before EPIC-3 starts.

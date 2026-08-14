**The session model is a ceiling, not a per-agent default.** Picking the tier per call is part of
orchestrating. An omitted model inherits the session's — usually the most expensive one.

| Call | Model | Why |
|---|---|---|
| review, any lens | `sonnet` | One lens, a pinned range, a rule to quote, a terse report. Several run at once. |
| scout / investigate | `sonnet` | Locating code and citing `file:line`. No design judgement. |
| implement a **mechanical** slice | `sonnet` | The shape is already written down: a page copied from a named existing page, a rename across call sites, wiring that follows an existing seam, a regenerated client, documentation. |
| implement a **design-carrying** slice | inherit | New seams, schema and wire contracts, permissions, concurrency. |
| fix an already-triaged finding list | `sonnet` | Bounded work with the reasoning done. |
| fix the whole-feature sweep | `opus` | Cross-cutting findings and the last write before review. |

Three rules:

- **Turn count beats token price.** A cheap model routinely takes two or three times the turns on
  multi-step work, which costs more overall. Use the cheap tier when the brief contains the shape;
  otherwise start one tier up.
- **A `sonnet` agent that fails its gates twice on the same thing gets one re-run on `opus`** — the
  failure is as likely to be the tier as the task. After that, re-scope or park.
- **Escalate a reviewer deliberately**, not by default: for correctness or spec alignment over a sweep of
  more than about fifteen changed files, or when a lens returned clean on a diff you have concrete reason
  to distrust. Escalating every lens costs the price of the build again.

Name the cheap-tier slices in the plan, so one go-ahead covers the choice.

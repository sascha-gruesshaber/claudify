---
name: plan
description: Turn a committed spec into an ordered, executable plan — after agents have actually read the code it will change. Every task names its files, its test, its seam and the command that verifies it; a coverage table maps every numbered requirement to a task or an explicit deferral. Writes plan.md beside the spec. It plans, it never implements. Use when a spec exists and someone asks how we build it, wants the work broken into ordered tasks, or wants to know where the code lives today. Keywords - plan, how do we build it, break it into tasks, implementation plan, task order, test seams, coverage, where does this code live.
---

# Plan (a contract → an executable plan)

Turn a spec into work somebody can execute, **after reading the code it will change**.

> **A plan written without reading the code is the spec restated with filenames guessed onto it.** It
> looks like work, it reviews as work, and whoever picks it up discovers the guesses one at a time. So
> every plan rests on a scouting pass, and every claim it makes about the codebase carries a
> `path:line` somebody actually opened — which is exactly what
> [`plan-check`](../plan-check/SKILL.md) then verifies.

**This skill plans. It never implements.** Writing the code is [`build`](../build/SKILL.md).

<!-- shared:repo-config:start source=repo-config.md -->
**This repo describes itself in `.agents/`, at the repository root. Read the files that bind your step,
and treat them as authority over anything you would otherwise assume.**

| File | Answers |
|---|---|
| `.agents/lifecycle.md` | which phases run, which review lenses are in use, how many rounds each loop gets, how wide a wave may be |
| `.agents/gates.md` | the commands that must pass, in order, and what "green" means here |
| `.agents/tracker.md` | where specs and tickets live, and what may be written to the board |
| `.agents/forge.md` | the git host, and how a branch becomes a reviewed change |
| `.agents/docs.md` | where architecture truth lives, the glossary, and what "docs are part of done" costs |
| `.agents/naming.md` | branch, commit, directory and test-name grammar |
| `.agents/working-agreement.md` | working hours, what may run unattended, how to report, when to stop and ask |

Three rules:

- **A missing file is a real answer: that thing is not configured here.** Say so in one line and take
  the safest reading — do not invent the repo's conventions, and do not fall back on another project's.
  If the whole directory is absent, stop and tell the user to run `/onboard` instead of guessing.
- **`.agents/` beats your own judgement, and loses to the user.** It was written deliberately, so a rule
  you disagree with is reported once, not routed around.
- **Read only what your step needs.** Every line costs on every turn of a long run.
<!-- shared:repo-config:end -->

## When NOT to use

- The spec is **draft**, with anything under `## Open` → settle it in [`grill`](../grill/SKILL.md)
  first. Planning around an open question means silently planning one of its answers.
- There is no spec → [`spec`](../spec/SKILL.md). Planning straight from a ticket is how requirements
  get invented inside a plan, where nobody reviews them as requirements.
- A bug whose cause is unknown → [`diagnose`](../diagnose/SKILL.md). You cannot plan a fix for a cause
  nobody has established.

## What you are working from

<!-- shared:spec-shape:start source=spec-shape.md -->
**A spec states WHAT. A plan states HOW.** The moment a spec names a class, a method, a table or a
control-flow step it has become a plan, written before anybody read the code — and it gets none of the
checking a plan gets.

The test: **could two competent developers satisfy this with different designs?** If not, you have
specified a design.

**The numbers are permanent.** Requirements and acceptance criteria are each one numbered list, and the
number is the handle every later step uses — a review finding, a review comment, a commit, a plan's
coverage table.

- Adding a requirement **appends**. It never inserts.
- Removing one leaves the number **retired**: `~~withdrawn~~` with the reason and the date. Never reused.
- Renumbering is the one edit that silently breaks every consumer. A revision preserves numbers by
  definition; if it cannot, it stops and says why.

**Every requirement and criterion names where it came from** — the ticket, a comment, an answered
question, a recorded assumption. A line with no trace is one somebody invented, and inventing
requirements is the easiest failure to commit here: the ticket is terse, the gap is obvious, and filling
it feels like diligence. **Fill nothing. A gap goes under `## Open`.**

**A spec with anything under `## Open` is a draft, not a contract.** Say so in the header and in the
summary, and name the open questions.

**`## Out of scope` is not filler.** A reviewer who assumes a nearby behaviour was in scope reports its
absence as a missing requirement, and the round trip is spent explaining that nobody asked for it.
<!-- shared:spec-shape:end -->

## Step 1 — Read the spec, and refuse a draft

Resolve the spec from `.agents/tracker.md` and read its status line. **A spec marked draft, or carrying
a non-empty `## Open`, stops the run.** Name the open questions and point at `/grill`. This is the only
refusal here and it is worth keeping.

**`## Constraints` is binding.** Those are the edge cases somebody settled deliberately; a plan that
quietly re-decides one has thrown away the only record of the decision.

**`## Out of scope` is binding in the other direction.** Work listed there is work the plan must not
contain, however obviously adjacent it looks.

## Step 2 — Scout before you plan

Group the requirements into work areas — a service, a layer, a feature surface — and spawn one
[`code-scout`](../../agents/code-scout.md) per area, **all in a single message** so they run
concurrently.

Ask each for **evidence, not a design**: where the behaviour lives today, what the code does at
`path:line`, which call sites exist, what the surrounding conventions are, **what already exists that
this should copy rather than reinvent**, and what it could not establish.

**A scout that comes back empty is a result, not a failure to hide.** The plan says `NOT LOCATED` for
that area, and its first task becomes the investigation rather than a change to a file nobody found.

## Step 3 — Read the rules that bind this change

Before designing anything, read what already governs it. A plan that routes around a documented seam or
reaches for a forbidden library is wrong before a line is written, and this is the cheapest moment to
find out. `.agents/docs.md` names all of it: the glossary, the repo rules, the conventions, the
architecture documents, the accepted decisions.

**Documented seams and accepted decisions are constraints, not suggestions.** A change that routes
around one is a finding even when the code is otherwise correct.

**Anything an analyzer, formatter or the compiler already enforces is not a plan decision.** The build
fails on it anyway.

## Step 4 — Name the test seams here, not while writing tests

A **seam** is the public boundary the behaviour can be observed at without reaching inside.

- **Prefer an existing seam.** A new one is new public surface, and it usually exists only to make one
  test convenient.
- **Use the highest seam that still observes the behaviour.** Higher means fewer tests covering more,
  each closer to what a user actually does.
- **Fewer is better; one is ideal.** Every extra seam is another interface the change is pinned to.
- **Pick the cheapest test level that can faithfully reproduce the failure mode.** If stubbing at a
  cheap level would trivialise the assertion, promote the test or rename it to match what it actually
  proves. The levels and their costs are in `.agents/gates.md`.

**A seam chosen while writing the test is chosen to make that test easy**, which is how a suite ends up
pinned to the implementation it was meant to be independent of.

**An acceptance criterion no seam can observe belongs in `## Unresolved`, never in a task.** Either the
criterion needs restating or the change needs a seam it does not have, and both are decisions somebody
should take deliberately.

**Clear the coverage floor in the plan, not at the gate.** The floor is in `.agents/gates.md`. Anything
genuinely not worth covering — a thin adapter, a generated surface — says so here, with the reason.

## Step 5 — Map every requirement to a task

**Every numbered requirement and criterion gets a task, or an explicit deferral.** A requirement the
plan never mentions has not been deferred — it has been lost, and that is the most common way a plan
fails.

| Spec | Covered by |
|---|---|
| Requirement 1 | Task 2, Task 3 |
| Requirement 2 | **deferred** — <why, and what unblocks it> |
| Criterion 1 | Task 3 test |

## Step 6 — Write `plan.md`

Next to the spec. Committed, like the spec.

````markdown
**Date:** YYYY-MM-DD
**Spec:** `<path to spec.md>` (Specced)
**Scouted:** <sha> on <date>

## Approach

<a paragraph: the shape of the change and why this shape. Alternatives rejected, briefly.>

## Coverage

| Spec | Covered by |
|---|---|
| Requirement 1 | Task 2 |

## Test seams

- `<seam>` — observes requirement <n>. Existing (`path:line`) | new, because <nothing existing observes it>.

## Task 1 — <imperative title>

**Files:** `path/one`, `path/two`
**Today:** <what the code does now> (`path/one:120`)
**Reuse:** <the nearest existing thing to copy> (`path/other:44`)
**Change:** <what to do — behaviour, not a diff>
**Test:** <which test, at which seam, at which level>
**Verify:** `<command>` → <what passing looks like>
**Consumes:** <exact signatures this takes from earlier tasks>
**Produces:** <exact names and types later tasks will rely on>
**Assumes:** Task <n> is done | nothing

## Task 2 — ...

## Risks

- <migration, tenancy, permissions, public contract, deploy ordering> — <what happens if this ships half-applied>

## Unresolved

- <what a scout could not establish, and what it blocks>
- <any criterion no seam can observe>
````

**`Consumes` and `Produces` are not decoration.** An implementer sees only its own task. That block is
how it learns the exact names its neighbours use, and it is what stops two parallel tickets inventing
two names for one thing and colliding at integration.

**`## Unresolved` is mandatory and never empty by omission.** When there is genuinely nothing, write
"Nothing unresolved." An absent section reads as full confidence, and a plan is exactly where unfounded
confidence is most expensive.

## Step 7 — Write tasks somebody can execute

- **No placeholders.** "Implement the handler" is not a task, and `TODO` in a plan is a defect.
- **Every command runnable as written** — no machine-specific absolute path, no credential that will
  not exist elsewhere.
- **Each task leaves the tree building.** A plan whose middle tasks cannot compile is a plan whose
  one-commit-per-task rule is fiction.
- **Order by dependency**, and say what each task assumes is already done.
- **Do not inline the code.** Name the behaviour, the file and the test. Pasted code blocks go stale the
  moment the repo moves, and the implementer is better at writing them than you are at guessing them.

<!-- shared:model-choice:start source=model-choice.md -->
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
<!-- shared:model-choice:end -->

## Re-planning after a Not Ready verdict

Feed the blocking findings and every **contradicted** claim back in, and rewrite.

**A contradicted claim is not a wording problem.** The plan asserted something false about the
repository, so the reasoning resting on it has not been done — re-scout that area rather than editing
the sentence.

**The re-plan cap is in `.agents/lifecycle.md`** — typically one. A plan that fails review twice has
something wrong with its premises, and this loop is cheap to get stuck in. Then get a person.

## Chat summary

The path written, the spec it came from, N tasks and M seams, whether every requirement is covered or
which are deferred, **every area whose scout returned `NOT LOCATED` by name**, and everything under
`## Unresolved`. Then: `/plan-check`.

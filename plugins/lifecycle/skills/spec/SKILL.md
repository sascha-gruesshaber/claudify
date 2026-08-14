---
name: spec
description: Write the settled design down as the contract — one numbered list of requirements, one numbered list of acceptance criteria, the decisions and what they ruled out. States WHAT, never HOW. Commits the spec where the repo keeps them, at Status Specced, where `/plan` and `/build` pick it up. Use after a design is agreed, when someone asks to "write it up", "spec it out", "pin down the requirements", or to revise a spec the work has outgrown. Keywords - spec, write it up, spec it out, requirements, acceptance criteria, the contract, pin it down, revise the spec.
---

# Spec (a settled design → the contract)

Turn the agreed design into a document that can be **graded**. That is the whole difference between a
spec and a conversation: `/plan`, every reviewer and `/build` all measure their work against this file,
and against a conversation they measure against nothing.

Runs after [`grill`](../grill/SKILL.md) reaches an empty frontier.

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

## When NOT to use

- **The frontier is not empty** → back to [`grill`](../grill/SKILL.md). A spec with holes is a contract
  nobody can sign.
- **A spec already exists for this work** → read it and use `--revise`. Never write a second one; two
  specs for one change is a contradiction nothing detects.
- **A change too small to have requirements.** A one-line fix does not need a contract, and writing one
  costs more than the change.
- **Turning it into tasks** → [`plan`](../plan/SKILL.md).

## Step 1 — Where it goes

The path is in `.agents/tracker.md` — typically `<specs dir>/<KEY>-<short-desc>/spec.md`, with the
same `<short-desc>` as the branch per `.agents/naming.md`. Without a ticket key the directory is just
`<short-desc>`.

**It is committed.** Unlike every comparable system, the spec lives in the repo, moves through review
and has a history — which is what makes "was this requirement weakened to fit the code?" answerable at
all. Do not put it anywhere else.

## Step 2 — Write it

```markdown
**Date:** YYYY-MM-DD
**Status:** Specced
**Ticket:** <KEY> | none

**Scope:** One paragraph — what this covers and what it deliberately doesn't.

## Problem

Two or three sentences: what is wrong or missing today, for whom, and why now. No design.

## Requirements

1. <what the system must do, observably> — *source: ticket description*
2. <...> — *source: Q3 answered B*
3. ~~withdrawn~~ — <why, and when>

## Acceptance criteria

1. <an observable outcome a test or a tester can settle> — *covers requirement 1*
2. <...> — *covers requirements 2, 3*

## Decisions

- **<decision>** — <the reason, one clause>. Rejected: <the live alternative and why not>.

## Constraints

- <an edge case settled without asking> — assumed because <convention / codebase / low-risk default>.

## Out of scope

- <what this deliberately does not cover, especially anything a reader would expect it to>

## Open

- <a question still unanswered> — blocks criterion <n>. *(Delete this section once empty.)*
```

**The header is fixed, not free-form.** It is the one place any skill looks to know where the work
stands. `Specced` means designed and agreed, nothing built.

**`## Decisions` carries the rejected alternatives**, or the design gets relitigated in three months.
A decision with no live alternative is not a decision; leave it out.

**`## Decisions` is not `## Implementation`.** Record *what was chosen* — a library, a boundary, a data
shape the user agreed to. The moment you name a file path, a class or a task order, it belongs in
[`plan`](../plan/SKILL.md), where it gets scouted against the real code and reviewed.

<!-- shared:criterion-quality:start source=criterion-quality.md -->
**A criterion nobody can settle is worse than a missing one.** It survives every review, because each
reviewer grades how completely the wording was satisfied rather than whether it could be.

- **State an observable outcome. Never name a function, a control-flow step, or a validity notion the
  change is expected to introduce.** Naming one that does not exist yet hands the implementer a design to
  invent in order to satisfy the wording, and from then on every review grades how completely the
  invention was built.
- **No proxy evidence.** A criterion the repository cannot produce evidence for is not a criterion. The
  only thing that could satisfy "the code is clear" is a test asserting some prose is still present.
- **Verify every count, path, symbol and file the criterion asserts, with a command you actually ran** —
  a `git ls-files`, a grep whose output you read. A number you have not confirmed belongs in the
  criterion as **"every site"**, a form an off-by-one cannot falsify, not as "the five sites".
- **Read the criteria together as a set** and confirm one implementation can satisfy all of them at once.
  Two criteria that are individually reasonable and jointly impossible are visible only side by side.

The same bar governs an assumption recorded instead of a question: an assumption you cannot check is a
question somebody should have asked.
<!-- shared:criterion-quality:end -->

## Step 3 — Check it before anyone builds on it

Everyone who has read this so far was in the room while it was designed, so the question that decides
its quality — **does this document stand on its own?** — is still unasked.

Spawn [`spec-reviewer`](../../agents/spec-reviewer.md) once per lens, all of them in one message.
Lenses, and the bodies to paste, are in [`spec-lenses.md`](spec-lenses.md).

Say one line first, so a fresh round of questions does not arrive unexplained:

> Four reviewers are reading this cold — none of them saw our conversation. Anything they cannot work
> out from the document alone is something an implementer will not be able to either.

**Route by severity. That is yours, not the user's:**

- **`fix`** — apply it yourself and report a count, not a list.
- **`question`** — back to [`grill`](../grill/SKILL.md). Each is a live frontier item: ask them as one
  round, each with your recommendation, then wait. A gap settled here in a sentence is one an
  implementer would otherwise settle alone at 200k context.
- **`note`** — drop it unless it changes something.

Fold every answer back in, decisions and rejected alternatives included, so the document carries the
reasoning rather than the conversation.

**The round cap is in `.agents/lifecycle.md`** — typically two, the second only if the first changed
the design. A spec that gained three decisions is worth re-reading; one that gained wording is not. If
a further round still returns `question` findings, stop spawning reviewers, carry on with the user
directly, and record what is still open under `## Open`.

## Step 4 — Commit

One commit: `docs(specs): design <feature>`, per `.agents/naming.md`. Leave it uncommitted until step 3
is done — what comes back usually changes it.

Then put it in front of the user: spawn [`operator-view`](../../agents/operator-view.md) with the path.
They are about to be asked to agree with a document they have so far only seen as chat messages.

## Step 5 — Tell the board, if that is a standing write

<!-- shared:tracker-limits:start source=tracker-limits.md -->
**Read the issue tracker freely. Write to it only as `.agents/tracker.md` allows** — at the repository
root. That file names the tracker, the project key, and the writes that are standing permission here
— typically none, or a small closed set such as claiming a ticket when work starts and commenting the
agreed design and the shipped link.

Limits that hold for every write, whatever the tracker:

- **Only the writes that file lists.** Anything wider — creating issues, a bulk edit, another field —
  needs a manifest shown to the user and an explicit go-ahead.
- **English, whatever language the session ran in.** A board is read outside the team that fills it.
- **Only ever forwards.** Never drag an item backwards, and never set a status that reports an *outcome*
  — those stay human calls.
- **If it is assigned to somebody else, leave it and say so.** Taking a colleague's ticket silently costs
  more than it saves.
- **Never blocking.** Missing credentials, a 404 or an outage each cost one line, and the run carries on.
  **The committed spec is the authority; the board is a convenience.**

Say in one line what you wrote and where. If `.agents/tracker.md` is missing, **write nothing** and
carry on with the local files.
<!-- shared:tracker-limits:end -->

## Revising

`--revise` rewrites an existing spec **in place, preserving every number**. New requirements append;
removals become `~~withdrawn~~`. If it cannot preserve the numbering, it stops and says why.

**A revision during implementation is a retrofit risk.** Weakening a requirement so the code passes
turns a failed implementation into a passing one without anybody deciding to. So a revision says in the
header **what changed and why** — and because the spec is committed, the diff backs that up.

**An old-shape spec is left alone until it is revised.** Specs written before this numbering existed
are read as they are; `--revise` is what gives them numbers.

## Chat summary

The path, the status, the counts (N requirements, M criteria, K constraints), every open question by
name if the status is draft, and anything the grounding pass found — a requirement the codebase already
satisfies, one that looks impossible, an attachment nobody could read. Then: `/plan` is next.

## Language

The spec is **English**. Chat may stay in the user's language.

## Dispatching the agents

<!-- shared:agent-names:start source=agent-names.md -->
**These agents ship inside this plugin, so their `subagent_type` carries the plugin prefix:**
`lifecycle:code-scout`, `lifecycle:spec-reviewer`, `lifecycle:change-reviewer`,
`lifecycle:ticket-implementer`, `lifecycle:finding-fixer`, `lifecycle:operator-view`.

A bare name may resolve, and it may also pick up a different agent the repo happens to define. **Pass
the prefixed form.** Where this document links an agent by file, the prefixed name is what goes in the
dispatch.
<!-- shared:agent-names:end -->

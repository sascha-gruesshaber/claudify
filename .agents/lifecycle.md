# The lifecycle, as this repo runs it

Which phases run, how hard each loop turns, and which reviews are worth their cost here.

## Phases

| Phase | Skill | On? | Notes |
|---|---|---|---|
| frame the request | `/frame` | yes | |
| grill the design | `/grill` | yes | |
| write the spec | `/spec` | yes | first run creates `docs/specs/` |
| plan against the code | `/plan` | yes | |
| check the plan | `/plan-check` | yes | |
| build it | `/build` | yes | |
| ship it | this repo's own | — | `/build` stops at a green branch; see [`forge.md`](forge.md) |

**The fast path.** A change that needs the word "and" to describe takes the full path. Everything below
that skips straight to a commit:

- a single-file documentation edit — `README.md`, `CONTRIBUTING.md`, `ATTRIBUTION.md`, one plugin README
- a version bump across `plugin.json` and `marketplace.json` together
- a typo or one-line wording fix inside one skill, with `skills.mjs check` still clean
- adding a CI step that only greps, with nothing else changed

**Not fast, however small it looks:** any edit under `skills/_shared/fragments/` (it rewrites up to 18
tracked files), and anything that changes what a skill *does* rather than how it reads.

**The ratchet is one way.** Hidden complexity found later upgrades the path. Nothing downgrades
mid-flight, and reaching for a lighter label to skip work *is* the doubt that means you should take the
heavier one.

## Review lenses in use

Per ticket: **one** reviewer with the *ticket review* lens.

In the whole-feature sweep, these — from the catalogue in the plugin's `build/prompts.md`:

| Lens | When |
|---|---|
| spec alignment | always |
| correctness | always |
| over-engineering | always |
| repo standards | always |
| docs completeness | always |
| test gaps | **only if anything under `plugins/lifecycle/skills/_shared/tools/` changed** — the only unit-testable code here |

**Not in use here, and why:**

- **UI patterns** — never. There is no front end, no component, no page. It can never apply.
- **security & permissions** — never. There is no auth, no tenancy, no permission model, no runtime that
  handles a request. It can never apply.

Both are recorded as *never applicable*, not as *dropped for cost*. If this repo ever grows either, this
line is wrong and the lens comes back.

**Why `docs completeness` is an always here** and not the most deferrable lens it usually is: this repo's
product *is* documents. `README.md` mirrors what ships in four tables, and `CONTRIBUTING.md` § *What is
not proved yet* is a live list. Drift there is a defect in the deliverable, not a stale comment. See
[`docs.md`](docs.md) § *Docs are part of done*.

**Why `test gaps` is conditional** and not an always: for a markdown skill there is no test that can
fail, so the lens has nothing to look at and would push toward writing a test that asserts prose still
exists — exactly the failure the lens is meant to catch. It earns its cost only on
`skills/_shared/tools/`. See [`gates.md`](gates.md) § *What "test-first" means here*.

## Effort and budget

**Plan paying for this:** Max 5×
**Profile taken:** the Max 5× profile from the plugin's `onboard/plan-profiles.md`, **unchanged.**

| Setting | Value |
|---|---|
| wave width | 1–2 |
| spec cold reads | all 4 |
| plan-check | all 8 axes, sonnet |
| per-ticket review | 1 ticket-review lens, sonnet |
| sweep lenses | 5, sonnet (6 when the tooling changed) |
| fix rounds per ticket | 3 |
| implementation | opus on design-carrying, sonnet on mechanical |
| sweep fix | opus |

**Going to three tickets in a wave is where this plan stops being enough.** That is the observed edge,
and it is the first thing to pull back if limits start being hit.

What a single call is allowed to cost. **Wave width and the lens count move cost far more than the tier
does** — and a cheap tier on design-carrying work usually costs *more*, because it takes two or three
times the turns. Narrow the work before you downgrade it.

| Role | Model | Effort* | Soft output ceiling |
|---|---|---|---|
| `code-scout` — locate code, cite `path:line` | sonnet | low | 800 |
| `spec-reviewer` — one lens on a spec | sonnet | medium | 400 |
| `spec-reviewer` — the implementability lens | opus | high | 600 |
| `change-reviewer` — one lens per ticket | sonnet | medium | 400 |
| `change-reviewer` — one lens in the sweep | sonnet | medium | 600 |
| `ticket-implementer` — mechanical slice | sonnet | medium | — |
| `ticket-implementer` — design-carrying slice | inherit | high | — |
| `finding-fixer` — a triaged list | sonnet | medium | 300 |
| `finding-fixer` — the whole-feature sweep | opus | high | 400 |
| `operator-view` | sonnet | low | 1 line |

***Effort is only settable where the harness exposes it.*** The `Agent` tool takes a `model` but **no
effort parameter**, so a skill dispatching through it cannot set effort — the agent inherits the
session's. Treat the column as intent: it says which calls deserve a high-effort session, not a flag
anybody can pass.

**Ceilings are in output tokens, and they are soft.** A callee that cannot finish inside its ceiling
returns `reviewer-uncertainty` and says what it did not reach. **It never returns a shallow pass that
fits the budget** — the caller cannot tell that apart from a clean result, and would ship on it.

### Per-phase ceilings

Not enforced by anything. They are the number at which a run should stop and ask whether it is still
doing the right thing. **These are set low, because this is a small repo** — 64 tracked files, one
tested module. A phase that blows one of these is almost certainly re-reading things it already read.

| Phase | Rough ceiling | What blows it |
|---|---|---|
| `/frame` | 20k | scouting more than the two or three files a change here touches |
| `/spec` + its 4 cold reads | 60k | a second and third review round |
| `/plan` + `/plan-check` | 100k | re-planning after a Not ready verdict |
| one ticket: build + review + fix | 150k | fix rounds; the cap below is what bounds it |
| the whole-feature sweep | 100k | the lens count above, more than anything else |

### If a limit is hit, cut in this order

Ranked by value per token. The full table is in the plugin's `onboard/plan-profiles.md`.

1. wave width to 1 — the biggest single lever
2. drop, from the bottom up: test gaps (if it was even on), over-engineering, repo standards
3. lower the tier on **mechanical** slices only
4. fix rounds to 1

**Never cut the implementability spec review or plan-check's claims axis**, whatever the plan. They are
the two places where a small spend prevents a large one.

**Do not cut `docs completeness` here** unless nothing outside `plugins/` moved. In this repo it is
checking the deliverable, not a comment.

### When to spend more, deliberately

- a change under `skills/_shared/fragments/`, on the correctness lens — one edit reaches up to 18 files
- a change to `skills.mjs` or `fragments.json`, on correctness and test gaps — it is the gate itself
- a change that alters what a skill *does*, on spec alignment — CI cannot see behaviour, only consistency
- a lens that came back `clean` on a diff you have concrete reason to distrust

**Say in one line when you escalate, and why.** Silently overspending and silently underspending are the
same defect.

## Loop caps

| Loop | Cap | Then |
|---|---|---|
| fix rounds per ticket | 3 | park the rest with a written ruling; carry it to review |
| re-plan after a Not Ready verdict | 1 | fetch a human — twice means the premises are wrong |
| spec cold-read rounds | 2 | the second only if the first changed the design |
| grilling rounds | none | ends when the frontier is empty, or the user stops it |

## Parallelism

**This repo can be checked out twice.** No database, no build output, no absolute paths; `skills.mjs`
resolves everything relative to the plugin root, and `.claude/worktrees/` is already gitignored. So
worktrees work, and wave width is set by the plan, not by a blocker.

- **Wave width:** 2 — from the Max 5× profile, not from a repo limit.
- **Worktrees:** `.claude/worktrees/<branch with / → +>`
- **Split threshold:** one unit of work up to ~150k estimated context or ~10 changed hand-written files.
  Over either, split into tickets. **Injected fragment copies do not count toward the file total** —
  `skills.mjs sync` generates them, so one fragment edit is one file of work and up to 18 files of diff.

### Files that must not be touched in parallel

| What | Why |
|---|---|
| `plugins/lifecycle/skills/_shared/fragments/**` and every managed region | Two worktrees syncing the same fragment conflict in generated text nobody wrote. **A ticket that edits a fragment runs alone.** |
| `plugins/lifecycle/skills/_shared/fragments.json` | Append-heavy manifest; two tickets adding a requirement both rewrite the same object |
| `README.md` | Four tables mirror what ships; two tickets both edit them |
| `.claude-plugin/marketplace.json` + `plugins/*/.claude-plugin/plugin.json` | **The version pair must move in one commit.** Bump it once, at integration — never inside a per-ticket worktree. |

## Where specs and tickets go

See [`tracker.md`](tracker.md).

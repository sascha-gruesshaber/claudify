# The lifecycle, as this repo runs it

Which phases run, how hard each loop turns, and which reviews are worth their cost here.

## Phases

| Phase | Skill | On? | Notes |
|---|---|---|---|
| frame the request | `/frame` | yes | |
| grill the design | `/grill` | yes | |
| write the spec | `/spec` | yes | |
| plan against the code | `/plan` | yes | |
| check the plan | `/plan-check` | yes | |
| build it | `/build` | yes | |
| ship it | *this repo's own* | — | `/build` stops at a green branch; see `forge.md` |

**The fast path.** A change that needs the word "and" to describe takes the full path. Everything
below that skips straight to a commit:

- <a single-file documentation edit>
- <a dependency bump>
- <a one-line fix with an existing test>

**The ratchet is one way.** Hidden complexity found later upgrades the path. Nothing downgrades
mid-flight, and reaching for a lighter label to skip work *is* the doubt that means you should take
the heavier one.

## Review lenses in use

Per ticket: **one** reviewer with the *ticket review* lens.

In the whole-feature sweep, these — from the catalogue in the plugin's `build/prompts.md`:

| Lens | When |
|---|---|
| spec alignment | always |
| correctness | always |
| over-engineering | always |
| test gaps | always |
| repo standards | always |
| <UI patterns> | <only if the front end changed> |
| <security & permissions> | <only if auth, permissions or tenant scoping changed> |
| <a lens specific to this repo> | <when> |

**Not in use here, and why:** <lens> — <reason>. A lens nobody drops is a lens nobody chose.

## Effort and budget

**Plan paying for this:** <Pro | Max 5x | Max 20x | API billing>
**Profile taken:** <the matching one from the plugin's `onboard/plan-profiles.md`, adjusted where noted>

What a single call is allowed to cost. **Wave width and the lens count move cost far more than the tier
does** — and a cheap tier on design-carrying work usually costs *more*, because it takes two or three
times the turns. Narrow the work before you downgrade it.

| Role | Model | Effort | Soft output ceiling |
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

**Ceilings are in output tokens, and they are soft.** A callee that cannot finish inside its ceiling
returns `reviewer-uncertainty` and says what it did not reach. **It never returns a shallow pass that
fits the budget** — the caller cannot tell that apart from a clean result, and would ship on it.

### Per-phase ceilings

Not enforced by anything. They are the number at which a run should stop and ask whether it is still
doing the right thing.

| Phase | Rough ceiling | What blows it |
|---|---|---|
| `/frame` | <30k> | scouting a codebase nobody has mapped |
| `/spec` + its 4 cold reads | <80k> | a second and third review round |
| `/plan` + `/plan-check` | <150k> | re-planning after a Not ready verdict |
| one ticket: build + review + fix | <250k> | fix rounds; the cap below is what bounds it |
| the whole-feature sweep | <120k> | the lens count above, more than anything else |

### If a limit is hit, cut in this order

Ranked by value per token, so the cheap-and-valuable survives. The full table is in the plugin's
`onboard/plan-profiles.md`.

1. wave width to 1 — the biggest single lever
2. drop, from the bottom up: docs completeness, repo standards, over-engineering, test gaps
3. lower the tier on **mechanical** slices only
4. fix rounds to 1

**Never cut the implementability spec review or plan-check's claims axis**, whatever the plan. They are
the two places where a small spend prevents a large one.

### When to spend more, deliberately

- a diff of more than ~15 changed files, on the correctness or spec-alignment lens
- any change touching auth, permissions, tenancy, a migration or a wire contract
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

- **Wave width:** 3 tickets. <Set to 1 if this repo cannot be checked out twice.>
- **Worktrees:** `.claude/worktrees/<branch with / → +>`
- **Split threshold:** one unit of work up to ~250k estimated context, ~12 changed production files,
  or <n> services. Over any of those, split into tickets.
- **Files that must not be touched in parallel:** <generated files, append-heavy manifests>

## Where specs and tickets go

See [`tracker.md`](tracker.md).

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

# Picking tiers and lenses for the plan you are actually on

Read this with `/onboard` question 6. It turns "how much may one call cost" into four ready-made
profiles, because the honest answer depends on something the repo cannot tell you: **which subscription
is paying for the run.**

> **This is calibrated on one project, not a benchmark.** The numbers below come from a .NET monorepo of
> roughly 12 services and 3 front ends, where this lifecycle was used daily for months. Treat the
> *shape* as advice and the numbers as a starting point. **Plan names and prices change** — check current
> pricing rather than trusting the figures here; the profile is the durable part.

## First, what actually burns the budget

Three things, and the order surprises people:

1. **Wave width, more than anything else.** A wave of three tickets is three full
   implement → review → fix cycles running *at once*. It does not just cost three times as much in
   total — it burns three times as fast, against a rolling window. **This is the single biggest lever on
   whether you hit a limit.**
2. **The lens count.** Six sweep lenses cost three times two. Each is a whole agent reading a whole diff.
3. **The tier.** Real, but third — and see the trap below before you reach for it.

## The trap: cut scope before you cut tier

**A cheap model on hard work often costs more than an expensive one.** It takes two or three times the
turns, fails its gates, gets re-dispatched, and you pay for every attempt. This is already the law in
`model-choice`, and it is exactly where a tight budget goes wrong:

> Downgrading a **design-carrying** slice to save money is the most reliable way to spend more.

So when the budget is tight, in this order:

1. **Narrow the work.** Wave width to 1. Fewer, smaller tickets.
2. **Drop lenses**, using the cut order below.
3. **Lower the tier — but only on the mechanical slices**, where the brief already contains the shape.
4. **Only then** consider the tier on design-carrying work, and expect it to disappoint.

## The four profiles

### Pro — roughly €20/month

Real constraint. Assume Opus is scarce or unavailable, and plan for it rather than discovering it
mid-wave.

| Setting | Value |
|---|---|
| wave width | **1** — no parallelism at all |
| spec cold reads | **1 lens: implementability** |
| plan-check | **keep it**, sonnet, all eight axes |
| per-ticket review | **keep it** — one ticket-review lens |
| sweep lenses | **2: correctness, spec alignment** |
| fix rounds per ticket | **1** |
| implementation | sonnet; escalate one slice at a time only if it stalls twice |
| sweep fix | sonnet |

**Also worth doing on Pro:** take the fast path more often. `/frame` offers it, and a change that
genuinely does not need a contract should not get one.

### Max 5× — roughly €100/month

**This is the measured working point.** Mostly Opus, **one or two tickets at a time**, comfortably
within the window for a full working day.

| Setting | Value |
|---|---|
| wave width | **1–2** |
| spec cold reads | all 4 |
| plan-check | all 8 axes, sonnet |
| per-ticket review | 1 ticket-review lens, sonnet |
| sweep lenses | 5, sonnet |
| fix rounds per ticket | 3 |
| implementation | opus on design-carrying, sonnet on mechanical |
| sweep fix | opus |

**Going to three tickets in a wave is where this plan stops being enough.** That was the observed edge,
and it is the first thing to pull back if you start hitting limits.

### Max 20× — roughly €200/month

Headroom for the full shape.

| Setting | Value |
|---|---|
| wave width | **3** |
| spec cold reads | all 4, opus on implementability and scope |
| plan-check | all 8, opus on coverage and risk |
| sweep lenses | 5–7, and escalate a lens on a diff you distrust |
| fix rounds per ticket | 3 |
| implementation | opus by default |

**Above three, the binding limit stops being the plan and becomes you.** Wave width is bounded by how
many agent reports one orchestrator can triage well — go wider and the reports get skimmed, which is the
failure the reviews existed to prevent.

### API or console billing

No rolling window, so nothing stops a runaway — the failure mode inverts. **The per-phase ceilings in
`.agents/lifecycle.md` do the work here**, and they are the section to actually fill in rather than
leave as defaults.

## The cut order

When something has to go, drop from the bottom. This is ranked by **value per token**, not by how
thorough it feels:

| Keep | Why it earns its cost |
|---|---|
| 1 · **implementability**, on the spec | One call, and it can prevent a whole wrong build. Best ratio in the kit. |
| 2 · **plan-check's claims axis** | Greps and file opens. Cheap, and it stops work being built on fiction. |
| 3 · **the per-ticket review** | Catches a missed acceptance criterion while the context is still warm and the fix is one round. |
| 4 · **correctness**, in the sweep | Finds real bugs, with a repro attached. |
| 5 · **spec alignment**, in the sweep | Catches drift across tickets that no per-ticket review can see. |
| — | *cut from here down first* |
| 6 · test gaps | Real value, but a coverage gate catches much of it. |
| 7 · over-engineering | Cheap to fix later; nothing breaks meanwhile. |
| 8 · repo standards | Largely what a linter and a formatter already enforce. |
| 9 · docs completeness | The most deferrable. Costs nothing today and something in six months. |

**Never cut 1 or 2**, whatever the plan. They are the two places where a small spend prevents a large
one, and cutting them is how a tight budget becomes an expensive rebuild.

## When you hit a limit mid-run

It will happen inside a wave, because that is when burn is highest.

- **Finish the ticket that is in flight.** A half-built ticket in a worktree is the most expensive thing
  to come back to.
- **Integrate what is green**, and update the ledger and the spec header. `/lifecycle:advance` picks it
  up from disk later — that is what the committed state is for.
- **Then narrow and resume**: wave width 1, and the cut order above.
- **Do not** re-dispatch the same wave on a cheaper tier and hope. That pays twice for one result.

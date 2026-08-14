# claudify

Two Claude Code plugins, in one marketplace.

| Plugin | What it is |
|---|---|
| **`lifecycle`** | A committed-spec engineering lifecycle: twelve callable skills and six sub-agents that take a ticket to a green branch. Reads how *your* repo works from `.agents/`. |
| **`plain-words`** | Report in controlled English. Small words, one idea per sentence, what you did / did it work / what now. |

## Install

```bash
/plugin marketplace add sascha-gruesshaber/claudify
/plugin install lifecycle@claudify
/plugin install plain-words@claudify
```

Then, in the repo you want to use it in:

```
/onboard
```

That is the setup ceremony. It reads your repository, asks only what it cannot read, proposes where
your way of working should change, and writes the eight files under `.agents/` that every other skill
reads. Nothing works until it has run — and that is deliberate.

## The lifecycle

```
/frame ──▶ /grill ──▶ /spec ──▶ /plan ──▶ /plan-check ──▶ /build ──▶ a green branch
   │          │          │         │            │             │
 facts &   design    the        tasks,      a verdict     waves of
 questions settled   contract   scouted     on the plan   worktree
                                                          agents
```

Each one also runs alone. Four more are called from inside the loop: **`/tdd`** (the red-green loop),
**`/diagnose`** (a feedback loop before a theory), **`/resolve-conflicts`**, and **`/show`** — which puts
a flow, a decision round or a spec on a page whose every block the user can annotate, and reads their
notes back labelled.

## Or don't remember the chain at all

Every artefact the lifecycle writes is committed, and the spec's `Status:` header is a state machine — so
one skill can read where the work stands and run whatever comes next.

```
/lifecycle:advance          run the next phase, and keep going until a phase needs you
/lifecycle:advance --dry    say where you are and what is next. Run nothing.
/lifecycle:advance --once   run exactly one phase, then stop
```

Saying **"advance"** or **"what's next"** in a sentence does the same thing — no slash needed.

It **halts at every phase that needs a person** — `/onboard`, `/frame`, `/grill`, and `/build`'s single
go-ahead — and at a `Not ready` verdict, a loop cap, or a state it does not recognise. **A halt always
names the next command.**

It reads the state **off disk, never from the conversation**, so it gives the same answer in a fresh
session the next morning. On a repo it has never seen:

```
effort    none            (matched by: rule 4 — nothing found)
status    repo not set up
beside    .agents/ ✗   spec.md ✗   plan.md ✗   issues/ —
next      /lifecycle:onboard
halting   --dry mode, and /onboard needs a person anyway
```

> **Commands need the namespace; skills do not.** Verified on a real install:
>
> | | Bare | Namespaced |
> |---|---|---|
> | **commands** — `advance` | ✗ `Unknown command: /advance` | ✓ `/lifecycle:advance` |
> | **skills** — `frame`, `plan`, `build`, `workflow` | ✓ `/frame` | ✓ `/lifecycle:frame` |
> | **agents** — `code-scout` and the rest | risky, may hit a repo's own agent | ✓ `lifecycle:code-scout` |
>
> So the only thing that needs typing in full is `/lifecycle:advance`. Everything else takes the short
> form, and plain English works for all of it.

**`/build` stops at a green branch.** Opening a review, posting questions on it and watching it are
your repo's business, and they differ everywhere — `.agents/forge.md` records how it happens for you.

### What each phase is for

| Skill | In | Out |
|---|---|---|
| `/advance` | whatever is on disk | the next phase, run |
| `/onboard` | a repo | `.agents/`, eight files |
| `/frame` | a ticket or a sentence | the facts, the size, the questions worth asking |
| `/grill` | a rough idea | a settled design, glossary terms, decision records |
| `/spec` | a settled design | a committed contract, cold-read by four reviewers |
| `/plan` | a contract | ordered tasks, after agents actually read the code |
| `/plan-check` | a plan | Ready / Ready with changes / Not ready, with every claim verified |
| `/build` | a Ready plan | a green branch, and a record of every decision taken for you |
| `/show` | anything worth seeing | a page the user annotates; their notes come back labelled |

## The idea

**The plugin ships law. Your repo keeps shape.**

*Law* is how to work well — grill until the frontier is empty, one worktree per writing agent, evidence
before claims, a spec states WHAT and a plan states HOW. It is true in any repository, so it ships
inlined in the skills.

*Shape* is what your repo happens to be — the build command, the tracker, the git host, where the
architecture docs live. It is true in exactly one repository, so it lives in `.agents/` and the skills
read it at run time.

That line is the whole design. It is enforced mechanically: see
[`plugins/lifecycle/skills/_shared/README.md`](plugins/lifecycle/skills/_shared/README.md).

## The eight files `/onboard` writes

| File | Answers |
|---|---|
| `lifecycle.md` | which phases run, which review lenses, how many rounds, how wide a wave |
| `gates.md` | the commands that must pass, in order, and what "green" means |
| `tracker.md` | where specs and tickets live, and what may be written to the board |
| `forge.md` | the git host, and how a branch becomes a reviewed change |
| `docs.md` | where architecture truth lives, the glossary, what "docs are part of done" costs |
| `naming.md` | branch, commit, directory and test-name grammar |
| `working-agreement.md` | hours, unattended work, the autonomy line, how to report |
| `README.md` | one page saying the above is authority |

They are **committed**, so they are reviewable in a pull request and greppable by a human. Templates
are in [`plugins/lifecycle/skills/onboard/templates/`](plugins/lifecycle/skills/onboard/templates/).

## What it costs, and how you cap it

The lifecycle spends model time deliberately, at the points where a mistake is cheapest to fix:

- **four reviewers read every spec cold**, before anybody builds on it;
- **the plan is verified against the repository** — every `path:line` opened, every count checked, every
  "nothing else calls this" grepped;
- **every ticket gets its own worktree, its own review and its own fix loop**;
- **the finished feature gets a whole-feature sweep** that per-ticket review cannot see.

The bet is that one wrong plan costs more than all of it. If your change is small, take the fast path
`/frame` will offer you.

**You set the price.** `.agents/lifecycle.md` § *Effort and budget* fixes, per role, the **model tier**,
the **reasoning effort** and a **soft output ceiling** — and `/onboard` asks you for all three. Four
levers, in the order they actually move cost:

| Lever | Where | Why it matters |
|---|---|---|
| **how many calls** | the lens list | six lenses cost three times two. By far the biggest lever. |
| **which tier** | per role | a cheap tier where the brief already contains the shape |
| **how much effort** | per role | separate from tier — the review lenses are where effort earns most |
| **the output ceiling** | per role | how long a report may run |

The ceiling is **an instruction to the callee, not an enforced limit**, so it is written with a
consequence: a reviewer that cannot finish inside its budget must **say so and escalate, never return a
shallow pass that fits**. A truncated report reading as complete is the one outcome worse than an
expensive one, because the caller cannot tell and ships on it.

### Match it to the plan you are on

`/onboard` asks which subscription is paying, because it changes the right answer more than anything in
the repo does. Four ready-made profiles are in
[`plan-profiles.md`](plugins/lifecycle/skills/onboard/plan-profiles.md).

| Plan | Wave width | Spec cold reads | Sweep lenses | Implementation |
|---|---|---|---|---|
| **Pro** ~€20 | 1 | 1 — implementability | 2 | sonnet |
| **Max 5×** ~€100 | **1–2** | 4 | 5 | opus on design, sonnet on mechanical |
| **Max 20×** ~€200 | 3 | 4, opus on two | 5–7 | opus by default |
| **API billing** | 3 | 4 | 5–7 | per-phase ceilings do the work |

**Max 5× at one or two tickets in parallel is a measured working point**, not a guess — it is how the
project this came from ran for months. Three tickets in a wave is where that plan stops being enough.

Two things that are easy to get wrong:

- **Wave width is the biggest lever**, not the tier. Three tickets is three implement → review → fix
  cycles running *at once*, so it burns three times as fast against a rolling window.
- **Cut scope before you cut tier.** A cheap model on design-carrying work takes two or three times the
  turns and fails its gates, so downgrading it is the most reliable way to spend *more*. Narrow the wave
  and drop lenses first — the cut order is ranked by value per token, and it says **never** drop the
  implementability spec review or `plan-check`'s claims axis, whatever you are paying.

## Status

**v0.2.0 — early. Use it, but read the caveats.** All twelve skills, six agents and the fragment gate are
green, and `/lifecycle:advance` is verified on a real install.
[`CONTRIBUTING.md`](CONTRIBUTING.md) lists what has **not** been proved yet — chiefly that `/build` has
never run end to end. Read it before relying on this for something that matters.

## Where it came from

The lifecycle grew inside one private .NET monorepo and was rewritten here to depend on nothing about
it. Ideas were borrowed from several public skill collections; **no code was.** See
[`ATTRIBUTION.md`](ATTRIBUTION.md).

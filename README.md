# claudify

Two Claude Code plugins, in one marketplace.

| Plugin | What it is |
|---|---|
| **`lifecycle`** | A committed-spec engineering lifecycle: eleven callable skills and six sub-agents that take a ticket to a green branch. Reads how *your* repo works from `.agents/`. |
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

Each one also runs alone. Three more are called from inside the loop: **`/tdd`** (the red-green loop),
**`/diagnose`** (a feedback loop before a theory), **`/resolve-conflicts`**.

**`/build` stops at a green branch.** Opening a review, posting questions on it and watching it are
your repo's business, and they differ everywhere — `.agents/forge.md` records how it happens for you.

### What each phase is for

| Skill | In | Out |
|---|---|---|
| `/onboard` | a repo | `.agents/`, eight files |
| `/frame` | a ticket or a sentence | the facts, the size, the questions worth asking |
| `/grill` | a rough idea | a settled design, glossary terms, decision records |
| `/spec` | a settled design | a committed contract, cold-read by four reviewers |
| `/plan` | a contract | ordered tasks, after agents actually read the code |
| `/plan-check` | a plan | Ready / Ready with changes / Not ready, with every claim verified |
| `/build` | a Ready plan | a green branch, and a record of every decision taken for you |

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

## What it costs

The lifecycle spends model time deliberately, at the points where a mistake is cheapest to fix:

- **four reviewers read every spec cold**, before anybody builds on it;
- **the plan is verified against the repository** — every `path:line` opened, every count checked, every
  "nothing else calls this" grepped;
- **every ticket gets its own worktree, its own review and its own fix loop**;
- **the finished feature gets a whole-feature sweep** that per-ticket review cannot see.

The bet is that one wrong plan costs more than all of it. If your change is small, take the fast path
`/frame` will offer you.

## Status

**v0.1.0 — first draft.** The skills and agents are complete and the fragment gate is green.
[`CONTRIBUTING.md`](CONTRIBUTING.md) lists what has not been proved yet, and it is worth reading before
you rely on this for something that matters.

## Where it came from

The lifecycle grew inside one private .NET monorepo and was rewritten here to depend on nothing about
it. Ideas were borrowed from several public skill collections; **no code was.** See
[`ATTRIBUTION.md`](ATTRIBUTION.md).

# Where the ideas came from

**Ideas were borrowed. No code was.** Every file here was written for this repo, so there is **no merge
and no upgrade path** — refreshing means re-reading a source and deciding again.

## Sources

| Source | What it is | Licence |
|---|---|---|
| **`cm-agentic`** | a private sibling project at the same company, solving the same problem for a 28-repository estate. **The largest single source here.** | private |
| **`superpowers`** | [obra/superpowers](https://github.com/obra/superpowers) | MIT |
| **`mattpocock-skills`** | Matt Pocock's Claude Code skill collection | public |
| **a private .NET monorepo** | where this lifecycle was assembled and used daily for months | private |
| **ASD-STE100** | Simplified Technical English, the controlled language behind `plain-words` | spec |

## What was taken

| Idea | From | Landed in |
|---|---|---|
| A spec states WHAT and may never name a class; a plan states HOW | cm-agentic | `fragments/spec-shape.md`, `spec` |
| Permanently numbered requirements — append, never insert, `~~withdrawn~~` never reused | cm-agentic | `fragments/spec-shape.md` |
| The rules for a criterion that can actually be settled | cm-agentic | `fragments/criterion-quality.md` |
| The seven-category edge-case sweep, and "every one is a question or a written assumption" | cm-agentic | `fragments/edge-case-probe.md`, `frame` |
| Scout the code before planning; every plan claim carries a `path:line` somebody opened | cm-agentic | `plan`, `code-scout` |
| Review the plan before building; verify each claim with the command you ran | cm-agentic | `plan-check` |
| Uncertainty as a routable signal from a closed set | cm-agentic | `fragments/uncertainty-signal.md` |
| Unrequested behaviour is a defect in its own right | cm-agentic | `change-reviewer` |
| **Shared rule files injected as managed regions, with a checker** | cm-agentic | `skills/_shared/`, `tools/skills.mjs` |
| The checker needs a negative control, or there is no evidence it can fail | cm-agentic | `tools/skills.test.mjs` |
| A ledger naming its own spec on line 1, so a compacted run resumes | superpowers | `build` step 1 |
| Hand briefs and diffs over as file paths; the agent returns a status line | superpowers | `fragments/file-handoff.md` |
| Four agent statuses, each with a written handler | superpowers | `fragments/agent-report-contract.md` |
| Fix round one resumes the agent that wrote the code | superpowers | `build` step 4 |
| Never tell a reviewer what not to flag, with the tell-phrases listed | superpowers | `fragments/no-prejudging.md` |
| Evidence before claims — the command, run in this message | superpowers | `fragments/evidence-before-claims.md` |
| `Consumes` / `Produces` on every task, so parallel work agrees on names | superpowers | `plan` step 6 |
| Three paths, and the ratchet only goes up | superpowers | `frame` step 3 |
| The design tree and its frontier, asked a whole round at a time | mattpocock | `grill` |
| The red-green loop, the three test anti-patterns, mock only at boundaries | mattpocock | `tdd` |
| A tight feedback loop **before** a theory; the ways to construct one; a red-capable completion test | mattpocock | `diagnose` |
| Ranked, falsifiable hypotheses before testing any; tag every debug log | mattpocock | `diagnose` |
| Resolve a conflict by finding each side's intent; never `--abort`; never invent behaviour | mattpocock | `resolve-conflicts` |
| One idea per sentence, approved plain words, active voice | ASD-STE100 | `plain-words` |

## Deliberately not taken

**Read this before proposing any of them again.** A rejection nobody wrote down costs the same argument
in six months.

| Idea | From | Why not |
|---|---|---|
| Specs, plans and reports in a gitignored scratch directory | cm-agentic | Their own docs list the cost: per-machine, unshareable, **no history** — so their own "was the spec weakened to fit the code?" check cannot run at all. Ours are committed and move through review. |
| A 1,593-line orchestrator prompt | cm-agentic | A fixed context cost on every turn of a long run. `build` does most of the same job in a fraction of it. |
| The incident behind each rule, inline with the rule | cm-agentic | Excellent as a record, expensive as a prompt. A fragment states the law; commit messages hold the reasoning. |
| A multi-model review panel resolved from a rigor matrix | cm-agentic | Built for a 28-repository estate with a second model family available. **Revisit if a second engine is ever in play.** |
| **Two agent definitions per role, to move the effort axis** | cm-agentic | A workaround for the `Agent` tool having no effort parameter. Costs a byte-identical duplicate of every role plus a check to police it. `.agents/lifecycle.md` records the intent instead, and says so plainly. |
| Plans that inline the code for every step | superpowers | Goes stale the moment the repo moves, and the implementer writes it better than the planner guesses it. A task names behaviour, file, seam and verify command. |
| Never run implementers in parallel | superpowers | They forbid it because of conflicts. **A worktree per ticket removes the conflict**, so waves run up to three. |
| A local companion server for live visual feedback | superpowers | Artifacts plus paste-back first. This is the **named upgrade** when paste-back grates — MIT, zero dependencies. `show` says so at the bottom. |
| A 0–5 scorecard over the estate | cm-agentic | They built it, ran it, and **deleted it**: a number gets quoted without the evidence behind it. Do not rebuild it. |
| Baking the forge into the build orchestrator | — | Review mechanics differ per host and per team more than anything else in the flow. `build` stops at a green branch on purpose. |

## The fact that caused all of it

`mattpocock-skills` is enabled with **no version pin, and it auto-updates.** So a skill the lifecycle
called could change with no commit anywhere in your repo, on a schedule you do not control. There is no
pin available to buy instead.

That is a fact, not a preference, and it produced the rule this whole plugin follows:

> **Fork what the lifecycle depends on; leave what is merely convenient.**

The design-phase skills upstream also carry `disable-model-invocation: true`, so a flow built on them
stalls and asks the user to type the next step. **Nothing here carries that flag, and CI checks that** —
see [`CONTRIBUTING.md`](CONTRIBUTING.md).

## Refreshing

There is no `upstream.json` here, and that is a deliberate simplification of what the source project did:
it pinned a commit per source and had a tool print the log range to re-read. **That machinery is worth
rebuilding only once this plugin has a second maintainer.** Until then the discipline that matters is the
one rule from it:

> When a re-read changes something, bump the pin **in the same commit as the change**. Bumping it alone
> records that somebody looked, which is exactly the claim nobody can check later.

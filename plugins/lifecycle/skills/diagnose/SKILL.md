---
name: diagnose
description: Find the cause of a hard bug or a performance regression by building a tight feedback loop first and a theory second. Six phases — loop, reproduce and minimise, ranked hypotheses, instrument, fix behind a regression test, clean up. Use whenever something is broken, throwing, failing, flaky or slow and nobody knows why, or when someone says "debug this", "why is this happening", "it works locally". Keywords - diagnose, debug, broken, throwing, failing, flaky, slow, regression, why is this happening, repro, root cause, bisect.
---

# Diagnose (a symptom → a cause, behind a regression test)

A discipline for hard bugs. **Skip a phase only when you can say why.**

**A bug whose cause is unknown is not a planning problem.** Do not write a spec or a plan for a fix you
cannot yet name — come here first.

Ground yourself in the glossary and the architecture documents `.agents/docs.md` names for the area,
before you touch anything.

## Redact

This skill has you show commands and captured output. **Redact every secret first** — write
`<REDACTED>` in its place. Build loops against environment variables so the credential stays in the
environment rather than in what you print. Tokens, signed proofs and secret-store values all end up in
captured traffic here: quote only the lines that carry the signal.

If the redacted output is not enough to diagnose the bug, say so and ask.

## Phase 1 — Build a feedback loop

**This is the skill. Everything else is mechanical.** With a tight pass/fail signal that goes red on
*this* bug, you will find the cause — bisection, hypothesis testing and instrumentation all just consume
it. Without one, no amount of reading code will save you.

Spend disproportionate effort here. Be aggressive, be creative, refuse to give up.

### Ways to build one, roughly in this order

1. **A failing test** at whatever seam reaches the bug — the cheapest level in `.agents/gates.md` that
   can go red.
2. **A request against the local stack** — however `.agents/gates.md` or the repo's README says to run it.
3. **The repo's own end-to-end harness**, with whatever fixture reset makes each run start clean.
4. **Replay a captured payload** — save the real message, request or event to disk and push it through the
   handler in isolation.
5. **A throwaway harness** — one component, stubbed dependencies, one call that reaches the bug.
6. **A property or fuzz loop** — for "sometimes wrong", run a thousand inputs and look for the shape of
   the failure.
7. **`git bisect run`** — when it appeared between two known-good states.
8. **A differential loop** — the same input through two versions or two configs, and diff.
9. **Ask the operator to drive.** Last resort, and they are right there in the terminal — give them one
   numbered instruction at a time and capture what they report.

### Tighten it

Treat the loop as a product. Once you have *a* loop, make it faster (cache setup, narrow the scope),
sharper (assert the specific symptom, not "did not crash") and more deterministic (pin time, seed
randomness, isolate the data store, freeze the network).

**A 30-second flaky loop is barely better than none. A 2-second deterministic one is a superpower.**

**A non-deterministic bug does not need a clean repro, it needs a higher rate.** Loop the trigger a
hundred times, parallelise, add load, narrow the timing window. A 50 % flake is debuggable; 1 % is not —
keep raising the rate until it is.

### Done when the loop is tight and red-capable

Name **one command** you have **already run at least once**, and show its invocation and output:

- **Red-capable** — it drives the real code path and asserts **the user's exact symptom**, so it goes red
  on this bug and green once fixed. "Runs without erroring" is not a loop.
- **Deterministic** — the same verdict every run, or a pinned high reproduction rate.
- **Fast** — seconds.
- **Runnable unattended.**

**If you catch yourself reading code to build a theory before that command exists, stop.** Jumping to a
hypothesis is the exact failure this skill prevents. No red-capable command, no phase 2.

**When you genuinely cannot build one**, say so explicitly, list what you tried, and ask for the
environment that reproduces it or a redacted captured artefact. Do not hypothesise without a loop.

## Phase 2 — Reproduce, then minimise

Run the loop and watch it go red. Confirm all three:

- It produces the failure the **user** described, not a different one nearby. Wrong bug, wrong fix.
- It reproduces across runs, or at a high enough rate to work against.
- You captured the exact symptom, so a later phase can prove the fix addresses it.

Then **shrink it to the smallest scenario that still goes red.** Cut inputs, callers, config, data and
steps **one at a time**, re-running after each cut. Done when every remaining element is load-bearing:
removing any one of them turns it green.

A minimal repro shrinks the hypothesis space in phase 3 and becomes the regression test in phase 5.

## Phase 3 — Hypothesise

Generate **three to five ranked hypotheses before testing any of them.** Generating one anchors you on
the first plausible idea.

Each must be **falsifiable** — state the prediction:

> If `<X>` is the cause, then `<changing Y>` makes the bug disappear.

**If you cannot state the prediction, it is a vibe.** Sharpen it or discard it.

**Show the ranked list to the operator before testing.** They often re-rank it instantly — "we deployed a
change to number three yesterday" — or know one they have already ruled out. Cheap checkpoint. Do not
block on it; carry on with your own ranking if nobody answers.

## Phase 4 — Instrument

Every probe maps to a specific prediction from phase 3. **Change one variable at a time.**

1. A debugger or REPL where the environment allows it. One breakpoint beats ten logs.
2. Targeted logs at the boundaries that distinguish the hypotheses.
3. Never "log everything and grep".

**Tag every debug log with a unique prefix** — `[DEBUG-a4f2]` — so cleanup is one grep. An untagged debug
log survives to production.

**Performance is a different branch.** Logs are usually wrong for it. Establish a baseline measurement — a
timing harness, a profiler, a query plan — then bisect. **Measure first, fix second.**

## Phase 5 — Fix, behind a regression test

Write the regression test **before the fix**, but only if a **correct seam** exists — one where the test
exercises the real bug pattern as it occurs at the call site. A seam too shallow to replicate the chain
that triggered it gives false confidence.

**If no correct seam exists, that is itself the finding.** Note it: the architecture is preventing the bug
from being locked down. It belongs in the report, and usually in the area's architecture document.

With a correct seam:

1. Turn the minimised repro into a failing test there.
2. Watch it fail.
3. Apply the fix.
4. Watch it pass.
5. **Re-run the phase 1 loop against the original, un-minimised scenario.**

Step 5 is the one people skip, and it is the one that proves the fix addresses the reported symptom rather
than the shrunken one.

## Phase 6 — Clean up, then say what would have prevented it

Required before you call it done:

- The original repro no longer reproduces — re-run the phase 1 loop.
- The regression test passes, or the absence of a seam is written down.
- Every `[DEBUG-...]` line is gone. Grep the prefix.
- Throwaway harnesses deleted.
- **The hypothesis that turned out correct is in the commit message**, so the next person debugging this
  area learns something.

Then ask what would have prevented it. If the answer is architectural — no good seam, tangled callers,
hidden coupling — say so **after** the fix is in, when you know more than you did at the start. If it is a
fact the next reader needs, it belongs in the area's document in the same change.

<!-- shared:evidence-before-claims:start source=evidence-before-claims.md -->
**If you have not run the command in this message, you cannot say it passes.**

Before any statement that work is done, fixed, passing or ready:

1. Name the command that would prove the claim.
2. Run it in full. Not a subset, not a remembered earlier run.
3. Read the whole output and the exit code.
4. State the claim **with** the evidence, or state what actually happened.

| Claim | What proves it | What does not |
|---|---|---|
| tests pass | the test command's output, 0 failures | a previous run, "should pass" |
| build succeeds | exit 0 from the build | the linter passing |
| lint clean | the linter's output, 0 errors | a partial check |
| the bug is fixed | the original symptom, retested | the code changed |
| the agent finished | `git diff` / `git log` in its tree | the agent reporting success |
| the requirement is met | that requirement checked by name | the suite being green |

**Report what happened, not what you hoped.** A failing gate is reported with its output. A skipped step
is reported as skipped. Words that imply success without evidence — "should", "probably", "looks
right" — are the same violation as claiming it outright.
<!-- shared:evidence-before-claims:end -->

<!-- shared:uncertainty-signal:start source=uncertainty-signal.md -->
**When you cannot reach a confident answer, say so and name which kind.** The caller routes on the name;
a confident-sounding answer about something you could not actually see reads as a clean bill of health,
and it is the worst output you can produce here.

| Signal | Means | The caller's move |
|---|---|---|
| `not-located` | you searched and did not find it | the next step is an investigation, not a change |
| `scout-uncertainty` | the code path is tangled, ownership unclear, the pattern contradicts itself | re-scout, or ask a human |
| `hard-execution` | you know what to build, but the environment or the build keeps defeating you | same tree, stronger model |
| `architectural-ambiguity` | the brief does not actually determine what to build here | back to design — **never guess** |
| `reviewer-uncertainty` | the change is too large for your context, or the brief is too vague to check against | escalate the review |

Two rules that make the signals honest:

- **"I did not find X" and "X does not exist" are different statements.** Only the first is ever provable
  by searching. Label a belief as a belief.
- **A repeated failure is information.** Do not try the same approach a third time hoping for a different
  result — report it.
<!-- shared:uncertainty-signal:end -->

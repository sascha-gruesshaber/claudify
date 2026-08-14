# Where the ideas came from

**Ideas were borrowed. No code was.** Every file here was written for this repo, and nothing is
vendored — so there is no upstream to merge from, and refreshing means re-reading a delta and deciding
again.

## Sources

| Source | What was taken |
|---|---|
| A private .NET monorepo where this lifecycle grew | the whole phase sequence, the fragment mechanism, the sub-agent report contract, the wave scheduler, the ledger, the edge-case probe, the criterion-quality bar |
| Matt Pocock's Claude Code skills | the grilling frontier as an explicit tree; the two-axis review split (standards, spec); the shape of a diagnosis loop; test-first framing |
| Anthropic's `superpowers` | showing work to the operator as a first-class step rather than prose |
| ASD-STE100 Simplified Technical English | the whole basis of `plain-words` — one idea per sentence, approved plain words, active voice |

## Deliberately not taken

Recorded so nothing costs the same argument twice.

- **A separate "tickets" skill.** Splitting is a decision `/build` makes with the size estimate in front
  of it; a standalone skill would split work nobody had sized.
- **Vendoring an upstream skill.** A plugin with no version pin auto-updates, so anything the lifecycle
  called could change without a commit here. Owning the text is the point.
- **A companion server for showing things on screen.** More moving parts than the job needs;
  `operator-view` walks a surface ladder and silently does nothing when there is none.
- **Auto-transitioning tracker items on outcome.** An automatic move to *Done* or *Review* is wrong
  exactly when a change then sits unreviewed for a week.
- **Letting a reviewer triage its own findings.** A reviewer that filters while it looks comes back
  clean for the wrong reason. Cover first, filter second, and the caller judges severity.
- **Per-finding fix agents.** One agent gets the whole triaged list. Many agents on one worktree is the
  same lost-work problem worktrees exist to solve.
- **A generic `update` mutation shape, a generic fetcher seam, or any other one-size interface.**
  Purpose-named operations substitute with one shape; generic ones force conditional logic into the
  stub, which is a second implementation nobody reviews.
- **Baking the forge into `/build`.** Review mechanics differ per host and per team more than anything
  else in the flow. `/build` stops at a green branch on purpose.

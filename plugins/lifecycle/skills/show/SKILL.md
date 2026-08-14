---
name: show
description: Put something in front of the user as a page they can point at — a process flow, a set of options, a spec, a before-and-after, run progress — published as an artifact, opened in whatever browser this machine has, with every block annotatable so their notes come back labelled. Use when a picture would land better than prose, when a decision needs comparing side by side, or when someone says "show me", "draw it", "let me see it", "I want to comment on that". Keywords - show, show me, draw it, diagram, visualise, mockup, flow chart, options, side by side, let me see, annotate, comment on it, feedback page.
---

# Show (a thing → a page you can point at)

Turn something into a page, publish it, open it, and read the user's notes back.

**Decide per question, not per session.** The test is one line: **would they understand this better by
seeing it than by reading it?**

| Show it | Say it in chat |
|---|---|
| a process, a flow, a state machine | a yes/no question |
| four options that differ visually or structurally | two options that differ in one word |
| a spec or plan they are about to agree with | a fact they asked for |
| a comparison with more than two columns | a list of three bullets |
| progress of a long unattended run | a status line |

A question *about* a UI is not automatically a visual question. "What should the rule be?" is a chat
question. "Which of these three layouts?" is a page.

**Never make a page to look thorough.** A page nobody needed costs the user a click and costs you the
tokens to build it.

## Step 1 — Pick the shape

Four shapes cover almost everything. The skeleton and the classes for all of them are in
[`page-template.html`](page-template.html) — **start from it rather than rebuilding the annotation
machinery**, which has bitten this skill twice.

| Shape | For | Blocks |
|---|---|---|
| **flow board** | a process with phases, or several systems compared over the same phases | a grid of `.step` chips, one column per actor, one row per phase |
| **decision sheet** | open questions from a grilling round | one `.card` per question, two to four options, the recommendation marked |
| **document review** | a spec or plan they must agree with | one row per numbered requirement, each annotatable |
| **before and after** | a refactor, a data-model change, a layout change | two `.split` panels side by side |

**Draw the gaps.** A dashed red box where a thing is missing says more than a paragraph about it.

## Step 2 — Build it

Write the file to the session scratchpad, **not into the repo**. If an `artifact-design` skill is
available, load it before writing — it calibrates how much design the page actually warrants.

**Every block the user might comment on carries two attributes:**

```html
<button class="step" data-note data-label="Ours / Plan">…</button>
<div class="card" data-note data-label="Q3 · naming">…</div>
<div class="panel" data-note data-label="After">…</div>
<tr data-note data-label="Requirement 3"><td class="n">3</td><td>…</td></tr>
```

`data-label` is what comes back in their paste, so make it the name **you** would use for that block in
conversation. `data-note` is what wires it up.

Three rules the template already obeys, learned the hard way:

- **Resolve the tray elements before the wiring loop.** Each block's initial refresh calls the tray; if
  the tray's handles are looked up further down the file, the first block throws and **every block after
  it is silently dead.**
- **Never call `confirm()`, `alert()` or `prompt()`.** The viewer sandbox blocks them, so the guard
  returns false and the handler does nothing at all. Use a two-tap button.
- **Key notes by `data-label`, not by index.** Then a note survives the page gaining a section.

**Verify it before you publish.** Where the repo has `jsdom` available, load the page in it, count that
`[data-note]` and `.noteBtn` come out equal, type into a box, and check the copy button enables. Where it
does not, at minimum grep that every `data-note` block also carries a `data-label`. **A page whose
annotation is broken is worse than prose, because the user finds out only after writing.**

## Step 3 — Publish and open it

Publish with the `Artifact` tool. **Same file path means the same URL** — republish in place as the topic
moves. One link per topic, never a new link per round; a second link means the user is reading a stale
copy.

Then hand the URL to [`operator-view`](../../agents/operator-view.md), which walks a ladder and stops at
the first surface that exists: an embedded browser pane in the user's own window if the tooling offers
one, else the machine's default browser, else nothing. **It is cosmetic and never blocks** — carry on
without waiting for its answer, and never treat "no display surface" as a failure.

Give the link in chat as well. That is the fallback that always works.

## Step 4 — Say what is on it, then stop

Two or three lines: what the page shows, what you want from them, and the link. Then end the turn.

> The flow board is up — four systems over the same ten phases. The dashed red boxes are where we have
> nothing. Click any box to leave a note, then **Copy for Claude** at the bottom and paste it back.

**Do not paraphrase the page in chat.** If it needs a summary to be understood, redraw it.

## Step 5 — Read the notes back

Their paste arrives as one block, each line labelled with the block it came from:

```
- **Ours / Plan** — this is the bit I care about
- **Q3 · naming** — B, but call it a magazine
```

Treat each line as a live decision, exactly as if they had said it in a grilling round. Fold it in,
redeploy the same path, and say in one line what changed.

**A block with no note is not agreement.** Say what you are taking as settled and let them correct it.

## When a page stops being enough

The paste-back is the one seam here: **the published page cannot send anything anywhere**, because the
sandbox blocks every outbound request. If that starts to grate, the upgrade is a local companion server
that turns a click into a file this session reads on its next turn. **That is a deliberate future step,
not a gap to work around now.** Do not try to make the artifact phone home.

## Dispatching the agents

<!-- shared:agent-names:start source=agent-names.md -->
**These agents ship inside this plugin, so their `subagent_type` carries the plugin prefix:**
`lifecycle:code-scout`, `lifecycle:spec-reviewer`, `lifecycle:change-reviewer`,
`lifecycle:ticket-implementer`, `lifecycle:finding-fixer`, `lifecycle:operator-view`.

A bare name may resolve, and it may also pick up a different agent the repo happens to define. **Pass
the prefixed form.** Where this document links an agent by file, the prefixed name is what goes in the
dispatch.
<!-- shared:agent-names:end -->

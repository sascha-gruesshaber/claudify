# lifecycle

A committed-spec engineering lifecycle for Claude Code. Eleven callable skills, six sub-agents, one
driver.

```
/onboard                                    once per repo — writes .agents/
   │
/frame ──▶ /grill ──▶ /spec ──▶ /plan ──▶ /plan-check ──▶ /build ──▶ a green branch
   ╰────────────────── /advance ───────────────────────────────╯
                   reads the state, runs what is next
```

Called from inside the loop: `/tdd`, `/diagnose`, `/resolve-conflicts`.

## Layout

```
commands/
└── advance.md            the /advance slash command — forwards to the workflow skill

skills/
├── _shared/              one rule, one file — see its README
│   ├── fragments/        14 rules: 11 law, 3 shape
│   ├── fragments.json    which document requires or forbids which
│   └── tools/            sync + check, and their tests
├── onboard/              the setup ceremony
│   └── templates/        the eight .agents/ files it writes
├── workflow/             the driver — state on disk to the next phase
├── frame/ grill/ spec/   design
├── plan/ plan-check/     planning
├── build/                orchestration — prompts.md holds the lens catalogue
└── tdd/ diagnose/ resolve-conflicts/

agents/
├── code-scout            read-only investigator (no Bash, no Write — deliberately)
├── spec-reviewer         reads a spec cold, one lens
├── change-reviewer       reads a pinned range, one lens, read-only by tool grant
├── ticket-implementer    builds one ticket test-first, in its own worktree
├── finding-fixer         applies a triaged list and nothing else
└── operator-view         puts something on screen; cosmetic, never blocks
```

## What makes it portable

**No file here names a repository.** Where a repo-specific fact is needed, a skill reads it from
`.agents/` in the consuming repo — written once by `/onboard`.

Three fragments carry that seam: `repo-config` (where the files are and that they are authority),
`gates` (run the gate the way CI runs it, whatever it is), `tracker-limits` (read freely, write only as
configured). The other ten are law and ship inlined.

CI fails the build if a concrete build command appears in any skill or agent.

## `/advance`, and why it can exist at all

Every artefact the lifecycle writes is **committed**, and the spec's `Status:` header is a state machine.
So the answer to "what comes next" is already on disk, and `workflow` reads it: the status, whether
`## Open` is empty, whether `plan.md` is current, the `Verdict:` line, the ticket statuses, `git log`.

Nothing is inferred from the conversation, which is why it gives the same answer in a fresh session the
next morning.

It **halts at every phase that needs a person**, and a halt always names the next command. It never does
a phase's work itself — a router that starts planning is a second planner nobody reviews.

## Two design choices worth knowing

**`/build` stops at a green branch.** Opening a review, posting questions on it and watching it differ
per host and per team more than anything else in the flow. `.agents/forge.md` records how it happens in
your repo; the plugin does not guess.

**`/onboard` deliberately does not read `.agents/`.** It writes it. A skill that read its own output
would happily agree with a mistake it had just made — which is why `fragments.json` *forbids* it the
`repo-config` fragment the other ten require.

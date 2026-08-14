# lifecycle

A committed-spec engineering lifecycle for Claude Code. Eleven callable skills, six sub-agents.

```
/onboard                                    once per repo — writes .agents/
   │
/frame ──▶ /grill ──▶ /spec ──▶ /plan ──▶ /plan-check ──▶ /build ──▶ a green branch
```

Called from inside the loop: `/tdd`, `/diagnose`, `/resolve-conflicts`.

## Layout

```
skills/
├── _shared/              one rule, one file — see its README
│   ├── fragments/        13 rules: 10 law, 3 shape
│   ├── fragments.json    which document requires or forbids which
│   └── tools/            sync + check, and their tests
├── onboard/              the setup ceremony
│   └── templates/        the eight .agents/ files it writes
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

## Two design choices worth knowing

**`/build` stops at a green branch.** Opening a review, posting questions on it and watching it differ
per host and per team more than anything else in the flow. `.agents/forge.md` records how it happens in
your repo; the plugin does not guess.

**`/onboard` deliberately does not read `.agents/`.** It writes it. A skill that read its own output
would happily agree with a mistake it had just made — which is why `fragments.json` *forbids* it the
`repo-config` fragment the other ten require.

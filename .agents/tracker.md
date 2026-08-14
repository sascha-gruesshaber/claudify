# Specs and tickets

## There is no issue tracker

- **Tracker:** **none.** GitHub Issues is **disabled** on this repository — `gh issue list` returns
  *"the 'sascha-gruesshaber/claudify' repository has disabled issues"*.
- **Nothing is ever written to any board.** There is no board. No skill claims a ticket, posts a
  comment, or moves a status. If a future run finds a tracker, it stops and asks rather than writing.
- **Ticket keys do not exist here.** Every place the plugin's naming grammar offers `<KEY>-<short-desc>`,
  this repo uses `<short-desc>` alone. See [`naming.md`](naming.md).

The work item is therefore whatever the user says in the session, plus the spec that session commits.

## Where the artefacts live

Specs and tickets live as **committed markdown in the worktree**, under `docs/specs/`. One directory
per effort:

```
docs/specs/<short-desc>/
├── spec.md                       ← /spec writes this; its Status: header is the authority
├── plan.md                       ← /plan writes this
├── plan-check.md                 ← /plan-check writes this
├── implementation-record.md      ← /build writes this: what it decided, and why
└── issues/
    ├── 01-<slug>.md              Blocked by: None
    └── 02-<slug>.md              Blocked by: 01
```

- `docs/` **does not exist yet.** The first `/spec` run creates it. That is expected, not a mistake.
- Directory name is `<short-desc>` — the same kebab-case phrase as the branch, per
  [`naming.md`](naming.md).
- **One file per ticket**, numbered from `01` in dependency order. Never a single combined file.

**They are committed.** With no tracker and no issue history, the committed spec is the *only* record
of what was asked for — which makes "was this requirement weakened to fit the code?" answerable at all.

## Ticket format

Avoid file paths and code snippets in ticket bodies — they go stale fast.

```markdown
# <NN> — <Ticket title>

**What to build:** the end-to-end behaviour this ticket makes work, from the user's perspective —
not a layer-by-layer implementation list.

**Blocked by:** the numbers of the tickets that gate this one, or "None — can start immediately".

**Status:** ready-for-agent

- [ ] Acceptance criterion 1
- [ ] Acceptance criterion 2
- [ ] Docs: <the document this ticket must update, from docs.md § Docs are part of done>
```

**Every ticket cuts a vertical slice.** In this repo a slice usually means: the fragment or skill text,
its injected copies synced, the CI step that would catch a regression, and the document that describes
it. **Wide rewrites are the exception:** sequence those as expand → migrate in batches → contract, each
batch its own ticket.

## Commit cadence

**One commit per ticket** — the reviewable unit, and what this repo's history already does. See
[`naming.md`](naming.md).

# Contributing to claudify

## The one rule

**Nothing in `plugins/lifecycle/` may name a specific repository.** Not a build command, not a tracker,
not a path, not a language, not a company. The moment one does, the plugin only works in the repo it
came from — which is the failure this whole thing exists to undo.

When you need a repo-specific fact, you have exactly two moves:

1. **Point at `.agents/`.** Say which file holds the answer and what rule holds whatever that answer
   turns out to be.
2. **Add a question to [`/onboard`](plugins/lifecycle/skills/onboard/SKILL.md)**, and a line to the
   matching template.

There is no third move.

## The gate

```bash
cd plugins/lifecycle
node skills/_shared/tools/skills.mjs sync     # after editing any fragment
node skills/_shared/tools/skills.mjs check    # must be clean
node --test "skills/_shared/tools/skills.test.mjs"
```

**Edit the fragment, never the injected copy.** `check` fails on a drifted region, on a document missing
a fragment the manifest requires, on one carrying a fragment it forbids, and on a fragment nothing
declares. It runs in CI.

A quick way to catch a leak before `check` does:

```bash
grep -rniE 'dotnet|npm run|cargo|gradle|jira|azure|github\.com|sonar' plugins/lifecycle/skills plugins/lifecycle/agents \
  | grep -v templates/ | grep -v _shared/README
```

Every hit should be either an example clearly marked as one, or a sentence about how to *find* the real
answer. A hit that reads as an instruction is a bug.

## Never add `disable-model-invocation`

**This plugin exists because upstream skills carry that flag.** It makes a skill un-invokable by the
model, so a flow built on it stalls and asks the user to type the next command — which is exactly what
`/advance` and `/build` cannot survive, since their whole shape is skills calling skills.

CI fails the build if the string appears anywhere under `plugins/*/skills` or `plugins/*/commands`. If you
ever vendor a skill in from elsewhere, **strip the flag as part of vendoring it.**

## Writing a skill here

- **The frontmatter `description` is how the model decides to load it.** Write it for that: what it takes
  in, what it produces, and the phrasings a user actually types. The `Keywords -` tail is not decoration.
- **State the law, then the exception.** A rule with no stated cost gets routed around the first time it
  is inconvenient.
- **Say what happens next.** Every skill names the one that follows it, so a flow does not stall on a
  user who does not know the next command.
- **Every line is paid for on every turn of a long run.** Cut anything that does not change what the
  model does.
- **A rule that appears in two skills belongs in a fragment.** That is not a style preference; two copies
  drift and nothing detects it.

## Versioning

Each plugin carries its own `version` in `.claude-plugin/plugin.json` **and** in the marketplace's
`marketplace.json`. **Bump both in the same commit** — the cache is keyed on the marketplace's copy, so
a plugin whose manifest moved without its marketplace entry never reaches anybody.

## What is not proved yet

Read this before relying on the plugin for work that matters. Each line is a thing that is *designed*
but has not been *run*.

1. **Cross-skill calls across the plugin boundary.** The lifecycle's whole shape is skills calling
   skills — `/build` calls `/plan`, `/plan` calls `/plan-check`, `ticket-implementer` calls `/tdd`.
   Inside one plugin this should hold, but it has not been exercised end to end. **Test this first.**
2. **`/build` has never run.** It is the largest skill here and it orchestrates five agent types across
   parallel worktrees. Expect the first real run to find things.
3. **`/onboard` has never run against a repo it did not come from.** The observation table is written
   from what CI files usually look like, not from a sample.
4. **The lens catalogue is now generic.** Each body reads its standard out of `.agents/` rather than
   naming one. Whether that keeps a reviewer as sharp as a repo-specific body did is untested, and it
   is the most likely quality regression in this rewrite.
5. **No repo has been onboarded twice.** The claim that `/onboard` is safe to re-run rests on the skill
   saying so.
6. **The `Effort` column in `.agents/lifecycle.md` is intent, not a setting.** The `Agent` tool takes a
   `model` but no effort parameter, so a skill dispatching through it cannot set effort. The column says
   which calls deserve a high-effort *session*; the tier, the ceiling and the lens count are the levers
   that actually pass.

## Adding a plugin to the marketplace

1. `plugins/<name>/.claude-plugin/plugin.json` — `name`, `version`, `description`, `metadata`.
2. An entry in `.claude-plugin/marketplace.json` with a matching `version` and `source: "./plugins/<name>"`.
3. A `README.md` in the plugin directory if it is not obvious from its skills.

## Commits

`<type>(<scope>): <imperative subject>` — scope is the plugin or the area (`lifecycle`, `onboard`,
`fragments`, `plain-words`, `docs`, `ci`). Body says *why*.

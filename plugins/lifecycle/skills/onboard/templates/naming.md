# Naming grammar

One `<short-desc>` per effort, reused across the branch, the spec directory and the commit scope, so
the three are greppable together. Kebab-case, four words or fewer.

## Branches

```
<type>/<KEY>-<short-desc>          with a ticket
<type>/<short-desc>                without
```

- **Types in use:** `<feat | fix | refactor | test | docs | chore | build>`
- **Per-ticket branches** suffix `-t<NN>`, never `/t<NN>` — git refuses a branch nested under an
  existing branch name. They are local scaffolding: never pushed, deleted after integration.
- **Branch model:** <trunk-based off `main` | `develop` + `release/*` | …>

## Commits

```
<type>(<scope>): <imperative subject, lower case, no full stop>

<body: why, not what — the diff already says what>

<trailer>
```

- **Subject is imperative** — "add the bulk-assign mutation", not "added" or "adds".
- **One commit per ticket.** The implement-then-fix split is scaffolding the history should not
  remember.
- **Trailer:** `<Refs: <KEY>>` when a ticket exists.
- **Never `--no-verify`.**
- <Any co-author or attribution trailer this repo requires.>

## Spec directories

`<docs/specs>/<KEY>-<short-desc>/` — the same `<short-desc>` as the branch. See
[`tracker.md`](tracker.md).

## Tests

- **Name:** `<Should_<ExpectedBehavior>_When_<Conditions> | it("<does X> when <Y>") | test_<x>_when_<y>>`
- **Body comments:** `<// Arrange`, `// Act`, `// Assert` and nothing else | none>`
- Enforced in review, not by a tool. <Or name the tool.>

## Review titles

`<type>(<scope>): <what the change achieves, in plain words>` — the achievement, not the mechanism.

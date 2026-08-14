# Forge — how a branch becomes a reviewed change

`/build` stops at a **green feature branch**. Everything below that line is this repo's own business,
and this file is where it is written down.

## The host

- **Host:** <GitHub | Azure DevOps | GitLab | self-hosted>
- **Remote:** `<the origin URL>`
- **Default branch:** `<main>` · **Release branches:** `<release/* | none>`
- **CLI:** `<gh | az repos | glab>` — <one line on auth: how it is authenticated here>

## Opening a change for review

```bash
<the exact command, with the flags this repo needs>
```

- **Target:** `<main>`
- **Required reviewers:** <who, and how to resolve them — some hosts return an unusable internal id>
- **Description:** <what it must contain: a template path, a linked ticket, a checklist>
- **Draft first?** <yes / no, and why>

## Reading review comments

```bash
<the exact command to list comment threads>
```

- <A gotcha specific to this host's API — e.g. replying inside a thread needs a different resource
  than creating one, and the wrong one silently creates a second thread.>

## Finding the build for a change

```bash
<the exact command>
```

- <A gotcha — e.g. builds run against a merge ref, not the source branch, so filtering by branch name
  returns nothing and looks like "no CI".>

## Branch policies that block a merge

| Policy | Threshold |
|---|---|
| <build must pass> | <which pipeline> |
| <coverage on new code> | <n> % |
| <scanner quality gate> | <which gate> |
| <reviewer approvals> | <n> |

## What is deliberately not automated here

- <e.g. nothing moves the ticket on the board at review time — see `tracker.md`>
- <e.g. no automatic merge>

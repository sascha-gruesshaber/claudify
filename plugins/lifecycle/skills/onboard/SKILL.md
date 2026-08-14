---
name: onboard
description: Set this lifecycle up in a repo that has never used it. Reads the repository to work out how it already builds, tests, tracks work and ships; asks only what evidence cannot settle; proposes where the way of working should change and lets you decline each one; then writes the eight files under .agents/ that every other skill reads, and proves the install by framing one real ticket. Use on a fresh clone, when `/frame` or `/build` says .agents/ is missing, or when the repo has changed enough that the config is lying. Keywords - onboard, install, set up, initialise, configure, first run, adopt the lifecycle, .agents, gates, which reviews, how many rounds.
---

# Onboard (a repo → a configured lifecycle)

Every other skill here reads how this repository works from **eight files under `.agents/`**. This
skill writes them. Nothing else in the plugin knows anything about your repo, which is the whole
reason it is installable.

**Three passes, in this order.** The order is the point: each pass is only cheap because the one
before it ran.

| Pass | What it does | Who answers |
|---|---|---|
| 1 · **Observe** | read the repo and fill the eight files in as drafts | nobody — evidence only |
| 2 · **Ask** | put the questions evidence cannot settle | the user |
| 3 · **Propose** | name where this repo's way of working fights the lifecycle | the user, and they may decline |

## When NOT to use

- `.agents/` already exists and is current → read it. Re-running to fix one answer is fine, but say
  which file you are changing and change only that.
- To decide whether to adopt the lifecycle at all. That is a conversation, not a config run.

## Pass 1 — Observe. Never ask what you can read.

Every question you ask that the repo already answers spends the user's attention on your laziness.
Sweep in one batch, then draft.

| What to settle | Where to look |
|---|---|
| language and build system | `*.sln*`, `*.csproj`, `package.json`, `Cargo.toml`, `go.mod`, `pyproject.toml`, `pom.xml`, `Makefile`, `*.cake`, `cake.cs` |
| the real gate | the CI definition — `.github/workflows/*`, `azure-pipelines.yml`, `.gitlab-ci.yml`, `Jenkinsfile`. **This is the authority on what "green" means**, not the README. |
| test command and framework | the CI test step first, then `package.json` scripts, then the test project layout |
| formatter and linter | `.editorconfig`, `biome.json`, `.eslintrc*`, `.prettierrc*`, `ruff.toml`, `Directory.Build.props` |
| coverage floor and scanners | `sonar-project.properties`, a coverage threshold in CI, a `codecov.yml`, a branch-policy file |
| the forge | `git remote -v` — `github.com`, `*.visualstudio.com` / `dev.azure.com`, `gitlab.com`, something self-hosted |
| default branch and branch model | `git symbolic-ref refs/remotes/origin/HEAD`, then `git branch -r` for `release/*`, `develop`, `master` |
| existing conventions | `CONTRIBUTING.md`, `AGENT.md`, `AGENTS.md`, `CLAUDE.md`, `docs/`, `.cursor/rules` |
| the glossary, if any | a `CONTEXT.md`, `GLOSSARY.md`, or a domain-model document |
| naming grammar in use | `git log --oneline -60` and `git branch -r` — read the shape actually used, not the shape documented |
| where specs live today | `docs/specs/`, `docs/rfcs/`, `docs/adr/`, `.github/ISSUE_TEMPLATE/` |
| generated files | anything a CI step or a script writes back into the tree |

Then **read the CI definition properly, end to end.** It is the one file that cannot lie about the
gate, and the most common install defect is a `.agents/gates.md` that lists the commands a human
would run instead of the ones that block a merge.

**Draft all eight files from the templates in [`templates/`](templates/)**, and mark every line with
where it came from:

```
`.agents/gates.md`      drafted from azure-pipelines.yml:44-71 + Directory.Build.props
`.agents/forge.md`      drafted from git remote (dev.azure.com)
`.agents/naming.md`     drafted from git log — 58 of 60 subjects match <type>(<scope>): <imperative>
`.agents/docs.md`       NOT FOUND — no architecture docs; needs an answer
```

**A gap is a finding, not a guess.** Write `NOT CONFIGURED` and carry it into pass 2. A drafted line
you invented is worse than a missing one, because every later run trusts it.

## Pass 2 — Ask what evidence cannot settle

Policy, not fact. These have no answer in the repository because nobody wrote one down.

Ask the whole set **in one round**, numbered, each with your recommendation. Never drip-feed.

1. **Board writes.** May a skill write to the issue tracker unasked? If yes, which writes exactly?
   *Recommend: claim the ticket when work starts, comment the agreed design, comment the shipped
   link. Nothing else, and never a status that reports an outcome.*
2. **Unattended work.** May a run continue without you watching, and between which hours?
   *Recommend: name your working hours and forbid anything unattended outside them. A run that
   finishes at 02:00 with a question nobody answers has stalled, not succeeded.*
3. **Autonomy line.** What must stop and ask, whatever else is decided alone?
   *Recommend: user-visible behaviour the spec does not settle and is expensive to reverse — a
   persisted schema, a wire contract, a permission boundary. Everything else is the agent's.*
4. **Review lenses.** Which of the lens catalogue apply here? *(pass the list from
   [`../build/prompts.md`](../build/prompts.md#lens-catalogue))*
   *Recommend: spec alignment, correctness, over-engineering, test gaps, repo standards — always;
   plus UI patterns and security only when the diff touches them.*
5. **Loop caps.** How many fix rounds per ticket before a finding is parked, and how many re-plans
   before a human is fetched?
   *Recommend: three fix rounds, one re-plan. Both are places this loop gets cheaply stuck.*
6. **Wave width.** How many tickets may build in parallel?
   *Recommend: three. It is bounded by how many agent reports one orchestrator can triage well, not
   by machine capacity.*
7. **Frozen ground.** Which directories are history that must never be edited or cited as current?
8. **The glossary.** Is there a vocabulary document, and does it beat a spec's wording?
   *Recommend: yes, and yes — two words for one thing is the cheapest bug to fix now and the most
   expensive later, because it reaches code, tests, tickets and commit subjects.*

Then sweep the edges of the install itself. The seven below are about *this repo's shape*, and each
one that goes unasked shows up later as a skill doing something surprising.

<!-- shared:edge-case-probe:start source=edge-case-probe.md -->
**Sweep these seven every time, and lose none of them.** The brief states the happy path; the cost sits
in what it left unsaid.

- **Boundary, empty and limit values** — zero, empty, maximum, very large; first and last item; ranges
  that are off by one.
- **Absent or partial data** — null, missing, not-yet-set fields; an optional relationship that does not
  exist.
- **Concurrency and ordering** — two users acting at once, the action repeated, steps out of order, a
  double submit.
- **Failure and rollback** — a dependency fails midway. What state remains, what the user sees, whether
  it is retryable.
- **State and lifecycle transitions** — the entity is already in the target state, archived, deleted or
  locked; the action fired twice.
- **Permissions and roles** — a role the brief never mentioned reaching this path.
- **Locale, formatting and units** — time zones, currencies, decimal and thousands separators.

**Every edge case you find gets exactly one of two homes.** Either it is a decision only the product
owner can make — then it is a question — or you settle it yourself and write it under `## Assumptions`
with the handling you chose and why. **Nothing is dropped.** An edge case that vanishes into prose is one
an implementer will settle alone, silently, at 200k context.

The test for "the product owner must decide this": the answer changes *what* is built rather than *how*;
a developer cannot settle it from the code, the conventions or the domain; and getting it wrong means
reworking shipped behaviour rather than refactoring. If any of the three fails, settle it and record the
assumption. **Better to ask one too few than to flood them with developer-answerable questions.**
<!-- shared:edge-case-probe:end -->

## Pass 3 — Propose where the way of working should change

**This is the pass that earns its keep.** The lifecycle assumes things. Where this repo does not work
that way, say so plainly, say what it costs, and let the user decline.

Do not smuggle these in. A convention adopted without the user agreeing to it is one they will fight
with for weeks without knowing why.

| The lifecycle assumes | Say it out loud when the repo does not |
|---|---|
| a **spec is committed before code**, and it is the thing reviews grade against | there is nowhere for specs to live, or specs live outside the repo where a diff cannot show them |
| **one commit per ticket** | history is many small WIP commits, or squash-on-merge already handles it |
| **docs are part of done**, in the same change | documentation lives elsewhere and drifts by design |
| **test-first at an agreed seam** | there are no tests, or tests are written after the fact |
| **a numbered requirement list whose numbers never move** | requirements live in ticket prose |
| **worktrees for parallel work** | the repo cannot be checked out twice — a build that writes outside the tree, a hard-coded path, a single dev database |

For each, offer **two options and a recommendation**, and one line on the cost of the cheaper one.
Record every declined proposal in `.agents/working-agreement.md` under **Deliberately not adopted**,
with the date and the reason. That entry is what stops the next run re-arguing it.

**One is a genuine blocker, not a preference: a repo that cannot be checked out twice cannot run
`/build`'s parallel waves.** Say so, and set the wave width to 1 in `.agents/lifecycle.md` rather
than pretending. Everything else degrades gracefully.

## Step 4 — Write the eight files

Into `.agents/` at the repository root. Flat, so a repo with no `docs/` convention still has a home
for them.

| File | Answers |
|---|---|
| `lifecycle.md` | which phases run, which lenses, how many rounds, how wide a wave |
| `gates.md` | the commands that must pass, in order, and what "green" means |
| `tracker.md` | where specs and tickets live, and what may be written to the board |
| `forge.md` | the git host, and how a branch becomes a reviewed change |
| `docs.md` | where architecture truth lives, the glossary, what "docs are part of done" costs |
| `naming.md` | branch, commit, directory and test-name grammar |
| `working-agreement.md` | hours, unattended work, autonomy line, how to report |
| `README.md` | one page: what this directory is, and that skills read it as authority |

Rules for what you write:

- **Every command exactly as it must be typed.** A paraphrased gate is a broken gate.
- **Say which commands are weaker locally than in CI**, and name the CI form. This is the single most
  valuable line in `gates.md`.
- **No prose the repo does not need.** A file that says "this project values quality" costs tokens on
  every run and decides nothing. If a section has no answer, write `NOT CONFIGURED` and one line on
  what would have to be true to fill it.
- **Link, never mirror.** Where a convention is already written down in `CONTRIBUTING.md` or
  `docs/`, point at it. A copy drifts.

Then add the pointer so a human and a fresh agent both find it. In `CLAUDE.md` (and `AGENTS.md` if the
repo has one), one stanza:

```markdown
## How this repo works, for agents

`.agents/` describes this repository to the `lifecycle` plugin's skills — the gates, the tracker, the
forge, the naming grammar, the working agreement. **It is authority.** Start at
[`.agents/README.md`](.agents/README.md).
```

**Commit it as one change**, message `chore(agents): describe this repo to the lifecycle skills`. It
is reviewable, and being reviewable is most of the point of putting it in the repo.

## Step 5 — Prove the install

A config nobody ran is a config that is wrong in a way you have not found yet.

**Run [`frame`](../frame/SKILL.md) on one small, real ticket** and read what comes back. It reads
`.agents/docs.md`, `.agents/tracker.md` and `.agents/lifecycle.md`, so a wrong answer in any of the
three surfaces here for the price of one cheap run.

Then say, in the report, which of the eight files that run actually exercised — and which are still
unproven.

## What you report

```
`.agents/` written · 8 files · committed as <sha>

Observed        <n> answers from evidence — build system, gate, forge, branch model, naming
Asked           <n> questions, all answered
Proposed        <n> changes · <n> adopted · <n> declined (recorded in working-agreement.md)
NOT CONFIGURED  <the files or sections with no answer, by name>
Proven          /frame on <ticket> exercised gates.md, docs.md, tracker.md
Unproven        forge.md, naming.md — nothing has shipped yet

Next            /frame <ticket> to start work · /onboard again to change an answer
```

**Name the unproven files.** An install reported as complete when half of it has never executed is
the failure mode of this skill.

## Notes

- **Read a config file, never reconstruct it.** After this run, no skill infers the build system
  again; the file is the answer even when the tree looks different.
- **This skill deliberately does not read `.agents/`.** It writes it. If it read its own output it
  would happily agree with a mistake it just made.
- Re-running is cheap and safe. It re-observes, shows a diff of what changed, and asks before
  overwriting an answer a human edited.

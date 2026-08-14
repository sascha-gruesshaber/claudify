# Docs — where truth lives, and what "done" includes

## Read these before making a claim about the system

In this order. The first one is short and decides the vocabulary.

| # | What | Where |
|---|---|---|
| 1 | **the glossary** — the shared vocabulary | `<CONTEXT.md | none>` |
| 2 | **repo rules for agents** | `<AGENT.md | CLAUDE.md | CONTRIBUTING.md>` |
| 3 | **architecture** — how the system works today | `<docs/kb/ | docs/architecture/ | none>` |
| 4 | **code conventions**, in prose | `<docs/conventions/ | .editorconfig only>` |
| 5 | **decisions** — the ones that close off alternatives | `<docs/decisions/ | none>` |

**The glossary beats a spec's wording.** Two words for one thing is the cheapest bug in a project to
fix while somebody still holds the design in their head, and the most expensive later — it reaches
code, tests, tickets and commit subjects.

## Finding the document that owns a path

```bash
<the command — e.g. grep an index, or grep `code:` frontmatter across the doc nodes>
```

<One line: how a source path maps to the document that describes it. If there is no mapping, say so —
that is a real answer, and it means a reviewer has to judge staleness by reading.>

## Docs are part of done

<Delete this whole section if documentation is deliberately out of scope for a code change. Say so
explicitly — silence reads as an oversight.>

**When you change code under a documented path, update its document in the same change.** Then:

```bash
<any index or check command>
```

- Write **what is true now**, never a changelog. No "added in July", no review numbers, no
  "previously this…".
- A ticket that touches a documented path carries the document in its acceptance criteria, by name.

## Decision records

A decision earns its own record when **all three** hold: it is hard to reverse, it is surprising
without context, and it is the result of a real trade-off. Two of three is a line in the spec.

- **Where:** `<docs/decisions/ | none — record them in the spec>`
- **Numbering:** <who assigns it>

## Frozen ground

**Never edit these, and never cite them as current.** They are history that has diverged from what
shipped.

- `<path>` — <what it was, and the one thing it is still useful for>

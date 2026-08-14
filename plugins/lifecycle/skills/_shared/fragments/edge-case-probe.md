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

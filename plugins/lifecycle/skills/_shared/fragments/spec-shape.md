**A spec states WHAT. A plan states HOW.** The moment a spec names a class, a method, a table or a
control-flow step it has become a plan, written before anybody read the code — and it gets none of the
checking a plan gets.

The test: **could two competent developers satisfy this with different designs?** If not, you have
specified a design.

**The numbers are permanent.** Requirements and acceptance criteria are each one numbered list, and the
number is the handle every later step uses — a review finding, a review comment, a commit, a plan's
coverage table.

- Adding a requirement **appends**. It never inserts.
- Removing one leaves the number **retired**: `~~withdrawn~~` with the reason and the date. Never reused.
- Renumbering is the one edit that silently breaks every consumer. A revision preserves numbers by
  definition; if it cannot, it stops and says why.

**Every requirement and criterion names where it came from** — the ticket, a comment, an answered
question, a recorded assumption. A line with no trace is one somebody invented, and inventing
requirements is the easiest failure to commit here: the ticket is terse, the gap is obvious, and filling
it feels like diligence. **Fill nothing. A gap goes under `## Open`.**

**A spec with anything under `## Open` is a draft, not a contract.** Say so in the header and in the
summary, and name the open questions.

**`## Out of scope` is not filler.** A reviewer who assumes a nearby behaviour was in scope reports its
absence as a missing requirement, and the round trip is spent explaining that nobody asked for it.

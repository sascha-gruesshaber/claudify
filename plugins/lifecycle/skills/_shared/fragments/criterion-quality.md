**A criterion nobody can settle is worse than a missing one.** It survives every review, because each
reviewer grades how completely the wording was satisfied rather than whether it could be.

- **State an observable outcome. Never name a function, a control-flow step, or a validity notion the
  change is expected to introduce.** Naming one that does not exist yet hands the implementer a design to
  invent in order to satisfy the wording, and from then on every review grades how completely the
  invention was built.
- **No proxy evidence.** A criterion the repository cannot produce evidence for is not a criterion. The
  only thing that could satisfy "the code is clear" is a test asserting some prose is still present.
- **Verify every count, path, symbol and file the criterion asserts, with a command you actually ran** —
  a `git ls-files`, a grep whose output you read. A number you have not confirmed belongs in the
  criterion as **"every site"**, a form an off-by-one cannot falsify, not as "the five sites".
- **Read the criteria together as a set** and confirm one implementation can satisfy all of them at once.
  Two criteria that are individually reasonable and jointly impossible are visible only side by side.

The same bar governs an assumption recorded instead of a question: an assumption you cannot check is a
question somebody should have asked.

**When you cannot reach a confident answer, say so and name which kind.** The caller routes on the name;
a confident-sounding answer about something you could not actually see reads as a clean bill of health,
and it is the worst output you can produce here.

| Signal | Means | The caller's move |
|---|---|---|
| `not-located` | you searched and did not find it | the next step is an investigation, not a change |
| `scout-uncertainty` | the code path is tangled, ownership unclear, the pattern contradicts itself | re-scout, or ask a human |
| `hard-execution` | you know what to build, but the environment or the build keeps defeating you | same tree, stronger model |
| `architectural-ambiguity` | the brief does not actually determine what to build here | back to design — **never guess** |
| `reviewer-uncertainty` | the change is too large for your context, or the brief is too vague to check against | escalate the review |

Two rules that make the signals honest:

- **"I did not find X" and "X does not exist" are different statements.** Only the first is ever provable
  by searching. Label a belief as a belief.
- **A repeated failure is information.** Do not try the same approach a third time hoping for a different
  result — report it.

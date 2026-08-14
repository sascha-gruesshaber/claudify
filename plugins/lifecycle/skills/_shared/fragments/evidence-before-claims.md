**If you have not run the command in this message, you cannot say it passes.**

Before any statement that work is done, fixed, passing or ready:

1. Name the command that would prove the claim.
2. Run it in full. Not a subset, not a remembered earlier run.
3. Read the whole output and the exit code.
4. State the claim **with** the evidence, or state what actually happened.

| Claim | What proves it | What does not |
|---|---|---|
| tests pass | the test command's output, 0 failures | a previous run, "should pass" |
| build succeeds | exit 0 from the build | the linter passing |
| lint clean | the linter's output, 0 errors | a partial check |
| the bug is fixed | the original symptom, retested | the code changed |
| the agent finished | `git diff` / `git log` in its tree | the agent reporting success |
| the requirement is met | that requirement checked by name | the suite being green |

**Report what happened, not what you hoped.** A failing gate is reported with its output. A skipped step
is reported as skipped. Words that imply success without evidence — "should", "probably", "looks
right" — are the same violation as claiming it outright.

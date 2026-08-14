**Hand work to an agent as a file path. Never paste it into the prompt.**

Everything you paste into a dispatch, and everything an agent prints back, stays in your context and is
re-read on every later turn of the run. You are the one context that lives for the whole build.

- **Brief in, by path.** Write the agent's brief to a file and give it the path. Never make an agent read
  a whole spec or plan to find its own slice.
- **Diff in, by path.** `git log --oneline`, `git diff --stat` and `git diff -U10` for the pinned range,
  redirected to one file. The reviewer reads it in a single call and the diff never enters your context.
- **Report out, by path.** Name the report file in the dispatch. The agent writes its full findings
  there and **returns only**: a status, the commits it made, a one-line test result, and its concerns.
- **A dispatch describes one task, not the session's history.** Do not paste "state after tickets 1–3"
  into a later dispatch. A fresh agent needs its task, the interfaces it touches, and the constraints
  that bind it. Nothing else.

**Pin the range yourself.** Record `BASE` before dispatching and use it for every diff afterwards.
`HEAD~1` silently drops all but the last commit of a multi-commit task.

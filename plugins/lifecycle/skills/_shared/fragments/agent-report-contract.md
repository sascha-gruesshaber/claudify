**Every agent ends on exactly one of four statuses.** The caller has a written move for each, so a
status is a routing instruction rather than a mood.

| Status | Means | The caller's move |
|---|---|---|
| `DONE` | the work is complete and its gates were run | review it |
| `DONE_WITH_CONCERNS` | complete, but the agent flagged doubts | read the concerns first; correctness or scope doubts are settled before review |
| `NEEDS_CONTEXT` | information the brief did not carry | supply it and re-dispatch, same model |
| `BLOCKED` | the agent cannot finish | assess the blocker — never re-dispatch the same model unchanged |

Rules that hold whatever the status:

- **Report the exact command you ran and what it printed.** "Tests pass" is not usable as verification
  evidence against the commit the caller is about to make.
- **Name the kind of stuck.** A blocker is routed on its signal, not on its prose.
- **Build what the brief says and stop.** Something genuinely wrong that the brief does not cover is
  **reported, not fixed**. An unrequested fix lands in a diff a reviewer grades against a brief that
  never asked for it, and it is invisible to the gate that approved the work.
- **Never run `git` unless the brief says you own it**, never write the caller's state file, and never
  prompt the developer — there is nobody on the other end of your session.

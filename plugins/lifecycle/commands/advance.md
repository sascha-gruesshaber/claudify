---
description: Run the lifecycle phase that comes next, reading where the work stands off disk
argument-hint: "[<spec path>] [--once] [--dry]"
---

Invoke the `workflow` skill with these arguments: $ARGUMENTS

It works out where the current effort stands, runs the phase that comes next, and keeps going until it
reaches a phase that needs a person. Do not do any of the phase work yourself — the skill routes, and the
phase it names does the work.

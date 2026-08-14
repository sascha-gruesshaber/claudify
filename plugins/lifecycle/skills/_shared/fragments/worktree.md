**Every writing agent gets its own working tree.** Parallelism without one interleaves edits and loses
work, and that is the whole safety model.

Cut it from the main checkout:

```bash
git worktree add -b <branch> .claude/worktrees/<branch with / → +> <default-branch>
```

- The directory name replaces `/` with `+`. Git refuses a branch nested under an existing branch name,
  so a per-ticket tree suffixes `-t<NN>` and never `/t<NN>`.
- **Cut it before the first committed file exists.** A worktree cut later leaves the spec and the tickets
  dirtying the main checkout. Carry uncommitted work across rather than stranding it:
  `git diff > /tmp/carry.patch`, `git apply` in the new tree, then revert the original.
- Per-ticket branches are local scaffolding. Never push one; delete it after integration.
- **Never remove a worktree you did not create.** Somebody else's half-finished work looks exactly like
  a stale directory.

**A tool may resolve your path against the wrong tree, and say nothing.** Anything running outside your
shell — an MCP server, a language server, a scanner — resolves a relative path against **the directory it
started in**, which is the main checkout, not your worktree. It then reports on the *unmodified* file with
no error and no hint, which reads exactly like "my fix did not work".

- **Pass a path that is correct from the main checkout**: `.claude/worktrees/<name>/<path>`. A bare
  worktree-relative path is the trap.
- **Spot it by the line numbers.** If a reported range matches the file *before* your change, the tool
  read the other tree.
- **The fallback is a throwaway copy inside the main checkout**, analysed and then deleted.

**Say the path once, in one line.** Everything after that happens there, and a reader who does not know
where they are will look for their files in the main checkout.

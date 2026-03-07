# Codex YOLO Runbook (aroido-site, GitLab)

## Standard Flow

1. Create a task branch/worktree.

```bash
git fetch origin
git worktree add ../wt-issue-123 -b feature/issue-123 origin/main
cd ../wt-issue-123
```

2. Run Codex for implementation.

```bash
cye - < /path/to/task.md
```

3. Verify and finish.

```bash
./scripts/ai-verify --mode full
./scripts/ai-finish-task --issue 123 --commit-msg "feat: implement issue 123" --auto-merge
```

## Latest-Information Tasks

Use interactive search session when latest facts are required.

```bash
cyl
```

## Long-Horizon Flow (24h class)

Use dedicated long-horizon loop when you want continuous autonomous improvement.

```bash
./scripts/long-horizon-loop.sh \
  --spec docs/specs/work-session-spec.md \
  --hours 24
```

- durable memory files are stored per session under `.codex/long-horizon/<session-id>/`
- stop signal:

```bash
touch .codex/STOP_LONG_HORIZON_LOOP
```

## Failure Recovery

- Verification failed:

```bash
./scripts/ai-verify --mode full
```

- Dry-run finish flow first:

```bash
./scripts/ai-finish-task --issue 123 --commit-msg "feat: ..." --dry-run
```

- Auto-merge pending:

```bash
glab mr merge <iid> --auto-merge --squash --remove-source-branch --yes
```

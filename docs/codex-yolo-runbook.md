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

1. Bootstrap isolated worktree/branch and open Draft MR.

```bash
./scripts/long-horizon-bootstrap.sh --target main
```

2. Move into the generated worktree and run long loop.

```bash
./scripts/long-horizon-loop.sh \
  --spec docs/specs/work-session-spec.md \
  --hours 24 \
  --checkpoint-every 3 \
  --stale-minutes 20
```

3. At each milestone, checkpoint changes.

```bash
./scripts/long-horizon-checkpoint.sh --session-id <session-id>
```

4. Session KPI is automatically appended at loop end.

- `.codex/.long-horizon-kpi.jsonl`
- `.codex/.long-horizon-kpi.csv`

Refactor-focused profile:

```bash
./scripts/long-horizon-loop.sh \
  --spec docs/specs/long-horizon-refactor-best-practices-spec.md \
  --hours 24 \
  --checkpoint-every 3 \
  --stale-minutes 20
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

# Codex Hook Templates

이 디렉토리의 파일은 `.git/hooks`에 심볼릭 링크하여 사용할 수 있습니다.

## Recommended install

```bash
ln -sf ../../.codex/hooks/pre-push .git/hooks/pre-push
ln -sf ../../.codex/hooks/commit-msg .git/hooks/commit-msg
chmod +x .codex/hooks/pre-push .codex/hooks/commit-msg
```

# aroido-site Makefile

.PHONY: help ai-verify-fast ai-verify-full ai-finish i18n-audit work-session-preflight work-session-bootstrap-labels work-session-kpi notify-moshi

.DEFAULT_GOAL := help

help: ## Show available commands
	@echo "aroido-site commands"
	@echo "===================="
	@grep -E '^(ai-verify-fast|ai-verify-full|ai-finish|i18n-audit|work-session-preflight|work-session-bootstrap-labels|work-session-kpi|notify-moshi):.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  %-28s %s\n", $$1, $$2}'

ai-verify-fast: ## Run fast AI verification profile
	@./scripts/run-ai-verify --mode fast

ai-verify-full: ## Run full AI verification profile
	@./scripts/run-ai-verify --mode full

i18n-audit: ## Verify ko/en translation key parity
	@./scripts/i18n-audit.sh

work-session-preflight: ## Run work-session preflight checks
	@./scripts/work-session-preflight.sh

work-session-bootstrap-labels: ## Create required GitLab labels for work-session
	@./scripts/work-session-bootstrap-labels.sh

work-session-kpi: ## Build work-session KPI summary from .codex/.last-session.json
	@./scripts/work-session-kpi.sh

notify-moshi: ## Send Moshi notification (usage: make notify-moshi MSG=\"...\")
	@if [ -z "$(MSG)" ]; then \
		echo "MSG is required"; \
		echo "Example: make notify-moshi MSG=\"작업 완료: 이슈 #123, MR !45\""; \
		exit 1; \
	fi
	@./scripts/notify-moshi.sh --message "$(MSG)"

ai-finish: ## Finish AI task (usage: make ai-finish ISSUE=123 MSG="feat: ..." [AUTO_MERGE=1] [TARGET=main])
	@if [ -z "$(ISSUE)" ] || [ -z "$(MSG)" ]; then \
		echo "ISSUE and MSG are required"; \
		echo "Example: make ai-finish ISSUE=123 MSG=\"feat: update hero\" AUTO_MERGE=1"; \
		exit 1; \
	fi
	@AUTO_FLAG=""; \
	if [ "$(AUTO_MERGE)" = "1" ]; then AUTO_FLAG="--auto-merge"; fi; \
	TARGET_BRANCH="$(if $(TARGET),$(TARGET),main)"; \
	./scripts/ai-finish-task --issue "$(ISSUE)" --commit-msg "$(MSG)" --target "$$TARGET_BRANCH" $$AUTO_FLAG

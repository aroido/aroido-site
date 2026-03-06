# aroido-site Makefile

.PHONY: help ai-verify-fast ai-verify-full ai-finish

.DEFAULT_GOAL := help

help: ## Show available commands
	@echo "aroido-site commands"
	@echo "===================="
	@grep -E '^(ai-verify-fast|ai-verify-full|ai-finish):.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  %-16s %s\n", $$1, $$2}'

ai-verify-fast: ## Run fast AI verification profile
	@./scripts/ai-verify --mode fast

ai-verify-full: ## Run full AI verification profile
	@./scripts/ai-verify --mode full

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

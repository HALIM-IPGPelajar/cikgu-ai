#!/usr/bin/env bash
# push-to-github.sh
# One-time script to push CIKGU AI to GitHub.
# Run from the cikgu-ai/ folder: bash push-to-github.sh

set -e

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  CIKGU AI → GitHub Push Script"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# 1. Initialise git if not already done
if [ ! -d ".git" ]; then
  echo "▶ Initialising git repository…"
  git init
  git branch -M main
else
  echo "✅ Git already initialised"
fi

# 2. Set remote (update if it already exists)
REMOTE_URL="https://github.com/HALIM-IPGPelajar/cikgu-ai.git"
if git remote get-url origin &>/dev/null; then
  git remote set-url origin "$REMOTE_URL"
  echo "✅ Remote origin updated: $REMOTE_URL"
else
  git remote add origin "$REMOTE_URL"
  echo "✅ Remote origin set: $REMOTE_URL"
fi

# 3. Stage everything (respects .gitignore — no secrets pushed)
echo "▶ Staging files…"
git add .

# 4. Commit
echo "▶ Committing…"
git commit -m "CIKGU AI v1.0 — Year 4 Fractions educational chatbot

- Rule-based chatbot engine (no LLM API)
- 6 complete Fractions lessons
- 24 verified quiz questions
- Points, stars, and badge rewards
- Telegram bot integration (@CIKGUAI0001_bot)
- Responsive web interface
- Human fallback to WhatsApp +601158921344" || echo "(nothing new to commit)"

# 5. Push
echo "▶ Pushing to GitHub…"
echo ""
echo "⚠️  You may be asked for your GitHub username and password."
echo "    Use a Personal Access Token (PAT) as the password."
echo "    Get one at: https://github.com/settings/tokens"
echo ""
git push -u origin main

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅  CIKGU AI pushed to GitHub!"
echo "    https://github.com/HALIM-IPGPelajar/cikgu-ai"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

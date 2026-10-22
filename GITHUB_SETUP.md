# CIKGU AI – GitHub Push Instructions
# Run this file in Git Bash, WSL, or PowerShell
# Requires: git installed, GitHub account at https://github.com/HALIM-IPGPelajar

# ── Step 1: Create the repository on GitHub ───────────────────────────────────
# Go to: https://github.com/new
# Repository name: cikgu-ai
# Visibility: Public or Private
# Do NOT initialise with README (leave unchecked)
# Click "Create repository"

# ── Step 2: Run these commands from INSIDE the cikgu-ai/ folder ──────────────

git init
git branch -M main
git remote add origin https://github.com/HALIM-IPGPelajar/cikgu-ai.git
git add .
git commit -m "CIKGU AI v1.0 - Year 4 Fractions educational chatbot"
git push -u origin main

# ── GitHub will ask for credentials ──────────────────────────────────────────
# Username: HALIM-IPGPelajar
# Password: use a Personal Access Token (NOT your GitHub password)
#   → Get one at: https://github.com/settings/tokens/new
#   → Select scope: repo (full control)
#   → Copy the token and paste it as the password

# ── After pushing ─────────────────────────────────────────────────────────────
# Your repo will be at: https://github.com/HALIM-IPGPelajar/cikgu-ai

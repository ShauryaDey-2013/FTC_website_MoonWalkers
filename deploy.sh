#!/bin/bash

# ==========================================================================
# FTC TEAM DEPLOYMENT ENGINE (FIRST-TIME & SUBSEQUENT PUSHES)
# ==========================================================================

# 1. Configuration - Replace this with your team's real GitHub URL
REPO_URL="https://github.com"

echo "🤖 Scanning local workspace tracker..."

# 2. Check if .git folder exists to determine if it is a first-time setup
if [ ! -d ".git" ]; then
    echo "🆕 First-time initialization detected! Wiring up repo structure..."
    
    git init
    git add .
    git commit -m "Initial commit: Core cyberpunk architecture structure"
    git branch -M main
    git remote add origin "$REPO_URL"
    
    echo "🚀 Launching code base to GitHub for the first time..."
    git push -u origin main

else
    echo "⚡ Existing repository detected. Scanning for file modifications..."
    
    # Check if there are any actual changes before pushing
    if [ -z "$(git status --porcelain)" ]; then
        echo "✅ Workspace completely clean. Nothing new to sync!"
        exit 0
    fi

    # Add all changed and newly created web assets
    git add .

    # Ask the student to type what they changed so your Git log looks professional
    echo "💬 Enter a short description of what you changed (e.g., 'fixed slider CAD typo'):"
    read -r commit_message

    # Fallback message if the student just hits enter
    if [ -z "$commit_message" ]; then
        commit_message="Update: Iterative web adjustments"
    fi

    git commit -m "$commit_message"
    
    echo "🚀 Syncing updates to the main line..."
    git push origin main
fi

echo "🎉 Process complete! Netlify is now automatically compiling your changes live."

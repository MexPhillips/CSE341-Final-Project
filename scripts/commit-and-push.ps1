# Run from project root in PowerShell
# Usage: ./scripts/commit-and-push.ps1 -Message "Your commit message" [-PushBranch "main"]
param(
  [string]$Message = "feat: complete CRUD endpoints and swagger documentation",
  [string]$PushBranch = "main"
)

Write-Host "Running git add ."
git add .

Write-Host "Committing with message: $Message"
# If there are no changes to commit, git will exit non-zero; that will be printed to console.
git commit -m "$Message"

Write-Host "Pushing to origin/$PushBranch"
git push origin $PushBranch

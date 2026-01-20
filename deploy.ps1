param(
    [string]$Message = "Update"
)

Write-Host "Starting deployment..."
git status
git add .
git commit -m "$Message"
git push origin main
Write-Host "Finished."

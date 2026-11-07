@echo off
chcp 65001 >nul
echo ============================================================================
echo   Automatic Portfolio Publisher for Dr. Wai Hnin Eaindrar Mg
echo   Target: https://github.com/WaiHninEaindrarMg/WaiHninEaindrarMg.github.io
echo   Live URL: https://waihnineaindrarmg.github.io
echo ============================================================================
echo.
cd /d "%~dp0"

powershell -NoProfile -ExecutionPolicy Bypass -Command ^
  "$clientId = '178c6fc778ccc68e1d6a'; " ^
  "$dc = Invoke-RestMethod -Uri 'https://github.com/login/device/code' -Method Post -Headers @{ 'Accept' = 'application/json' } -Body @{ client_id = $clientId; scope = 'repo workflow' }; " ^
  "Set-Clipboard -Value $dc.user_code; " ^
  "Write-Host '======================================================' -ForegroundColor Cyan; " ^
  "Write-Host ('  1. Your 8-digit GitHub Code (Copied to Clipboard): ' + $dc.user_code) -ForegroundColor Yellow; " ^
  "Write-Host '  2. Press Ctrl+V in the browser window that opens and click Authorize.' -ForegroundColor Green; " ^
  "Write-Host '======================================================' -ForegroundColor Cyan; " ^
  "Start-Process $dc.verification_uri; " ^
  "$interval = [int]$dc.interval + 1; if ($interval -lt 5) { $interval = 5 }; " ^
  "$token = $null; " ^
  "for ($i = 0; $i -lt 120; $i++) { " ^
  "  Start-Sleep -Seconds $interval; " ^
  "  $poll = Invoke-RestMethod -Uri 'https://github.com/login/oauth/access_token' -Method Post -Headers @{ 'Accept' = 'application/json' } -Body @{ client_id = $clientId; device_code = $dc.device_code; grant_type = 'urn:ietf:params:oauth:grant-type:device_code' }; " ^
  "  if ($poll.access_token) { $token = $poll.access_token; break } " ^
  "}; " ^
  "if (-not $token) { Write-Host 'Timed out waiting for authorization.' -ForegroundColor Red; exit 1 }; " ^
  "$headers = @{ 'Authorization' = \"Bearer $token\"; 'Accept' = 'application/vnd.github+json'; 'User-Agent' = 'WaiHninEaindrarMg-Portfolio' }; " ^
  "$me = Invoke-RestMethod -Uri 'https://api.github.com/user' -Headers $headers; " ^
  "Write-Host ('Authenticated as: ' + $me.login) -ForegroundColor Green; " ^
  "$body = @{ name = 'WaiHninEaindrarMg.github.io'; description = 'Official Bilingual Portfolio Website of Dr. Wai Hnin Eaindrar Mg'; homepage = 'https://waihnineaindrarmg.github.io'; private = $false } | ConvertTo-Json; " ^
  "try { $r = Invoke-RestMethod -Uri 'https://api.github.com/user/repos' -Method Post -Headers $headers -Body $body -ContentType 'application/json'; Write-Host ('Created repository: ' + $r.html_url) -ForegroundColor Green } catch { Write-Host ('Repo check: ' + $_.Exception.Message) -ForegroundColor Yellow }; " ^
  "git branch -M main; " ^
  "git push -u \"https://$($me.login):$token@github.com/$($me.login)/WaiHninEaindrarMg.github.io.git\" main; " ^
  "git remote set-url origin \"https://github.com/$($me.login)/WaiHninEaindrarMg.github.io.git\"; " ^
  "Write-Host '======================================================' -ForegroundColor Green; " ^
  "Write-Host ('  SUCCESS! Live at: https://' + $me.login.ToLower() + '.github.io') -ForegroundColor Green; " ^
  "Write-Host '======================================================' -ForegroundColor Green"

pause

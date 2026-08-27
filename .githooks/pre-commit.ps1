# PowerShell pre-commit hook for Windows users
# Enable locally with: git config core.hooksPath .githooks

param()

$changed = git diff --cached --name-only --diff-filter=ACM
if (-not $changed) { exit 0 }

foreach ($f in $changed) {
    if ($f -match '\.pem$|\.key$|^id_rsa$|^id_dsa$|^id_ecdsa$|\.p12$|\.pfx$|^\.env$|^\.env\.') {
        Write-Host "ERROR: Attempt to commit a potentially sensitive file: $f" -ForegroundColor Red
        Exit 1
    }

    try {
        $content = git show (":$f") -ErrorAction Stop
        if ($content -match '-----BEGIN (RSA )?PRIVATE KEY-----|BEGIN PRIVATE KEY|PRIVATE KEY') {
            Write-Host "ERROR: Detected private key content in staged file: $f" -ForegroundColor Red
            Exit 1
        }
    } catch {
        # binary or removed file - ignore
    }
}

Exit 0

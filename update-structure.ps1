$r = if ($PSScriptRoot) { $PSScriptRoot } else { Split-Path -Parent $MyInvocation.MyCommand.Path }
$files = git -C $r ls-files
$now = Get-Date -Format "yyyy-MM-dd HH:mm"
$o = @(); $o += "# Habib-summary - Project Structure"; $o += "> Updated: $now"; $o += ""; $o += '`'; $o += "habib-summary/"; $o += ""; foreach ($f in $files) { $o += "?? $f" }; $o += '`'; $o += ""; $o += "Total files: $($files.Count)"; $o += "## File Details"; $o += "| File | Size |"; $o += "|------|------|"; foreach ($f in $files) { $fp = Join-Path $r $f; if (Test-Path $fp) { $s = [math]::Round((Get-Item $fp).Length / 1KB, 1); $o += "| $f | $sKB |" } }; $o += ""; $o += "CDN: Tailwind CSS, PDF.js, Mammoth.js, Tesseract.js, Vazirmatn"; $o += "Deploy: https://habibrahmanyonocy786-cmyk.github.io/habib-summary/"; $o += ""; $o += "Habib Rahman Yonocy | 0784258414"; $o -join "
" | Out-File (Join-Path $r "STRUCTURE.md") -Encoding UTF8; Write-Output "STRUCTURE.md updated with $($files.Count) files"

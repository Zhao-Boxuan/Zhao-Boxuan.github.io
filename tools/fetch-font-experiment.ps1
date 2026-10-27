$ErrorActionPreference = 'Stop'
$projectRoot = 'C:\Users\ZOOMRIZE\OneDrive - National University of Singapore\Documents\ChatGPT\Bernard''s Personal Website'
$fontDirectory = Join-Path $projectRoot 'public\fonts\font-experiment'
$cssPath = Join-Path $projectRoot 'styles\font-experiment.css'
New-Item -ItemType Directory -Force -Path $fontDirectory | Out-Null
$cssUrl = 'https://fonts.googleapis.com/css2?family=Bytesized&family=Doto:wght@400;500&family=Silkscreen:wght@400;700&display=swap'
$headers = @{ 'User-Agent' = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/140 Safari/537.36' }
$css = (Invoke-WebRequest -Uri $cssUrl -Headers $headers -UseBasicParsing).Content
$urls = [regex]::Matches($css, 'url\((https://[^)]+)\)')
$index = 0
foreach ($match in $urls) {
  $index += 1
  $fontName = ('trial-{0:D2}.woff2' -f $index)
  Invoke-WebRequest -Uri $match.Groups[1].Value -Headers $headers -OutFile (Join-Path $fontDirectory $fontName) -UseBasicParsing
  $css = $css.Replace($match.Groups[1].Value, "/fonts/font-experiment/$fontName")
}
Set-Content -LiteralPath $cssPath -Value $css -Encoding utf8

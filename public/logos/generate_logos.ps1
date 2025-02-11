# PowerShell script to download technology logos

# Logos dictionary with alternative download URLs
$logos = @{
    "nextjs-logo" = "https://cdn.worldvectorlogo.com/logos/next-js.svg"
    "vercel-logo" = "https://www.svgrepo.com/show/327408/logo-vercel.svg"
    "supabase-logo" = "https://www.svgrepo.com/show/354344/supabase-icon.svg"
    "nodejs-logo" = "https://www.svgrepo.com/show/303360/nodejs-logo.svg"
    "react-logo" = "https://www.svgrepo.com/show/303500/react-logo.svg"
    "tailwind-logo" = "https://www.svgrepo.com/show/374118/tailwind.svg"
    "ovh-logo" = "https://www.svgrepo.com/show/331336/ovh.svg"
    "github-logo" = "https://www.svgrepo.com/show/475654/github-color.svg"
}

# Create logos directory if it doesn't exist
$logoPath = $PSScriptRoot
if (-not (Test-Path -Path $logoPath)) {
    New-Item -ItemType Directory -Path $logoPath
}

# Download logos with error handling
foreach ($logoName in $logos.Keys) {
    $url = $logos[$logoName]
    $outputPath = Join-Path -Path $logoPath -ChildPath "$logoName.svg"
    
    try {
        # Use WebClient for more reliable downloads
        $webClient = New-Object System.Net.WebClient
        $webClient.DownloadFile($url, $outputPath)
        Write-Host "Downloaded $logoName.svg successfully"
    }
    catch {
        Write-Host "Failed to download $logoName.svg: $_"
    }
}

Write-Host "Logo download process completed."

# Validate downloaded files
Get-ChildItem -Path $logoPath -Filter *.svg | ForEach-Object {
    Write-Host "Verifying $($_.Name): $($_.Length) bytes"
}

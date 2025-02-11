# Technology Logos Downloader

## Overview
This script downloads SVG logos for various technologies used in the documentation page.

## Prerequisites
- Windows PowerShell 5.1 or later
- Internet connection

## Usage
1. Double-click `download_logos.bat`
2. PowerShell will download logos to this directory

## Included Logos
- Next.js
- Vercel
- Supabase
- Node.js
- React
- Tailwind CSS
- OVH
- GitHub

## Troubleshooting
- Ensure PowerShell execution policy allows script execution
- Check internet connection
- Verify logo URLs are still valid

## Manual Execution
```powershell
powershell -ExecutionPolicy Bypass -File generate_logos.ps1
```

## Notes
- Logos are downloaded as SVG files
- Script provides download status and file verification

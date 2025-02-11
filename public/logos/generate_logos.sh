#!/bin/bash

# URLs for logos
declare -A logos=(
    ["nextjs-logo"]="https://raw.githubusercontent.com/vercel/next.js/canary/docs/public/static/images/brand/nextjs-logo.svg"
    ["vercel-logo"]="https://www.vectorlogo.zone/logos/vercel/vercel-icon.svg"
    ["supabase-logo"]="https://www.vectorlogo.zone/logos/supabase/supabase-icon.svg"
    ["nodejs-logo"]="https://www.vectorlogo.zone/logos/nodejs/nodejs-icon.svg"
    ["react-logo"]="https://www.vectorlogo.zone/logos/reactjs/reactjs-icon.svg"
    ["tailwind-logo"]="https://www.vectorlogo.zone/logos/tailwindcss/tailwindcss-icon.svg"
    ["ovh-logo"]="https://www.vectorlogo.zone/logos/ovh/ovh-icon.svg"
    ["github-logo"]="https://www.vectorlogo.zone/logos/github/github-icon.svg"
)

# Download logos
for name in "${!logos[@]}"; do
    curl -o "$name.svg" "${logos[$name]}"
    echo "Downloaded $name.svg"
done

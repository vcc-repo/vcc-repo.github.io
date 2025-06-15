# Function to create the markdown table
function Create-ReposMarkdownTable {
    param(
        [string]$SettingsPath = "$env:LOCALAPPDATA\VRChatCreatorCompanion\settings.json",
        [string]$OutputPath = "$PSScriptRoot\index.md"
    )

    # Read and parse JSON file
    try {
        $settingsContent = Get-Content -Path $SettingsPath -Raw
        $settings = ConvertFrom-Json -InputObject $settingsContent
    }
    catch {
        Write-Error "Failed to read settings file: $_"
        return
    }

    # Create array of repository objects with formatted links
    $repos = @()
    foreach ($repo in $settings.userRepos) {
        $installUrl = "vcc://vpm/addRepo?url={0}" -f [uri]::EscapeDataString($repo.url)
        $installLink = "[Install]({0})" -f $installUrl
        $packages = @()
        
        if ($repo.name -eq "bd_") {
            $packages += "Modular Avatar"
        }
        if ($repo.Name -eq "VRLabs Packages: By Ids") {
            $packages += "Custom Object Sync"
        }

        if ($packages.Count -ne 0 ) {
            $packages = ($packages -join "<br>")
        }
        $repos += [PSCustomObject]@{
            Name = $repo.name
            Packages = $packages
            URL  = $repo.url
            InstallUrl = $installUrl
            InstallLink = $installLink
        }
    }

    # VRChat Creator Companion Repositories
    $markdown = @"

- VCC: <a>https://vrchat.com/download/vcc</a>
- Docs: <a>https://vcc.docs.vrchat.com/guides/create-listing</a>

| Name | Packages | Link
|------|-----|-----

"@

    # Add each repository as a table row
    foreach ($repo in $repos) {
        $markdown += "[$($repo.Name)]($($repo.URL)) | $($repo.Packages) | $($repo.InstallLink) |`n"
    }

    # Save to file
    try {
        Set-Content -Path $OutputPath -Value $markdown -Encoding UTF8
        Write-Host "Markdown table generated successfully at $OutputPath"
    }
    catch {
        Write-Error "Failed to save markdown file: $_"
    }
}

# Example usage
Create-ReposMarkdownTable
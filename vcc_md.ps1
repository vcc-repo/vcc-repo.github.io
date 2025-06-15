# Function to create the markdown table
function Create-ReposMarkdownTable {
    param(
        [string]$SettingsPath = "$env:LOCALAPPDATA\VRChatCreatorCompanion\settings.json",
        [string]$ReposPath = "$PSScriptRoot\repos.json",
        [string]$PackagesPath = "$PSScriptRoot\packages.json",
        [string]$OutputPath = "$PSScriptRoot\index.md"
    )

    $repos = @()

    if (Test-Path $PackagesPath) {
        $packages = Get-Content -Path $PackagesPath -Raw
        $packages = ConvertFrom-Json -InputObject $packages
    }
    if (Test-Path $SettingsPath) {
        $settingsContent = Get-Content -Path $SettingsPath -Raw
        $repos = (ConvertFrom-Json -InputObject $settingsContent).userRepos
        foreach ($repo in $repos) {
            $repo.PSObject.Properties.Remove('localPath')
            $repo.PSObject.Properties.Remove('headers')
        }
    }

    # Save repos to repos.json
    $reposJson = ConvertTo-Json -InputObject $repos -Depth 10
    Set-Content -Path $ReposPath -Value $reposJson -Encoding UTF8

    # VRChat Creator Companion Repositories
    $markdown = @"

- VCC: [https://vrchat.com/download/vcc](https://vrchat.com/download/vcc)
- Docs: [https://vcc.docs.vrchat.com/guides/create-listing](https://vcc.docs.vrchat.com/guides/create-listing)

| Id | Name | Packages | Install | Url
---|---|---|---|---

"@

    # Add each repository as a table row
    Write-Host "Found $($repos.Count) repositories"
    foreach ($repo in $repos) {
        Write-Host "Processing repository: $($repo.Name)"
        $installUrl = "vcc://vpm/addRepo?url={0}" -f [uri]::EscapeDataString($repo.url)
        $installLink = "[Install]({0})" -f $installUrl
        $packagesStr = ""
        if ($packages.PSObject.Properties.Name -eq $repo.Name) {
            $packagesStr = ($packages.$($repo.Name) -join "<br>")
        }
        $markdown += "$($repo.Id) | $($repo.Name) | $packagesStr | $InstallLink | $($repo.URL)`n"
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
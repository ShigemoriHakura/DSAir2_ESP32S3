# ServerFile.ps1
Set-Location $PSScriptRoot
$list = New-Object System.Text.StringBuilder
$code = New-Object System.Text.StringBuilder
$count = 1
Get-ChildItem -LiteralPath "SD_WLAN" -Recurse -File | Sort-Object FullName |
ForEach-Object {
    $url = (Resolve-Path -LiteralPath $_.FullName -Relative).Replace("\", "/").TrimStart(".")
    $var = "file{0:D4}" -f $count
    $data = [System.IO.File]::ReadAllBytes($_.FullName)
    [void]$list.Append("    { $var, ""$url"", $($data.Length) },`n")
    $hex = "0x" + ([System.BitConverter]::ToString($data) -replace "-", ",0x")
    [void]$code.Append("const char $var[] = {`n    $($hex -replace ".{160}", "`$0`n    ")`n};`n")
    $count++
}
[void]$code.Append(@"
const struct st_server_file {
    const char *data;
    const char *url;
    int size;
} SERVER_FILE[] = {
$($list.ToString())    { 0, 0, 0 }
};
"@)
$code.ToString() | Out-File -FilePath "ServerFile.cpp" -Encoding ascii

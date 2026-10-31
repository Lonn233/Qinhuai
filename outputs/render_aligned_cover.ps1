$ErrorActionPreference = 'Stop'
$root = 'E:\soft\project\codex-Qinhuai\outputs'
$path = Join-Path $root '一灯一匠——秦淮灯彩数字体验传承_作品介绍文档_封面对齐版.docx'
$qa = Join-Path $root 'project-intro-cover-qa'
$word = $null
$doc = $null
try {
    $word = New-Object -ComObject Word.Application
    $word.Visible = $false
    $word.DisplayAlerts = 0
    $doc = $word.Documents.Open($path, $false, $true)
    $doc.Repaginate()
    $doc.ExportAsFixedFormat((Join-Path $qa 'document.pdf'), 17)
    $result = [ordered]@{pages=$doc.ComputeStatistics(2); sections=$doc.Sections.Count}
    $result | ConvertTo-Json | Set-Content -LiteralPath (Join-Path $qa 'word-render.json') -Encoding UTF8
    Write-Output ($result | ConvertTo-Json -Compress)
} finally {
    if ($null -ne $doc) { $doc.Close(0) }
    if ($null -ne $word) { $word.Quit(); [Runtime.InteropServices.Marshal]::ReleaseComObject($word) | Out-Null }
}

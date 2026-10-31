$ErrorActionPreference = 'Stop'
$root = 'E:\soft\project\codex-Qinhuai\outputs'
$path = Join-Path $root '一灯一匠——秦淮灯彩数字体验传承_作品介绍文档.docx'
$qa = Join-Path $root 'project-intro-qa'
$word = $null
$doc = $null
try {
    $word = New-Object -ComObject Word.Application
    $word.Visible = $false
    $word.DisplayAlerts = 0
    $doc = $word.Documents.Open($path, $false, $false)
    $doc.Fields.Update() | Out-Null
    foreach ($toc in $doc.TablesOfContents) { $toc.Update() }
    foreach ($toc in $doc.TablesOfContents) {
        $toc.Range.Font.Size = 9
        $toc.Range.Font.Color = 0
        $format = $toc.Range.ParagraphFormat
        $format.SpaceBefore = 0
        $format.SpaceAfter = 0
        $format.LineSpacingRule = 4
        $format.LineSpacing = 10.8
        $format.KeepWithNext = 0
        $format.KeepTogether = 0
        $format.PageBreakBefore = 0
        $format.WidowControl = 0
    }
    $doc.Styles.Item(-86).Font.Color = 0
    $doc.Repaginate()
    foreach ($toc in $doc.TablesOfContents) {
        $toc.UpdatePageNumbers()
        $toc.Range.Font.Color = 0
    }
    $doc.Content.Font.Color = 0
    $doc.Repaginate()
    $doc.Save()
    $doc.ExportAsFixedFormat((Join-Path $qa 'document.pdf'), 17)
    $result = [ordered]@{pages=$doc.ComputeStatistics(2); toc=$doc.TablesOfContents.Count; paragraphs=$doc.Paragraphs.Count}
    $result | ConvertTo-Json | Set-Content -LiteralPath (Join-Path $qa 'word-render.json') -Encoding UTF8
    Write-Output ($result | ConvertTo-Json -Compress)
} finally {
    if ($null -ne $doc) { $doc.Close(0) }
    if ($null -ne $word) { $word.Quit(); [Runtime.InteropServices.Marshal]::ReleaseComObject($word) | Out-Null }
}

$ErrorActionPreference = 'Stop'
$root = 'E:\soft\project\codex-Qinhuai\outputs'
$path = Join-Path $root '一灯一匠——秦淮灯彩数字体验传承_作品介绍文档_排版优化版.docx'
$qa = Join-Path $root 'project-intro-format-qa'
New-Item -ItemType Directory -Path $qa -Force | Out-Null
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
        $toc.Range.Font.Name = 'Times New Roman'
        $toc.Range.Font.NameFarEast = '宋体'
        $toc.Range.Font.Size = 10.5
        $toc.Range.Font.Bold = 0
        $toc.Range.Font.Color = 0
        $format = $toc.Range.ParagraphFormat
        $format.SpaceBefore = 0
        $format.SpaceAfter = 2
        $format.LineSpacingRule = 1
        $format.FirstLineIndent = 0
        $format.KeepWithNext = 0
        $format.KeepTogether = -1
        $format.PageBreakBefore = 0
        $format.WidowControl = -1
        foreach ($p in $toc.Range.Paragraphs) {
            $style = $p.Style.NameLocal
            if ($style -match '[12]$') {
                $p.Format.KeepWithNext = -1
                $p.Format.SpaceBefore = 3
            }
            if ($style -match '1$') {
                $p.Range.Font.Size = 12
                $p.Range.Font.Bold = -1
                $p.Format.SpaceBefore = 5
                $p.Format.SpaceAfter = 3
            }
        }
    }
    $doc.Styles.Item(-86).Font.Color = 0
    $doc.Repaginate()
    foreach ($toc in $doc.TablesOfContents) { $toc.UpdatePageNumbers() }
    $doc.Content.Font.Color = 0
    $doc.Repaginate()
    $doc.Save()
    $doc.ExportAsFixedFormat((Join-Path $qa 'document.pdf'), 17)
    $result = [ordered]@{pages=$doc.ComputeStatistics(2); toc=$doc.TablesOfContents.Count; sections=$doc.Sections.Count; paragraphs=$doc.Paragraphs.Count}
    $result | ConvertTo-Json | Set-Content -LiteralPath (Join-Path $qa 'word-render.json') -Encoding UTF8
    Write-Output ($result | ConvertTo-Json -Compress)
} finally {
    if ($null -ne $doc) { $doc.Close(0) }
    if ($null -ne $word) { $word.Quit(); [Runtime.InteropServices.Marshal]::ReleaseComObject($word) | Out-Null }
}

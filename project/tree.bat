@echo off
REM Ce script génère l'arborescence des fichiers, en excluant les dossiers node_modules, et la sauvegarde dans tree.txt en utilisant PowerShell

REM Appel de PowerShell pour générer l'arborescence
powershell -Command "Get-ChildItem -Recurse | Where-Object { $_.FullName -notmatch '\\node_modules\\' } | ForEach-Object { $_.FullName.Substring($pwd.Path.Length).Replace('\', '-->') } | Out-File -FilePath tree.txt -Encoding utf8"

REM Message de confirmation
echo L'arborescence des fichiers a été sauvegardée dans tree.txt

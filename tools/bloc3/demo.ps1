param(
  [switch]$Prepare,
  [switch]$Verify
)
$ErrorActionPreference = 'Stop'
$projectRoot = (Resolve-Path -LiteralPath (Join-Path $PSScriptRoot '../..')).Path
$appDirectory = Join-Path $projectRoot 'spity'
$scratchDirectory = Join-Path $projectRoot 'tmp/bloc3'
$demoEnvFile = Join-Path $scratchDirectory 'demo.env'
$composeFile = Join-Path $PSScriptRoot 'compose.demo.yml'
New-Item -ItemType Directory -Force -Path $scratchDirectory | Out-Null

if (!(Test-Path -LiteralPath $demoEnvFile)) {
  if (!$Prepare) { throw 'Premier lancement : utiliser -Prepare pour initialiser la base de démonstration dédiée.' }
  $dbSecret = [guid]::NewGuid().ToString('N') + [guid]::NewGuid().ToString('N')
  $rootSecret = [guid]::NewGuid().ToString('N') + [guid]::NewGuid().ToString('N')
  $jwtSecret = [guid]::NewGuid().ToString('N') + [guid]::NewGuid().ToString('N') + [guid]::NewGuid().ToString('N')
  @("BLOC3_DB_PASSWORD=$dbSecret", "BLOC3_ROOT_PASSWORD=$rootSecret", "JWT_SECRET=$jwtSecret") | Set-Content -LiteralPath $demoEnvFile -Encoding utf8
}
$demoVariables = @{}
Get-Content -LiteralPath $demoEnvFile | ForEach-Object {
  if ($_ -match '^([A-Z0-9_]+)=(.*)$') { $demoVariables[$matches[1]] = $matches[2] }
}
docker compose --env-file $demoEnvFile -f $composeFile -p spity-bloc3-demo up -d --wait
if ($LASTEXITCODE -ne 0) { throw 'Docker ou MariaDB indisponible. Démarrer Docker Desktop puis relancer.' }

$variableNames = @('DATABASE_URL', 'JWT_SECRET', 'NEXT_TELEMETRY_DISABLED', 'ACCEPTANCE_PORT')
$previousValues = @{}
foreach ($variableName in $variableNames) { $previousValues[$variableName] = [Environment]::GetEnvironmentVariable($variableName, 'Process') }
try {
  # La cible est volontairement fixe : ce script n'utilise jamais DATABASE_URL de .env.local.
  $env:DATABASE_URL = 'mysql://spity_demo:' + $demoVariables['BLOC3_DB_PASSWORD'] + '@127.0.0.1:33313/spity_bloc3_demo'
  $env:JWT_SECRET = $demoVariables['JWT_SECRET']
  $env:NEXT_TELEMETRY_DISABLED = '1'
  $env:ACCEPTANCE_PORT = '3313'
  Push-Location $appDirectory
  try {
    if ($Prepare) {
      npm run db:migrate
      if ($LASTEXITCODE -ne 0) { throw 'Échec des migrations de démonstration.' }
      npm run db:seed
      if ($LASTEXITCODE -ne 0) { throw 'Échec du chargement des données de démonstration.' }
    }
    if ($Verify) {
      npm run test:acceptance
      if ($LASTEXITCODE -ne 0) { throw 'La recette navigateur a échoué. Consulter le rapport Playwright.' }
    } elseif (!$Prepare) {
      Write-Host 'Démonstration locale : http://127.0.0.1:3313 - arrêt avec Ctrl+C'
      npm run dev -- --hostname 127.0.0.1 --port 3313
      if ($LASTEXITCODE -ne 0) { throw 'Le serveur de démonstration a quitté avec une erreur.' }
    }
  } finally { Pop-Location }
} finally {
  foreach ($variableName in $variableNames) { [Environment]::SetEnvironmentVariable($variableName, $previousValues[$variableName], 'Process') }
}

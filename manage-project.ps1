# Script de Gestión del Proyecto DJ Wacko

# Función para mostrar el menú principal
function Show-Menu {
    Clear-Host
    Write-Host "==============================================" -ForegroundColor Cyan
    Write-Host "   Panel de Control - Proyecto DJ Wacko   " -ForegroundColor White
    Write-Host "==============================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Selecciona una opción:" -ForegroundColor Yellow
    Write-Host "1. Actualizar y Compilar APK de Android" -ForegroundColor White
    Write-Host "2. Subir Cambios a GitHub (Commit Manual)" -ForegroundColor White
    Write-Host "3. Iniciar Servidor de Desarrollo (pnpm dev)" -ForegroundColor White
    Write-Host "4. Compilar Proyecto Web (pnpm build)" -ForegroundColor White
    Write-Host "Q. Salir" -ForegroundColor Red
    Write-Host ""
}

# Bucle principal del menú
do {
    Show-Menu
    $choice = Read-Host -Prompt "Tu elección"

    switch ($choice) {
        '1' {
            Write-Host "
--- 1. Actualizando y Compilando APK ---
" -ForegroundColor Green
            
            Write-Host "Paso 1/2: Sincronizando proyecto web con Android..." -ForegroundColor Yellow
            npx cap sync android
            if ($LASTEXITCODE -ne 0) {
                Write-Host "Error durante la sincronización de Capacitor." -ForegroundColor Red
                break
            }

            Write-Host "Paso 1.5/2: Parcheando versión de Java en capacitor.build.gradle..." -ForegroundColor Yellow
            $capacitorBuildGradle = ".\android\app\capacitor.build.gradle"
            if (Test-Path $capacitorBuildGradle) {
                (Get-Content $capacitorBuildGradle -Raw).Replace('JavaVersion.VERSION_21', 'JavaVersion.VERSION_17') | Set-Content $capacitorBuildGradle
                Write-Host "Versión de Java corregida a 17." -ForegroundColor Green
            } else {
                Write-Host "ADVERTENCIA: No se encontró capacitor.build.gradle para parchear." -ForegroundColor Yellow
            }
            
            Write-Host "
Paso 2/2: Limpiando y compilando el APK de depuración..." -ForegroundColor Yellow
            Push-Location -Path .\android
            .\gradlew.bat app:clean app:assembleDebug
            if ($LASTEXITCODE -ne 0) {
                Write-Host "Error durante la compilación con Gradle." -ForegroundColor Red
            } else {
                Write-Host "
✅ ¡APK generado con éxito!" -ForegroundColor Green
                Write-Host "Encontrarás el archivo en: android\app\build\outputs\apk\debug\app-debug.apk"
            }
            Pop-Location
        }
        '2' {
            Write-Host "
--- 2. Subiendo Cambios a GitHub ---
" -ForegroundColor Green
            
            $commitMessage = Read-Host -Prompt "Introduce tu mensaje de commit"
            if ([string]::IsNullOrWhiteSpace($commitMessage)) {
                Write-Host "El mensaje de commit no puede estar vacío." -ForegroundColor Red
                break
            }

            Write-Host "
Paso 1/3: Añadiendo todos los cambios (git add .)..." -ForegroundColor Yellow
            git add .
            
            Write-Host "
Paso 2/3: Creando commit..." -ForegroundColor Yellow
            git commit -m "$commitMessage"

            Write-Host "
Paso 3/3: Subiendo a GitHub (git push)..." -ForegroundColor Yellow
            git push

            if ($LASTEXITCODE -eq 0) {
                Write-Host "
✅ ¡Cambios subidos a GitHub con éxito!" -ForegroundColor Green
            } else {
                Write-Host "
Error al subir los cambios a GitHub." -ForegroundColor Red
            }
        }
        '3' {
            Write-Host "
--- 3. Iniciando Servidor de Desarrollo ---
" -ForegroundColor Green
            pnpm dev
        }
        '4' {
            Write-Host "
--- 4. Compilando Proyecto Web ---
" -ForegroundColor Green
            pnpm build
            if ($LASTEXITCODE -eq 0) {
                Write-Host "
✅ ¡Proyecto compilado con éxito!" -ForegroundColor Green
            } else {
                Write-Host "
Error al compilar el proyecto." -ForegroundColor Red
            }
        }
        'q' {
            Write-Host "Saliendo..." -ForegroundColor White
        }
        default {
            Write-Host "Opción no válida. Inténtalo de nuevo." -ForegroundColor Red
        }
    }

    if ($choice -ne 'q') {
        Read-Host -Prompt "
Presiona Enter para volver al menú..."
    }

} while ($choice -ne 'q')

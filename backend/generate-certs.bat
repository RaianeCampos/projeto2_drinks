@echo off
REM Script para gerar certificados SSL autoassinados no Windows

echo Gerando certificados SSL autoassinados...

REM Usando PowerShell para gerar certificados
powershell -Command "Add-Type -AssemblyName System.Security; [System.Security.Cryptography.X509Certificates.CertificateRequest]::New; $cert = New-SelfSignedCertificate -DnsName 'localhost' -CertStoreLocation 'cert:\CurrentUser\My' -NotAfter (Get-Date).AddYears(1); Export-PfxCertificate -Cert $cert -FilePath './server.pfx' -Password (ConvertTo-SecureString -String 'password' -AsPlainText -Force); Get-Content './server.pfx' | Out-File './server.key' -Encoding ASCII"

if %errorlevel% equ 0 (
    echo Certificados gerados com sucesso!
) else (
    echo Erro ao gerar certificados. Usando fallback para HTTP...
)

pause

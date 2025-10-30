# Simple PowerShell HTTP Server for testing the Astronomy Picture App
# Run this script to start a local web server

param(
    [int]$Port = 8080,
    [string]$Path = "."
)

Write-Host "Starting HTTP Server on port $Port..."
Write-Host "Serving files from: $(Resolve-Path $Path)"
Write-Host "Open your browser and go to: http://localhost:$Port"
Write-Host "Press Ctrl+C to stop the server"

# Import required assembly
Add-Type -AssemblyName System.Net.Http

# Create HTTP listener
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$Port/")

try {
    $listener.Start()
    
    while ($listener.IsListening) {
        # Wait for a request
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response
        
        # Get the requested file path
        $localPath = $request.Url.LocalPath
        if ($localPath -eq "/") { $localPath = "/index.html" }
        
        $filePath = Join-Path $Path $localPath.TrimStart('/')
        
        Write-Host "$(Get-Date -Format 'HH:mm:ss') - $($request.HttpMethod) $localPath"
        
        try {
            if (Test-Path $filePath -PathType Leaf) {
                # Serve the file
                $content = [System.IO.File]::ReadAllBytes($filePath)
                
                # Set content type based on file extension
                $extension = [System.IO.Path]::GetExtension($filePath).ToLower()
                switch ($extension) {
                    ".html" { $response.ContentType = "text/html; charset=utf-8" }
                    ".css"  { $response.ContentType = "text/css; charset=utf-8" }
                    ".js"   { $response.ContentType = "application/javascript; charset=utf-8" }
                    ".json" { $response.ContentType = "application/json; charset=utf-8" }
                    ".png"  { $response.ContentType = "image/png" }
                    ".jpg"  { $response.ContentType = "image/jpeg" }
                    ".jpeg" { $response.ContentType = "image/jpeg" }
                    ".gif"  { $response.ContentType = "image/gif" }
                    ".ico"  { $response.ContentType = "image/x-icon" }
                    default { $response.ContentType = "application/octet-stream" }
                }
                
                $response.ContentLength64 = $content.Length
                $response.StatusCode = 200
                $response.OutputStream.Write($content, 0, $content.Length)
            } else {
                # File not found
                $response.StatusCode = 404
                $errorContent = [System.Text.Encoding]::UTF8.GetBytes("404 - File Not Found")
                $response.ContentLength64 = $errorContent.Length
                $response.OutputStream.Write($errorContent, 0, $errorContent.Length)
            }
        } catch {
            # Internal server error
            $response.StatusCode = 500
            $errorContent = [System.Text.Encoding]::UTF8.GetBytes("500 - Internal Server Error")
            $response.ContentLength64 = $errorContent.Length
            $response.OutputStream.Write($errorContent, 0, $errorContent.Length)
            Write-Host "Error serving $filePath`: $_" -ForegroundColor Red
        } finally {
            $response.Close()
        }
    }
} catch {
    Write-Host "Error starting server: $_" -ForegroundColor Red
} finally {
    if ($listener.IsListening) {
        $listener.Stop()
    }
    Write-Host "Server stopped."
}
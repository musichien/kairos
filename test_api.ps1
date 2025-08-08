$headers = @{
    "Content-Type" = "application/json"
    "Authorization" = "Bearer your-secret-key-here"
}

$body = @{
    model = "jinbora/deepseek-r1-Bllossom:8b"
    messages = @(
        @{
            role = "user"
            content = "한국의 수도는 어디입니까?"
        }
    )
    temperature = 0.7
} | ConvertTo-Json -Depth 10

$url = "https://eb3f9d86fe6b.ngrok-free.app/v1/chat/completions"

try {
    $response = Invoke-WebRequest -Uri $url -Method POST -Headers $headers -Body $body
    Write-Host "Status Code: $($response.StatusCode)"
    Write-Host "Response:"
    $response.Content | ConvertFrom-Json | ConvertTo-Json -Depth 10
} catch {
    Write-Host "Error: $($_.Exception.Message)"
    if ($_.Exception.Response) {
        Write-Host "Response Status: $($_.Exception.Response.StatusCode)"
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $responseBody = $reader.ReadToEnd()
        Write-Host "Response Body: $responseBody"
    }
} 
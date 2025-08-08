# 메모리 기능 테스트 스크립트
# PowerShell에서 실행

$OLLAMA_API_URL = "https://eb3f9d86fe6b.ngrok-free.app"
$API_KEY = "dummy-key"
$USER_ID = "test_user_001"

Write-Host "🧠 Ollama API 서버 메모리 기능 테스트" -ForegroundColor Green
Write-Host "API URL: $OLLAMA_API_URL" -ForegroundColor Yellow
Write-Host "사용자 ID: $USER_ID" -ForegroundColor Yellow
Write-Host ""

# 1. 메모리 통계 조회
Write-Host "1️⃣ 메모리 통계 조회..." -ForegroundColor Cyan
try {
    $response = Invoke-WebRequest -Uri "$OLLAMA_API_URL/api/memory/$USER_ID/stats" -Method GET -Headers @{
        "Authorization" = "Bearer $API_KEY"
        "Content-Type" = "application/json; charset=utf-8"
    }
    Write-Host "✅ 메모리 통계:" -ForegroundColor Green
    $stats = $response.Content | ConvertFrom-Json
    $stats | Format-List
} catch {
    Write-Host "❌ 메모리 통계 조회 실패: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# 2. 사실 추가
Write-Host "2️⃣ 사실 추가..." -ForegroundColor Cyan
try {
    $factData = @{
        fact = "이 사용자는 AI와 프로그래밍에 관심이 많다"
        category = "interests"
    } | ConvertTo-Json

    $response = Invoke-WebRequest -Uri "$OLLAMA_API_URL/api/memory/$USER_ID/facts" -Method POST -Body $factData -Headers @{
        "Authorization" = "Bearer $API_KEY"
        "Content-Type" = "application/json; charset=utf-8"
    }
    Write-Host "✅ 사실 추가됨:" -ForegroundColor Green
    $fact = $response.Content | ConvertFrom-Json
    $fact | Format-List
} catch {
    Write-Host "❌ 사실 추가 실패: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# 3. 선호도 추가
Write-Host "3️⃣ 선호도 추가..." -ForegroundColor Cyan
try {
    $prefData = @{
        preference = "프로그래밍 언어"
        value = "Python, JavaScript"
    } | ConvertTo-Json

    $response = Invoke-WebRequest -Uri "$OLLAMA_API_URL/api/memory/$USER_ID/preferences" -Method POST -Body $prefData -Headers @{
        "Authorization" = "Bearer $API_KEY"
        "Content-Type" = "application/json; charset=utf-8"
    }
    Write-Host "✅ 선호도 추가됨:" -ForegroundColor Green
    $pref = $response.Content | ConvertFrom-Json
    $pref | Format-List
} catch {
    Write-Host "❌ 선호도 추가 실패: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# 4. 메모리를 활용한 대화
Write-Host "4️⃣ 메모리를 활용한 대화..." -ForegroundColor Cyan
try {
    $chatData = @{
        model = "jinbora/deepseek-r1-Bllossom:8b"
        messages = @(
            @{
                role = "user"
                content = "내가 어떤 프로그래밍 언어를 좋아하는지 기억하나요?"
            }
        )
        temperature = 0.7
        user_id = $USER_ID
    } | ConvertTo-Json

    $response = Invoke-WebRequest -Uri "$OLLAMA_API_URL/v1/chat/completions" -Method POST -Body $chatData -Headers @{
        "Authorization" = "Bearer $API_KEY"
        "Content-Type" = "application/json; charset=utf-8"
    }
    Write-Host "✅ AI 응답:" -ForegroundColor Green
    $chatResponse = $response.Content | ConvertFrom-Json
    Write-Host $chatResponse.choices[0].message.content -ForegroundColor White
} catch {
    Write-Host "❌ 대화 실패: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# 5. 전체 메모리 조회
Write-Host "5️⃣ 전체 메모리 조회..." -ForegroundColor Cyan
try {
    $response = Invoke-WebRequest -Uri "$OLLAMA_API_URL/api/memory/$USER_ID" -Method GET -Headers @{
        "Authorization" = "Bearer $API_KEY"
        "Content-Type" = "application/json; charset=utf-8"
    }
    Write-Host "✅ 전체 메모리:" -ForegroundColor Green
    $memory = $response.Content | ConvertFrom-Json
    Write-Host "대화 수: $($memory.conversations.Count)" -ForegroundColor Yellow
    Write-Host "사실 수: $($memory.facts.Count)" -ForegroundColor Yellow
    Write-Host "선호도 수: $($memory.preferences.Count)" -ForegroundColor Yellow
} catch {
    Write-Host "❌ 메모리 조회 실패: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

Write-Host "🎉 메모리 기능 테스트 완료!" -ForegroundColor Green 
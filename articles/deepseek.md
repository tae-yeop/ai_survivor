앤트트로픽 클로드코드 
다른 프로바이더 적용하기

클로드코드 성능이 좋으나 비용이 매우 비싸고(환율도 너무 높다)
토큰 소모도 앤트로픽측에서 업데이트를 하면 엄청 빨리 소모되버린다.

맥이나 리눅스

```
export ANTHROPIC_BASE_URL="https://api.moonshot.ai/anthropic"
export ANTHROPIC_AUTH_TOKEN="<YOUR_MOONSHOT_API_KEY>"

export ANTHROPIC_MODEL="kimi-k2.6"
export ANTHROPIC_DEFAULT_OPUS_MODEL="kimi-k2.6"
export ANTHROPIC_DEFAULT_SONNET_MODEL="kimi-k2.6"
export ANTHROPIC_DEFAULT_HAIKU_MODEL="kimi-k2.6"
export CLAUDE_CODE_SUBAGENT_MODEL="kimi-k2.6"

export ENABLE_TOOL_SEARCH=false

cd /path/to/your-project
claude
```

윈도우

```
$env:ANTHROPIC_BASE_URL="https://api.moonshot.ai/anthropic"
$env:ANTHROPIC_AUTH_TOKEN="<YOUR_MOONSHOT_API_KEY>"

$env:ANTHROPIC_MODEL="kimi-k2.6"
$env:ANTHROPIC_DEFAULT_OPUS_MODEL="kimi-k2.6"
$env:ANTHROPIC_DEFAULT_SONNET_MODEL="kimi-k2.6"
$env:ANTHROPIC_DEFAULT_HAIKU_MODEL="kimi-k2.6"
$env:CLAUDE_CODE_SUBAGENT_MODEL="kimi-k2.6"

$env:ENABLE_TOOL_SEARCH="false"

cd C:\path\to\your-project
claude
```
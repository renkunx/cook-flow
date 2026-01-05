# AI Provider 环境变量配置指南

## ✅ 已完成的配置

您的 Tandoor Recipes 现在支持通过环境变量配置 AI provider。

### 当前配置状态

| 项目 | 配置 |
|------|------|
| Provider 名称 | OpenAI GPT-4o |
| API Key | `ENV:OPENAI_API_KEY` |
| 模型 | gpt-4o |
| 配置方式 | 环境变量 |

## 🔧 环境变量配置方式

### 支持的环境变量格式

AI provider 的 API key 和 URL 字段支持以下格式引用环境变量：

| 格式 | 示例 | 说明 |
|------|------|------|
| `ENV:变量名` | `ENV:OPENAI_API_KEY` | 推荐格式 |
| `env://变量名` | `env://OPENAI_API_KEY` | URL 风格 |
| `${变量名}` | `${OPENAI_API_KEY}` | Shell 风格 |

### 配置步骤

#### 1. 编辑 `.env` 文件

```bash
# 编辑项目根目录的 .env 文件
cd /Users/renkun/Source/cook-flow
nano .env  # 或使用您喜欢的编辑器
```

#### 2. 添加/更新 API 密钥

```bash
# OpenAI API Configuration
# Get your API key from: https://platform.openai.com/api-keys
OPENAI_API_KEY=sk-proj-你的真实API密钥

# Optional: Custom API base URL (for proxies or alternative endpoints)
# OPENAI_API_BASE=https://api.openai.com/v1
```

#### 3. 重启 Django 服务器

```bash
# 停止当前服务器 (Ctrl+C)
# 重新启动
source venv/bin/activate
python manage.py runserver
```

## 📋 完整的 .env 配置示例

```bash
# ---------------------------------------------------------------------------
# AI Provider Configuration
# ---------------------------------------------------------------------------

# OpenAI API Configuration
OPENAI_API_KEY=sk-proj-your-openai-api-key-here
# OPENAI_API_BASE=https://api.openai.com/v1

# Anthropic Claude API Configuration
# ANTHROPIC_API_KEY=sk-ant-your-anthropic-api-key-here
# ANTHROPIC_API_BASE=https://api.anthropic.com

# Google Gemini API Configuration
# GOOGLE_API_KEY=your-google-api-key-here
# GOOGLE_API_BASE=https://generativelanguage.googleapis.com

# Local Ollama Configuration
# OLLAMA_API_KEY=ollama
# OLLAMA_API_BASE=http://localhost:11434
```

## 🎯 在数据库中配置 Provider

### 方法 1: 通过 Web 界面

1. 登录 Tandoor Recipes
2. 用户菜单 → **空间设置**
3. 找到 **AI 提供商** 部分
4. 编辑或创建提供商
5. **API 密钥** 字段填写：`ENV:OPENAI_API_KEY`
6. **URL** 字段（可选）：`ENV:OPENAI_API_BASE`
7. 保存

### 方法 2: 通过命令行

```python
from cookbook.models import AiProvider
from django_scopes import scopes_disabled

with scopes_disabled():
    # 创建使用环境变量的 provider
    provider = AiProvider.objects.create(
        space=space,
        name='OpenAI GPT-4o',
        description='OpenAI GPT-4o (使用环境变量)',
        api_key='ENV:OPENAI_API_KEY',  # 引用环境变量
        model_name='gpt-4o',
        url='ENV:OPENAI_API_BASE',     # 可选：API 基础 URL
        log_credit_cost=True
    )
```

## 🌟 多提供商配置示例

### OpenAI + Claude + Ollama

```python
from cookbook.models import AiProvider
from django_scopes import scopes_disabled

with scopes_disabled():
    space = Space.objects.first()

    # OpenAI (用于图像识别等复杂任务)
    AiProvider.objects.create(
        space=space,
        name='OpenAI GPT-4o',
        api_key='ENV:OPENAI_API_KEY',
        model_name='gpt-4o',
        log_credit_cost=True
    )

    # Claude (用于分析和排序)
    AiProvider.objects.create(
        space=space,
        name='Claude 3.5 Sonnet',
        api_key='ENV:ANTHROPIC_API_KEY',
        model_name='claude-3-5-sonnet-20241022',
        log_credit_cost=True
    )

    # 本地 Ollama (免费使用)
    AiProvider.objects.create(
        space=space,
        name='Local Llama 3.2',
        api_key='ENV:OLLAMA_API_KEY',  # 可以是任意值
        model_name='ollama/llama3.2',
        url='ENV:OLLAMA_API_BASE',      # http://localhost:11434
        log_credit_cost=False  # 本地模型不计费
    )
```

## 🔐 安全最佳实践

### 1. 不要提交 API 密钥到 Git

确保 `.env` 文件在 `.gitignore` 中：

```bash
# .gitignore
.env
.env.local
.env.*.local
```

### 2. 使用不同的环境变量

生产环境和开发环境使用不同的密钥：

```bash
# .env (开发环境 - 本地配置)
OPENAI_API_KEY=sk-proj-dev-key

# .env.production (生产环境 - 生产配置)
OPENAI_API_KEY=sk-proj-prod-key
```

### 3. 限制 API 密钥权限

在 OpenAI 平台：
- 为不同环境创建不同的密钥
- 设置使用限额
- 定期轮换密钥

### 4. 服务器部署配置

对于生产服务器，使用系统环境变量：

```bash
# Linux/Mac
export OPENAI_API_KEY=sk-proj-your-key

# 或在 systemd 服务文件中
[Service]
Environment="OPENAI_API_KEY=sk-proj-your-key"
Environment="ANTHROPIC_API_KEY=sk-ant-your-key"
```

## 🧪 测试配置

### 验证环境变量是否正确

```python
import os
from cookbook.helper.ai_config_helper import _resolve_env_var

# 检查环境变量
print(f"OPENAI_API_KEY: {os.getenv('OPENAI_API_KEY', 'NOT SET')}")

# 测试解析
test_values = [
    'ENV:OPENAI_API_KEY',
    'env://OPENAI_API_KEY',
    '${OPENAI_API_KEY}',
    'sk-direct-key'
]

for v in test_values:
    resolved = _resolve_env_var(v)
    print(f"{v} -> {resolved[:20]}..." if resolved and len(resolved) > 20 else f"{v} -> {resolved}")
```

### 测试 AI 功能

1. 确保 `.env` 文件中有有效的 API 密钥
2. 重启 Django 服务器
3. 尝试使用 AI 功能：
   - 从图片导入食谱
   - 自动排序步骤

## 📊 监控使用情况

### 查看环境变量配置

```python
from cookbook.models import AiProvider
from cookbook.helper.ai_config_helper import get_ai_provider_config
from django_scopes import scopes_disabled

with scopes_disabled():
    provider = AiProvider.objects.first()
    config = get_ai_provider_config(provider)

    print(f"Provider: {provider.name}")
    print(f"API Key: {config['api_key'][:20]}...")
    print(f"Model: {config['model']}")
    if 'api_base' in config:
        print(f"API Base: {config['api_base']}")
```

### 查看 AI 使用日志

- Web 界面：空间设置 → AI 日志
- 数据库：
  ```python
  from cookbook.models import AiLog

  logs = AiLog.objects.order_by('-created_at')[:10]
  for log in logs:
      print(f"{log.function}: {log.credit_cost} credits")
  ```

## 🔧 故障排除

### 问题：环境变量未生效

**检查**：
```bash
# 确认环境变量已设置
echo $OPENAI_API_KEY

# 或在 Python 中检查
python -c "import os; print(os.getenv('OPENAI_API_KEY'))"
```

**解决**：
- 确保 `.env` 文件在项目根目录
- 重启 Django 服务器
- 检查环境变量名称拼写

### 问题：AI 请求失败

**检查**：
```python
from cookbook.models import AiProvider
from cookbook.helper.ai_config_helper import get_ai_provider_config
from django_scopes import scopes_disabled

with scopes_disabled():
    provider = AiProvider.objects.first()
    config = get_ai_provider_config(provider)

    # 检查解析后的值
    print(f"Resolved API key: {config['api_key']}")
```

**解决**：
- 确保 API 密钥有效
- 检查 API 基础 URL 是否正确
- 查看 AI 日志获取详细错误

## 📚 相关文档

- [AI 功能完整指南](./AI_GUIDE.md)
- [OpenAI 快速启动](./OPENAI_QUICKSTART.md)
- [LiteLLM 文档](https://docs.litellm.ai/)

## 🎉 配置完成！

您的 AI provider 现在已配置为使用环境变量。这种方式：

- ✅ 更安全 - 密钥不会硬编码在数据库中
- ✅ 更灵活 - 不同环境使用不同配置
- ✅ 易维护 - 只需修改 `.env` 文件
- ✅ 符合最佳实践 - 遵循 12-Factor App 原则

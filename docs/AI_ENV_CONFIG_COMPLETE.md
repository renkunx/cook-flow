# AI Provider 完整环境变量配置

## ✅ 配置完成

您的 AI provider 现已完全配置为使用环境变量管理所有配置项。

### 当前配置状态

| 配置项 | 数据库值 | 环境变量 | 解析后值 |
|--------|----------|----------|----------|
| API Key | `ENV:OPENAI_API_KEY` | `OPENAI_API_KEY` | `sk-hq5Ofx108...` |
| 模型 | `ENV:OPENAI_MODEL` | `OPENAI_MODEL` | `gpt-4o` |
| URL | `ENV:OPENAI_API_BASE` | `OPENAI_API_BASE` | `https://llmhub.app/v1` |

## 📝 .env 文件配置

所有 AI 相关配置都在 `.env` 文件中管理：

```bash
# ---------------------------------------------------------------------------
# AI Provider Configuration
# ---------------------------------------------------------------------------

# OpenAI API Configuration
OPENAI_API_KEY=sk-hq5Ofx108VMtTnHh44D44b58F6D44768971d8bAd0714D49c
OPENAI_MODEL=gpt-4o
OPENAI_API_BASE=https://llmhub.app/v1

# Anthropic Claude API Configuration (示例)
# ANTHROPIC_API_KEY=sk-ant-your-key
# ANTHROPIC_MODEL=claude-3-5-sonnet-20241022
# ANTHROPIC_API_BASE=https://api.anthropic.com

# Google Gemini API Configuration (示例)
# GOOGLE_API_KEY=your-key
# GOOGLE_MODEL=gemini-pro
```

## 🎯 更换模型或配置

### 更换 OpenAI 模型

编辑 `.env` 文件：

```bash
# 从 gpt-4o 切换到 gpt-4o-mini (更便宜)
OPENAI_MODEL=gpt-4o-mini

# 或切换到 gpt-4-turbo (更强大)
OPENAI_MODEL=gpt-4-turbo
```

然后重启 Django 服务器：

```bash
# 停止当前服务器 (Ctrl+C)
# 重新启动
python manage.py runserver
```

### 更换 API 端点

```bash
# 使用 OpenAI 官方端点
OPENAI_API_BASE=https://api.openai.com/v1

# 或使用代理端点
OPENAI_API_BASE=https://your-proxy.com/v1
```

### 添加新的 AI 提供商

1. 在 `.env` 中添加配置：

```bash
# Anthropic Claude
ANTHROPIC_API_KEY=sk-ant-your-key
ANTHROPIC_MODEL=claude-3-5-sonnet-20241022
ANTHROPIC_API_BASE=https://api.anthropic.com
```

2. 在数据库中创建 provider：

```python
from cookbook.models import AiProvider
from django_scopes import scopes_disabled

with scopes_disabled():
    AiProvider.objects.create(
        space=space,
        name='Claude 3.5 Sonnet',
        api_key='ENV:ANTHROPIC_API_KEY',
        model_name='ENV:ANTHROPIC_MODEL',
        url='ENV:ANTHROPIC_API_BASE',
        log_credit_cost=True
    )
```

## 🔧 常用 OpenAI 模型

| 模型 | 用途 | 成本 | 配置示例 |
|------|------|------|----------|
| `gpt-4o` | 通用、多模态 | 中等 | `OPENAI_MODEL=gpt-4o` |
| `gpt-4o-mini` | 快速、经济 | 低 | `OPENAI_MODEL=gpt-4o-mini` |
| `gpt-4-turbo` | 高质量 | 高 | `OPENAI_MODEL=gpt-4-turbo` |

## 📊 环境变量对应关系

### OpenAI

| 数据库字段 | 环境变量 | 说明 |
|-----------|----------|------|
| `api_key` | `OPENAI_API_KEY` | API 密钥 |
| `model_name` | `OPENAI_MODEL` | 模型名称 |
| `url` | `OPENAI_API_BASE` | API 端点 |

### Anthropic Claude

| 数据库字段 | 环境变量 | 说明 |
|-----------|----------|------|
| `api_key` | `ANTHROPIC_API_KEY` | API 密钥 |
| `model_name` | `ANTHROPIC_MODEL` | 模型名称 |
| `url` | `ANTHROPIC_API_BASE` | API 端点 |

### Google Gemini

| 数据库字段 | 环境变量 | 说明 |
|-----------|----------|------|
| `api_key` | `GOOGLE_API_KEY` | API 密钥 |
| `model_name` | `GOOGLE_MODEL` | 模型名称 |
| `url` | `GOOGLE_API_BASE` | API 端点 |

## 🌟 完整配置示例

### 开发环境 (.env)

```bash
# 使用便宜的模型进行测试
OPENAI_MODEL=gpt-4o-mini
```

### 生产环境 (.env.production)

```bash
# 使用高质量模型
OPENAI_MODEL=gpt-4o
```

### 多提供商配置

```bash
# OpenAI - 用于图像识别
OPENAI_API_KEY=sk-proj-key1
OPENAI_MODEL=gpt-4o
OPENAI_API_BASE=https://api.openai.com/v1

# Claude - 用于文本分析
ANTHROPIC_API_KEY=sk-ant-key2
ANTHROPIC_MODEL=claude-3-5-sonnet-20241022
ANTHROPIC_API_BASE=https://api.anthropic.com

# Ollama - 本地免费使用
OLLAMA_API_KEY=ollama
OLLAMA_MODEL=ollama/llama3.2
OLLAMA_API_BASE=http://localhost:11434
```

## 🧪 验证配置

### 检查环境变量

```python
import os
from cookbook.helper.ai_config_helper import get_ai_provider_config
from cookbook.models import AiProvider
from django_scopes import scopes_disabled

with scopes_disabled():
    provider = AiProvider.objects.first()
    config = get_ai_provider_config(provider)

    print("配置验证:")
    print(f"  API Key: {config['api_key'][:20]}...")
    print(f"  Model: {config['model']}")
    print(f"  API Base: {config.get('api_base', '(default)')}")
```

### 测试 AI 功能

1. 确保 Django 服务器正在运行
2. 登录 Tandoor Recipes
3. 尝试使用 AI 功能：
   - 从图片导入食谱
   - 自动排序步骤
   - 分析营养信息

## 📝 配置检查清单

- [x] 辅助函数已更新支持模型名称
- [x] .env 文件已添加模型配置
- [x] 数据库 provider 已更新
- [x] 配置验证通过
- [ ] Django 服务器已重启
- [ ] AI 功能测试成功

## 🎉 总结

现在所有 AI 配置都通过 `.env` 文件管理：

✅ **优势**:
- API 密钥不在数据库中
- 模型名称可灵活切换
- API 端点可轻松更换
- 不同环境使用不同配置
- 符合 12-Factor App 最佳实践

✅ **操作**:
- 修改 `.env` 文件
- 重启 Django 服务器
- 立即生效

无需修改数据库！

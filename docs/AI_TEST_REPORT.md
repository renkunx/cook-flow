# AI 功能测试诊断报告

## 📋 测试结果

### ✅ 配置验证：通过

| 检查项 | 状态 |
|--------|------|
| 环境变量解析 | ✅ 正常 |
| 数据库配置 | ✅ 正常 |
| 环境变量加载 | ✅ 正常 |
| 模型名称 | gpt-4o-mini |

### ❌ API 调用：失败

**错误信息**：
```
AuthenticationError: Incorrect API key provided
```

## 🔍 问题分析

### 可能的原因

1. **API 密钥无效**
   - 当前密钥：`sk-hq5Ofx108VMtTnHh44D44b58F6D44768971d8bAd0714D49c`
   - 错误提示密钥格式不正确或已失效

2. **API 端点问题**
   - 当前配置：`https://llmhub.app/v1`
   - 测试官方端点时仍报错，说明是密钥本身的问题

3. **账户问题**
   - OpenAI 账户可能被暂停
   - API 密钥可能已撤销
   - 账户余额不足

## 🔧 解决方案

### 方案 1：获取新的 OpenAI API 密钥

1. 访问 [OpenAI Platform](https://platform.openai.com/)
2. 登录您的账户
3. 进入 [API Keys](https://platform.openai.com/api-keys)
4. 点击 **+ Create new secret key**
5. 复制新的 API 密钥
6. 更新 `.env` 文件：

```bash
OPENAI_API_KEY=sk-proj-新的密钥
```

7. 重启 Django 服务器

### 方案 2：检查当前密钥状态

1. 登录 [OpenAI Platform](https://platform.openai.com/)
2. 检查 API 密钥列表
3. 确认密钥是否仍然有效
4. 检查账户余额和使用情况

### 方案 3：使用其他 AI 提供商

如果 OpenAI 不可用，可以考虑：

#### 使用本地模型 (Ollama)

```bash
# 安装 Ollama
brew install ollama

# 启动 Ollama
ollama serve

# 下载模型
ollama pull llama3.2

# 更新 .env 配置
OPENAI_API_KEY=ollama  # Ollama 不需要真实密钥
OPENAI_MODEL=ollama/llama3.2
OPENAI_API_BASE=http://localhost:11434
```

#### 使用其他平台

```bash
# DeepSeek (中国用户友好)
OPENAI_API_KEY=your-deepseek-key
OPENAI_MODEL=deepseek-chat
OPENAI_API_BASE=https://api.deepseek.com
```

## 🧪 重新测试

获取新密钥后，运行以下测试：

```bash
cd /Users/renkun/Source/cook-flow
source venv/bin/activate
python manage.py shell
```

```python
from cookbook.models import Space
from cookbook.helper.ai_config_helper import get_ai_provider_config
from litellm import completion

space = Space.objects.first()
provider = space.ai_default_provider
config = get_ai_provider_config(provider)

print(f"Testing with model: {config['model']}")

response = completion(
    **config,
    messages=[{"role": "user", "content": "Say 'Test successful'"}],
)

print(f"Response: {response.choices[0].message.content}")
```

## 📊 测试清单

- [ ] 确认 API 密钥有效
- [ ] 检查账户余额充足
- [ ] 验证网络连接正常
- [ ] 更新 .env 文件
- [ ] 重启 Django 服务器
- [ ] 运行测试脚本
- [ ] 在 Web 界面测试 AI 功能

## 🎯 Web 界面测试

配置正确密钥后，在 Tandoor Recipes 中测试：

1. **登录系统**
2. **进入导入食谱页面**
3. **选择 AI 导入**
4. **上传一张食谱图片**
5. **选择 AI 提供商**
6. **点击分析并导入**

## 💡 建议

1. **定期检查密钥** - API 密钥可能会过期或被撤销
2. **设置使用限额** - 在 OpenAI 平台设置使用限制避免意外费用
3. **监控使用情况** - 定期查看 AI 日志
4. **使用本地模型** - 对于开发测试，本地模型免费且快速

## 🔗 相关链接

- [OpenAI Platform](https://platform.openai.com/)
- [OpenAI API Keys](https://platform.openai.com/api-keys)
- [OpenAI 使用情况](https://platform.openai.com/usage)
- [Ollama 官网](https://ollama.com/)

---

**结论**: 当前配置的 API 密钥无效，需要获取新的有效密钥才能使用 AI 功能。

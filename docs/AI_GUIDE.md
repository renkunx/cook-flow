# Tandoor Recipes AI 功能配置指南

## 概述

Tandoor Recipes 集成了 AI 功能，使用 **LiteLLM** 库支持多种 AI 提供商（OpenAI、Claude、本地模型等）。AI 功能可以帮助您：

- 从图片或 PDF 文件自动识别和导入食谱
- 自动排序食谱步骤
- 分析食材和食谱的营养信息
- 生成食谱属性和标签

## AI 功能列表

### 1. 文件导入 (FILE_IMPORT)
- **功能**: 从图片或 PDF 文件自动识别并导入食谱
- **用途**: 拍照上传菜谱、扫描食谱书、导入 PDF 食谱
- **API**: `POST /api/ai-import/`

### 2. 步骤排序 (STEP_SORT)
- **功能**: 自动分析并重新排序食谱步骤
- **用途**: 整理混乱的食谱步骤顺序
- **API**: 食谱编辑界面中的 AI 按钮

### 3. 食材属性分析 (FOOD_PROPERTIES)
- **功能**: 分析食材的营养属性和特征
- **用途**: 自动填充食材营养信息
- **API**: 食材编辑界面

### 4. 食谱属性分析 (RECIPE_PROPERTIES)
- **功能**: 分析食谱的整体属性和特征
- **用途**: 自动生成食谱标签、分类、难度等级等
- **API**: 食谱编辑界面

## 配置步骤

### 1. 准备 AI 服务

Tandoor 使用 LiteLLM，支持以下 AI 提供商：

| 提供商 | 支持状态 | 推荐模型 |
|--------|----------|----------|
| **OpenAI** | ✅ 完全支持 | GPT-4o, GPT-4o-mini, GPT-4-turbo |
| **Anthropic** | ✅ 完全支持 | Claude 3.5 Sonnet, Claude 3 Opus |
| **Google** | ✅ 完全支持 | Gemini Pro |
| **本地模型** | ✅ 支持 | Ollama, vLLM |
| **其他** | ✅ 通过 LiteLLM | 100+ 提供商 |

### 2. 获取 API 密钥

#### OpenAI
1. 访问 [OpenAI Platform](https://platform.openai.com/)
2. 注册/登录账号
3. 创建 API Key: Settings → API Keys → Create new secret key

#### Anthropic Claude
1. 访问 [Anthropic Console](https://console.anthropic.com/)
2. 注册/登录账号
3. 创建 API Key: Settings → API Keys

#### 其他提供商
参考 [LiteLLM 文档](https://docs.litellm.ai/)

### 3. 在 Tandoor 中配置 AI 提供商

#### 通过 Web 界面配置（推荐）

1. **进入空间设置**
   - 登录 Tandoor Recipes
   - 点击右上角用户菜单 → 空间设置

2. **启用 AI 功能**
   - 找到 "AI 功能" 部分
   - 启用 `启用 AI 功能` 开关

3. **配置 AI 积分**
   - `每月 AI 积分`: 设置每月可用的积分额度（默认：1000）
   - `AI 积分余额`: 可用积分余额（可选）

4. **添加 AI 提供商**
   - 点击 "添加 AI 提供商"
   - 填写以下信息：
     - **名称**: 提供商名称（如 "OpenAI GPT-4o"）
     - **描述**: 可选说明
     - **API 密钥**: 您的 API 密钥
     - **模型名称**: 模型名称（见下表）
     - **URL**: 可选，自定义 API 端点
     - **记录积分成本**: 启用以跟踪使用情况

5. **设置默认提供商**
   - 选择一个提供商作为默认选项

#### 通过数据库配置

```bash
cd /Users/renkun/Source/cook-flow
source venv/bin/activate
python manage.py shell
```

```python
from cookbook.models import Space, AiProvider

# 获取您的空间
space = Space.objects.first()

# 启用 AI
space.ai_enabled = True
space.ai_credits_monthly = 1000  # 每月积分
space.ai_credits_balance = 0     # 余额积分
space.save()

# 创建 AI 提供商
provider = AiProvider.objects.create(
    space=space,
    name='OpenAI GPT-4o',
    description='OpenAI GPT-4o for recipe analysis',
    api_key='sk-your-api-key-here',
    model_name='gpt-4o',
    log_credit_cost=True
)

# 设置为默认提供商
space.ai_default_provider = provider
space.save()
```

### 4. 常用模型配置

#### OpenAI 模型

| 模型 | 用途 | 成本 | 推荐场景 |
|------|------|------|----------|
| `gpt-4o` | 通用 | 中等 | 所有功能 |
| `gpt-4o-mini` | 轻量 | 低 | 步骤排序 |
| `gpt-4-turbo` | 高性能 | 高 | 复杂分析 |

#### Anthropic Claude 模型

| 模型 | 用途 | 推荐场景 |
|------|------|----------|
| `claude-3-5-sonnet-20241022` | 通用 | 所有功能 |
| `claude-3-opus-20240229` | 高质量 | 复杂分析 |

#### 本地模型 (Ollama)

| 模型 | 配置 |
|------|------|
| `llama3.2` | URL: `http://localhost:11434` |
| `mistral` | Model: `ollama/mistral` |

## 使用 AI 功能

### 从图片导入食谱

1. 进入 **导入食谱** 页面
2. 选择 **AI 导入** 标签
3. 上传图片或 PDF 文件
4. 选择 AI 提供商
5. 点击 **分析并导入**

### 自动排序步骤

1. 编辑食谱
2. 在步骤列表中找到 **AI** 按钮
3. 点击让 AI 自动排序步骤

### 分析营养信息

1. 编辑食材
2. 点击 **AI 分析** 按钮
3. AI 会自动填充营养信息

## AI 积分系统

### 积分消耗

- **文件导入**: 约 50-200 积分/次（取决于文件大小）
- **步骤排序**: 约 10-30 积分/次
- **营养分析**: 约 20-50 积分/次

### 积分计算

```python
# LiteLLM 自动计算成本
credit_cost = response_cost * 100

# 优先使用月度配额，然后使用余额
if has_monthly_token(space):
    # 使用月度配额
else:
    # 使用余额积分
    space.ai_credits_balance -= credit_cost
```

### 查看使用日志

```bash
# 通过数据库查看
python manage.py shell
```

```python
from cookbook.models import AiLog

# 查看最近的 AI 使用记录
logs = AiLog.objects.order_by('-created_at')[:10]
for log in logs:
    print(f"{log.function}: {log.credit_cost} 积分")
```

或通过 Web 界面：空间设置 → AI 日志

## 配置示例

### 示例 1: OpenAI GPT-4o（推荐）

```python
AiProvider.objects.create(
    space=space,
    name='OpenAI GPT-4o',
    api_key='sk-proj-xxxxx',
    model_name='gpt-4o',
    log_credit_cost=True
)
```

### 示例 2: Claude 3.5 Sonnet

```python
AiProvider.objects.create(
    space=space,
    name='Claude 3.5 Sonnet',
    api_key='sk-ant-xxxxx',
    model_name='claude-3-5-sonnet-20241022',
    log_credit_cost=True
)
```

### 示例 3: 本地 Ollama 模型

```python
AiProvider.objects.create(
    space=space,
    name='Local Llama 3.2',
    api_key='ollama',  # Ollama 不需要真实 key
    model_name='ollama/llama3.2',
    url='http://localhost:11434',
    log_credit_cost=False  # 本地模型不计费
)
```

## 故障排除

### 问题：AI 选项不显示

**检查**:
```python
from cookbook.models import Space
space = Space.objects.first()
print(f'AI enabled: {space.ai_enabled}')
print(f'Has provider: {AiProvider.objects.filter(space=space).exists()}')
```

**解决**:
- 确保 `ai_enabled=True`
- 至少配置一个 AI 提供商

### 问题：积分不足错误

**检查**:
```python
from cookbook.helper.ai_helper import can_perform_ai_request, has_monthly_token
print(f'Can perform AI: {can_perform_ai_request(space)}')
print(f'Has monthly token: {has_monthly_token(space)}')
```

**解决**:
- 增加 `ai_credits_monthly` 或 `ai_credits_balance`
- 等待下个月重置月度配额

### 问题：AI 请求失败

**检查**:
1. API 密钥是否正确
2. 模型名称是否正确
3. 网络连接是否正常
4. 查看 AI 日志获取详细错误

### 查看 AI 日志

```python
from cookbook.models import AiLog

# 查看失败的请求
failed_logs = AiLog.objects.filter(
    space=space,
).order_by('-created_at')[:10]

for log in failed_logs:
    print(f"{log.function}: {log.credit_cost} credits")
    print(f"  Input: {log.input_tokens} tokens")
    print(f"  Output: {log.output_tokens} tokens")
```

## 安全建议

1. **API 密钥安全**
   - 不要在代码中硬编码 API 密钥
   - 定期轮换 API 密钥
   - 为每个空间使用独立的密钥

2. **成本控制**
   - 设置合理的月度积分限制
   - 启用 `log_credit_cost` 监控使用
   - 定期检查 AI 日志

3. **数据隐私**
   - 食谱数据会发送到 AI 提供商
   - 使用企业版 API 可获得更好的隐私保护
   - 考虑使用本地模型处理敏感数据

## 高级配置

### 自定义 API 端点

```python
# 使用代理或自托管服务
AiProvider.objects.create(
    space=space,
    name='Custom OpenAI',
    api_key='sk-xxxxx',
    model_name='gpt-4o',
    url='https://your-proxy.com/v1',  # 自定义端点
)
```

### 多提供商配置

```python
# 主要用于文件导入（高精度）
provider_vision = AiProvider.objects.create(
    space=space,
    name='GPT-4o Vision',
    api_key='sk-xxxxx',
    model_name='gpt-4o',
)

# 用于简单任务（低成本）
provider_cheap = AiProvider.objects.create(
    space=space,
    name='GPT-4o-mini',
    api_key='sk-xxxxx',
    model_name='gpt-4o-mini',
)
```

## 相关链接

- [LiteLLM 文档](https://docs.litellm.ai/)
- [OpenAI API 文档](https://platform.openai.com/docs)
- [Anthropic API 文档](https://docs.anthropic.com/)
- [Tandoor Recipes AI 讨论](https://github.com/TandoorRecipes/recipes/discussions)

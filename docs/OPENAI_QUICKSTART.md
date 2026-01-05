# OpenAI AI 提供商配置完成

## ✅ 当前配置状态

| 项目 | 状态 |
|------|------|
| 空间 | 私家小厨 |
| AI 功能 | ✅ 已启用 |
| 每月积分 | 10000 |
| 提供商 | OpenAI GPT-4o |
| 模型 | gpt-4o |
| API 密钥 | ⚠️ 测试密钥（需替换） |

## 🔑 替换为真实 API 密钥

### 方法 1: 通过 Web 界面（推荐）

1. 登录 Tandoor Recipes
2. 点击右上角用户菜单 → **空间设置**
3. 滚动到 **AI 提供商** 部分
4. 找到 "OpenAI GPT-4o"，点击 **编辑**
5. 将 API 密钥替换为真实密钥
6. 点击 **保存**

### 方法 2: 通过命令行

```bash
cd /Users/renkun/Source/cook-flow
source venv/bin/activate
python manage.py shell
```

```python
from cookbook.models import AiProvider
from django_scopes import scopes_disabled

with scopes_disabled():
    provider = AiProvider.objects.filter(name='OpenAI GPT-4o').first()
    provider.api_key = 'sk-proj-你的真实密钥'
    provider.save()
    print(f'✓ API 密钥已更新')
```

### 方法 3: 通过环境变量（生产环境推荐）

编辑 `.env` 文件：

```bash
# OpenAI API 密钥
OPENAI_API_KEY=sk-proj-你的真实密钥
```

然后修改提供商配置使用环境变量。

## 📝 如何获取 OpenAI API 密钥

### 步骤：

1. **访问 OpenAI 平台**
   - 打开 [https://platform.openai.com/](https://platform.openai.com/)
   - 如果没有账号，先注册（需要手机号验证）

2. **创建 API 密钥**
   - 登录后点击右上角头像 → **API Keys**
   - 或直接访问 [https://platform.openai.com/api-keys](https://platform.openai.com/api-keys)
   - 点击 **+ Create new secret key**
   - 输入描述（如 "Tandoor Recipes"）
   - 点击 **Create secret key**

3. **复制密钥**
   - ⚠️ 密钥只显示一次，请立即复制保存
   - 格式类似：`sk-proj-xxxxxxxxxxxxxxxxxxxxxxxx`

4. **充值（可选）**
   - 访问 [https://platform.openai.com/usage](https://platform.openai.com/usage)
   - 添加付款方式
   - 设置使用限额

### 定价参考（2025年）：

| 模型 | 输入 | 输出 | 说明 |
|------|------|------|------|
| GPT-4o | $2.50/百万tokens | $10/百万tokens | 最新模型，多模态 |
| GPT-4o-mini | $0.15/百万tokens | $0.60/百万tokens | 性价比高 |
| GPT-4-turbo | $10/百万tokens | $30/百万tokens | 高质量 |

**估算**：每月 10000 积分 ≈ 几百次 AI 调用

## 🎯 测试 AI 功能

配置真实密钥后，可以测试以下功能：

### 1. 从图片导入食谱

1. 进入 **导入食谱** 页面
2. 选择 **AI 导入** 标签
3. 上传一张菜谱图片
4. 选择 "OpenAI GPT-4o"
5. 点击 **分析并导入**

### 2. 自动排序步骤

1. 编辑任意食谱
2. 在步骤列表中点击 **AI** 按钮
3. 等待 AI 分析完成

### 3. 查看使用日志

- 空间设置 → **AI 日志**
- 可以看到每次调用的：
  - 功能类型
  - 积分消耗
  - Token 使用量

## 🔧 其他可用模型

如果 GPT-4o 成本较高，可以添加其他模型：

### GPT-4o-mini（推荐用于日常使用）

```python
provider = AiProvider.objects.create(
    space=space,
    name='OpenAI GPT-4o-mini',
    api_key='sk-proj-你的密钥',
    model_name='gpt-4o-mini',
    log_credit_cost=True
)
```

### GPT-4-turbo（高质量任务）

```python
provider = AiProvider.objects.create(
    space=space,
    name='OpenAI GPT-4-turbo',
    api_key='sk-proj-你的密钥',
    model_name='gpt-4-turbo',
    log_credit_cost=True
)
```

## ⚠️ 安全建议

1. **不要在代码中硬编码 API 密钥**
2. **定期轮换密钥**（建议每 3-6 个月）
3. **设置使用限额**避免意外产生高额费用
4. **监控 AI 日志**及时发现异常使用
5. **不要将 API 密钥提交到 Git**

## 📚 相关资源

- [OpenAI API 文档](https://platform.openai.com/docs)
- [OpenAI 定价](https://openai.com/pricing)
- [LiteLLM 文档](https://docs.litellm.ai/)
- [Tandoor Recipes AI 指南](./AI_GUIDE.md)

## 🆘 常见问题

### Q: 提示"积分不足"？
A: 在空间设置中增加每月积分或余额积分

### Q: AI 分析失败？
A: 检查 API 密钥是否正确，查看 AI 日志获取详细错误

### Q: 如何查看使用了多少？
A: 空间设置 → AI 日志 → 查看积分消耗

### Q: 可以使用本地模型吗？
A: 可以！使用 Ollama 等本地模型，参考 AI_GUIDE.md

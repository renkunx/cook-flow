# 图片显示问题调试指南

## 问题诊断

图片已成功导入到服务器，文件存在于 `mediafiles/recipes/` 目录。

## 可能的原因和解决方案

### 1. Django 后端服务未运行

确保 Django 开发服务器正在运行：

```bash
cd /Users/renkun/Source/cook-flow
source venv/bin/activate
python manage.py runserver
```

### 2. 浏览器缓存问题

清除浏览器缓存并刷新：
- Chrome: `Ctrl+Shift+R` (Windows) 或 `Cmd+Shift+R` (Mac)
- 或者使用隐私模式打开

### 3. 用户认证问题

图片需要用户登录后才能访问。确保：
- 已登录 Tandoor Recipes
- Session cookie 有效

### 4. 检查图片 URL

在浏览器中检查：
1. 右键点击图片 -> "检查元素"
2. 查看 `<img>` 标签的 `src` 属性
3. URL 应该类似: `/media/recipes/xxx.jpg`

### 5. 直接访问测试

在浏览器中直接访问图片 URL：
```
http://localhost:8000/media/recipes/813227f4-3aae-4443-997f-1c3d21270459_287.jpg
```

如果需要登录，说明认证正常。

### 6. 检查数据库

```bash
source venv/bin/activate
python manage.py shell
```

```python
from cookbook.models import Recipe
r = Recipe.objects.first()
print(f"Recipe: {r.name}")
print(f"Image: {r.image}")
print(f"Image URL: {r.image.url if r.image else 'None'}")
```

### 7. 前端配置检查

检查前端是否正确配置了 API URL：

```javascript
// vue3/src/api/index.ts
// 确保 baseURL 指向正确的 Django 服务器
```

## 快速修复步骤

1. **重启 Django 服务器**
   ```bash
   # 停止当前服务器 (Ctrl+C)
   # 重新启动
   python manage.py runserver
   ```

2. **清除浏览器缓存**

3. **重新登录**
   - 退出登录
   - 重新登录

4. **检查网络请求**
   - 打开浏览器开发者工具 (F12)
   - 切换到 Network 标签
   - 刷新页面
   - 查看图片请求是否返回 200

## 脚本功能更新

### 新增 `--replace` 参数

替换已存在的食谱而不是跳过：

```bash
# 跳过已存在的食谱（默认）
python scripts/import_themealdb.py --user renkun --count 10

# 替换已存在的食谱
python scripts/import_themealdb.py --user renkun --count 10 --replace
```

### 使用示例

```bash
# 导入 1000 个食谱，替换已存在的
python scripts/import_themealdb.py --user renkun --count 1000 --replace

# 从特定分类导入，替换已存在的
python scripts/import_themealdb.py --user renkun --category Seafood --count 50 --replace

# 随机导入，替换已存在的
python scripts/import_themealdb.py --user renkun --random --count 20 --replace
```

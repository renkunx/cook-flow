# 后端 API 端点完整列表

## 基础信息
- **Base URL**: `/api/`
- **认证**: Bearer Token (OAuth2) 或 Session
- **Content-Type**: `application/json`

## 端点列表

### 1. 认证
| 方法 | 端点 | 描述 |
|------|------|------|
| POST | `/api-token-auth/` | 获取 Token |

### 2. 用户与空间
| 方法 | 端点 | 描述 |
|------|------|------|
| GET | `/user/` | 用户列表 |
| GET/PUT/PATCH | `/user/{id}/` | 用户详情/更新 |
| GET | `/group/` | 用户组列表 |
| GET/POST/PUT/PATCH | `/space/` | 空间列表/创建/更新 |
| GET | `/space/current/` | 当前空间 |
| GET/PUT/PATCH/DELETE | `/user-space/` | 用户空间管理 |
| GET | `/user-space/all_personal/` | 所有个人空间 |
| GET/PATCH | `/user-preference/` | 用户偏好设置 |

### 3. 食谱管理
| 方法 | 端点 | 描述 |
|------|------|------|
| GET/POST | `/recipe/` | 食谱列表/创建 |
| GET/PUT/PATCH/DELETE | `/recipe/{id}/` | 食谱详情/更新/删除 |
| PUT | `/recipe/batch_update/` | 批量更新 |
| PUT | `/recipe/{id}/image/` | 上传图片 |
| PUT | `/recipe/{id}/shopping/` | 添加到购物清单 |
| GET | `/recipe/{id}/related/` | 相关食谱 |
| GET | `/recipe/flat/` | 扁平列表 |
| POST | `/recipe/{id}/aiproperties/` | AI 获取属性 |
| PATCH | `/recipe/{id}/delete_external/` | 删除外部文件 |
| GET | `/recipe/{id}/cascading/` | 级联删除信息 |
| GET | `/recipe/{id}/protecting/` | 阻止删除信息 |
| GET | `/recipe/{id}/nulling/` | 置空删除信息 |

### 4. 步骤管理
| 方法 | 端点 | 描述 |
|------|------|------|
| GET/POST | `/step/` | 步骤列表/创建 |
| GET/PUT/PATCH/DELETE | `/step/{id}/` | 步骤详情/更新/删除 |

### 5. 食材管理
| 方法 | 端点 | 描述 |
|------|------|------|
| GET/POST | `/ingredient/` | 食材列表/创建 |
| GET/PUT/PATCH/DELETE | `/ingredient/{id}/` | 食材详情/更新/删除 |

### 6. 食物管理
| 方法 | 端点 | 描述 |
|------|------|------|
| GET/POST | `/food/` | 食物列表/创建 |
| GET/PUT/PATCH/DELETE | `/food/{id}/` | 食物详情/更新/删除 |
| PUT | `/food/batch_update/` | 批量更新 |
| PUT | `/food/{id}/merge/{target}/` | 合并 |
| PUT | `/food/{id}/move/{parent}/` | 移动 |
| PUT | `/food/{id}/shopping/` | 添加到购物清单 |
| POST | `/food/{id}/fdc/` | 从 FDC 更新 |
| POST | `/food/{id}/aiproperties/` | AI 获取属性 |
| GET | `/food/{id}/cascading/` | 级联删除信息 |
| GET | `/food/{id}/protecting/` | 阻止删除信息 |
| GET | `/food/{id}/nulling/` | 置空删除信息 |
| GET | `/food-inherit-field/` | 继承字段列表 |

### 7. 关键词管理
| 方法 | 端点 | 描述 |
|------|------|------|
| GET/POST | `/keyword/` | 关键词列表/创建 |
| GET/PUT/PATCH/DELETE | `/keyword/{id}/` | 关键词详情/更新/删除 |
| PUT | `/keyword/{id}/merge/{target}/` | 合并 |
| PUT | `/keyword/{id}/move/{parent}/` | 移动 |
| GET | `/keyword/{id}/cascading/` | 级联删除信息 |
| GET | `/keyword/{id}/protecting/` | 阻止删除信息 |
| GET | `/keyword/{id}/nulling/` | 置空删除信息 |

### 8. 单位管理
| 方法 | 端点 | 描述 |
|------|------|------|
| GET/POST | `/unit/` | 单位列表/创建 |
| GET/PUT/PATCH/DELETE | `/unit/{id}/` | 单位详情/更新/删除 |
| PUT | `/unit/{id}/merge/{target}/` | 合并 |
| GET | `/unit/{id}/cascading/` | 级联删除信息 |
| GET | `/unit/{id}/protecting/` | 阻止删除信息 |
| GET | `/unit/{id}/nulling/` | 置空删除信息 |
| GET/POST | `/unit-conversion/` | 单位转换列表/创建 |
| GET/PUT/PATCH/DELETE | `/unit-conversion/{id}/` | 单位转换详情/更新/删除 |

### 9. 属性管理
| 方法 | 端点 | 描述 |
|------|------|------|
| GET/POST | `/property/` | 属性列表/创建 |
| GET/PUT/PATCH/DELETE | `/property/{id}/` | 属性详情/更新/删除 |
| GET/POST | `/property-type/` | 属性类型列表/创建 |
| GET/PUT/PATCH/DELETE | `/property-type/{id}/` | 属性类型详情/更新/删除 |
| GET | `/property-type/{id}/cascading/` | 级联删除信息 |
| GET | `/property-type/{id}/protecting/` | 阻止删除信息 |
| GET | `/property-type/{id}/nulling/` | 置空删除信息 |

### 10. 食谱书
| 方法 | 端点 | 描述 |
|------|------|------|
| GET/POST | `/recipe-book/` | 食谱书列表/创建 |
| GET/PUT/PATCH/DELETE | `/recipe-book/{id}/` | 食谱书详情/更新/删除 |
| GET | `/recipe-book/{id}/cascading/` | 级联删除信息 |
| GET | `/recipe-book/{id}/protecting/` | 阻止删除信息 |
| GET | `/recipe-book/{id}/nulling/` | 置空删除信息 |
| GET/POST | `/recipe-book-entry/` | 食谱书条目列表/创建 |
| GET/PUT/PATCH/DELETE | `/recipe-book-entry/{id}/` | 食谱书条目详情/更新/删除 |

### 11. 膳食计划
| 方法 | 端点 | 描述 |
|------|------|------|
| GET/POST | `/meal-plan/` | 膳食计划列表/创建 |
| GET/PUT/PATCH/DELETE | `/meal-plan/{id}/` | 膳食计划详情/更新/删除 |
| GET | `/meal-plan/ical/` | 导出 iCal |
| POST | `/auto-plan/` | 自动生成膳食计划 |
| GET/POST | `/meal-type/` | 膳食类型列表/创建 |
| GET/PUT/PATCH/DELETE | `/meal-type/{id}/` | 膳食类型详情/更新/删除 |
| GET | `/meal-type/{id}/cascading/` | 级联删除信息 |
| GET | `/meal-type/{id}/protecting/` | 阻止删除信息 |
| GET | `/meal-type/{id}/nulling/` | 置空删除信息 |

### 12. 购物清单
| 方法 | 端点 | 描述 |
|------|------|------|
| GET/POST | `/shopping-list/` | 购物清单列表/创建 |
| GET/PUT/PATCH/DELETE | `/shopping-list/{id}/` | 购物清单详情/更新/删除 |
| GET/POST | `/shopping-list-entry/` | 购物条目列表/创建 |
| GET/PUT/PATCH/DELETE | `/shopping-list-entry/{id}/` | 购物条目详情/更新/删除 |
| POST | `/shopping-list-entry/bulk/` | 批量创建 |
| GET/POST | `/shopping-list-recipe/` | 购物食谱列表/创建 |
| GET/PUT/PATCH/DELETE | `/shopping-list-recipe/{id}/` | 购物食谱详情/更新/删除 |
| POST | `/shopping-list-recipe/{id}/bulk_create_entries/` | 批量创建条目 |

### 13. 超市管理
| 方法 | 端点 | 描述 |
|------|------|------|
| GET/POST | `/supermarket/` | 超市列表/创建 |
| GET/PUT/PATCH/DELETE | `/supermarket/{id}/` | 超市详情/更新/删除 |
| GET | `/supermarket/{id}/cascading/` | 级联删除信息 |
| GET | `/supermarket/{id}/protecting/` | 阻止删除信息 |
| GET | `/supermarket/{id}/nulling/` | 置空删除信息 |
| GET/POST | `/supermarket-category/` | 超市分类列表/创建 |
| GET/PUT/PATCH/DELETE | `/supermarket-category/{id}/` | 超市分类详情/更新/删除 |
| PUT | `/supermarket-category/{id}/merge/{target}/` | 合并 |
| GET | `/supermarket-category/{id}/cascading/` | 级联删除信息 |
| GET | `/supermarket-category/{id}/protecting/` | 阻止删除信息 |
| GET | `/supermarket-category/{id}/nulling/` | 置空删除信息 |
| GET/POST | `/supermarket-category-relation/` | 分类关系列表/创建 |
| GET/PUT/PATCH/DELETE | `/supermarket-category-relation/{id}/` | 分类关系详情/更新/删除 |

### 14. AI 功能
| 方法 | 端点 | 描述 |
|------|------|------|
| GET/POST | `/ai-provider/` | AI 提供商列表/创建 |
| GET/PUT/PATCH/DELETE | `/ai-provider/{id}/` | AI 提供商详情/更新/删除 |
| GET | `/ai-provider/{id}/cascading/` | 级联删除信息 |
| GET | `/ai-provider/{id}/protecting/` | 阻止删除信息 |
| GET | `/ai-provider/{id}/nulling/` | 置空删除信息 |
| GET | `/ai-log/` | AI 日志列表 |
| GET | `/ai-log/{id}/` | AI 日志详情 |

### 15. 日志
| 方法 | 端点 | 描述 |
|------|------|------|
| GET/POST | `/cook-log/` | 烹饪日志列表/创建 |
| GET/PUT/PATCH/DELETE | `/cook-log/{id}/` | 烹饪日志详情/更新/删除 |
| GET/POST | `/view-log/` | 浏览日志列表/创建 |
| GET/PUT/PATCH/DELETE | `/view-log/{id}/` | 浏览日志详情/更新/删除 |
| GET | `/import-log/` | 导入日志列表 |
| GET | `/import-log/{id}/` | 导入日志详情 |
| GET | `/export-log/` | 导出日志列表 |
| GET | `/export-log/{id}/` | 导出日志详情 |
| GET | `/sync-log/` | 同步日志列表 |
| GET | `/sync-log/{id}/` | 同步日志详情 |

### 16. 存储与同步（前端未对接）
| 方法 | 端点 | 描述 |
|------|------|------|
| GET/POST | `/storage/` | 存储列表/创建 |
| GET/PUT/PATCH/DELETE | `/storage/{id}/` | 存储详情/更新/删除 |
| GET | `/storage/{id}/cascading/` | 级联删除信息 |
| GET | `/storage/{id}/protecting/` | 阻止删除信息 |
| GET | `/storage/{id}/nulling/` | 置空删除信息 |
| GET/POST | `/sync/` | 同步列表/创建 |
| GET/PUT/PATCH/DELETE | `/sync/{id}/` | 同步详情/更新/删除 |
| POST | `/sync/{id}/query_synced_folder/` | 查询同步文件夹 |

### 17. 导入导出
| 方法 | 端点 | 描述 |
|------|------|------|
| POST | `/recipe-from-source/` | 从 URL 导入食谱 |
| POST | `/ai-import/` | AI 导入食谱 |
| POST | `/import/` | 导入应用数据 |
| POST | `/export/` | 导出应用数据 |
| POST | `/sync_all/` | 同步所有存储 |
| POST | `/import-open-data/` | 导入开放数据 |
| POST | `/reset-food-inheritance/` | 重置食物继承 |

### 18. 分享
| 方法 | 端点 | 描述 |
|------|------|------|
| GET/POST | `/share-link/` | 分享链接列表/创建 |
| GET/PUT/PATCH/DELETE | `/share-link/{id}/` | 分享链接详情/更新/删除 |
| GET/POST | `/invite-link/` | 邀请链接列表/创建 |
| GET/PUT/PATCH/DELETE | `/invite-link/{id}/` | 邀请链接详情/更新/删除 |
| GET | `/share-link/{pk}` | 获取分享链接 |
| GET | `/abuse/{token}` | 报告滥用 |

### 19. 其他
| 方法 | 端点 | 描述 |
|------|------|------|
| GET | `/fdc-search/` | FDC 食品搜索 |
| POST | `/ingredient-from-string/` | 从字符串解析食材 |
| GET | `/localization/` | 本地化统计 |
| GET | `/server-settings/` | 服务器设置 |
| POST | `/switch-active-space/{space_id}/` | 切换空间 |

### 20. 系统功能（前端未对接）
| 方法 | 端点 | 描述 |
|------|------|------|
| GET/POST | `/custom-filter/` | 自定义过滤器 |
| GET/PUT/PATCH/DELETE | `/custom-filter/{id}/` | 自定义过滤器详情 |
| GET/POST | `/automation/` | 自动化规则 |
| GET/PUT/PATCH/DELETE | `/automation/{id}/` | 自动化规则详情 |
| GET/POST | `/connector-config/` | 连接器配置 |
| GET/PUT/PATCH/DELETE | `/connector-config/{id}/` | 连接器配置详情 |
| GET | `/search-fields/` | 搜索字段 |
| GET/PATCH | `/search-preference/` | 搜索偏好 |
| GET/POST | `/access-token/` | API 令牌 |
| GET/DELETE | `/access-token/{id}/` | API 令牌详情 |
| GET/POST | `/bookmarklet-import/` | 书签导入 |
| GET/DELETE | `/bookmarklet-import/{id}/` | 书签导入详情 |
| GET/POST | `/user-file/` | 用户文件 |
| GET/DELETE | `/user-file/{id}/` | 用户文件详情 |
| GET/POST | `/recipe-import/` | 食谱导入队列 |
| GET/DELETE | `/recipe-import/{id}/` | 食谱导入详情 |
| POST | `/recipe-import/{id}/import_recipe/` | 导入单个食谱 |
| POST | `/recipe-import/import_all/` | 导入所有 |

### 21. 文件下载
| 方法 | 端点 | 描述 |
|------|------|------|
| GET | `/get_external_file_link/{pk}/` | 获取外部文件链接 |
| GET | `/get_recipe_file/{pk}/` | 获取食谱文件 |
| GET | `/download-file/{file_id}/` | 下载文件 |

## 查询参数

### 通用参数
| 参数 | 类型 | 描述 |
|------|------|------|
| `query` | string | 模糊搜索 |
| `updated_at` | string | 更新时间过滤 |
| `limit` | number | 限制数量 |
| `random` | boolean | 随机排序 |
| `page` | number | 页码 |
| `page_size` | number | 每页数量 |

### 食谱搜索参数
| 参数 | 类型 | 描述 |
|------|------|------|
| `keywords` | number[] | 关键词过滤 |
| `foods` | number[] | 食物过滤 |
| `books` | number[] | 食谱书过滤 |
| `rating` | number | 评分精确匹配 |
| `rating_gte/lte` | number | 评分范围 |
| `createdon` | date | 创建日期 |
| `updatedon` | date | 更新日期 |
| `sort_order` | string | 排序方式 |
| `makenow` | boolean | 可立即制作 |

### 树形结构参数
| 参数 | 类型 | 描述 |
|------|------|------|
| `root` | number | 根节点 ID |
| `tree` | number | 获取某节点及其后代 |
| `root_tree` | number | 获取整棵树 |
| `extended` | boolean | 扩展信息 |

## 响应格式

### 成功响应
```json
{
  "id": 1,
  "name": "示例",
  ...
}
```

### 列表响应
```json
{
  "count": 100,
  "next": "http://example.com/api/recipe/?page=2",
  "previous": null,
  "timestamp": "2024-01-01T00:00:00Z",
  "results": [...]
}
```

### 错误响应
```json
{
  "error": true,
  "msg": "错误信息"
}
```

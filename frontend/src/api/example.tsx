/**
 * API 使用示例
 * 展示如何在 React 组件中使用 API 服务
 */

import { useState, useEffect } from 'react';
import { recipeApi, foodApi, authApi } from '@/api';
import { usePaginatedList, useMutation } from '@/hooks/useApi';
import type { Recipe, RecipeOverview, Food } from '@/types/api';

// ==================== 示例 1: 食谱列表 ====================

export function RecipeListExample() {
  const [searchQuery, setSearchQuery] = useState('');
  
  const {
    data: recipes,
    loading,
    error,
    pagination,
    refetch,
    loadMore,
  } = usePaginatedList(recipeApi.list);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    refetch({ query });
  };

  if (error) {
    return <div>Error: {error.msg}</div>;
  }

  return (
    <div>
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder="搜索食谱..."
      />
      
      {loading && <div>加载中...</div>}
      
      <ul>
        {recipes.map((recipe) => (
          <li key={recipe.id}>
            <h3>{recipe.name}</h3>
            <p>{recipe.description}</p>
          </li>
        ))}
      </ul>
      
      {pagination.next && (
        <button onClick={loadMore} disabled={loading}>
          加载更多
        </button>
      )}
    </div>
  );
}

// ==================== 示例 2: 食谱详情 ====================

interface RecipeDetailProps {
  recipeId: number;
}

export function RecipeDetailExample({ recipeId }: RecipeDetailProps) {
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    recipeApi.get(recipeId)
      .then(setRecipe)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [recipeId]);

  if (loading) return <div>加载中...</div>;
  if (error) return <div>错误: {error}</div>;
  if (!recipe) return <div>食谱不存在</div>;

  return (
    <div>
      <h1>{recipe.name}</h1>
      <p>{recipe.description}</p>
      <div>份量: {recipe.servings}</div>
      <div>烹饪时间: {recipe.working_time} 分钟</div>
      
      <h2>步骤</h2>
      <ol>
        {recipe.steps.map((step) => (
          <li key={step.id}>
            <p>{step.instruction}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}

// ==================== 示例 3: 创建食谱 ====================

export function CreateRecipeExample() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const { mutate: createRecipe, loading, error, data: createdRecipe } = useMutation(
    (data: Partial<Recipe>) => recipeApi.create(data)
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createRecipe({ name, description });
      // 创建成功后的处理
      alert('食谱创建成功！');
    } catch (err) {
      // 错误已在 hook 中处理
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>名称:</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div>
        <label>描述:</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      {error && <div style={{ color: 'red' }}>{error.msg}</div>}
      <button type="submit" disabled={loading}>
        {loading ? '创建中...' : '创建食谱'}
      </button>
      {createdRecipe && (
        <div>创建成功！ID: {createdRecipe.id}</div>
      )}
    </form>
  );
}

// ==================== 示例 4: 食物搜索 ====================

export function FoodSearchExample() {
  const [query, setQuery] = useState('');
  const [foods, setFoods] = useState<Food[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query) {
      setFoods([]);
      return;
    }

    const timer = setTimeout(() => {
      setLoading(true);
      foodApi.list({ query, limit: 10 })
        .then((response) => setFoods(response.results as Food[]))
        .finally(() => setLoading(false));
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  return (
    <div>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="搜索食材..."
      />
      {loading && <div>搜索中...</div>}
      <ul>
        {foods.map((food) => (
          <li key={food.id}>{food.name}</li>
        ))}
      </ul>
    </div>
  );
}

// ==================== 示例 5: 登录 ====================

export function LoginExample() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { token, user } = await authApi.login({ username, password });
      authApi.setToken(token);
      alert(`欢迎回来, ${user.display_name}!`);
    } catch (err: any) {
      setError(err.response?.data?.msg || '登录失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <div>
        <label>用户名:</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
      </div>
      <div>
        <label>密码:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <button type="submit" disabled={loading}>
        {loading ? '登录中...' : '登录'}
      </button>
    </form>
  );
}

// ==================== 示例 6: 批量操作 ====================

export function BatchUpdateExample() {
  const [selectedRecipes, setSelectedRecipes] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);

  const handleBatchDelete = async () => {
    if (!confirm(`确定要删除 ${selectedRecipes.length} 个食谱吗？`)) {
      return;
    }

    setLoading(true);
    try {
      await Promise.all(
        selectedRecipes.map((id) => recipeApi.delete(id))
      );
      alert('删除成功！');
      setSelectedRecipes([]);
    } catch (err) {
      alert('删除失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <p>已选择: {selectedRecipes.length} 个食谱</p>
      <button
        onClick={handleBatchDelete}
        disabled={loading || selectedRecipes.length === 0}
      >
        批量删除
      </button>
    </div>
  );
}

// 导出所有示例
export default {
  RecipeListExample,
  RecipeDetailExample,
  CreateRecipeExample,
  FoodSearchExample,
  LoginExample,
  BatchUpdateExample,
};

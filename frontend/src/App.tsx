// App component with multi-tab sync
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Navigation } from './sections/Navigation';
import { Hero } from './sections/Hero';
import { IngredientInput } from './sections/IngredientInput';
import { RecipeGrid } from './sections/RecipeGrid';
import { PopularRecipes } from './sections/PopularRecipes';
import { Testimonials } from './sections/Testimonials';
import { Footer } from './sections/Footer';
import { RecipeDetail } from './pages/RecipeDetail';
import { Schedule } from './pages/Schedule';
import { ShoppingList } from './pages/ShoppingList';
import { useSyncStorage } from './hooks/useSyncStorage';
import type { Ingredient, CookingSchedule, ShoppingItem } from './types';
import './App.css';

// Home Page Component
function HomePage({
  selectedIngredients,
  setSelectedIngredients,
}: {
  selectedIngredients: Ingredient[];
  setSelectedIngredients: (ingredients: Ingredient[]) => void;
}) {
  return (
    <>
      <main>
        <Hero />
        <IngredientInput
          selectedIngredients={selectedIngredients}
          onIngredientsChange={setSelectedIngredients}
        />
        <RecipeGrid selectedIngredients={selectedIngredients} />
        <PopularRecipes />
        <Testimonials />
      </main>
      <Footer />
    </>
  );
}

// Wrapper to get location for Navigation
function AppContent() {
  const location = useLocation();
  const isRecipeDetail = location.pathname.startsWith('/recipe/');

  // 使用同步存储，实现多标签页数据共享
  const [selectedIngredients, setSelectedIngredients] = useSyncStorage<Ingredient[]>('fridge_ingredients', []);
  const [schedules, setSchedules] = useSyncStorage<CookingSchedule[]>('cooking_schedules', []);
  const [shoppingList, setShoppingList] = useSyncStorage<ShoppingItem[]>('shopping_list', []);

  const handleAddToSchedule = (schedule: CookingSchedule) => {
    setSchedules((prev) => [...prev, schedule]);
  };

  const handleRemoveSchedule = (id: string) => {
    setSchedules((prev) => prev.filter((s) => s.id !== id));
  };

  const handleAddToShoppingList = (items: ShoppingItem[]) => {
    setShoppingList((prev) => {
      // Avoid duplicates
      const newItems = items.filter(
        (item) => !prev.some((p) => p.name === item.name && p.recipeId === item.recipeId)
      );
      return [...prev, ...newItems];
    });
  };

  const handleToggleShoppingItem = (id: string) => {
    setShoppingList((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    );
  };

  const handleRemoveShoppingItem = (id: string) => {
    setShoppingList((prev) => prev.filter((item) => item.id !== id));
  };

  const handleClearChecked = () => {
    setShoppingList((prev) => prev.filter((item) => !item.checked));
  };

  const uncheckedShoppingCount = shoppingList.filter((i) => !i.checked).length;

  return (
    <>
      {/* Global Navigation - Visible on all pages */}
      <Navigation 
        scheduleCount={schedules.length} 
        shoppingCount={uncheckedShoppingCount}
        isRecipeDetail={isRecipeDetail}
        onAddToSchedule={handleAddToSchedule}
        onAddToShoppingList={handleAddToShoppingList}
      />
      
      <Routes>
        <Route
          path="/"
          element={
            <HomePage
              selectedIngredients={selectedIngredients}
              setSelectedIngredients={setSelectedIngredients}
            />
          }
        />
        <Route
          path="/recipe/:id"
          element={
            <RecipeDetail
              fridgeIngredients={selectedIngredients}
              onAddToSchedule={handleAddToSchedule}
              onAddToShoppingList={handleAddToShoppingList}
            />
          }
        />
        <Route
          path="/schedule"
          element={
            <Schedule
              schedules={schedules}
              onRemoveSchedule={handleRemoveSchedule}
            />
          }
        />
        <Route
          path="/shopping"
          element={
            <ShoppingList
              items={shoppingList}
              onToggleItem={handleToggleShoppingItem}
              onRemoveItem={handleRemoveShoppingItem}
              onClearChecked={handleClearChecked}
            />
          }
        />
      </Routes>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;

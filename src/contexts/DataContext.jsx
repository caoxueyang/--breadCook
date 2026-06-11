import { createContext, useContext, useState, useCallback } from 'react';
import { getDishes, addDish as addDishUtil, updateDish as updateDishUtil, deleteDish as deleteDishUtil, saveDishes } from '../utils/storage';

const DataContext = createContext();

export function DataProvider({ children }) {
  const [dishes, setDishes] = useState(() => getDishes());
  const [refreshKey, setRefreshKey] = useState(0);

  const refresh = useCallback(() => {
    setDishes(getDishes());
    setRefreshKey(k => k + 1);
  }, []);

  const addDish = useCallback((dish) => {
    const newDish = addDishUtil(dish);
    refresh();
    return newDish;
  }, [refresh]);

  const updateDish = useCallback((id, updates) => {
    const updated = updateDishUtil(id, updates);
    refresh();
    return updated;
  }, [refresh]);

  const deleteDish = useCallback((id) => {
    deleteDishUtil(id);
    refresh();
  }, [refresh]);

  const importDishes = useCallback((data) => {
    if (data.dishes) {
      saveDishes(data.dishes);
      refresh();
    }
  }, [refresh]);

  return (
    <DataContext.Provider value={{ dishes, refresh, refreshKey, addDish, updateDish, deleteDish, importDishes }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used within DataProvider');
  return ctx;
}

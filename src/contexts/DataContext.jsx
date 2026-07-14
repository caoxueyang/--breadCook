import { createContext, useContext, useState, useCallback, useRef } from 'react';
import { getDishes, addDish as addDishUtil, updateDish as updateDishUtil, deleteDish as deleteDishUtil, saveDishes } from '../utils/storage';

const DataContext = createContext();

export function DataProvider({ children }) {
  const [dishes, setDishes] = useState(() => getDishes());
  const [refreshKey, setRefreshKey] = useState(0);
  // 最近一次删除的备份：{ dish, index, expiresAt }
  // 5 秒内可撤销，之后真正“穿透”到 localStorage
  const [lastDeletedBackup, setLastDeletedBackup] = useState(null);
  const deleteTimerRef = useRef(null);

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

  // 软删除：先备份 + 同步刷UI，5 秒窗口内可撤销
  const deleteDish = useCallback((id) => {
    const all = getDishes();
    const idx = all.findIndex(d => d.id === id);
    if (idx === -1) return null;
    const dish = { ...all[idx] };
    // 同步从 localStorage 删除（避免撤销前是临时内存状态、刷新后“复活”）
    deleteDishUtil(id);
    // 清除上一个待撤销
    if (deleteTimerRef.current) {
      clearTimeout(deleteTimerRef.current);
      deleteTimerRef.current = null;
    }
    const backup = { dish, index: idx, deletedAt: Date.now() };
    setLastDeletedBackup(backup);
    // 5 秒后清除 backup（表示“过了期”）
    deleteTimerRef.current = setTimeout(() => {
      setLastDeletedBackup(null);
      deleteTimerRef.current = null;
    }, 5000);
    refresh();
    return backup;
  }, [refresh]);

  // 撤销恢复：在原 index 插回，保留顺序
  const restoreLastDeleted = useCallback(() => {
    if (deleteTimerRef.current) {
      clearTimeout(deleteTimerRef.current);
      deleteTimerRef.current = null;
    }
    setLastDeletedBackup((cur) => {
      if (!cur) return null;
      const all = getDishes();
      const insertIdx = Math.min(Math.max(0, cur.index), all.length);
      const next = [...all.slice(0, insertIdx), cur.dish, ...all.slice(insertIdx)];
      saveDishes(next);
      refresh();
      return null;
    });
  }, [refresh]);

  // 手动清除 backup（例如用户点了其他操作）
  const dismissDeletedBackup = useCallback(() => {
    if (deleteTimerRef.current) {
      clearTimeout(deleteTimerRef.current);
      deleteTimerRef.current = null;
    }
    setLastDeletedBackup(null);
  }, []);

  const importDishes = useCallback((data) => {
    if (data.dishes) {
      saveDishes(data.dishes);
      refresh();
    }
  }, [refresh]);

  return (
    <DataContext.Provider value={{
      dishes,
      refresh,
      refreshKey,
      addDish,
      updateDish,
      deleteDish,
      importDishes,
      lastDeletedBackup,
      restoreLastDeleted,
      dismissDeletedBackup,
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used within DataProvider');
  return ctx;
}

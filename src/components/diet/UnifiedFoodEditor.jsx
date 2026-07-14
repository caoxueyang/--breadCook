// 统一食物列表编辑器（用于 target / eaten 表单）
// 包含：① 按餐别分组的食物列表 ② 营养素实时合计 ③ 食物搜索+克数 picker
// 从 DietTracker.jsx 拆出，最复杂的一个组件

import { useState, useMemo, useEffect } from 'react';
import {
  FOOD_DB,
  findFood,
  calcGrams,
  parseSizeG,
  per100g,
  getAllFoods,
  subscribeCustomFoods,
} from '../../utils/foodDatabase';
import { getPesticideRisk, RISK_LABELS, RISK_COLORS } from '../../data/pesticideRisk';
import CustomFoodManager from '../CustomFoodManager';
import LactoseSwapModal from './LactoseSwapModal';
import { pinyinMatch } from '../../utils/pinyin';
import { isLactoseFood } from '../../utils/lactoseAlternatives';

export default function UnifiedFoodEditor({ foodList, onChange, mealConfig }) {
  // 解析后的 grams 总和（每 100g 归一化）
  const totalC = useMemo(() => {
    let s = 0;
    for (const it of foodList) {
      const f = findFood(it.id); if (!f) continue;
      const grams = Number(it.grams) || 0;
      s += per100g(f).carbs * grams / 100;
    }
    return Math.round(s);
  }, [foodList]);
  const totalP = useMemo(() => {
    let s = 0;
    for (const it of foodList) {
      const f = findFood(it.id); if (!f) continue;
      const grams = Number(it.grams) || 0;
      s += per100g(f).protein * grams / 100;
    }
    return Math.round(s);
  }, [foodList]);
  const totalF = useMemo(() => {
    let s = 0;
    for (const it of foodList) {
      const f = findFood(it.id); if (!f) continue;
      const grams = Number(it.grams) || 0;
      s += per100g(f).fat * grams / 100;
    }
    return Math.round(s);
  }, [foodList]);
  const totalKcal = useMemo(() => {
    let s = 0;
    for (const it of foodList) {
      const f = findFood(it.id); if (!f) continue;
      const grams = Number(it.grams) || 0;
      const p = per100g(f);
      s += (p.carbs * 4 + p.protein * 4 + p.fat * 9) * grams / 100;
    }
    return Math.round(s);
  }, [foodList]);

  // 搜索 + 分类过滤
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('');
  // 餐别折叠状态：默认全展开
  const [expandedMeals, setExpandedMeals] = useState(() => new Set(['breakfast', 'lunch', 'dinner', 'snack', '_other']));
  const toggleMeal = (meal) => {
    setExpandedMeals((prev) => {
      const next = new Set(prev);
      if (next.has(meal)) next.delete(meal);
      else next.add(meal);
      return next;
    });
  };
  const allExpanded = foodList.length === 0 ? false : (() => {
    const mealsWithFood = new Set();
    for (const it of foodList) {
      if (it.id) mealsWithFood.add(it.meal || '_other');
    }
    for (const m of mealsWithFood) {
      if (!expandedMeals.has(m)) return false;
    }
    return mealsWithFood.size > 0;
  })();
  const toggleAll = () => {
    if (allExpanded) {
      setExpandedMeals(new Set());
    } else {
      const next = new Set();
      for (const it of foodList) {
        if (it.id) next.add(it.meal || '_other');
      }
      setExpandedMeals(next);
    }
  };

  // 141 个食物全量 + 自定义食物
  const [customFoodVersion, setCustomFoodVersion] = useState(0);
  useEffect(() => subscribeCustomFoods(() => setCustomFoodVersion((v) => v + 1)), []);
  const allFoods = useMemo(() => {
    const out = [];
    for (const f of getAllFoods()) {
      const catKey = f.category;
      const cat = FOOD_DB[catKey];
      out.push({
        ...f,
        _catKey: catKey,
        _catIcon: cat?.icon || '🍱',
        _catLabel: cat?.label || '其他',
      });
    }
    return out;
  }, [customFoodVersion]);

  // 过滤（支持拼音首字母搜索：输「mf」也能找到「米饭」）
  const filteredFoods = useMemo(() => {
    const kw = search.trim().toLowerCase();
    return allFoods.filter((f) => {
      if (catFilter && f._catKey !== catFilter) return false;
      if (!kw) return true;
      // 任一字段（name / size / id）匹配原文 OR 拼音首字母
      if (pinyinMatch(f.name || '', kw)) return true;
      if (pinyinMatch(f.size || '', kw)) return true;
      if (pinyinMatch(f.id || '', kw)) return true;
      return false;
    });
  }, [allFoods, search, catFilter]);

  const updateItem = (idx, patch) => onChange(foodList.map((it, i) => (i === idx ? { ...it, ...patch } : it)));
  const removeItem = (idx) => onChange(foodList.filter((_, i) => i !== idx));
  const [pendingFood, setPendingFood] = useState(null);
  const [pendingGrams, setPendingGrams] = useState(100);
  const openAddModal = (food) => {
    setPendingFood(food);
    // 优先用 food.weightG（已 P0-2 字段化）
    setPendingGrams(Number(food?.weightG) > 0 ? Number(food.weightG) : (parseSizeG(food?.size) || 100));
  };
  const confirmAdd = () => {
    if (!pendingFood) return;
    const grams = Math.max(10, Number(pendingGrams) || 100);
    const existIdx = foodList.findIndex((it) => it.id === pendingFood.id);
    if (existIdx >= 0) {
      const cur = Number(foodList[existIdx].grams) || 0;
      updateItem(existIdx, { grams: cur + grams });
    } else {
      onChange([...foodList, { id: pendingFood.id, qty: 1, grams }]);
    }
    setPendingFood(null);
    setSearch('');
  };
  const cancelAdd = () => setPendingFood(null);
  const addItem = (food) => openAddModal(food);

  // 「＋ 自定义」入口：打开 CustomFoodManager
  const [customOpen, setCustomOpen] = useState(false);

  // 「🥛 换」入口：乳制品 5 选 1 Modal 状态
  const [swapState, setSwapState] = useState(null); // { idx, food, grams }
  const adjustQty = (idx, delta) => {
    const cur = Number(foodList[idx]?.grams) || 0;
    const next = cur + delta * 25;
    if (next <= 0) removeItem(idx);
    else updateItem(idx, { grams: next });
  };
  const adjustGrams = (idx, newGrams) => {
    const g = Math.max(10, Number(newGrams) || 0);
    updateItem(idx, { grams: g });
  };

  return (
    <div className="dt-unified">
      {foodList.length === 0 ? (
        <div className="dt-food-empty">还没添加，点击下方「＋ 添加食物」开始 ↓</div>
      ) : (
        <>
          <div className="dt-food-list">
            {(() => {
              const order = mealConfig?.order || ['breakfast', 'lunch', 'dinner', 'snack'];
              const labels = mealConfig?.labels || { breakfast: '🍚 早餐', lunch: '🍛 午餐', dinner: '🍜 晚餐', snack: '🥛 加餐' };
              const groups = [];
              const seen = new Set();
              for (const m of order) {
                const items = foodList
                  .map((it, idx) => ({ it, idx }))
                  .filter(({ it }) => it.meal === m);
                if (items.length > 0) {
                  groups.push({ meal: m, label: labels[m] || m, items });
                  seen.add(m);
                }
              }
              const rest = foodList
                .map((it, idx) => ({ it, idx }))
                .filter(({ it, idx }) => !seen.has(it.meal) && it.id);
              if (rest.length > 0) groups.push({ meal: '_other', label: '🍱 其他', items: rest });
              return (
                <>
                  {foodList.length > 0 && (
                    <div className="dt-eaten-header">
                      <span className="dt-eaten-header-title">
                        📋 已选 <b>{foodList.length}</b> 项
                      </span>
                      <button
                        type="button"
                        className="dt-eaten-toggle-all"
                        onClick={toggleAll}
                        title={allExpanded ? '一键收起所有餐别' : '一键展开所有餐别'}
                      >
                        {allExpanded ? '🔼 全部收起' : '🔽 全部展开'}
                      </button>
                    </div>
                  )}
                  {groups.map((g) => {
                    const expanded = expandedMeals.has(g.meal);
                    const totalK = g.items.reduce((s, { it }) => {
                      const food = findFood(it.id); if (!food) return s;
                      const grams = Number(it.grams) || 0;
                      const p = per100g(food);
                      return s + (p.carbs * 4 + p.protein * 4 + p.fat * 9) * grams / 100;
                    }, 0);
                    return (
                      <div key={g.meal} className={`dt-meal-group ${expanded ? 'is-expanded' : 'is-collapsed'}`} data-meal={g.meal}>
                        <div
                          className="dt-meal-label dt-meal-clickable"
                          onClick={() => toggleMeal(g.meal)}
                          role="button"
                          tabIndex={0}
                          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleMeal(g.meal); } }}
                        >
                          <span className="dt-meal-arrow">{expanded ? '▼' : '▶'}</span>
                          <span className="dt-meal-name">{g.label}</span>
                          <span className="dt-meal-count">· {g.items.length} 项 · {Math.round(totalK)} kcal</span>
                        </div>
                        {expanded && (
                          <div className="dt-meal-items">
                            {g.items.map(({ it, idx }) => {
                              const food = findFood(it.id);
                              if (!food) return null;
                              const grams = Number(it.grams) || 0;
                              const p = per100g(food);
                              const c = Math.round(p.carbs   * grams / 100);
                              const pr = Math.round(p.protein * grams / 100);
                              const f = Math.round(p.fat     * grams / 100);
                              const kcal = Math.round((p.carbs * 4 + p.protein * 4 + p.fat * 9) * grams / 100);
                              return (
                                <div key={idx} className="dt-food-item dt-food-item-unified">
                                  <div className="dt-food-info">
                                    <div className="dt-food-name-row">
                                      <span className="dt-food-cat-badge" data-cat={food.category || 'dishes'}>
                                        {food.categoryIcon || '🍱'}
                                      </span>
                                      <span className="dt-food-name">{food.name}</span>
                                    </div>
                                    {food.size && <span className="dt-food-size">{food.size}</span>}
                                    <div className="dt-food-contrib">
                                      {c > 0 && <span>🍚 {c}g</span>}
                                      {pr > 0 && <span>🥩 {pr}g</span>}
                                      {f > 0 && <span>🥑 {f}g</span>}
                                      <span className="dt-food-kcal">🔥 {kcal} 大卡</span>
                                    </div>
                                  </div>
                                  <div className="dt-food-controls">
                                    <div className="dt-food-grams">
                                      <button type="button" className="dt-qty-btn" onClick={() => adjustQty(idx, -1)}>−</button>
                                      <input
                                        type="number"
                                        className="dt-grams-input"
                                        value={grams}
                                        min="10"
                                        step="10"
                                        onChange={(e) => adjustGrams(idx, e.target.value)}
                                        title="克数（默认 100g）"
                                      />
                                      <span className="dt-grams-unit">g</span>
                                      <button type="button" className="dt-qty-btn" onClick={() => adjustQty(idx, +1)}>+</button>
                                    </div>
                                    {isLactoseFood(food) && (
                                      <button
                                        type="button"
                                        className="dt-food-swap"
                                        onClick={() => setSwapState({ idx, food, grams })}
                                        title="换一种乳制品（等热量）"
                                        aria-label="换一种乳制品"
                                      >
                                        🥛 换
                                      </button>
                                    )}
                                    <button type="button" className="dt-food-del" onClick={() => removeItem(idx)} aria-label="删除">×</button>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </>
              );
            })()}
          </div>

          <div className="dt-unified-total">
            <div className="dt-unified-total-title">📊 已录入合计</div>
            <div className="dt-unified-total-grid">
              <div><span>🍚 碳水</span><b>{totalC}g</b></div>
              <div><span>🥩 蛋白</span><b>{totalP}g</b></div>
              <div><span>🥑 脂肪</span><b>{totalF}g</b></div>
            </div>
            <div className="dt-unified-kcal">🔥 总大卡 <b>{totalKcal}</b> 大卡</div>
          </div>
        </>
      )}

      <div className="dt-food-picker">
        <div className="dt-picker-toggle">＋ 快速添加食物（按克数）</div>
        <div className="dt-picker-controls">
          <input
            type="search"
            className="dt-picker-search"
            placeholder="🔍 输名称或拼音首字母（米饭 / mf / 鸡腿 / jxt）"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            autoComplete="off"
          />
          <select
            className="dt-picker-cat-select"
            value={catFilter}
            onChange={(e) => setCatFilter(e.target.value)}
          >
            <option value="">全部分类</option>
            {Object.entries(FOOD_DB).map(([k, c]) => (
              Array.isArray(c?.foods) && (
                <option key={k} value={k}>{c.icon} {c.label}（{c.foods.length}）</option>
              )
            ))}
          </select>
          <button
            type="button"
            className="dt-picker-custom-btn"
            onClick={() => setCustomOpen(true)}
            title="添加我的常吃食物"
          >
            ＋ 自定义
          </button>
        </div>
        {filteredFoods.length === 0 ? (
          <div className="dt-picker-empty">未找到匹配食物，换个关键词试试</div>
        ) : (
          <div className="dt-picker-categories">
            {(() => {
              const groups = {};
              for (const f of filteredFoods) {
                if (!groups[f._catKey]) groups[f._catKey] = { icon: f._catIcon, label: f._catLabel, foods: [] };
                groups[f._catKey].foods.push(f);
              }
              return Object.entries(groups).map(([catKey, g]) => (
                <div key={catKey} className="dt-picker-cat-block">
                  <div className="dt-picker-cat-title">{g.icon} {g.label}</div>
                  <div className="dt-picker-grid">
                    {g.foods.map((f) => {
                      const isProduce = f._catKey === 'vegetable' || f._catKey === 'fruit';
                      const risk = isProduce ? getPesticideRisk(f.name) : null;
                      const riskColors = risk ? RISK_COLORS[risk] : null;
                      const riskLabel = risk ? RISK_LABELS[risk] : null;
                      return (
                        <button
                          key={f.id}
                          type="button"
                          className={`dt-picker-card${risk ? ' has-risk' : ''}`}
                          onClick={() => addItem(f)}
                          title={f.size}
                        >
                          <div className="dt-picker-name">{f.name}</div>
                          <div className="dt-picker-size">{f.size}</div>
                          {risk && (
                            <div
                              className="dt-picker-risk"
                              style={{
                                '--risk-bg': riskColors.bg,
                                '--risk-border': riskColors.border,
                                '--risk-text': riskColors.text,
                              }}
                              title={`${riskLabel.label} · ${riskLabel.desc}`}
                            >
                              <span className="dt-picker-risk-dot" style={{ backgroundColor: riskColors.text }} />
                              <span className="dt-picker-risk-text">{riskLabel.desc}</span>
                            </div>
                          )}
                          <div className="dt-picker-meta">1{f.unit} 总计 {Math.round((f.carbs || 0) + (f.protein || 0) + (f.fat || 0))}g</div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ));
            })()}
          </div>
        )}
      </div>

      {/* 克数输入 modal */}
      {pendingFood && (
        <div className="dt-grams-modal-mask" onClick={cancelAdd}>
          <div className="dt-grams-modal" onClick={(e) => e.stopPropagation()}>
            <div className="dt-grams-modal-title">⚖️ 输入克数（默认 100g）</div>
            <div className="dt-grams-modal-food">
              <span className="dt-grams-modal-icon">{pendingFood.categoryIcon || '🍱'}</span>
              <span className="dt-grams-modal-name">{pendingFood.name}</span>
              <span className="dt-grams-modal-size">{pendingFood.size}</span>
            </div>
            <div className="dt-grams-modal-row">
              <button type="button" className="dt-grams-step" onClick={() => setPendingGrams(Math.max(10, (Number(pendingGrams) || 0) - 10))}>−10</button>
              <input
                type="number"
                className="dt-grams-modal-input"
                value={pendingGrams}
                min="10"
                max="2000"
                step="10"
                onChange={(e) => setPendingGrams(e.target.value)}
                autoFocus
              />
              <span className="dt-grams-modal-unit">g</span>
              <button type="button" className="dt-grams-step" onClick={() => setPendingGrams((Number(pendingGrams) || 0) + 10)}>+10</button>
            </div>
            <div className="dt-grams-modal-presets">
              {[50, 100, 150, 200, 300, 500].map((g) => (
                <button
                  key={g}
                  type="button"
                  className={`dt-grams-preset ${Number(pendingGrams) === g ? 'active' : ''}`}
                  onClick={() => setPendingGrams(g)}
                >
                  {g}g
                </button>
              ))}
            </div>
            <div className="dt-grams-modal-preview">
              {(() => {
                const p = per100g(pendingFood);
                const g = Math.max(10, Number(pendingGrams) || 0);
                const c = (p.carbs   * g / 100).toFixed(1);
                const pr = (p.protein * g / 100).toFixed(1);
                const f = (p.fat     * g / 100).toFixed(1);
                const k = Math.round((p.carbs * 4 + p.protein * 4 + p.fat * 9) * g / 100);
                return (
                  <div>
                    预计：🍚 {c}g 碳 · 🥩 {pr}g 蛋白 · 🥑 {f}g 脂肪 · 🔥 {k} kcal
                  </div>
                );
              })()}
            </div>
            <div className="dt-grams-modal-actions">
              <button type="button" className="modal-btn cancel" onClick={cancelAdd}>取消</button>
              <button type="button" className="modal-btn confirm" onClick={confirmAdd}>✅ 添加</button>
            </div>
          </div>
        </div>
      )}

      {/* 「我的常吃」食物管理入口 */}
      <CustomFoodManager
        open={customOpen}
        onClose={() => setCustomOpen(false)}
        onAdded={(record) => {
          // 添加后自动选中并打开克数选择面板
          if (record) {
            openAddModal(record);
            setCustomOpen(false);
          }
        }}
      />

      {/* 「🥛 换」乳制品替换 Modal */}
      <LactoseSwapModal
        open={!!swapState}
        currentFood={swapState?.food}
        currentGrams={swapState?.grams}
        onClose={() => setSwapState(null)}
        onConfirm={(result) => {
          if (swapState) {
            updateItem(swapState.idx, { id: result.newId, grams: result.newGrams });
            setSwapState(null);
          }
        }}
      />
    </div>
  );
}

import { useEffect, useMemo, useState } from 'react';
import {
  getDiet,
  saveTarget,
  saveEaten,
  resetEaten,
  resetAll,
  calcKcal,
  calcProgress,
} from '../utils/dietStorage';
import {
  FOOD_DB,
  findFood,
  calcGrams,
  calcKcalFromFoodList,
  describeMacro,
  gramsToSingleFood,
  getAllFoods,
} from '../utils/foodDatabase';
import './DietTracker.css';

// 快捷填充：训练日 vs 休息日（180cm/83kg 减脂保肌基线）
// 训练日 ≈2370 大卡，休息日 ≈1815 大卡，平均亏空 ~300 大卡/天
const QUICK_TARGETS = {
  training: {
    label: '训练日',
    desc: '🍚7碗 米饭 + 🥩9个 鸡腿 + 🥑3把 核桃',
    carbs: { grams: 300, foods: gramsToSingleFood(300, 'carbs') },
    protein: { grams: 180, foods: gramsToSingleFood(180, 'protein') },
    fat: { grams: 50, foods: gramsToSingleFood(50, 'fat') },
  },
  rest: {
    label: '休息日',
    desc: '🍚3碗 米饭 + 🥩9个 鸡腿 + 🥑3把 核桃',
    carbs: { grams: 150, foods: gramsToSingleFood(150, 'carbs') },
    protein: { grams: 180, foods: gramsToSingleFood(180, 'protein') },
    fat: { grams: 55, foods: gramsToSingleFood(55, 'fat') },
  },
};

// 三大营养素配置
const MACROS = [
  { name: 'carbs', label: '碳水', icon: '🍚', color: '#F6A623' },
  { name: 'protein', label: '蛋白质', icon: '🥩', color: '#E74C3C' },
  { name: 'fat', label: '脂肪', icon: '🥑', color: '#27AE60' },
];

// 单条进度条
function MacroRow({ icon, label, name, value, target, color }) {
  const pct = calcProgress({ [name]: target }, { [name]: value }, name);
  const remaining = Math.max(0, target - value);
  const over = value > target;
  const desc = describeMacro(remaining, name, true);
  return (
    <div className={`dt-macro-row ${over ? 'is-over' : ''}`}>
      <div className="dt-macro-head">
        <span className="dt-macro-icon" style={{ background: color + '33', color }}>{icon}</span>
        <span className="dt-macro-label">{label}</span>
        <span className="dt-macro-numbers">
          <b>{value}</b>
          <span className="dt-macro-sep">/</span>
          <span className="dt-macro-target">{target}</span>
          <span className="dt-macro-unit">g</span>
        </span>
      </div>
      <div className="dt-progress">
        <div
          className="dt-progress-fill"
          style={{
            width: `${pct}%`,
            background: over ? 'var(--color-danger)' : color,
          }}
        />
      </div>
      <div className="dt-macro-foot">
        {over ? (
          <span className="dt-macro-over">已超标 {value - target}g</span>
        ) : (
          <span className="dt-macro-remaining">
            还差 <b>{remaining}g</b>
            {desc.primary && (
              <em className="dt-macro-desc">
                ≈ <b className="dt-desc-qty">{desc.primary.colloquial}</b>
                {desc.primary.precise && <span className="dt-desc-precise">（{desc.primary.precise}）</span>}
                {desc.alternative && desc.alternative.colloquial !== desc.primary.colloquial && (
                  <>
                    <span className="dt-desc-or">或</span>
                    <b className="dt-desc-qty dt-desc-qty-alt">{desc.alternative.colloquial}</b>
                    {desc.alternative.precise && <span className="dt-desc-precise">（{desc.alternative.precise}）</span>}
                  </>
                )}
              </em>
            )}
          </span>
        )}
        <span className="dt-macro-pct">{pct}%</span>
      </div>
    </div>
  );
}

// 单宏量素编辑（用于 target 表单）
function MacroFoodEditor({ macroKey, foodList, onChange, hintGrams }) {
  const cat = FOOD_DB[macroKey];
  const total = Math.round(calcGrams(foodList, macroKey));
  const delta = total - hintGrams;

  const updateItem = (idx, patch) => onChange(foodList.map((it, i) => (i === idx ? { ...it, ...patch } : it)));
  const removeItem = (idx) => onChange(foodList.filter((_, i) => i !== idx));
  const addItem = (food) => {
    const existIdx = foodList.findIndex((it) => it.id === food.id);
    if (existIdx >= 0) updateItem(existIdx, { qty: (foodList[existIdx].qty || 0) + 1 });
    else onChange([...foodList, { id: food.id, qty: 1 }]);
  };
  const adjustQty = (idx, delta) => {
    const next = (Number(foodList[idx]?.qty) || 0) + delta;
    if (next <= 0) removeItem(idx);
    else updateItem(idx, { qty: next });
  };

  return (
    <div className="dt-food-section">
      <div className="dt-food-header">
        <span className="dt-food-title">{cat.icon} {cat.label}</span>
        <span className={`dt-food-total ${delta > 5 ? 'is-over' : delta < -5 ? 'is-under' : 'is-ok'}`}>
          小计 {total}g
        </span>
      </div>
      {foodList.length === 0 ? (
        <div className="dt-food-empty">还没添加 ↓</div>
      ) : (
        <div className="dt-food-list">
          {foodList.map((it, idx) => {
            const food = findFood(it.id);
            if (!food) return null;
            const contributed = Math.round((Number(food[macroKey]) || 0) * (Number(it.qty) || 0));
            return (
              <div key={idx} className="dt-food-item">
                <div className="dt-food-info">
                  <span className="dt-food-name">{food.name}</span>
                  {food.size && <span className="dt-food-size">{food.size}</span>}
                </div>
                <div className="dt-food-qty">
                  <button type="button" className="dt-qty-btn" onClick={() => adjustQty(idx, -1)}>−</button>
                  <span className="dt-qty-num">{it.qty}</span>
                  <button type="button" className="dt-qty-btn" onClick={() => adjustQty(idx, +1)}>+</button>
                  <span className="dt-qty-unit">{food.unit}</span>
                </div>
                <span className="dt-food-gram">={contributed}g</span>
                <button type="button" className="dt-food-del" onClick={() => removeItem(idx)} aria-label="删除">×</button>
              </div>
            );
          })}
        </div>
      )}
      <details className="dt-food-picker">
        <summary className="dt-picker-toggle">＋ 添加{cat.label}食物</summary>
        <div className="dt-picker-grid">
          {cat.foods.map((f) => (
            <button
              key={f.id}
              type="button"
              className="dt-picker-card"
              onClick={() => addItem(f)}
              title={f.size}
            >
              <div className="dt-picker-name">{f.name}</div>
              <div className="dt-picker-size">{f.size}</div>
              <div className="dt-picker-meta">1{f.unit} ≈ {f[macroKey]}g</div>
            </button>
          ))}
        </div>
      </details>
    </div>
  );
}

// 统一食物列表编辑器（用于 eaten 表单）
// foodList: [{ id, qty }, ...] 任意食物都能加
// 自动按营养素分类汇总 + 计算总大卡
function UnifiedFoodEditor({ foodList, onChange }) {
  // 总量统计
  const totalC = Math.round(calcGrams(foodList, 'carbs'));
  const totalP = Math.round(calcGrams(foodList, 'protein'));
  const totalF = Math.round(calcGrams(foodList, 'fat'));
  const totalKcal = Math.round(calcKcalFromFoodList(foodList));

  const updateItem = (idx, patch) => onChange(foodList.map((it, i) => (i === idx ? { ...it, ...patch } : it)));
  const removeItem = (idx) => onChange(foodList.filter((_, i) => i !== idx));
  const addItem = (food) => {
    const existIdx = foodList.findIndex((it) => it.id === food.id);
    if (existIdx >= 0) updateItem(existIdx, { qty: (foodList[existIdx].qty || 0) + 1 });
    else onChange([...foodList, { id: food.id, qty: 1 }]);
  };
  const adjustQty = (idx, delta) => {
    const next = (Number(foodList[idx]?.qty) || 0) + delta;
    if (next <= 0) removeItem(idx);
    else updateItem(idx, { qty: next });
  };

  return (
    <div className="dt-unified">
      {/* 已添加的食物列表 */}
      {foodList.length === 0 ? (
        <div className="dt-food-empty">还没添加，点击下方「＋ 添加食物」开始 ↓</div>
      ) : (
        <>
          <div className="dt-food-list">
            {foodList.map((it, idx) => {
              const food = findFood(it.id);
              if (!food) return null;
              const c = Math.round((Number(food.carbs) || 0) * (Number(it.qty) || 0));
              const p = Math.round((Number(food.protein) || 0) * (Number(it.qty) || 0));
              const f = Math.round((Number(food.fat) || 0) * (Number(it.qty) || 0));
              const kcal = c * 4 + p * 4 + f * 9;
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
                      {p > 0 && <span>🥩 {p}g</span>}
                      {f > 0 && <span>🥑 {f}g</span>}
                      <span className="dt-food-kcal">🔥 {kcal} 大卡</span>
                    </div>
                  </div>
                  <div className="dt-food-controls">
                    <div className="dt-food-qty">
                      <button type="button" className="dt-qty-btn" onClick={() => adjustQty(idx, -1)}>−</button>
                      <span className="dt-qty-num">{it.qty}</span>
                      <button type="button" className="dt-qty-btn" onClick={() => adjustQty(idx, +1)}>+</button>
                      <span className="dt-qty-unit">{food.unit}</span>
                    </div>
                    <button type="button" className="dt-food-del" onClick={() => removeItem(idx)} aria-label="删除">×</button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* 实时汇总 */}
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

      {/* 食物选择器（按分类分组，全库扁平展示） */}
      <details className="dt-food-picker">
        <summary className="dt-picker-toggle">＋ 添加食物（任意分类）</summary>
        <div className="dt-picker-categories">
          {Object.entries(FOOD_DB).map(([catKey, cat]) => (
            <div key={catKey} className="dt-picker-cat-block">
              <div className="dt-picker-cat-title">{cat.icon} {cat.label}</div>
              <div className="dt-picker-grid">
                {cat.foods.map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    className="dt-picker-card"
                    onClick={() => addItem(f)}
                    title={f.size}
                  >
                    <div className="dt-picker-name">{f.name}</div>
                    <div className="dt-picker-size">{f.size}</div>
                    <div className="dt-picker-meta">1{f.unit} 总计 {Math.round((f.carbs || 0) + (f.protein || 0) + (f.fat || 0))}g</div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </details>
    </div>
  );
}

export default function DietTracker() {
  const [open, setOpen] = useState(false);
  const [diet, setDiet] = useState(() => getDiet());

  // 目标（按宏量素分类输入）
  const [targetForm, setTargetForm] = useState({
    carbs: [],
    protein: [],
    fat: [],
  });
  // 已吃（统一食物列表）
  const [eatenForm, setEatenForm] = useState([]);
  const [mode, setMode] = useState('view'); // view | editTarget | editEaten
  const [toast, setToast] = useState('');

  // 打开弹窗时初始化表单
  useEffect(() => {
    if (open) {
      const cur = getDiet();
      setDiet(cur);
      // 目标按宏量素分类
      setTargetForm({
        carbs: gramsToSingleFood(cur.target.carbs, 'carbs'),
        protein: gramsToSingleFood(cur.target.protein, 'protein'),
        fat: gramsToSingleFood(cur.target.fat, 'fat'),
      });
      // 已吃：暂不预填（用户进入表单时主动添加，避免误覆盖）
      setEatenForm([]);
      setMode('view');
    }
  }, [open]);

  // 监听 storage 事件
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === 'menu_app_diet_plan') {
        setDiet(getDiet());
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const flashToast = (msg) => {
    setToast(msg);
    window.setTimeout(() => setToast(''), 1600);
  };

  // 快捷填充目标
  const applyQuickTarget = (key) => {
    const q = QUICK_TARGETS[key];
    setTargetForm({
      carbs: gramsToSingleFood(q.carbs.grams, 'carbs'),
      protein: gramsToSingleFood(q.protein.grams, 'protein'),
      fat: gramsToSingleFood(q.fat.grams, 'fat'),
    });
  };

  // 保存目标
  const handleSaveTarget = () => {
    const target = {
      carbs: Math.round(calcGrams(targetForm.carbs, 'carbs')),
      protein: Math.round(calcGrams(targetForm.protein, 'protein')),
      fat: Math.round(calcGrams(targetForm.fat, 'fat')),
    };
    const next = saveTarget(target);
    setDiet(next);
    setMode('view');
    flashToast('已保存今日目标 ✓');
  };

  // 保存已吃（统一食物列表 → 自动汇总三大营养素）
  const handleSaveEaten = () => {
    const eaten = {
      carbs: Math.round(calcGrams(eatenForm, 'carbs')),
      protein: Math.round(calcGrams(eatenForm, 'protein')),
      fat: Math.round(calcGrams(eatenForm, 'fat')),
    };
    const next = saveEaten(eaten);
    setDiet(next);
    setMode('view');
    flashToast(`已更新已吃 ✓ （${eatenForm.length} 项 / ${Math.round(calcKcalFromFoodList(eatenForm))} 大卡）`);
  };

  // 重置已吃
  const handleResetEaten = () => {
    if (!window.confirm('确定清空今日已吃数据吗？')) return;
    const next = resetEaten();
    setDiet(next);
    setEatenForm([]);
    flashToast('已清空已吃数据');
  };

  // 全部重置
  const handleResetAll = () => {
    if (!window.confirm('确定重置所有数据吗？目标与已吃都会清空。')) return;
    const next = resetAll();
    setDiet(next);
    setTargetForm({ carbs: [], protein: [], fat: [] });
    setEatenForm([]);
    flashToast('已全部重置');
  };

  // 计算
  const targetKcal = useMemo(() => calcKcal(diet.target), [diet.target]);
  const eatenKcal = useMemo(() => calcKcal(diet.eaten), [diet.eaten]);
  const remaining = useMemo(() => ({
    carbs: Math.max(0, diet.target.carbs - diet.eaten.carbs),
    protein: Math.max(0, diet.target.protein - diet.eaten.protein),
    fat: Math.max(0, diet.target.fat - diet.eaten.fat),
  }), [diet]);
  const remainingKcal = Math.max(0, targetKcal - eatenKcal);

  // 关闭弹窗
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <>
      {/* 全局悬浮按钮 */}
      <button
        type="button"
        className="dt-fab safe-area-bottom"
        onClick={() => setOpen(true)}
        aria-label="今日饮食计划"
        title="今日饮食计划"
      >
        <span className="dt-fab-emoji">🥗</span>
      </button>

      {open && (
        <div
          className="modal-overlay"
          onClick={() => setOpen(false)}
          role="dialog"
          aria-modal="true"
        >
          <div className="modal-box dt-modal" onClick={(e) => e.stopPropagation()}>
            {/* 头部 */}
            <div className="dt-header">
              <div className="dt-header-left">
                <span className="dt-header-emoji">🥗</span>
                <div>
                  <div className="modal-title" style={{ textAlign: 'left', marginBottom: 0 }}>
                    今日饮食计划
                  </div>
                  <div className="dt-header-date">{diet.date}</div>
                </div>
              </div>
              <button
                type="button"
                className="dt-close-btn"
                onClick={() => setOpen(false)}
                aria-label="关闭"
              >
                ✕
              </button>
            </div>

            {/* 热量概览 */}
            <div className="dt-kcal-summary">
              <div className="dt-kcal-item">
                <div className="dt-kcal-label">目标</div>
                <div className="dt-kcal-value">{targetKcal}</div>
                <div className="dt-kcal-unit">大卡</div>
              </div>
              <div className="dt-kcal-arrow">→</div>
              <div className="dt-kcal-item">
                <div className="dt-kcal-label">已吃</div>
                <div className="dt-kcal-value dt-kcal-eaten">{eatenKcal}</div>
                <div className="dt-kcal-unit">大卡</div>
              </div>
              <div className="dt-kcal-arrow">→</div>
              <div className="dt-kcal-item">
                <div className="dt-kcal-label">还差</div>
                <div className="dt-kcal-value dt-kcal-remain">{remainingKcal}</div>
                <div className="dt-kcal-unit">大卡</div>
              </div>
            </div>

            {/* 三大营养素进度 */}
            <div className="dt-macros">
              {MACROS.map((m) => (
                <MacroRow
                  key={m.name}
                  name={m.name}
                  label={m.label}
                  icon={m.icon}
                  color={m.color}
                  value={diet.eaten[m.name]}
                  target={diet.target[m.name]}
                />
              ))}
            </div>

            {/* 操作区 */}
            {mode === 'view' && (
              <div className="dt-actions">
                <button
                  type="button"
                  className="dt-btn dt-btn-primary"
                  onClick={() => setMode('editEaten')}
                >
                  ✏️ 更新已吃
                </button>
                <button
                  type="button"
                  className="dt-btn"
                  onClick={() => setMode('editTarget')}
                >
                  🎯 调整目标
                </button>
                <button
                  type="button"
                  className="dt-btn dt-btn-danger-text"
                  onClick={handleResetEaten}
                >
                  清空已吃
                </button>
              </div>
            )}

            {/* 已吃表单：统一食物列表 */}
            {mode === 'editEaten' && (
              <div className="dt-form">
                <div className="dt-form-title">📝 记录今天吃的（不用分类，全库任选）</div>
                <UnifiedFoodEditor
                  foodList={eatenForm}
                  onChange={setEatenForm}
                />
                <div className="dt-form-actions">
                  <button
                    type="button"
                    className="modal-btn cancel"
                    onClick={() => setMode('view')}
                  >
                    取消
                  </button>
                  <button
                    type="button"
                    className="modal-btn confirm"
                    onClick={handleSaveEaten}
                  >
                    保存
                  </button>
                </div>
              </div>
            )}

            {/* 目标表单：按宏量素分类（保持原方案） */}
            {mode === 'editTarget' && (
              <div className="dt-form">
                <div className="dt-form-title">🎯 调整今日目标</div>
                <div className="dt-quick-targets">
                  <button
                    type="button"
                    className="dt-quick-btn"
                    onClick={() => applyQuickTarget('training')}
                    title={QUICK_TARGETS.training.desc}
                  >
                    🏋️ 训练日（≈2370 kcal）
                  </button>
                  <button
                    type="button"
                    className="dt-quick-btn"
                    onClick={() => applyQuickTarget('rest')}
                    title={QUICK_TARGETS.rest.desc}
                  >
                    🛌 休息日（≈1815 kcal）
                  </button>
                </div>
                {MACROS.map((m) => (
                  <MacroFoodEditor
                    key={m.name}
                    macroKey={m.name}
                    foodList={targetForm[m.name]}
                    onChange={(list) => setTargetForm({ ...targetForm, [m.name]: list })}
                  />
                ))}
                <div className="dt-form-actions">
                  <button
                    type="button"
                    className="modal-btn cancel"
                    onClick={() => setMode('view')}
                  >
                    取消
                  </button>
                  <button
                    type="button"
                    className="modal-btn confirm"
                    onClick={handleSaveTarget}
                  >
                    保存
                  </button>
                </div>
                <button
                  type="button"
                  className="dt-btn dt-btn-danger-text dt-btn-full"
                  onClick={handleResetAll}
                  style={{ marginTop: 8 }}
                >
                  重置全部数据
                </button>
              </div>
            )}

            {/* 剩余提示 */}
            {mode === 'view' && (
              <div className="dt-remain-tip">
                <div className="dt-remain-title">📊 今日还差</div>
                <div className="dt-remain-grid">
                  {MACROS.map((m) => {
                    const d = describeMacro(remaining[m.name], m.name, true);
                    return (
                      <div key={m.name} className="dt-remain-item">
                        <div className="dt-remain-item-head">
                          {m.icon} {m.label} <b>{remaining[m.name]}g</b>
                        </div>
                        {d.primary && (
                          <div className="dt-remain-item-body">
                            <span className="dt-remain-desc">≈ <b>{d.primary.colloquial}</b></span>
                            {d.primary.precise && <span className="dt-remain-precise">（{d.primary.precise}）</span>}
                            {d.alternative && d.alternative.colloquial !== d.primary.colloquial && (
                              <span className="dt-remain-alt">
                                或 <b>{d.alternative.colloquial}</b>
                                {d.alternative.precise && <em className="dt-remain-precise">（{d.alternative.precise}）</em>}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                  <div className="dt-remain-item">
                    <div className="dt-remain-item-head">🔥 热量 <b>{remainingKcal}</b> 大卡</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* toast */}
          {toast && <div className="dt-toast">{toast}</div>}
        </div>
      )}
    </>
  );
}

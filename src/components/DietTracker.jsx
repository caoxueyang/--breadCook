import { useEffect, useMemo, useState } from 'react';
import {
  getDiet,
  saveTarget,
  saveEaten,
  resetEaten,
  resetAll,
  toFoodList,
} from '../utils/dietStorage';
import {
  FOOD_DB,
  findFood,
  calcGrams,
  calcKcalFromFoodList,
  describeMacro,
  describeMacroMeal,
  describeFoods,
  describeRemaining,
  per100g,
  parseSizeG,
  calcByGrams,
} from '../utils/foodDatabase';
import './DietTracker.css';

// 快捷填充：训练日 vs 休息日（180cm/82.5kg/22%体脂 → 减脂为主+保肌+露腹肌）
// B v4.1 鸡胸替换版：体脂 22% → 14% 露腹肌（预计 17 周）
//   训练日 4 天：  2226 kcal / 缺口 -544（-20%）
//   休息日 3 天：  2245 kcal / 缺口 -525（-19%）
// 周总 = 15639 vs TDEE×7 = 19390 亏空 3751 kcal/周 ≈ 0.487 kg 脂肪/周
// 预期 17周：体脂 22% → 14.0% 露腹肌 / 24周：11% 运动员级
// 速度 0.49 kg/周 = 卫健委中位 0.5 kg/周（减重 2-4 kg/月）✓
// 零酮安全：脂肪占比 训练日 18.6% / 休息日 28.9%（均 ≤ 30% 底线 ✓）
// 蛋白 训练日 2.53 g/kg / 休息日 2.30 g/kg = Helms 高位（2.2-2.6）✓
// 4 餐分餐设计：早/午/晚/加，加餐只含牛奶/水果/坚果/蛋，不含米饭
// 碳周期化：训练日高碳（249g）/休息日低碳（214g）= Lyle McDonald 黄金标准
// v4.1 鸡胸替换：7 鸡腿 → 7 鸡胸（减脂 30g/天，提升 42g 蛋白）符合不可能三角
const QUICK_TARGETS = {
  // 训练日 2226 kcal / 249g 碳 / 207g 蛋白（2.53 g/kg） / 46g 脂肪（19% ✓）
  training: {
    label: '训练日',
    desc: '🍚早 1米饭+1燕麦+1蛋+1油 | 🍛午 2米饭+4鸡胸 | 🍜晚 1.5米饭+3鸡胸 | 🥛加 1牛奶+1苹果+1蛋',
    mealsOrder: ['breakfast', 'lunch', 'dinner', 'snack'],
    mealLabels: { breakfast: '🍚 早餐', lunch: '🍛 午餐', dinner: '🍜 晚餐', snack: '🥛 加餐' },
    foods: [
      { id: 'rice',           qty: 1,   meal: 'breakfast' },
      { id: 'oat',            qty: 1,   meal: 'breakfast' },
      { id: 'egg',            qty: 1,   meal: 'breakfast' },
      { id: 'oil',            qty: 1,   meal: 'breakfast' },
      { id: 'rice',           qty: 2,   meal: 'lunch' },
      { id: 'chicken_breast', qty: 4,   meal: 'lunch' },         // v4.1: 鸡腿 → 鸡胸
      { id: 'rice',           qty: 1.5, meal: 'dinner' },        // v4.1: 1 → 1.5（+22g 碳）
      { id: 'chicken_breast', qty: 3,   meal: 'dinner' },         // v4.1: 鸡腿 → 鸡胸
      { id: 'milk',           qty: 1,   meal: 'snack' },
      { id: 'apple',          qty: 1,   meal: 'snack' },
      { id: 'egg',            qty: 1,   meal: 'snack' },
    ],
  },
  // 休息日 2245 kcal / 214g 碳 / 188g 蛋白（2.30 g/kg） / 72g 脂肪（29% ✓）
  rest: {
    label: '休息日',
    desc: '🍚早 1燕麦+1牛奶+1蛋+0.5红薯+0.5油 | 🍛午 1米饭+4鸡胸+0.5油 | 🍜晚 2米饭+2鸡胸+1.5油+1蛋 | 🥛加 1牛奶+1苹果+1蛋',
    mealsOrder: ['breakfast', 'lunch', 'dinner', 'snack'],
    mealLabels: { breakfast: '🍚 早餐', lunch: '🍛 午餐', dinner: '🍜 晚餐', snack: '🥛 加餐' },
    foods: [
      { id: 'oat',            qty: 1,   meal: 'breakfast' },
      { id: 'milk',           qty: 1,   meal: 'breakfast' },
      { id: 'egg',            qty: 1,   meal: 'breakfast' },
      { id: 'sweet_potato',   qty: 0.5, meal: 'breakfast' },
      { id: 'oil',            qty: 0.5, meal: 'breakfast' },     // v4.1: +0.5 油
      { id: 'rice',           qty: 1,   meal: 'lunch' },
      { id: 'chicken_breast', qty: 4,   meal: 'lunch' },         // v4.1: 鸡腿 → 鸡胸
      { id: 'oil',            qty: 0.5, meal: 'lunch' },
      { id: 'rice',           qty: 2,   meal: 'dinner' },         // v4.1: 1 → 2（+45g 碳）
      { id: 'chicken_breast', qty: 2,   meal: 'dinner' },         // v4.1: 鸡腿 → 鸡胸
      { id: 'oil',            qty: 1.5, meal: 'dinner' },
      { id: 'egg',            qty: 1,   meal: 'dinner' },
      { id: 'milk',           qty: 1,   meal: 'snack' },
      { id: 'apple',          qty: 1,   meal: 'snack' },
      { id: 'egg',            qty: 1,   meal: 'snack' },
    ],
  },
};

// 三大营养素配置（用于进度条 + 告警展示）
const MACROS = [
  { name: 'carbs',   label: '碳水', icon: '🍚', color: '#F6A623' },
  { name: 'protein', label: '蛋白', icon: '🥩', color: '#E74C3C' },
  { name: 'fat',     label: '脂肪', icon: '🥑', color: '#27AE60' },
];

// 蛋白参考档位（训练者 vs 普通居民）— 根据中外指南差异化
//   'trainer'：ISSN/Helms 国际标准（力量训练者）
//   'resident'：中国 RNI/2024 减重指南（普通居民/减重者）
// 切换档位后，蛋白进度条 + 参考线自动适配
const PROFILE_PRESETS = {
  trainer: {
    label: '💪 训练者',
    desc: 'ISSN / Helms 国际标准（减脂保肌）',
    proteinPerKg: 2.3,   // 训练日 2.5 g/kg 之中位
    proteinMaxPerKg: 3.1,
    minPerKg: 1.6,        // 低于此值会掉肌肉
    speedMax: 1.0,        // 速度上限 kg/周（Helms 1% 体重）
    fatPctMax: 35,        // 脂肪供能上限（训练者耐受）
    carbPctMin: 35,       // 碳周期化低碳日
    refSource: 'ISSN 2017 + Helms 2014',
  },
  resident: {
    label: '🧘 普通居民',
    desc: '中国 RNI 2023 + 2024 减重指南',
    proteinPerKg: 1.0,    // 普通居民 RNI 上限
    proteinMaxPerKg: 1.5, // 2024 减重指南
    minPerKg: 0.83,        // 中国 RNI 下限
    speedMax: 1.0,         // 卫健委 减重速度上限 4kg/月
    fatPctMax: 30,         // 卫健委 脂肪供能上限
    carbPctMin: 50,        // 卫健委 碳水供能下限
    refSource: '中国卫健委 2023/2024',
  },
};

// 根据体重/体脂/活动推断推荐档位
// 规则：BMI≥24 OR 体脂≥25% OR 每周训练≥3次 → 训练者
function recommendProfile(p) {
  if (!p || !p.weight || !p.height) return 'trainer';
  const bmi = p.weight / Math.pow(p.height / 100, 2);
  const bf = Number(p.bodyFat) || 22;
  // BMI ≥ 24（中国超重线）或体脂≥25% 或活动量中高
  if (bmi >= 24 || bf >= 25 || (p.activity && p.activity >= 3)) return 'trainer';
  return 'resident';
}

// 档位切换器 + 快速调参组件
// 包含：① 训练者/普通居民 切换按钮 ② 体重/体脂/活动量微调 ③ 自动推荐 banner
function ProfileSwitcher({ profile, setProfile, recommend }) {
  const [open, setOpen] = useState(false);
  const recPreset = PROFILE_PRESETS[recommend];
  const isMismatch = (profile.role || recommend) !== recommend;
  return (
    <div className="dt-profile-switcher">
      <div className="dt-profile-row">
        <span className="dt-profile-label">📊 参考档位</span>
        <div className="dt-profile-toggle">
          {['trainer', 'resident'].map((k) => {
            const p = PROFILE_PRESETS[k];
            const active = (profile.role || recommend) === k;
            return (
              <button
                key={k}
                type="button"
                className={`dt-profile-tab ${active ? 'active' : ''}`}
                onClick={() => setProfile({ ...profile, role: k })}
                title={p.desc}
              >
                {p.label}
              </button>
            );
          })}
        </div>
        <button
          type="button"
          className="dt-profile-edit"
          onClick={() => setOpen((v) => !v)}
          title="微调体重/体脂/活动量"
        >
          {open ? '▲' : '⚙️'}
        </button>
      </div>
      {isMismatch && (
        <div className="dt-profile-hint">
          💡 根据您的 {profile.height}cm/{profile.weight}kg/体脂{profile.bodyFat}%，自动推荐
          <b> {recPreset.label}</b>（{recPreset.desc}）
          <button
            type="button"
            className="dt-profile-apply"
            onClick={() => setProfile({ ...profile, role: recommend })}
          >
            采用推荐
          </button>
        </div>
      )}
      {open && (
        <div className="dt-profile-fields">
          <label>
            <span>年龄</span>
            <input
              type="number"
              min="10" max="100"
              value={profile.age || ''}
              onChange={(e) => setProfile({ ...profile, age: Number(e.target.value) || 0 })}
            />
          </label>
          <label>
            <span>身高 cm</span>
            <input
              type="number"
              min="100" max="250"
              value={profile.height || ''}
              onChange={(e) => setProfile({ ...profile, height: Number(e.target.value) || 0 })}
            />
          </label>
          <label>
            <span>体重 kg</span>
            <input
              type="number"
              min="30" max="200" step="0.1"
              value={profile.weight || ''}
              onChange={(e) => setProfile({ ...profile, weight: Number(e.target.value) || 0 })}
            />
          </label>
          <label>
            <span>体脂 %</span>
            <input
              type="number"
              min="3" max="60" step="0.1"
              value={profile.bodyFat || ''}
              onChange={(e) => setProfile({ ...profile, bodyFat: Number(e.target.value) || 0 })}
            />
          </label>
          <label>
            <span>每周训练</span>
            <select
              value={profile.activity || 0}
              onChange={(e) => setProfile({ ...profile, activity: Number(e.target.value) })}
            >
              <option value={0}>0 天（久坐）</option>
              <option value={1}>1 天（低活动）</option>
              <option value={2}>2 天（轻活动）</option>
              <option value={3}>3 天（中活动）</option>
              <option value={4}>4 天（高活动）</option>
              <option value={5}>5 天（很高活动）</option>
              <option value={6}>6 天（运动员）</option>
              <option value={7}>7 天（专业训练）</option>
            </select>
          </label>
        </div>
      )}
    </div>
  );
}

// 全部营养素多源构成 + 隐藏碳水源告警
function MacroBreakdown({ foodList }) {
  const report = useMemo(() => describeFoods(foodList), [foodList]);
  if (!report.carbs.text && !report.protein.text && !report.fat.text) return null;
  const hasHidden = report.carbs.hiddenGrams >= 15;
  return (
    <div className={`dt-carbs-breakdown ${hasHidden ? 'has-hidden' : ''}`}>
      <div className="dt-carbs-breakdown-title">
        🥖 营养素来源
        {hasHidden && <span className="dt-carbs-hidden-badge">⚠️ 隐藏 {report.carbs.hiddenGrams}g 碳水</span>}
      </div>
      {MACROS.map((m) => {
        const r = report[m.name];
        if (!r || !r.text) return null;
        return (
          <div key={m.name} className="dt-carbs-breakdown-line">
            <span className="dt-carbs-breakdown-line-label">{m.icon} {m.label}</span>
            <span className="dt-carbs-breakdown-line-text">≈ {r.text}</span>
            <span className="dt-carbs-breakdown-total">（{r.totalGrams}g）</span>
          </div>
        );
      })}
      {hasHidden && report.carbs.hiddenItems.length > 0 && (
        <div className="dt-carbs-hidden-tip">
          💡 隐藏碳水（容易被忽略的）：<br />
          {report.carbs.hiddenItems.map((it, i) => (
            <span key={i} className="dt-carbs-hidden-item">
              {it.qty}{it.unit}{it.name} = {it.grams}g
              {i < report.carbs.hiddenItems.length - 1 ? ' · ' : ''}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

// 单条进度条（从 foodList 算 value/target）
function MacroRow({ icon, label, name, valueList, targetList, color, profilePreset, weight }) {
  const value  = useMemo(() => Math.round(calcGrams(valueList,  name)), [valueList,  name]);
  const target = useMemo(() => Math.round(calcGrams(targetList, name)), [targetList, name]);
  const pct = target > 0 ? Math.max(0, Math.min(100, Math.round((value / target) * 100))) : 0;
  const remaining = Math.max(0, target - value);
  const over = value > target;
  const desc = describeMacro(remaining, name, true);
  const meal = describeMacroMeal(remaining, name, true); // 综合餐食模板（主食+配菜+加餐）
  // 蛋白行专属：根据体重 + 档位推荐量 算出参考区段（仅蛋白显示）
  const isProtein = name === 'protein';
  const proteinPerKg = (weight && profilePreset) ? Math.round(value / weight * 100) / 100 : null;
  const proteinMin = weight && profilePreset ? Math.round(profilePreset.minPerKg * weight) : null;
  const proteinRec = weight && profilePreset ? Math.round(profilePreset.proteinPerKg * weight) : null;
  const proteinMax = weight && profilePreset ? Math.round(profilePreset.proteinMaxPerKg * weight) : null;
  // 状态颜色：低于 min 蓝/低于 rec 黄/达标 绿/超 max 红
  let proteinState = null;
  if (isProtein && weight && profilePreset) {
    if (proteinPerKg < profilePreset.minPerKg) proteinState = { tier: 'low',  text: '🔵 低于保肌线',       color: '#3498DB' };
    else if (proteinPerKg < profilePreset.proteinPerKg) proteinState = { tier: 'mid', text: '🟡 未达推荐区',     color: '#F39C12' };
    else if (proteinPerKg <= profilePreset.proteinMaxPerKg) proteinState = { tier: 'ok', text: '🟢 推荐区',        color: '#27AE60' };
    else proteinState = { tier: 'over', text: '🔴 超安全线（注意减量）', color: '#E74C3C' };
  }
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
          style={{ width: `${pct}%`, background: over ? 'var(--color-danger)' : color }}
        />
        {/* 蛋白行专属：参考区段下界/推荐/上界三条标线 */}
        {isProtein && proteinMin != null && (
          <div
            className="dt-progress-marker dt-progress-marker-min"
            style={{ left: `${Math.min(100, (proteinMin / Math.max(target, proteinMax || 1)) * 100)}%` }}
            title={`保肌下限 ${proteinMin}g (${profilePreset.minPerKg} g/kg)`}
          />
        )}
        {isProtein && proteinRec != null && (
          <div
            className="dt-progress-marker dt-progress-marker-rec"
            style={{ left: `${Math.min(100, (proteinRec / Math.max(target, proteinMax || 1)) * 100)}%` }}
            title={`推荐量 ${proteinRec}g (${profilePreset.proteinPerKg} g/kg)`}
          />
        )}
        {isProtein && proteinMax != null && (
          <div
            className="dt-progress-marker dt-progress-marker-max"
            style={{ left: `${Math.min(100, (proteinMax / Math.max(target, proteinMax || 1)) * 100)}%` }}
            title={`安全上限 ${proteinMax}g (${profilePreset.proteinMaxPerKg} g/kg)`}
          />
        )}
      </div>
      <div className="dt-macro-foot">
        {over ? (
          <span className="dt-macro-over">已超标 {value - target}g</span>
        ) : (
          <span className="dt-macro-remaining">
            还差 <b>{remaining}g</b>
            {meal.main && (
              <em className="dt-macro-meal">
                🍽️ <b className="dt-meal-qty">{meal.main.colloquial}</b>
                <span className="dt-meal-plus">+</span>
                <b className="dt-meal-qty">{meal.side.colloquial}</b>
                <span className="dt-meal-plus">+</span>
                <b className="dt-meal-qty">{meal.extra.colloquial}</b>
                <span className="dt-meal-hint">（一日餐食参考）</span>
              </em>
            )}
            {desc.primary && (
              <em className="dt-macro-desc">
                <span className="dt-desc-divider">·</span>
                ≈ <b className="dt-desc-qty">{desc.primary.colloquial}</b>
                {desc.primary.precise && <span className="dt-desc-precise">（{desc.primary.precise}）</span>}
                {desc.alternative && desc.alternative.colloquial !== desc.primary.colloquial && (
                  <>
                    <span className="dt-desc-or">或</span>
                    <b className="dt-desc-qty dt-desc-qty-alt">{desc.alternative.colloquial}</b>
                    {desc.alternative.precise && <span className="dt-desc-precise">（{desc.alternative.precise}）</span>}
                  </>
                )}
                {desc.extras && desc.extras.length > 0 && desc.extras.map((ex, i) => (
                  <span key={i}>
                    <span className="dt-desc-or">或</span>
                    <b className="dt-desc-qty dt-desc-qty-extra">{ex.colloquial}</b>
                    {ex.precise && <span className="dt-desc-precise">（{ex.precise}）</span>}
                  </span>
                ))}
              </em>
            )}
          </span>
        )}
        <span className="dt-macro-pct">{pct}%</span>
      </div>
      {/* 蛋白专属：g/kg 状态 + 参考档位提示 */}
      {isProtein && proteinPerKg != null && (
        <div className="dt-protein-meta" style={{ color: proteinState.color }}>
          <span className="dt-protein-tag">
            {profilePreset.label}
          </span>
          <span className="dt-protein-perkg">
            {proteinPerKg.toFixed(2)} g/kg
          </span>
          <span className="dt-protein-state">{proteinState.text}</span>
          <span className="dt-protein-range">
            参考 {profilePreset.minPerKg}–{profilePreset.proteinMaxPerKg} g/kg（{profilePreset.refSource}）
          </span>
        </div>
      )}
    </div>
  );
}

// 总大卡进度条（独立样式，不复用 MacroRow）
function KcalRow({ value, target }) {
  const pct = target > 0 ? Math.max(0, Math.min(100, Math.round((value / target) * 100))) : 0;
  const over = value > target;
  const remaining = Math.max(0, target - value);
  const carbsGap   = useMemo(() => Math.round(calcGrams(toFoodList([]), 'carbs')), []); // 0 placeholder
  const remainingText = useMemo(() => {
    // 改用 diet 全局传给这里（外层已经算了）
    return '';
  }, []);
  return (
    <div className={`dt-macro-row dt-macro-row-kcal ${over ? 'is-over' : ''}`}>
      <div className="dt-macro-head">
        <span className="dt-macro-icon" style={{ background: '#FF6F0033', color: '#FF6F00' }}>🔥</span>
        <span className="dt-macro-label">总大卡</span>
        <span className="dt-macro-numbers">
          <b>{value}</b>
          <span className="dt-macro-sep">/</span>
          <span className="dt-macro-target">{target}</span>
          <span className="dt-macro-unit">大卡</span>
        </span>
      </div>
      <div className="dt-progress">
        <div
          className="dt-progress-fill"
          style={{ width: `${pct}%`, background: over ? 'var(--color-danger)' : '#FF6F00' }}
        />
      </div>
      <div className="dt-macro-foot">
        {over ? (
          <span className="dt-macro-over">已超标 {value - target} 大卡</span>
        ) : (
          <span className="dt-macro-remaining">
            还差 <b>{remaining}</b> 大卡
            {remainingText && (
              <em className="dt-macro-desc">
                ≈ <b className="dt-desc-qty">{remainingText}</b>
              </em>
            )}
          </span>
        )}
        <span className="dt-macro-pct">{pct}%</span>
      </div>
    </div>
  );
}

// 统一食物列表编辑器（用于 target / eaten 表单）
function UnifiedFoodEditor({ foodList, onChange, mealConfig }) {
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
    // 检测当前所有有食物的 meal 是否都展开了
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
      // 全部收起
      setExpandedMeals(new Set());
    } else {
      // 全部展开（有食物的餐都展开）
      const next = new Set();
      for (const it of foodList) {
        if (it.id) next.add(it.meal || '_other');
      }
      setExpandedMeals(next);
    }
  };

  // 141 个食物全量 + 模糊匹配
  const allFoods = useMemo(() => {
    const out = [];
    for (const [catKey, cat] of Object.entries(FOOD_DB)) {
      if (!Array.isArray(cat?.foods)) continue;
      for (const f of cat.foods) out.push({ ...f, _catKey: catKey, _catIcon: cat.icon, _catLabel: cat.label });
    }
    return out;
  }, []);

  // 过滤
  const filteredFoods = useMemo(() => {
    const kw = search.trim().toLowerCase();
    return allFoods.filter((f) => {
      if (catFilter && f._catKey !== catFilter) return false;
      if (!kw) return true;
      const hay = `${f.name}${f.size || ''}${f.id}`.toLowerCase();
      return hay.includes(kw);
    });
  }, [allFoods, search, catFilter]);

  const updateItem = (idx, patch) => onChange(foodList.map((it, i) => (i === idx ? { ...it, ...patch } : it)));
  const removeItem = (idx) => onChange(foodList.filter((_, i) => i !== idx));
  // 添加食物：弹克数 modal，默认 100g
  const [pendingFood, setPendingFood] = useState(null); // {food, grams}
  const [pendingGrams, setPendingGrams] = useState(100);
  const openAddModal = (food) => {
    setPendingFood(food);
    setPendingGrams(parseSizeG(food?.size) || 100); // 默认 = size 字段克数（如米饭 150g）
  };
  const confirmAdd = () => {
    if (!pendingFood) return;
    const grams = Math.max(10, Number(pendingGrams) || 100);
    const existIdx = foodList.findIndex((it) => it.id === pendingFood.id);
    if (existIdx >= 0) {
      // 已存在 → 累加克数
      const cur = Number(foodList[existIdx].grams) || 0;
      updateItem(existIdx, { grams: cur + grams });
    } else {
      onChange([...foodList, { id: pendingFood.id, qty: 1, grams }]);
    }
    setPendingFood(null);
    setSearch(''); // 添加后清空搜索
  };
  const cancelAdd = () => setPendingFood(null);
  const addItem = (food) => openAddModal(food);
  const adjustQty = (idx, delta) => {
    // 现在用 grams 控制份量：± 25g 步进
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
              // 按 meal 分组（保留原始顺序）
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
              // 漏掉的 meal（不在 order 里的）依然显示
              const rest = foodList
                .map((it, idx) => ({ it, idx }))
                .filter(({ it, idx }) => !seen.has(it.meal) && it.id);
              if (rest.length > 0) groups.push({ meal: '_other', label: '🍱 其他', items: rest });
              return (
                <>
                  {/* 总开关：已选 X 项 / 一键全收/展 */}
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
            <MacroBreakdown foodList={foodList} />
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
            placeholder="🔍 输入名称搜索（鸡腿/米饭/牛奶/红薯...）"
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
        </div>
        {filteredFoods.length === 0 ? (
          <div className="dt-picker-empty">未找到匹配食物，换个关键词试试</div>
        ) : (
          <div className="dt-picker-categories">
            {(() => {
              // 按分类分组显示过滤后的结果
              const groups = {};
              for (const f of filteredFoods) {
                if (!groups[f._catKey]) groups[f._catKey] = { icon: f._catIcon, label: f._catLabel, foods: [] };
                groups[f._catKey].foods.push(f);
              }
              return Object.entries(groups).map(([catKey, g]) => (
                <div key={catKey} className="dt-picker-cat-block">
                  <div className="dt-picker-cat-title">{g.icon} {g.label}</div>
                  <div className="dt-picker-grid">
                    {g.foods.map((f) => (
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
              ));
            })()}
          </div>
        )}
      </div>

      {/* 克数输入 modal（添加食物时弹） */}
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
    </div>
  );
}

export default function DietTracker() {
  const [open, setOpen] = useState(false);
  const [diet, setDiet] = useState(() => getDiet());

  // 用户档位（训练者 vs 普通居民）— 持久化到 localStorage
  // 默认值：老铁 180/82.5/22%/4 训 = 训练者
  const [profile, setProfile] = useState(() => {
    try {
      const saved = window.localStorage.getItem('menu_app_diet_profile');
      if (saved) return JSON.parse(saved);
    } catch (e) { /* ignore */ }
    return { age: 33, height: 180, weight: 82.5, bodyFat: 22, activity: 4, role: 'trainer' };
  });
  useEffect(() => {
    try { window.localStorage.setItem('menu_app_diet_profile', JSON.stringify(profile)); } catch (e) { /* ignore */ }
  }, [profile]);
  const profileKey = profile.role || recommendProfile(profile);
  const profilePreset = PROFILE_PRESETS[profileKey];

  // 目标 / 已吃 都是统一食物列表
  const [targetForm, setTargetForm] = useState([]);
  const [eatenForm, setEatenForm] = useState([]);
  // 餐次配置（从 QUICK_TARGETS 带入，记录早/午/晚/加 顺序与名称）
  const [mealConfig, setMealConfig] = useState({
    order: ['breakfast', 'lunch', 'dinner', 'snack'],
    labels: { breakfast: '🍚 早餐', lunch: '🍛 午餐', dinner: '🍜 晚餐', snack: '🥛 加餐' },
  });
  const [mode, setMode] = useState('view'); // view | editTarget | editEaten
  const [toast, setToast] = useState('');

  // 打开弹窗时初始化表单（老数据 qty 缺 grams 时默认 100g）
  useEffect(() => {
    if (open) {
      const cur = getDiet();
      setDiet(cur);
      setTargetForm(toFoodList(cur.target).map((it) => ({ ...it, grams: Number(it.grams) || 100 })));
      setEatenForm(toFoodList(cur.eaten).map((it) => ({ ...it, grams: Number(it.grams) || 100 })));
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

  // 快捷填充目标：一行业务代码
  const applyQuickTarget = (key) => {
    const cfg = QUICK_TARGETS[key];
    setTargetForm(cfg.foods.map((f) => {
      // grams = 单份克数 × 份数（与 size 字段对齐，避免 0.5 勺油 = 100g = 900 kcal 的错误）
      const food = findFood(f.id);
      const sizeG = food ? parseSizeG(food.size) : 100;
      return { ...f, grams: Math.round(sizeG * (Number(f.qty) || 1)) };
    }));
    setMealConfig({ order: cfg.mealsOrder, labels: cfg.mealLabels });
  };

  // 保存目标
  const handleSaveTarget = () => {
    const next = saveTarget(targetForm);
    setDiet(next);
    setMode('view');
    flashToast('已保存今日目标 ✓');
  };

  // 保存已吃
  const handleSaveEaten = () => {
    const next = saveEaten(eatenForm);
    setDiet(next);
    setMode('view');
    // 方案 C：扫隐藏碳水源 · 超阈提醒
    const carbsReport = describeFoods(eatenForm).carbs;
    const kcal = Math.round(calcKcalFromFoodList(eatenForm));
    const baseMsg = `已更新已吃 ✓ （${eatenForm.length} 项 / ${kcal} 大卡）`;
    if (carbsReport.hiddenGrams >= 15) {
      const top = carbsReport.hiddenItems.slice(0, 2)
        .map((it) => it.grams > 0 ? `${Math.round(it.grams)}g${it.name}` : `${it.qty}${it.unit}${it.name}`)
        .join(' + ');
      setTimeout(() => flashToast(`⚠️ 隐藏碳水 ${carbsReport.hiddenGrams}g · ${top} · 建议明天减半`), 100);
    } else {
      flashToast(baseMsg);
    }
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
    setTargetForm(toFoodList(next.target));
    setEatenForm([]);
    flashToast('已全部重置');
  };

  // 训练日 / 休息日 kcal（按钮显示用，动态计算不会过时）
  const quickKcal = useMemo(() => ({
    training: Math.round(calcKcalFromFoodList(QUICK_TARGETS.training.foods)),
    rest: Math.round(calcKcalFromFoodList(QUICK_TARGETS.rest.foods)),
  }), []);

  // 计算
  const targetKcal = useMemo(() => Math.round(calcKcalFromFoodList(diet.target)), [diet.target]);
  const eatenKcal  = useMemo(() => Math.round(calcKcalFromFoodList(diet.eaten)),  [diet.eaten]);
  const remainingKcal = Math.max(0, targetKcal - eatenKcal);

  const remaining = useMemo(() => ({
    carbs:   Math.max(0, Math.round(calcGrams(diet.target, 'carbs'))   - Math.round(calcGrams(diet.eaten, 'carbs'))),
    protein: Math.max(0, Math.round(calcGrams(diet.target, 'protein')) - Math.round(calcGrams(diet.eaten, 'protein'))),
    fat:     Math.max(0, Math.round(calcGrams(diet.target, 'fat'))     - Math.round(calcGrams(diet.eaten, 'fat'))),
  }), [diet]);

  // 还差 X 大卡 = 3 碗米饭 + 2 个鸡腿 + 1 勺 油
  const remainingKcalText = useMemo(
    () => describeRemaining(remaining.carbs, remaining.protein, remaining.fat),
    [remaining]
  );

  // 关闭弹窗
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false); };
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

            {/* 三大营养素进度 + 总大卡进度 */}
            <div className="dt-macros">
              {MACROS.map((m) => (
                <MacroRow
                  key={m.name}
                  name={m.name}
                  label={m.label}
                  icon={m.icon}
                  color={m.color}
                  valueList={diet.eaten}
                  targetList={diet.target}
                  profilePreset={profilePreset}
                  weight={profile.weight}
                />
              ))}
              <KcalRow value={eatenKcal} target={targetKcal} remainingText={remainingKcalText} />
            </div>

            {/* 档位切换器 + 体重/体脂/活动量快速配置 */}
            <ProfileSwitcher profile={profile} setProfile={setProfile} recommend={recommendProfile(profile)} />

            {/* 操作区 */}
            {mode === 'view' && (
              <div className="dt-actions">
                <button type="button" className="dt-btn dt-btn-primary" onClick={() => setMode('editEaten')}>
                  ✏️ 更新已吃
                </button>
                <button type="button" className="dt-btn" onClick={() => setMode('editTarget')}>
                  🎯 调整目标
                </button>
                <button type="button" className="dt-btn dt-btn-danger-text" onClick={handleResetEaten}>
                  清空已吃
                </button>
              </div>
            )}

            {/* 已吃表单 */}
            {mode === 'editEaten' && (
              <div className="dt-form">
                <div className="dt-form-title">
                  <span>📝 记录今天吃的（不用分类，全库任选）</span>
                  <button
                    type="button"
                    className="dt-btn dt-btn-primary dt-btn-sm"
                    onClick={handleSaveEaten}
                    title="顶部快速保存"
                    style={{ marginLeft: 'auto', padding: '4px 10px', fontSize: 12 }}
                  >
                    💾 保存
                  </button>
                </div>
                <UnifiedFoodEditor foodList={eatenForm} onChange={setEatenForm} mealConfig={mealConfig} />
                <div className="dt-form-actions">
                  <button type="button" className="modal-btn cancel" onClick={() => setMode('view')}>取消</button>
                  <button type="button" className="modal-btn confirm" onClick={handleSaveEaten}>💾 保存已吃</button>
                </div>
              </div>
            )}

            {/* 目标表单：与已吃同款 UnifiedFoodEditor */}
            {mode === 'editTarget' && (
              <div className="dt-form">
                <div className="dt-form-title">
                  <span>🎯 调整今日目标（自由搭配，自动累加三大宏量素）</span>
                  <button
                    type="button"
                    className="dt-btn dt-btn-primary dt-btn-sm"
                    onClick={handleSaveTarget}
                    title="顶部快速保存"
                    style={{ marginLeft: 'auto', padding: '4px 10px', fontSize: 12 }}
                  >
                    💾 保存
                  </button>
                </div>
                                <div className="dt-form-hint">
                                  💡 营养数据按「150g 标准饭碗·盛满」估算，与食物成分表有 ~15% 偏差（碳水略高），属正常估重范围，实际餐量请以「重量」为准。
                                </div>
                <div className="dt-quick-targets">
                  <button
                    type="button"
                    className="dt-quick-btn"
                    onClick={() => applyQuickTarget('training')}
                    title={QUICK_TARGETS.training.desc}
                  >
                    <span className="dt-quick-btn-icon">🏋️</span>
                    <span className="dt-quick-btn-label">训练日</span>
                    <span className="dt-quick-btn-kcal">~{quickKcal.training} kcal</span>
                  </button>
                  <button
                    type="button"
                    className="dt-quick-btn"
                    onClick={() => applyQuickTarget('rest')}
                    title={QUICK_TARGETS.rest.desc}
                  >
                    <span className="dt-quick-btn-icon">🛌</span>
                    <span className="dt-quick-btn-label">休息日</span>
                    <span className="dt-quick-btn-kcal">~{quickKcal.rest} kcal</span>
                  </button>
                </div>
                <UnifiedFoodEditor foodList={targetForm} onChange={setTargetForm} mealConfig={mealConfig} />
                <div className="dt-form-actions">
                  <button type="button" className="modal-btn cancel" onClick={() => setMode('view')}>取消</button>
                  <button type="button" className="modal-btn confirm" onClick={handleSaveTarget}>保存</button>
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
          </div>

          {toast && <div className="dt-toast">{toast}</div>}
        </div>
      )}
    </>
  );
}

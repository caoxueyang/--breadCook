// 今日饮食计划主组件
// 子组件拆分到 ./diet/：
//   - ProfileSwitcher  档位切换（训练者 vs 普通居民）
//   - MacroRow         单条宏量素进度条
//   - KcalRow          总大卡进度条
//   - MacroBreakdown   宏量素来源分析
//   - UnifiedFoodEditor 统一食物列表编辑器
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
  calcGrams,
  calcKcalFromFoodList,
  describeFoods,
  describeRemaining,
  findFood,
  parseSizeG,
} from '../utils/foodDatabase';
import ProfileSwitcher, { GENDER_PRESETS, PROFILE_PRESETS, recommendProfile } from './diet/ProfileSwitcher';
import MacroRow from './diet/MacroRow';
import KcalRow from './diet/KcalRow';
import MacroBreakdown from './diet/MacroBreakdown';
import UnifiedFoodEditor from './diet/UnifiedFoodEditor';
import IronTracker from './diet/IronTracker';
import { logTodayIron, getWeeklyLimitStatus } from '../utils/ironDB';
import { useToast } from '../contexts/ToastContext';
import './DietTracker.css';

// 快捷填充：训练日 vs 休息日（180cm/82.5kg/22%体脂 → 减脂为主+保肌+露腹肌）
// B v4.1 鸡胸替换版：体脂 22% → 14% 露腹肌（预计 17 周）
const QUICK_TARGETS = {
  training: {
    label: '训练日',
    desc: '🥣早 1燕麦+1牛奶+2蛋+1香蕉 | 🍛午 1米饭+1红薯+3鸡胸+1油 | 🍠晚 1红薯+2鸡胸+1蛋+1油 | 🥛加 1蛋白粉+1苹果+1坚果',
    mealsOrder: ['breakfast', 'lunch', 'dinner', 'snack'],
    mealLabels: { breakfast: '🥣 早餐', lunch: '🍛 午餐', dinner: '🍠 晚餐', snack: '🥛 加餐' },
    foods: [
      { id: 'oat',            qty: 1,   meal: 'breakfast' },
      { id: 'milk',           qty: 1,   meal: 'breakfast' },
      { id: 'egg',            qty: 2,   meal: 'breakfast' },
      { id: 'banana',         qty: 1,   meal: 'breakfast' },
      { id: 'rice',           qty: 1,   meal: 'lunch' },
      { id: 'sweet_potato',   qty: 1,   meal: 'lunch' },
      { id: 'chicken_breast', qty: 3,   meal: 'lunch' },
      { id: 'oil',            qty: 1,   meal: 'lunch' },
      { id: 'sweet_potato',   qty: 1,   meal: 'dinner' },
      { id: 'chicken_breast', qty: 2,   meal: 'dinner' },
      { id: 'egg',            qty: 1,   meal: 'dinner' },
      { id: 'oil',            qty: 1,   meal: 'dinner' },
      { id: 'whey',           qty: 1,   meal: 'snack' },
      { id: 'apple',          qty: 1,   meal: 'snack' },
      { id: 'nuts',           qty: 1,   meal: 'snack' },
    ],
    _calculated: { carbs: 225, protein: 178, fat: 62, kcal: 2230 },
  },
  rest: {
    label: '休息日',
    desc: '🥣早 1燕麦+1牛奶+1蛋+1香蕉 | 🍛午 1米饭+1红薯+3鸡胸+1油 | 🍠晚 0.5红薯+2鸡胸+1蛋+1油 | 🥛加 1蛋白粉+1苹果',
    mealsOrder: ['breakfast', 'lunch', 'dinner', 'snack'],
    mealLabels: { breakfast: '🥣 早餐', lunch: '🍛 午餐', dinner: '🍠 晚餐', snack: '🥛 加餐' },
    foods: [
      { id: 'oat',            qty: 1,   meal: 'breakfast' },
      { id: 'milk',           qty: 1,   meal: 'breakfast' },
      { id: 'egg',            qty: 1,   meal: 'breakfast' },
      { id: 'banana',         qty: 1,   meal: 'breakfast' },
      { id: 'rice',           qty: 1,   meal: 'lunch' },
      { id: 'sweet_potato',   qty: 1,   meal: 'lunch' },
      { id: 'chicken_breast', qty: 3,   meal: 'lunch' },
      { id: 'oil',            qty: 1,   meal: 'lunch' },
      { id: 'sweet_potato',   qty: 0.5, meal: 'dinner' },
      { id: 'chicken_breast', qty: 2,   meal: 'dinner' },
      { id: 'egg',            qty: 1,   meal: 'dinner' },
      { id: 'oil',            qty: 1,   meal: 'dinner' },
      { id: 'whey',           qty: 1,   meal: 'snack' },
      { id: 'apple',          qty: 1,   meal: 'snack' },
    ],
    _calculated: { carbs: 200, protein: 170, fat: 60, kcal: 2020 },
  },
};

const MACROS = [
  { name: 'carbs',   label: '碳水', icon: '🍚', color: '#F6A623' },
  { name: 'protein', label: '蛋白', icon: '🥩', color: '#E74C3C' },
  { name: 'fat',     label: '脂肪', icon: '🥑', color: '#27AE60' },
];

export default function DietTracker() {
  const [open, setOpen] = useState(false);
  const [diet, setDiet] = useState(() => getDiet());

  // 用户档位（训练者 vs 普通居民）— 持久化到 localStorage
  const [profile, setProfile] = useState(() => {
    try {
      const saved = window.localStorage.getItem('menu_app_diet_profile');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (!parsed.gender) parsed.gender = 'male';
        return parsed;
      }
    } catch (e) { /* ignore */ }
    return { gender: 'male', age: 33, height: 180, weight: 82.5, bodyFat: 22, activity: 4, role: 'trainer' };
  });
  useEffect(() => {
    try { window.localStorage.setItem('menu_app_diet_profile', JSON.stringify(profile)); } catch (e) { /* ignore */ }
  }, [profile]);

  // 刷新触发器（铁统计等子组件依赖）
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // 性别切换：应用对应模板
  const handleGenderSwitch = (g) => {
    const preset = GENDER_PRESETS[g];
    if (preset) {
      setProfile({ ...preset });
      setRefreshTrigger((v) => v + 1);
    }
  };
  const profileKey = profile.role || recommendProfile(profile);
  const profilePreset = PROFILE_PRESETS[profileKey] || {};

  const [targetForm, setTargetForm] = useState([]);
  const [eatenForm, setEatenForm] = useState([]);
  const [mealConfig, setMealConfig] = useState({
    order: ['breakfast', 'lunch', 'dinner', 'snack'],
    labels: { breakfast: '🍚 早餐', lunch: '🍛 午餐', dinner: '🍜 晚餐', snack: '🥛 加餐' },
  });
  const [mode, setMode] = useState('view');
  const toast = useToast();

  // 打开弹窗时初始化表单
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

  const flashToast = (msg, type = 'success') => {
    if (type === 'success') toast.success(msg);
    else if (type === 'warn') toast.warn(msg);
    else if (type === 'error') toast.error(msg);
    else toast.info(msg);
  };

  // 快捷填充目标：grams = weightG × qty
  const applyQuickTarget = (key) => {
    const cfg = QUICK_TARGETS[key];
    setTargetForm(cfg.foods.map((f) => {
      const food = findFood(f.id);
      const sizeG = food ? parseSizeG(food) : 100;
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
    setRefreshTrigger((v) => v + 1);
    // 记录铁摄入（男女通用）
    try { logTodayIron(eatenForm); } catch (e) { /* ignore */ }
    const carbsReport = describeFoods(eatenForm).carbs;
    const kcal = Math.round(calcKcalFromFoodList(eatenForm));
    const baseMsg = `已更新已吃 ✓ （${eatenForm.length} 项 / ${kcal} 大卡）`;
    if (carbsReport.hiddenGrams >= 15) {
      const top = carbsReport.hiddenItems.slice(0, 2)
        .map((it) => it.grams > 0 ? `${Math.round(it.grams)}g${it.name}` : `${it.qty}${it.unit}${it.name}`)
        .join(' + ');
      setTimeout(() => flashToast(`⚠️ 隐藏碳水 ${carbsReport.hiddenGrams}g · ${top} · 建议明天减半`, 'warn'), 100);
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

  const remainingKcalText = useMemo(
    () => describeRemaining(remaining.carbs, remaining.protein, remaining.fat),
    [remaining]
  );

  // ESC 关闭
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

            {/* 档位切换器 */}
            <ProfileSwitcher
              profile={profile}
              setProfile={setProfile}
              recommend={recommendProfile(profile)}
              gender={profile.gender}
              onGenderSwitch={handleGenderSwitch}
            />

            {/* 铁摄入追踪（男女通用） */}
            <IronTracker refreshTrigger={refreshTrigger} gender={profile.gender} />

            {/* 本周限吃提醒 */}
            <WeeklyLimitCard refreshTrigger={refreshTrigger} />

            {/* 维生素D提示卡片 */}
            <div className="dt-vitd-card">
              <div className="dt-vitd-header">
                <span className="dt-vitd-icon">☀️</span>
                <span className="dt-vitd-title">维生素 D：靠吃基本不够</span>
              </div>
              <div className="dt-vitd-body">
                <p><b>🌞 晒太阳才是王道</b>——每周 3 次正午晒 15-30 分钟（露胳膊腿）≈ 10000 IU，比补剂强 10 倍。</p>
                <p>食物中的维D含量极低（鸡蛋黄 37IU、猪肝 45IU），靠吃一天得吃 30 个鸡蛋才够。</p>
                <p>💊 实在晒不够（阴天/室内办公/北方冬天），<b>再考虑每天补 1000-2000 IU</b>。</p>
                <p className="dt-vitd-foot">维D不足 → 睾酮降 · 肌肉恢复慢 · 免疫力崩 · 骨折风险高</p>
              </div>
            </div>

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

            {/* 目标表单 */}
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
        </div>
      )}
    </>
  );
}

// ============================================
// 本周限吃食物提醒卡片
// ============================================
function WeeklyLimitCard({ refreshTrigger }) {
  const [items, setItems] = useState(() => getWeeklyLimitStatus());

  useEffect(() => {
    setItems(getWeeklyLimitStatus());
  }, [refreshTrigger]);

  // 只显示有限吃的食物（不显示还没吃过的）
  const shown = items.filter((it) => it.count > 0);
  if (shown.length === 0) return null;

  return (
    <div className="dt-limit-card">
      <div className="dt-limit-header">
        <span className="dt-limit-icon">⚠️</span>
        <span className="dt-limit-title">本周限吃提醒</span>
      </div>
      <div className="dt-limit-list">
        {shown.map((item) => (
          <div key={item.id} className={`dt-limit-item${item.done ? ' is-done' : ''}`}>
            <span className="dt-limit-name">{item.displayName}</span>
            <span className={`dt-limit-badge ${item.done ? 'badge-done' : 'badge-ok'}`}>
              {item.done
                ? `✅ 已吃 ${item.count}/${item.max} 次 · 本周别吃了`
                : `⏳ 已吃 ${item.count}/${item.max} 次`}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

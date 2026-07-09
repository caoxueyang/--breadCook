// 每日饮食计划：碳水 / 蛋白质 / 脂肪 追踪
// localStorage 结构：{ date: "YYYY-MM-DD", target: {...}, eaten: {...} }

const DIET_KEY = 'menu_app_diet_plan';

// 默认目标（180cm/83kg 减脂保肌基线 - 训练日）
// 默认目标：训练日基线（180cm/83kg 减脂保肌方案）
// 300g 碳水 + 180g 蛋白 + 50g 脂肪 = 2370 大卡（支持力量训练 + 轻负平衡）
const DEFAULT_TARGET = { carbs: 300, protein: 180, fat: 50 };

// 工具：从 Date 取出 yyyy-mm-dd（本地时区）
function todayKey(d = new Date()) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

// 数字四舍五入到整数；空/无效转为 0
function toInt(v) {
  const n = parseFloat(v);
  return Number.isFinite(n) && n >= 0 ? Math.round(n) : 0;
}

// 安全读取 localStorage
function readRaw() {
  try {
    const raw = localStorage.getItem(DIET_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function writeRaw(data) {
  try {
    localStorage.setItem(DIET_KEY, JSON.stringify(data));
  } catch {
    // localStorage 满或被禁用：静默忽略
  }
}

// 读取今日饮食数据；跨天自动重置 eaten（target 保留）
export function getDiet() {
  const raw = readRaw();
  const today = todayKey();

  if (!raw) {
    return {
      date: today,
      target: { ...DEFAULT_TARGET },
      eaten: { carbs: 0, protein: 0, fat: 0 },
    };
  }

  // 跨天：保留 target，eaten 归零
  if (raw.date !== today) {
    const next = {
      date: today,
      target: raw.target || { ...DEFAULT_TARGET },
      eaten: { carbs: 0, protein: 0, fat: 0 },
    };
    writeRaw(next);
    return next;
  }

  return {
    date: raw.date,
    target: raw.target || { ...DEFAULT_TARGET },
    eaten: raw.eaten || { carbs: 0, protein: 0, fat: 0 },
  };
}

// 保存今日目标
export function saveTarget(target) {
  const cur = getDiet();
  const next = {
    ...cur,
    target: {
      carbs: toInt(target?.carbs),
      protein: toInt(target?.protein),
      fat: toInt(target?.fat),
    },
  };
  writeRaw(next);
  return next;
}

// 保存已吃
export function saveEaten(eaten) {
  const cur = getDiet();
  const next = {
    ...cur,
    eaten: {
      carbs: toInt(eaten?.carbs),
      protein: toInt(eaten?.protein),
      fat: toInt(eaten?.fat),
    },
  };
  writeRaw(next);
  return next;
}

// 重置今日已吃（保留 target）
export function resetEaten() {
  const cur = getDiet();
  const next = {
    ...cur,
    eaten: { carbs: 0, protein: 0, fat: 0 },
  };
  writeRaw(next);
  return next;
}

// 完全重置（target 也清空回默认，eaten 清零）
export function resetAll() {
  const next = {
    date: todayKey(),
    target: { ...DEFAULT_TARGET },
    eaten: { carbs: 0, protein: 0, fat: 0 },
  };
  writeRaw(next);
  return next;
}

// 计算热量（碳水/蛋白 × 4，脂肪 × 9）
export function calcKcal({ carbs, protein, fat }) {
  return toInt(carbs) * 4 + toInt(protein) * 4 + toInt(fat) * 9;
}

// 计算剩余（目标 - 已吃，下限为 0 用于显示正数；负数表示超额）
export function calcRemaining(target, eaten) {
  return {
    carbs: toInt(target.carbs) - toInt(eaten.carbs),
    protein: toInt(target.protein) - toInt(eaten.protein),
    fat: toInt(target.fat) - toInt(eaten.fat),
  };
}

// 进度百分比（0-100，超过 100 截断）
export function calcProgress(target, eaten, key) {
  const t = toInt(target[key]);
  const e = toInt(eaten[key]);
  if (t === 0) return 0;
  return Math.max(0, Math.min(100, Math.round((e / t) * 100)));
}

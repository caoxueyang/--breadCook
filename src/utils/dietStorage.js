// 每日饮食计划：碳水 / 蛋白质 / 脂肪 追踪
// localStorage 结构（SCHEMA_VERSION=2）：
//   { date, schema: 2, target: [{id, qty}, ...], eaten: [{id, qty}, ...] }
// 全部以「食物列表」为唯一真相源，不再拆为三个克数。

const DIET_KEY = 'menu_app_diet_plan';
const SCHEMA_VERSION = 2;

// 默认目标（180cm/83kg 减脂保肌 - 训练日基线）
// 累加：碳水 280g + 蛋白 200g + 脂肪 91g ≈ 2563 kcal
//   4 碗 米饭     180g 碳水 +  16g 蛋白 +   2g 脂肪
//   1 碗 燕麦      20g 碳水 +   4g 蛋白 +   2g 脂肪
//   2 个 红薯      80g 碳水 +   4g 蛋白 +   0g 脂肪
//  11 个 鸡腿       0g 碳水 + 176g 蛋白 +  77g 脂肪
//   1 勺 油         0g 碳水 +   0g 蛋白 +  10g 脂肪
// 用户可点「训练日 / 休息日」快捷键一键覆盖
const DEFAULT_TARGET_FOODS = [
  { id: 'rice',          qty: 4 },
  { id: 'oat',           qty: 1 },
  { id: 'sweet_potato',  qty: 2 },
  { id: 'chicken_thigh', qty: 11 },
  { id: 'oil',           qty: 1 },
];

// 工具：从 Date 取出 yyyy-mm-dd（本地时区）
function todayKey(d = new Date()) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

// 工具：把任意东西转成 [{id, qty}, ...]（防御性）
export function toFoodList(v) {
  if (!Array.isArray(v)) return [];
  return v
    .filter((it) => it && typeof it.id === 'string' && Number.isFinite(Number(it.qty)))
    .map((it) => ({ id: String(it.id), qty: Number(it.qty) }))
    .filter((it) => it.qty > 0);
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

/**
 * 迁移老 schema（v1：target/eaten = {carbs, protein, fat}）→ v2（食物列表）
 * 老数据是克数 → 用 gramsToSingleFood 单代表反推
 * 注：必须在 foodDatabase 加载完成后调用
 */
function migrateV1ToV2(v1Data, gramsToSingleFood) {
  const toList = (g) => {
    const list = [];
    if (g?.carbs)   list.push(...gramsToSingleFood(g.carbs,   'carbs'));
    if (g?.protein) list.push(...gramsToSingleFood(g.protein, 'protein'));
    if (g?.fat)     list.push(...gramsToSingleFood(g.fat,     'fat'));
    return list;
  };
  return {
    schema: SCHEMA_VERSION,
    date: v1Data?.date || todayKey(),
    target: toList(v1Data?.target),
    eaten: toList(v1Data?.eaten),
  };
}

// 读取今日饮食数据；跨天自动重置 eaten（target 保留）
export function getDiet() {
  const raw = readRaw();
  const today = todayKey();

  if (!raw) {
    return {
      schema: SCHEMA_VERSION,
      date: today,
      target: DEFAULT_TARGET_FOODS.map((f) => ({ ...f })),
      eaten: [],
    };
  }

  // 老 schema：先写回默认结构，异步迁移老数据
  if (raw.schema !== SCHEMA_VERSION) {
    const fallback = {
      schema: SCHEMA_VERSION,
      date: raw.date || today,
      target: DEFAULT_TARGET_FOODS.map((f) => ({ ...f })),
      eaten: [],
    };
    writeRaw(fallback);
    // 异步迁移（不阻塞首屏）
    import('./foodDatabase.js').then(({ gramsToSingleFood }) => {
      try {
        const migrated = migrateV1ToV2(raw, gramsToSingleFood);
        writeRaw(migrated);
      } catch {
        // 迁移失败则保持 fallback
      }
    });
    return fallback;
  }

  // 跨天：保留 target，eaten 归零
  if (raw.date !== today) {
    const cleanedTarget = toFoodList(raw.target);
    const next = {
      schema: SCHEMA_VERSION,
      date: today,
      target: cleanedTarget.length > 0 ? cleanedTarget : DEFAULT_TARGET_FOODS.map((f) => ({ ...f })),
      eaten: [],
    };
    writeRaw(next);
    return next;
  }

  // 正常路径
  const cleanedTarget = toFoodList(raw.target);
  return {
    schema: SCHEMA_VERSION,
    date: raw.date,
    target: cleanedTarget.length > 0 ? cleanedTarget : DEFAULT_TARGET_FOODS.map((f) => ({ ...f })),
    eaten: toFoodList(raw.eaten),
  };
}

// 保存今日目标（接收食物列表）
export function saveTarget(foodList) {
  const cur = getDiet();
  const next = {
    ...cur,
    target: toFoodList(foodList),
  };
  writeRaw(next);
  return next;
}

// 保存已吃（接收食物列表）
export function saveEaten(foodList) {
  const cur = getDiet();
  const next = {
    ...cur,
    eaten: toFoodList(foodList),
  };
  writeRaw(next);
  return next;
}

// 重置今日已吃（保留 target）
export function resetEaten() {
  const cur = getDiet();
  const next = {
    ...cur,
    eaten: [],
  };
  writeRaw(next);
  return next;
}

// 完全重置（target 也清空回默认，eaten 清零）
export function resetAll() {
  const next = {
    schema: SCHEMA_VERSION,
    date: todayKey(),
    target: DEFAULT_TARGET_FOODS.map((f) => ({ ...f })),
    eaten: [],
  };
  writeRaw(next);
  return next;
}

// 默认目标导出（供快捷键或重置使用）
export const DEFAULT_TARGET = DEFAULT_TARGET_FOODS;

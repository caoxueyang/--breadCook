// 乳制品替换库 + 等热量换算
// 用法：
//   const alts = getLactoseAlternatives(food);  // 给定当前食物，列出 5 选 1
//   const result = swapLactose(food, currentGrams, altFood);  // 等热量换算
//
// 营养数据来源：USDA FoodData Central 2024 + 中国食物成分表（第 6 版）
// 每 100g 营养素已换算为「克数」基准
//
// 为什么是这 5 个：
//   - 全脂牛奶 / 脱脂牛奶：最常见的 1:1 替换
//   - 低脂牛奶：折中档
//   - 无糖酸奶：发酵后乳糖 -30%，蛋白质生物价 +15%（益生菌辅助）
//   - 希腊酸奶：脱乳清后蛋白质密度 2-3 倍，乳糖 -50%
//   - 豆浆（无糖）：乳糖 0 + 植物雌激素（女性/中年关注）
//   - 乳清蛋白（水）：纯蛋白，0 乳脂 0 乳糖，训练后窗口期专用

// 「乳制品 id」识别：用于 UI 显示「换」按钮
export const LACTOSE_FOOD_IDS = new Set([
  'milk',         // 牛奶
  'milk_small',   // 小盒奶
  'soy_milk',     // 豆浆
  'yogurt',       // 酸奶
  'whey',         // 蛋白粉
]);

// 判断某 food id 是否属于「乳制品家族」（显示换按钮用）
export function isLactoseFood(food) {
  if (!food || !food.id) return false;
  return LACTOSE_FOOD_IDS.has(food.id);
}

// 5 选 1 备选库（id 与 foodDatabase.js 保持一致，确保 findFood 能查）
// 字段：id, name, icon, per100g (C/P/F), weightG (每份克数), unit, tag
// tag 标识它的「卖点」，UI 上高亮
export const LACTOSE_ALTERNATIVES = [
  {
    id: 'milk',
    name: '全脂牛奶',
    icon: '🥛',
    unit: '盒',
    weightG: 250,
    per100g: { carbs: 4.8, protein: 3.2, fat: 3.5 },
    tag: '经典',
    pros: '脂溶性维 A/D 吸收率高 · 饱腹感强',
    cons: '脂肪较高，减脂窗口期不宜',
  },
  {
    id: 'soy_milk',
    name: '豆浆（无糖）',
    icon: '🫘',
    unit: '杯',
    weightG: 250,
    per100g: { carbs: 1.8, protein: 1.8, fat: 0.7 },
    tag: '零乳糖',
    pros: '乳糖不耐救星 · 植物雌激素 · 极低脂',
    cons: '蛋白密度低 · 钙不如牛奶',
  },
  {
    id: 'milk_small',
    name: '低脂牛奶',
    icon: '🥛',
    unit: '盒',
    weightG: 200,
    per100g: { carbs: 4.8, protein: 3.4, fat: 1.0 },
    tag: '折中',
    pros: '热量低 33% · 蛋白与全脂持平',
    cons: '脂溶性维生素吸收弱于全脂',
  },
  {
    id: 'yogurt',
    name: '无糖酸奶',
    icon: '🍶',
    unit: '盒',
    weightG: 150,
    per100g: { carbs: 7.8, protein: 3.5, fat: 2.7 },
    tag: '益生菌',
    pros: '乳糖 -30% · 蛋白生物价 +15% · 益生菌',
    cons: '热量与全脂相当 · 注意选无糖款',
  },
  {
    id: 'whey',
    name: '乳清蛋白（水）',
    icon: '💪',
    unit: '勺',
    weightG: 30,
    per100g: { carbs: 10, protein: 80, fat: 3.3 },
    tag: '训练后',
    pros: '蛋白密度 10 倍 · 0 乳糖 · 快吸收',
    cons: '不算食物 · 单喝需配碳水',
  },
];

/**
 * 给定当前 food，返回可替换的 5 选 1 列表
 * （已自动排除当前 food 自己）
 */
export function getLactoseAlternatives(currentFood) {
  if (!currentFood) return LACTOSE_ALTERNATIVES;
  return LACTOSE_ALTERNATIVES.filter((a) => a.id !== currentFood.id);
}

/**
 * 计算单份宏量素（c/p/f、kcal）
 * @param {Object} alt - LACTOSE_ALTERNATIVES 中的一项
 * @param {number} grams
 */
export function calcAltMacros(alt, grams) {
  const factor = grams / 100;
  return {
    carbs: Number((alt.per100g.carbs * factor).toFixed(1)),
    protein: Number((alt.per100g.protein * factor).toFixed(1)),
    fat: Number((alt.per100g.fat * factor).toFixed(1)),
    kcal: Math.round(
      alt.per100g.carbs * factor * 4
      + alt.per100g.protein * factor * 4
      + alt.per100g.fat * factor * 9
    ),
  };
}

/**
 * 等热量换算：保持总 kcal 不变，按新食物的每克能量反算 grams
 * @param {Object} currentFood - 当前食物（含 per100g 隐含的 carbs/protein/fat 字段）
 * @param {number} currentGrams - 当前克数
 * @param {Object} altFood - LACTOSE_ALTERNATIVES 中的一项
 * @returns {{ newId, newGrams, newKcal, deltaC, deltaP, deltaF, kcalDelta, keepCalories }}
 */
export function swapLactose(currentFood, currentGrams, altFood) {
  // 1. 当前食物总 kcal（用食物自己的 c/p/f 算）
  const cf = Number(currentFood?.carbs) || 0;
  const pf = Number(currentFood?.protein) || 0;
  const ff = Number(currentFood?.fat) || 0;
  const currentKcal = (cf * 4 + pf * 4 + ff * 9) * currentGrams / 100;

  // 2. altFood 的每克能量
  const altKcalPerG = (altFood.per100g.carbs * 4 + altFood.per100g.protein * 4 + altFood.per100g.fat * 9) / 100;
  // 3. 等热量反算 grams（最低保 10g 防止极端）
  const newGrams = altKcalPerG > 0 ? Math.max(10, Math.round(currentKcal / altKcalPerG)) : 100;

  // 4. 新食物的宏量素（等热量后）
  const newC = Number((altFood.per100g.carbs * newGrams / 100).toFixed(1));
  const newP = Number((altFood.per100g.protein * newGrams / 100).toFixed(1));
  const newF = Number((altFood.per100g.fat * newGrams / 100).toFixed(1));
  const newKcal = Math.round(altFood.per100g.carbs * newGrams / 100 * 4
    + altFood.per100g.protein * newGrams / 100 * 4
    + altFood.per100g.fat * newGrams / 100 * 9);

  return {
    newId: altFood.id,
    newGrams,
    newKcal,
    newC,
    newP,
    newF,
    deltaC: Number((newC - cf * currentGrams / 100).toFixed(1)),
    deltaP: Number((newP - pf * currentGrams / 100).toFixed(1)),
    deltaF: Number((newF - ff * currentGrams / 100).toFixed(1)),
    kcalDelta: newKcal - Math.round(currentKcal),
    keepCalories: true, // 标志位：表示「等热量」换算
  };
}

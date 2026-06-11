/**
 * 威海应季食材月度数据
 *
 * 数据来源：威海本地应季蔬野菜/海鲜 + 威海本地应季水果 + 其他地区应季水果（产地）
 * 应季菜 = veggies + seafood（蔬菜野菜 + 威海应季海鲜）
 * 应季水果 = fruitsLocal（威海本地应季水果 + 其他产区）
 */

// 月份 -> 应季食材
// 1 月
// 2 月
// 3 月
// 4 月
// 5 月
// 6 月
// 7 月
// 8 月
// 9 月
// 10月
// 11月
// 12月
export const SEASONAL_DATA = {
  1: {
    veggies: ['大白菜', '萝卜', '菠菜', '生菜', '大葱', '土豆', '菜花'],
    seafood: ['乳山牡蛎', '扇贝', '带鱼', '鲅鱼', '海参'],
    fruitsLocal: ['红颜草莓（温室）'],
    fruitsOther: [
      { name: '春见粑粑柑', origin: '四川蒲江' },
      { name: '永兴冰糖橙', origin: '湖南宜章' },
      { name: '四会沙糖桔', origin: '广西四会' },
    ],
  },
  2: {
    veggies: ['菠菜', '茼蒿', '荠菜', '芹菜', '大蒜苗', '菜苔', '莴笋'],
    seafood: ['牡蛎', '扇贝', '海虹', '鹰爪虾'],
    fruitsLocal: ['红颜草莓（温室）'],
    fruitsOther: [
      { name: '千禧圣女果', origin: '海南陵水' },
      { name: '黑皮甘蔗', origin: '广西贵港' },
      { name: '黑金刚莲雾', origin: '海南琼海' },
    ],
  },
  3: {
    veggies: ['荠菜', '香椿', '婆婆丁', '蒲公英'],
    seafood: ['皮皮虾', '海虹', '海肠'],
    fruitsLocal: ['露天草莓（红颜）'],
    fruitsOther: [
      { name: '美早樱桃', origin: '四川攀枝花' },
      { name: '金钻菠萝', origin: '广东徐闻' },
      { name: '蜜丝青枣', origin: '云南西双版纳' },
    ],
  },
  4: {
    veggies: ['山苜楂', '马齿苋', '香椿', '小油菜'],
    seafood: ['皮皮虾', '爬虾', '面条鱼'],
    fruitsLocal: ['美早樱桃（温室）', '红颜草莓（尾期）'],
    fruitsOther: [
      { name: '解放钟枇杷', origin: '福建云霄' },
      { name: '金煌贵妃芒', origin: '海南三亚' },
      { name: '金钻凤梨', origin: '广东湛江' },
    ],
  },
  5: {
    veggies: ['黄瓜', '芸豆', '莴苣', '小葱'],
    seafood: ['章鱼', '八带', '虾虎', '偏口鱼', '虎头蟹'],
    fruitsLocal: ['美早樱桃', '蓝丰蓝莓'],
    fruitsOther: [
      { name: '妃子笑荔枝', origin: '广东茂名' },
      { name: '东魁杨梅', origin: '浙江仙居' },
      { name: '鹰嘴桃', origin: '广东连平' },
    ],
  },
  6: {
    veggies: ['菠菜', '油菜', '茄子', '芸豆', '空心菜'],
    seafood: ['黄花鱼', '扇贝', '海胆', '蛏子'],
    fruitsLocal: ['美早樱桃（尾期）', '蓝丰蓝莓', '早春红玉西瓜'],
    fruitsOther: [
      { name: '桂味荔枝', origin: '广东湛江' },
      { name: '鸡心黄皮', origin: '广东郁南' },
      { name: '靖州杨梅', origin: '湖南怀化靖州' },
    ],
  },
  7: {
    veggies: ['茄子', '辣椒', '豆角', '空心菜', '苋菜'],
    seafood: ['黄花鱼', '海胆', '鲍鱼', '扇贝'],
    fruitsLocal: ['甘美西瓜', '哈密瓜（早熟）', '巨峰葡萄'],
    fruitsOther: [
      { name: '西州蜜哈密瓜', origin: '新疆哈密' },
      { name: '吐鲁番葡萄', origin: '新疆吐鲁番' },
      { name: '锦绣黄桃', origin: '安徽砀山' },
    ],
  },
  8: {
    veggies: ['早秋白菜', '早秋萝卜', '秋葵', '丝瓜'],
    seafood: ['对虾', '蛏子', '海胆', '鱿鱼'],
    fruitsLocal: ['巨峰葡萄', '早酥梨', '甘美西瓜'],
    fruitsOther: [
      { name: '石硖龙眼', origin: '广东高州' },
      { name: '翁源三华李', origin: '广东翁源' },
      { name: '下野地西瓜', origin: '新疆下野地' },
    ],
  },
  9: {
    veggies: ['莲藕', '茭白', '南瓜', '菠菜'],
    seafood: ['梭子蟹', '带鱼', '偏口', '鲅鱼'],
    fruitsLocal: ['波姬红无花果', '嘎啦苹果', '巨峰葡萄（尾期）'],
    fruitsOther: [
      { name: '突尼斯软籽石榴', origin: '四川会理' },
      { name: '翠香猕猴桃', origin: '陕西周至' },
      { name: '琯溪蜜柚', origin: '福建平和' },
    ],
  },
  10: {
    veggies: ['白菜', '萝卜', '红薯', '莲藕', '茄子', '芋头'],
    seafood: ['梭子蟹', '八爪鱼', '虾怪', '牙片鱼'],
    fruitsLocal: ['红富士苹果', '沾化冬枣（鲜）'],
    fruitsOther: [
      { name: '广西沙田柚', origin: '广西容县' },
      { name: '赣南脐橙（早摘）', origin: '江西赣州' },
      { name: '大荔冬枣', origin: '陕西大荔' },
    ],
  },
  11: {
    veggies: ['白菜', '萝卜', '莲藕', '南瓜', '山药', '卷心菜', '茭白', '花菜', '菠菜', '茼蒿'],
    seafood: ['带鱼', '偏口', '鲳鱼', '贝类'],
    fruitsLocal: ['红富士苹果', '大山楂'],
    fruitsOther: [
      { name: '纽荷尔脐橙', origin: '湖北秭归' },
      { name: '黑皮甘蔗', origin: '云南红河' },
      { name: '恭城月柿', origin: '广西恭城' },
    ],
  },
  12: {
    veggies: ['大白菜', '萝卜', '大葱', '花菜', '土豆'],
    seafood: ['乳山牡蛎', '扇贝', '带鱼', '海参', '鲅鱼'],
    fruitsLocal: ['红富士苹果', '红颜草莓（温室）'],
    fruitsOther: [
      { name: '丹东红颜草莓', origin: '辽宁丹东' },
      { name: '武鸣沃柑', origin: '广西武鸣' },
      { name: '爱媛果冻橙', origin: '四川眉山' },
    ],
  },
};

/** 获取当前月份 1-12 */
export function getCurrentMonth() {
  return new Date().getMonth() + 1;
}

/** 获取某月及其前后 1 个月（3 个月窗口）。如 6 月 -> [5, 6, 7]；1 月 -> [12, 1, 2]；12 月 -> [11, 12, 1] */
export function getNeighborMonths(month) {
  const m = month || getCurrentMonth();
  const prev = m === 1 ? 12 : m - 1;
  const next = m === 12 ? 1 : m + 1;
  return [prev, m, next];
}

/** 3 个月窗口内的应季食材（按月分块，不合并）。返回结构: { months, byMonth: [{ month, veggies, seafood, fruitsLocal, fruitsOther }] } */
export function getSeasonalData(month) {
  const months = getNeighborMonths(month);
  const byMonth = months.map(m => ({
    month: m,
    veggies: SEASONAL_DATA[m]?.veggies || [],
    seafood: SEASONAL_DATA[m]?.seafood || [],
    fruitsLocal: SEASONAL_DATA[m]?.fruitsLocal || [],
    fruitsOther: SEASONAL_DATA[m]?.fruitsOther || [],
  }));
  return { months, byMonth };
}

/** 3 个月窗口内合并的应季菜食材名（去重）。用于菜品匹配 */
export function getSeasonalDishIngredients(month) {
  const data = getSeasonalData(month);
  const seen = new Set();
  const out = [];
  data.byMonth.forEach(({ veggies, seafood }) => {
    [...veggies, ...seafood].forEach(name => {
      if (name && !seen.has(name)) {
        seen.add(name);
        out.push(name);
      }
    });
  });
  return out;
}

/** 3 个月窗口内合并的应季水果食材名（去重）。用于菜品匹配 */
export function getSeasonalFruitIngredients(month) {
  const data = getSeasonalData(month);
  const seen = new Set();
  const out = [];
  data.byMonth.forEach(({ fruitsLocal, fruitsOther }) => {
    [...fruitsLocal, ...fruitsOther.map(f => (typeof f === 'string' ? f : f.name))].forEach(name => {
      if (name && !seen.has(name)) {
        seen.add(name);
        out.push(name);
      }
    });
  });
  return out;
}

/** 提取菜品的"材料"段 */
function extractIngredientsText(dish) {
  if (!dish || !dish.recipe) return '';
  const m = dish.recipe.match(/材料[::]([\s\S]*?)(?:\n\n|$)/);
  return m ? m[1] : '';
}

/** 判断一道菜是否匹配应季食材列表（任一应季食材出现在菜品的"材料"中即算） */
export function dishMatchesSeasonal(dish, ingredients) {
  if (!dish || !ingredients || ingredients.length === 0) return false;
  const text = extractIngredientsText(dish);
  if (!text) return false;
  const lower = text.toLowerCase();
  return ingredients.some(name => lower.includes(String(name).toLowerCase()));
}

// 食物数据库：每个食物包含「单位 / 份量规格 / 三大营养素」
// size 字段标注每份的实际重量或容量（如 "200g/根"、"250ml/盒"），让用户清楚「1份到底是多少」
// representativeId：表示该营养素的「通俗参考食物」，用于「还差 ≈ 6 碗米饭」这类表达

export const FOOD_DB = {
  carbs: {
    label: '碳水',
    icon: '🍚',
    key: 'carbs',
    representativeId: 'rice', // 通俗参考：米饭（最常吃、众认知度高）
    alternativeRepId: 'mantou', // 备用参考：馒头（1个 = 100g，也主要是碳水）
    foods: [
      { id: 'rice',         name: '米饭',     unit: '碗',   size: '150g/碗（标准饭碗·5寸·盛满）',  carbs: 45, protein: 4,   fat: 0.5 },
      { id: 'rice_small',   name: '米饭（小碗）', unit: '碗', size: '100g/碗（4寸碗·七分满）',   carbs: 30, protein: 3,   fat: 0.3 },
      { id: 'rice_big',     name: '米饭（大碗）', unit: '碗', size: '220g/碗（6寸碗·漫出来）',   carbs: 66, protein: 6,   fat: 0.7 },
      { id: 'mantou',       name: '馒头',     unit: '个',   size: '100g/个（成人拳头大小）',         carbs: 47, protein: 7,   fat: 0.5 },
      { id: 'bread',        name: '面包',     unit: '片',   size: '30g/片（吐司·3片=1人份）',     carbs: 15, protein: 2.5, fat: 1   },
      { id: 'noodle',       name: '面条',     unit: '碗',   size: '100g/碗（熟重·干面50g）',        carbs: 25, protein: 5,   fat: 1   },
      { id: 'sweet_potato', name: '红薯',     unit: '个',   size: '200g/个（中等·女士拳头）',       carbs: 40, protein: 2,   fat: 0   },
      { id: 'corn',         name: '玉米',     unit: '根',   size: '200g/根（带棒·净粒约120g）',   carbs: 30, protein: 3,   fat: 1   },
      { id: 'corn_kernal',  name: '玉米粒',   unit: '碗',   size: '100g/碗（去棒·煮熟）',         carbs: 20, protein: 2,   fat: 0.5 },
      { id: 'potato',       name: '土豆',     unit: '个',   size: '150g/个（中等·鸡蛋大）',         carbs: 25, protein: 2,   fat: 0   },
      { id: 'dumpling',     name: '饺子',     unit: '10个', size: '300g/10个（中等馅）',           carbs: 60, protein: 12,  fat: 8   },
      { id: 'porridge',     name: '粥',       unit: '碗',   size: '400ml/碗（米汤·稀饭）',         carbs: 30, protein: 2,   fat: 0   },
      { id: 'baozi',        name: '包子',     unit: '个',   size: '100g/个（肉包·掌心大小）',       carbs: 30, protein: 5,   fat: 3   },
      { id: 'oat',          name: '燕麦',     unit: '碗',   size: '30g/碗（干重·即食麦片）',       carbs: 20, protein: 4,   fat: 2   },
    ],
  },
  protein: {
    label: '蛋白质',
    icon: '🥩',
    key: 'protein',
    representativeId: 'chicken_thigh',  // 通俗参考：鸡大腿（去骨80g，1个1个算）
    alternativeRepId: 'chicken_drumstick', // 备用参考：鸡小腿（去骨50g，啃骨头也能凑数）
    foods: [
      { id: 'chicken_thigh',    name: '鸡大腿',     unit: '个',    size: '80g/个（去骨·掌心大小）',  carbs: 0,   protein: 16, fat: 7  },
      { id: 'chicken_drumstick',name: '鸡小腿',     unit: '个',    size: '50g/个（带骨去骨25g）',  carbs: 0,   protein: 11, fat: 3  },
      { id: 'chicken_leg',      name: '鸡全腿',     unit: '个',    size: '100g/个（大腿+小腿）',    carbs: 0,   protein: 20, fat: 8  },
      { id: 'chicken_breast',   name: '鸡胸肉',     unit: '块',    size: '100g/块',                carbs: 0,   protein: 23, fat: 2  },
      { id: 'chicken_wing',     name: '鸡翅',       unit: '个',    size: '30g/个（翅中）',          carbs: 0,   protein: 6,  fat: 4  },
      { id: 'egg',              name: '鸡蛋',       unit: '个',    size: '50g/个（带壳）',           carbs: 0.5, protein: 7,  fat: 5  },
      { id: 'egg_white',        name: '蛋白',       unit: '个',    size: '30g/个（蛋清）',           carbs: 0.2, protein: 3,  fat: 0  },
      { id: 'milk',             name: '牛奶',       unit: '盒',    size: '250ml/盒',                 carbs: 12,  protein: 8,  fat: 8  },
      { id: 'milk_small',       name: '小盒奶',     unit: '盒',    size: '200ml/盒',                 carbs: 10,  protein: 6,  fat: 6  },
      { id: 'soy_milk',         name: '豆浆',       unit: '杯',    size: '250ml/杯（无糖）',         carbs: 5,   protein: 5,  fat: 2  },
      { id: 'shrimp',           name: '虾',         unit: '10只',  size: '100g/10只（去壳）',         carbs: 0,   protein: 18, fat: 1  },
      { id: 'fish',             name: '鱼',         unit: '块',    size: '100g/块',                  carbs: 0,   protein: 20, fat: 5  },
      { id: 'beef',             name: '牛肉',       unit: '块',    size: '100g/块（瘦）',            carbs: 0,   protein: 20, fat: 8  },
      { id: 'pork_lean',        name: '瘦猪肉',     unit: '块',    size: '100g/块',                  carbs: 0,   protein: 20, fat: 6  },
      { id: 'tofu',             name: '豆腐',       unit: '盒',    size: '400g/盒（北豆腐）',         carbs: 4,   protein: 16, fat: 8  },
      { id: 'yogurt',           name: '酸奶',       unit: '盒',    size: '150g/盒',                  carbs: 12,  protein: 8,  fat: 4  },
      { id: 'whey',             name: '蛋白粉',     unit: '勺',    size: '30g/勺（1份）',            carbs: 3,   protein: 24, fat: 1  },
    ],
  },
  fat: {
    label: '脂肪',
    icon: '🥑',
    key: 'fat',
    representativeId: 'oil',           // 通俗参考：食用油（100% 脂肪，1勺=10g，准准对应）
    alternativeRepId: 'walnut',        // 备用参考：核桃（吃热爱吃零食的人才合逻辑，但量看起来吓人）
    foods: [
      { id: 'oil',           name: '食用油',   unit: '勺',   size: '10g/勺（约10ml）',   carbs: 0,  protein: 0,  fat: 10 },
      { id: 'oil_big',       name: '食用油',   unit: '汤匙', size: '15g/汤匙',          carbs: 0,  protein: 0,  fat: 15 },
      { id: 'butter',        name: '黄油',     unit: '勺',   size: '10g/勺',            carbs: 0,  protein: 0,  fat: 8  },
      { id: 'nuts',          name: '坚果',     unit: '把',   size: '30g/把（混合）',    carbs: 6,  protein: 6,  fat: 15 },
      { id: 'walnut',        name: '核桃',     unit: '把',   size: '30g/把（约8颗）',   carbs: 4,  protein: 5,  fat: 20 },
      { id: 'cashew',        name: '腰果',     unit: '把',   size: '30g/把（约15颗）',  carbs: 8,  protein: 6,  fat: 14 },
      { id: 'peanut',        name: '花生',     unit: '把',   size: '30g/把',            carbs: 6,  protein: 8,  fat: 14 },
      { id: 'almond',        name: '杏仁',     unit: '把',   size: '20g/把（约15颗）',  carbs: 4,  protein: 4,  fat: 10 },
      { id: 'bacon',         name: '培根',     unit: '片',   size: '10g/片',            carbs: 0,  protein: 3,  fat: 4  },
      { id: 'pork_belly',    name: '五花肉',   unit: '块',   size: '100g/块',           carbs: 0,  protein: 10, fat: 30 },
      { id: 'peanut_butter', name: '花生酱',   unit: '勺',   size: '15g/勺',            carbs: 4,  protein: 4,  fat: 8  },
      { id: 'chips',         name: '薯片',     unit: '袋',   size: '50g/袋（小包）',    carbs: 30, protein: 3,  fat: 15 },
      { id: 'avocado',       name: '牛油果',   unit: '个',   size: '200g/个（去核）',   carbs: 12, protein: 4,  fat: 30 },
      { id: 'cheese',        name: '奶酪',     unit: '片',   size: '20g/片',            carbs: 1,  protein: 7,  fat: 9  },
      { id: 'olive',         name: '橄榄',     unit: '颗',   size: '5g/颗',             carbs: 0,  protein: 0,  fat: 1  },
      { id: 'salad_dressing',name: '沙拉酱',   unit: '勺',   size: '15g/勺',            carbs: 2,  protein: 0,  fat: 8  },
    ],
  },
  // 新鲜蔬菜：低热量食物，重点是记录「我今天吃了多少蔬菜」，对三大营养素贡献微小
  // 代表参考设为 null（不用于"≈ X 蔬菜"换算，不参与宏量营养素计算）
  vegetable: {
    label: '蔬菜',
    icon: '🥬',
    key: 'vegetable',
    representativeId: null,
    foods: [
      { id: 'cucumber',     name: '黄瓜',       unit: '根',   size: '200g/根（中等·15-20cm）',  carbs: 4,   protein: 1,   fat: 0  },
      { id: 'tomato',       name: '番茄',       unit: '个',   size: '150g/个（中等·粉拳大）',  carbs: 6,   protein: 1.5, fat: 0  },
      { id: 'cherry_tomato',name: '圣女果',     unit: '10个', size: '100g/10个',                carbs: 5,   protein: 1,   fat: 0  },
      { id: 'lettuce',      name: '生菜',       unit: '碗',   size: '100g/碗（包饭生菜）',       carbs: 2,   protein: 1,   fat: 0  },
      { id: 'cabbage',      name: '白菜',       unit: '碗',   size: '200g/碗（炒一碗）',         carbs: 5,   protein: 2,   fat: 0  },
      { id: 'spinach',      name: '菠菜',       unit: '碗',   size: '150g/碗（烫熟）',           carbs: 4,   protein: 3,   fat: 0  },
      { id: 'broccoli',     name: '西兰花',     unit: '朵',   size: '150g/朵（炒一盘）',         carbs: 6,   protein: 4,   fat: 0  },
      { id: 'cauliflower',  name: '菜花',       unit: '朵',   size: '150g/朵（炒一盘）',         carbs: 6,   protein: 3,   fat: 0  },
      { id: 'eggplant',     name: '茄子',       unit: '根',   size: '200g/根（中等）',            carbs: 8,   protein: 2,   fat: 0  },
      { id: 'green_pepper', name: '青椒',       unit: '个',   size: '50g/个',                     carbs: 2,   protein: 0.5, fat: 0  },
      { id: 'red_pepper',   name: '红椒',       unit: '个',   size: '80g/个',                     carbs: 4,   protein: 1,   fat: 0  },
      { id: 'mushroom',     name: '蘑菇',       unit: '碗',   size: '100g/碗（炒一碗）',         carbs: 3,   protein: 3,   fat: 0  },
      { id: 'carrot',       name: '胡萝卜',     unit: '根',   size: '100g/根（中等）',            carbs: 8,   protein: 1,   fat: 0  },
      { id: 'onion',        name: '洋葱',       unit: '个',   size: '150g/个（中等）',            carbs: 12,  protein: 2,   fat: 0  },
      { id: 'bean_sprout',  name: '豆芽',       unit: '碗',   size: '100g/碗（炒一碗）',         carbs: 4,   protein: 2,   fat: 0  },
      { id: 'kelp',         name: '海带',       unit: '碗',   size: '100g/碗（凉拌）',           carbs: 3,   protein: 1,   fat: 0  },
      { id: 'winter_melon', name: '冬瓜',       unit: '碗',   size: '200g/碗（炒一碗）',         carbs: 4,   protein: 1,   fat: 0  },
      { id: 'bitter_melon', name: '苦瓜',       unit: '根',   size: '150g/根',                    carbs: 5,   protein: 1,   fat: 0  },
      { id: 'celery',       name: '芹菜',       unit: '把',   size: '100g/把（3-4 根）',        carbs: 3,   protein: 1,   fat: 0  },
      { id: 'water_spinach',name: '空心菜',     unit: '把',   size: '200g/把（炒一盘）',         carbs: 5,   protein: 2,   fat: 0  },
      { id: 'radish',       name: '白萝卜',     unit: '个',   size: '200g/个（中等）',            carbs: 8,   protein: 1,   fat: 0  },
    ],
  },
  // 常见菜品（混搭型）— 按 1 份=200g 估算，加多了油/糖所以三大营养素都有
  dishes: {
    label: '菜品',
    icon: '🍱',
    key: 'dishes',
    representativeId: null, // 菜品是混合型，不用于“≈ X 份”表达
    foods: [
      { id: 'tomato_egg',     name: '西红柿炒蛋',     unit: '份',   size: '200g/份',          carbs: 12, protein: 14, fat: 18 },
      { id: 'tofu_skin',      name: '凉拌豆腐皮',     unit: '份',   size: '200g/份',          carbs: 8,  protein: 20, fat: 8  },
      { id: 'potato_stir',    name: '酸辣土豆丝',     unit: '份',   size: '200g/份',          carbs: 30, protein: 4,  fat: 10 },
      { id: 'cucumber_stir',  name: '拍黄瓜',         unit: '份',   size: '200g/份',          carbs: 8,  protein: 3,  fat: 6  },
      { id: 'greens',         name: '炒青菜',         unit: '份',   size: '200g/份',          carbs: 8,  protein: 3,  fat: 8  },
      { id: 'beef_noodle',    name: '牛肉面',         unit: '碗',   size: '500g/碗（带汤）',   carbs: 60, protein: 25, fat: 15 },
      { id: 'fried_rice',     name: '炒饭',           unit: '份',   size: '300g/份',          carbs: 80, protein: 15, fat: 18 },
      { id: 'dumpling_soup',  name: '馄饨',           unit: '碗',   size: '400g/碗（带汤）',   carbs: 45, protein: 18, fat: 10 },
      { id: 'congee',         name: '皮蛋瘦肉粥',     unit: '碗',   size: '500g/碗',          carbs: 50, protein: 15, fat: 5  },
      { id: 'hamburger',      name: '汉堡',           unit: '个',   size: '200g/个',          carbs: 40, protein: 20, fat: 20 },
      { id: 'fried_chicken',  name: '炸鸡',           unit: '块',   size: '100g/块',          carbs: 8,  protein: 20, fat: 20 },
      { id: 'french_fries',   name: '薯条',           unit: '份',   size: '100g/份',          carbs: 35, protein: 3,  fat: 12 },
      { id: 'pizza',          name: '披萨',           unit: '块',   size: '100g/块',          carbs: 25, protein: 10, fat: 12 },
      { id: 'sushi',          name: '寿司',           unit: '8个',  size: '200g/8个',         carbs: 40, protein: 10, fat: 5  },
    ],
  },
};

// 取所有食物的扁平列表（含分类信息），供统一选择器使用
export function getAllFoods() {
  const all = [];
  for (const [catKey, cat] of Object.entries(FOOD_DB)) {
    for (const f of cat.foods) {
      all.push({ ...f, category: catKey, categoryLabel: cat.label, categoryIcon: cat.icon });
    }
  }
  return all;
}

// 在全库中按 id 找食物
export function findFood(id) {
  for (const cat of Object.values(FOOD_DB)) {
    const f = cat.foods.find((x) => x.id === id);
    if (f) return { ...f, category: cat.key };
  }
  return null;
}

// 把「食物+份量」列表算成克数（按指定营养素 key：carbs/protein/fat）
export function calcGrams(foodList, key) {
  if (!Array.isArray(foodList)) return 0;
  return foodList.reduce((sum, item) => {
    const food = findFood(item.id);
    if (!food) return sum;
    const per = Number(food[key]) || 0;
    const qty = Number(item.qty) || 0;
    return sum + per * qty;
  }, 0);
}

// 把「食物+份量」列表算成总卡路里（用 4/4/9 系数）
export function calcKcalFromFoodList(foodList) {
  const c = calcGrams(foodList, 'carbs');
  const p = calcGrams(foodList, 'protein');
  const f = calcGrams(foodList, 'fat');
  return c * 4 + p * 4 + f * 9;
}

// 从 size 字段中提取单位重量
// 例如 "150g/碗（焦）" → 150 + "g"
//     "250ml/盒" → 250 + "ml"
//     "30g/把（约8颗）" → 30 + "g"
function parseSizeUnit(size) {
  if (!size) return null;
  const m = String(size).match(/(\d+(?:\.\d+)?)\s*(g|ml)\b/i);
  if (!m) return null;
  return { value: parseFloat(m[1]), unit: m[2].toLowerCase() };
}

// 计算单个代表食物的引用
function calcRepRef(rep, grams, key) {
  if (!rep || !rep[key]) return null;
  // 保留下 1 位小数（避免 0.5 个鸡腿被四含五入成 1 个）
  const qtyRaw = grams / rep[key];
  const qty = qtyRaw < 0.05 ? 0 : Math.round(qtyRaw * 10) / 10;
  if (qty <= 0) return null;
  const sizeInfo = parseSizeUnit(rep.size);
  const totalUnitGram = sizeInfo ? Math.round(qty * sizeInfo.value) : 0;
  const totalUnit = sizeInfo?.unit || '';
  return {
    colloquial: `${qty}${rep.unit}${rep.name}`,
    precise: sizeInfo ? `共 ${totalUnitGram}${totalUnit}` : '',
    qty,
    totalUnitGram,
    totalUnit,
    rep,
  };
}

// 把克数换算成「≈ 5勺食用油 或 2.5把核桃」类的多个代表参考
// 返回字符串或 { primary, alternative } 对象（传 asObject=true 时）
export function describeMacro(grams, key, asObject = false) {
  const g = Math.round(Number(grams) || 0);
  const emptyObj = { primary: null, alternative: null };
  if (g <= 0) return asObject ? emptyObj : '';
  const cat = FOOD_DB[key];
  if (!cat) return asObject ? emptyObj : '';

  // 主参考：representativeId
  const repPrimary = cat.foods.find((f) => f.id === cat.representativeId)
    || cat.foods.slice().sort((a, b) => (b[key] || 0) - (a[key] || 0))[0];
  const primary = calcRepRef(repPrimary, g, key);

  // 备用参考：alternativeRepId（如未指定则选下一个同类食品）
  let repAlt = null;
  if (cat.alternativeRepId) {
    repAlt = cat.foods.find((f) => f.id === cat.alternativeRepId);
  }
  if (!repAlt) {
    // 退化：找另一个高含量食物（排除主参考）
    repAlt = cat.foods
      .filter((f) => f.id !== repPrimary?.id && f[key] > 0)
      .sort((a, b) => (b[key] || 0) - (a[key] || 0))[0];
  }
  const alternative = calcRepRef(repAlt, g, key);

  if (asObject) {
    return { primary, alternative };
  }

  // 合成最终提示
  if (!primary) return '';
  if (!alternative || alternative.colloquial === primary.colloquial) {
    return primary.precise
      ? `≈ ${primary.colloquial}（${primary.precise}）`
      : `≈ ${primary.colloquial}`;
  }
  return primary.precise
    ? `≈ ${primary.colloquial}（${primary.precise}）或 ${alternative.colloquial}${alternative.precise ? `（${alternative.precise}）` : ''}`
    : `≈ ${primary.colloquial}或 ${alternative.colloquial}`;
}

// 备份/迁移用：把克数尽量"反推"成一条食物（用于打开表单时预填）
export function gramsToSingleFood(grams, key) {
  const g = Math.round(Number(grams) || 0);
  if (g <= 0) return [];
  const cat = FOOD_DB[key];
  if (!cat) return [];
  // 优先用指定的代表食物；找不到则退化用单位克数最大的
  let rep = cat.foods.find((f) => f.id === cat.representativeId);
  if (!rep) {
    rep = cat.foods.slice().sort((a, b) => (b[key] || 0) - (a[key] || 0))[0];
  }
  if (!rep || !rep[key]) return [];
  const qty = Math.max(1, Math.round(g / rep[key]));
  return [{ id: rep.id, qty }];
}

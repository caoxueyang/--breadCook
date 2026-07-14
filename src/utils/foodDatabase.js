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
      { id: 'rice',         name: '米饭',     unit: '碗',   size: '150g/碗（标准饭碗·5寸·盛满）', weightG: 150,  carbs: 45, protein: 4,   fat: 0.5 },
      { id: 'rice_small',   name: '米饭（小碗）', unit: '碗', size: '100g/碗（4寸碗·七分满）', weightG: 100,   carbs: 30, protein: 3,   fat: 0.3 },
      { id: 'rice_big',     name: '米饭（大碗）', unit: '碗', size: '220g/碗（6寸碗·漫出来）', weightG: 220,   carbs: 66, protein: 6,   fat: 0.7 },
      { id: 'mantou',       name: '馒头',     unit: '个',   size: '100g/个（成人拳头大小）', weightG: 100,         carbs: 47, protein: 7,   fat: 0.5 },
      { id: 'bread',        name: '面包',     unit: '片',   size: '30g/片（吐司·3片=1人份）', weightG: 30,     carbs: 15, protein: 2.5, fat: 1   },
      { id: 'noodle',       name: '面条',     unit: '碗',   size: '100g/碗（熟重·干面50g）', weightG: 100,        carbs: 25, protein: 5,   fat: 1   },
      { id: 'sweet_potato',        name: '红薯',         unit: '个',   size: '200g/个（中等·女士拳头）', weightG: 200,       carbs: 40, protein: 2,   fat: 0   },
      { id: 'purple_sweet_potato', name: '紫薯',         unit: '个',   size: '200g/个（中等·紫薯王）', weightG: 200,        carbs: 35, protein: 3.2, fat: 0   },
      { id: 'corn',         name: '玉米',     unit: '根',   size: '200g/根（带棒·净粒约120g）', weightG: 200,   carbs: 30, protein: 3,   fat: 1   },
      { id: 'corn_kernal',  name: '玉米粒',   unit: '碗',   size: '100g/碗（去棒·煮熟）', weightG: 100,         carbs: 20, protein: 2,   fat: 0.5 },
      { id: 'potato',       name: '土豆',     unit: '个',   size: '150g/个（中等·鸡蛋大）', weightG: 150,         carbs: 25, protein: 2,   fat: 0   },
      { id: 'dumpling',     name: '饺子',     unit: '10个', size: '300g/10个（中等馅）', weightG: 300,           carbs: 60, protein: 12,  fat: 8   },
      { id: 'porridge',     name: '粥',       unit: '碗',   size: '400ml/碗（米汤·稀饭）', weightG: 400,         carbs: 30, protein: 2,   fat: 0   },
      { id: 'baozi',        name: '包子',     unit: '个',   size: '100g/个（肉包·掌心大小）', weightG: 100,       carbs: 30, protein: 5,   fat: 3   },
      { id: 'oat',          name: '燕麦（即食）', unit: '碗',   size: '30g/碗（干重·即食麦片·GI高）', weightG: 30, carbs: 20, protein: 4,   fat: 2   },
      { id: 'rolled_oat',   name: '燕麦（需煮）', unit: '碗',   size: '40g/碗（干重·隔夜燕麦·GI低）', weightG: 40, carbs: 25, protein: 5,   fat: 3   },
    ],
  },
  protein: {
    label: '蛋白质',
    icon: '🥩',
    key: 'protein',
    representativeId: 'chicken_thigh',  // 通俗参考：鸡大腿（去骨80g，1个1个算）
    alternativeRepId: 'chicken_drumstick', // 备用参考：鸡小腿（去骨50g，啃骨头也能凑数）
    secondaryRepIds: ['milk', 'shrimp'],   // 三级参考：牛奶（8g/盒）+ 虾（18g/10只），补足表达丰富度
    foods: [
      { id: 'chicken_thigh',    name: '鸡大腿',     unit: '个',    size: '80g/个（去骨·掌心大小）', weightG: 80,  carbs: 0,   protein: 16, fat: 7  },
      { id: 'chicken_drumstick',name: '鸡小腿',     unit: '个',    size: '50g/个（带骨去骨25g）', weightG: 50,  carbs: 0,   protein: 11, fat: 3  },
      { id: 'chicken_leg',      name: '鸡全腿',     unit: '个',    size: '100g/个（大腿+小腿）', weightG: 100,    carbs: 0,   protein: 20, fat: 8  },
      { id: 'chicken_breast',   name: '鸡胸肉',     unit: '块',    size: '100g/块', weightG: 100,                carbs: 0,   protein: 23, fat: 2  },
      { id: 'chicken_wing',     name: '鸡翅',       unit: '个',    size: '30g/个（翅中）', weightG: 30,          carbs: 0,   protein: 6,  fat: 4  },
      { id: 'egg',              name: '鸡蛋',       unit: '个',    size: '50g/个（带壳）', weightG: 50,           carbs: 0.5, protein: 7,  fat: 5  },
      { id: 'egg_white',        name: '蛋白',       unit: '个',    size: '30g/个（蛋清）', weightG: 30,           carbs: 0.2, protein: 3,  fat: 0  },
      { id: 'milk',             name: '牛奶',       unit: '盒',    size: '250ml/盒', weightG: 250,                 carbs: 12,  protein: 8,  fat: 8  },
      { id: 'milk_small',       name: '小盒奶',     unit: '盒',    size: '200ml/盒', weightG: 200,                 carbs: 10,  protein: 6,  fat: 6  },
      { id: 'soy_milk',         name: '豆浆',       unit: '杯',    size: '250ml/杯（无糖）', weightG: 250,         carbs: 5,   protein: 5,  fat: 2  },
      { id: 'shrimp',           name: '虾',         unit: '10只',  size: '100g/10只（去壳）', weightG: 100,         carbs: 0,   protein: 18, fat: 1  },
      { id: 'fish',             name: '鱼',         unit: '块',    size: '100g/块', weightG: 100,                  carbs: 0,   protein: 20, fat: 5  },
      { id: 'beef',             name: '牛肉',       unit: '块',    size: '100g/块（瘦）', weightG: 100,            carbs: 0,   protein: 20, fat: 8  },
      { id: 'pork_lean',        name: '瘦猪肉',     unit: '块',    size: '100g/块', weightG: 100,                  carbs: 0,   protein: 20, fat: 6  },
      { id: 'tofu',             name: '豆腐',       unit: '盒',    size: '400g/盒（北豆腐）', weightG: 400,         carbs: 4,   protein: 16, fat: 8  },
      { id: 'yogurt',           name: '酸奶',       unit: '盒',    size: '150g/盒', weightG: 150,                  carbs: 12,  protein: 8,  fat: 4  },
      { id: 'whey',             name: '蛋白粉',     unit: '勺',    size: '30g/勺（1 份）', weightG: 30,            carbs: 3,   protein: 24, fat: 1  },
      // === 东北菜/菜单补充 ===
      { id: 'ribs',             name: '排骨',       unit: '块',    size: '100g/块（带骨·含 50g 肉）', weightG: 100,  carbs: 0,   protein: 18, fat: 12 },
      { id: 'lamb',             name: '羊肉',       unit: '100g',  size: '100g（羊里脊·瘦）', weightG: 100,           carbs: 0,   protein: 19, fat: 13 },
      { id: 'chicken_wing_mid', name: '鸡翅中',     unit: '个',    size: '30g/个', weightG: 30,                       carbs: 0,   protein: 6,  fat: 2.5},
      { id: 'century_egg',      name: '皮蛋',       unit: '个',    size: '60g/个（松花皮蛋）', weightG: 60,           carbs: 1,   protein: 7,  fat: 9  },
      { id: 'cured_pork',       name: '咸肉',       unit: '块',    size: '100g/块（腌笃鲜用）', weightG: 100,         carbs: 1,   protein: 18, fat: 36 },
      // === 补铁食物 ===
      { id: 'pork_liver',       name: '猪肝',       unit: '块',    size: '100g/块', weightG: 100,                   carbs: 5,   protein: 21, fat: 5  },
      { id: 'duck_blood',       name: '鸭血',       unit: '块',    size: '100g/块', weightG: 100,                   carbs: 0.4, protein: 13, fat: 0.4 },
      { id: 'pig_blood',        name: '猪血',       unit: '块',    size: '100g/块', weightG: 100,                   carbs: 0.6, protein: 12, fat: 0.3 },
    ],
  },
  fat: {
    label: '脂肪',
    icon: '🥑',
    key: 'fat',
    representativeId: 'oil',           // 通俗参考：山茶油（100% 脂肪，1勺=10g，准准对应）
    alternativeRepId: 'walnut',        // 备用参考：核桃（20g/把，热衷吃零食的人才合逻辑）
    secondaryRepIds: ['cashew'],          // 三级参考：腰果（14g/把），补足表达丰富度
    foods: [
      { id: 'oil',           name: '山茶油',   unit: '勺',   size: '10g/勺（约10ml）', weightG: 10,   carbs: 0,  protein: 0,  fat: 10 },
      { id: 'oil_big',       name: '食用油',   unit: '汤匙', size: '15g/汤匙', weightG: 15,          carbs: 0,  protein: 0,  fat: 15 },
      { id: 'butter',        name: '黄油',     unit: '勺',   size: '10g/勺', weightG: 10,            carbs: 0,  protein: 0,  fat: 8  },
      { id: 'nuts',          name: '坚果',     unit: '把',   size: '30g/把（混合）', weightG: 30,    carbs: 6,  protein: 6,  fat: 15 },
      { id: 'walnut',        name: '核桃',     unit: '把',   size: '30g/把（约8颗）', weightG: 30,   carbs: 4,  protein: 5,  fat: 20 },
      { id: 'cashew',        name: '腰果',     unit: '把',   size: '30g/把（约15颗）', weightG: 30,  carbs: 8,  protein: 6,  fat: 14 },
      { id: 'peanut',        name: '花生',     unit: '把',   size: '30g/把', weightG: 30,            carbs: 6,  protein: 8,  fat: 14 },
      { id: 'almond',        name: '杏仁',     unit: '把',   size: '20g/把（约15颗）', weightG: 20,  carbs: 4,  protein: 4,  fat: 10 },
      { id: 'bacon',         name: '培根',     unit: '片',   size: '10g/片', weightG: 10,            carbs: 0,  protein: 3,  fat: 4  },
      { id: 'pork_belly',    name: '五花肉',   unit: '块',   size: '100g/块', weightG: 100,           carbs: 0,  protein: 10, fat: 30 },
      { id: 'peanut_butter', name: '花生酱',   unit: '勺',   size: '15g/勺', weightG: 15,            carbs: 4,  protein: 4,  fat: 8  },
      { id: 'chips',         name: '薯片',     unit: '袋',   size: '50g/袋（小包）', weightG: 50,    carbs: 30, protein: 3,  fat: 15 },
      { id: 'avocado',       name: '牛油果',   unit: '个',   size: '200g/个（去核）', weightG: 200,   carbs: 12, protein: 4,  fat: 30 },
      { id: 'cheese',        name: '奶酪',     unit: '片',   size: '20g/片', weightG: 20,            carbs: 1,  protein: 7,  fat: 9  },
      { id: 'olive',         name: '橄榄',     unit: '颗',   size: '5g/颗', weightG: 5,             carbs: 0,  protein: 0,  fat: 1  },
      { id: 'salad_dressing',name: '沙拉酱',   unit: '勺',   size: '15g/勺', weightG: 15,            carbs: 2,  protein: 0,  fat: 8  },
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
      { id: 'cucumber',     name: '黄瓜',       unit: '根',   size: '200g/根（中等·15-20cm）', weightG: 200,  carbs: 4,   protein: 1,   fat: 0  },
      { id: 'tomato',       name: '番茄',       unit: '个',   size: '150g/个（中等·粉拳大）', weightG: 150,  carbs: 6,   protein: 1.5, fat: 0  },
      { id: 'cherry_tomato',name: '圣女果',     unit: '10个', size: '100g/10个', weightG: 100,                carbs: 5,   protein: 1,   fat: 0  },
      { id: 'lettuce',      name: '生菜',       unit: '碗',   size: '100g/碗（包饭生菜）', weightG: 100,       carbs: 2,   protein: 1,   fat: 0  },
      { id: 'cabbage',      name: '白菜',       unit: '碗',   size: '200g/碗（炒一碗）', weightG: 200,         carbs: 5,   protein: 2,   fat: 0  },
      { id: 'spinach',      name: '菠菜',       unit: '碗',   size: '150g/碗（烫熟）', weightG: 150,           carbs: 4,   protein: 3,   fat: 0  },
      { id: 'broccoli',     name: '西兰花',     unit: '朵',   size: '150g/朵（炒一盘）', weightG: 150,         carbs: 6,   protein: 4,   fat: 0  },
      { id: 'cauliflower',  name: '菜花',       unit: '朵',   size: '150g/朵（炒一盘）', weightG: 150,         carbs: 6,   protein: 3,   fat: 0  },
      { id: 'eggplant',     name: '茄子',       unit: '根',   size: '200g/根（中等）', weightG: 200,            carbs: 8,   protein: 2,   fat: 0  },
      { id: 'green_pepper', name: '青椒',       unit: '个',   size: '50g/个', weightG: 50,                     carbs: 2,   protein: 0.5, fat: 0  },
      { id: 'red_pepper',   name: '红椒',       unit: '个',   size: '80g/个', weightG: 80,                     carbs: 4,   protein: 1,   fat: 0  },
      { id: 'mushroom',     name: '蘑菇',       unit: '碗',   size: '100g/碗（炒一碗）', weightG: 100,         carbs: 3,   protein: 3,   fat: 0  },
      { id: 'carrot',       name: '胡萝卜',     unit: '根',   size: '100g/根（中等）', weightG: 100,            carbs: 8,   protein: 1,   fat: 0  },
      { id: 'onion',        name: '洋葱',       unit: '个',   size: '150g/个（中等）', weightG: 150,            carbs: 12,  protein: 2,   fat: 0  },
      { id: 'bean_sprout',  name: '豆芽',       unit: '碗',   size: '100g/碗（炒一碗）', weightG: 100,         carbs: 4,   protein: 2,   fat: 0  },
      { id: 'kelp',         name: '海带',       unit: '碗',   size: '100g/碗（凉拌）', weightG: 100,           carbs: 3,   protein: 1,   fat: 0  },
      { id: 'winter_melon', name: '冬瓜',       unit: '碗',   size: '200g/碗（炒一碗）', weightG: 200,         carbs: 4,   protein: 1,   fat: 0  },
      { id: 'bitter_melon', name: '苦瓜',       unit: '根',   size: '150g/根', weightG: 150,                    carbs: 5,   protein: 1,   fat: 0  },
      { id: 'celery',       name: '芹菜',       unit: '把',   size: '100g/把（3-4 根）', weightG: 100,        carbs: 3,   protein: 1,   fat: 0  },
      { id: 'water_spinach',name: '空心菜',     unit: '把',   size: '200g/把（炒一盘）', weightG: 200,         carbs: 5,   protein: 2,   fat: 0  },
      { id: 'radish',       name: '白萝卜',     unit: '个',   size: '200g/个（中等）', weightG: 200,            carbs: 8,   protein: 1,   fat: 0  },
      // === 东北菜/菜单补充（袪装/卤品/香口常客） ===
      { id: 'shiitake',     name: '香菇',       unit: '朵',   size: '50g/朵（中等·干重 5g）', weightG: 50,   carbs: 2.5, protein: 1,   fat: 0.2},
      { id: 'wood_ear',     name: '木耳',       unit: '碗',   size: '50g/碗（干重·泡发后约 200g）', weightG: 50, carbs: 3, protein: 0.5, fat: 0.1},
      { id: 'bamboo_shoot', name: '春笋',       unit: '根',   size: '200g/根（剥壳后）', weightG: 200,         carbs: 7,   protein: 4,   fat: 0.3 },
      { id: 'tofu_skin_knot', name: '百叶结',   unit: '个',   size: '20g/个（豆腐皮打结）', weightG: 20,      carbs: 0.4, protein: 3,   fat: 1.5 },
      { id: 'green_bean',     name: '豆角',     unit: '把',   size: '100g/把（炒一碗）', weightG: 100,         carbs: 7,   protein: 2,   fat: 0.2 },
      { id: 'garlic_sprout',  name: '蒜薹',     unit: '把',   size: '100g/把（炒一盘）', weightG: 100,         carbs: 8,   protein: 2,   fat: 0.3 },
      { id: 'long_jing',      name: '龙井菜',   unit: '把',   size: '100g/把（江浙春日菜）', weightG: 100,     carbs: 3,   protein: 2,   fat: 0.2 },
    ],
  },
  // ========================================================
  // 水果类（新增）：每 100g 净重营养为主，unit 选「个/盒/根」便于掊拾
  //   苹果/香蕉/橙子等是日常高频，几乎人人会吃
  //   representativeId = 苹果（体积认知度最高：1 个≈200g）
  //   alternativeRepId = 香蕉（高碳代表，适合「还差 ≈ 1 根香蕉」表达）
  // ========================================================
  fruit: {
    label: '水果',
    icon: '🍎',
    key: 'fruit',
    representativeId: 'apple',
    alternativeRepId: 'banana',
    foods: [
      { id: 'apple',       name: '苹果',       unit: '个',  size: '200g/个（中果·成年人拳头）', weightG: 200,  carbs: 14,   protein: 0.3, fat: 0.2 },
      { id: 'banana',      name: '香蕉',       unit: '根',  size: '120g/根（中等·去皮）', weightG: 120,        carbs: 27,   protein: 1.3, fat: 0.4 },
      { id: 'orange',      name: '橙子',       unit: '个',  size: '200g/个（中等·去皮）', weightG: 200,        carbs: 24,   protein: 1.8, fat: 0.2 },
      { id: 'strawberry',  name: '草莓',       unit: '10颗', size: '100g/10颗（大果）', weightG: 100,          carbs: 7.7,  protein: 0.7, fat: 0.3 },
      { id: 'blueberry',   name: '蓝莓',       unit: '盒',  size: '100g/盒（1小盒）', weightG: 100,            carbs: 14.5, protein: 0.7, fat: 0.3 },
      { id: 'mango',       name: '芒果',       unit: '个',  size: '300g/个（大果·去核去皮）', weightG: 300,     carbs: 45,   protein: 2.4, fat: 1.2 },
      { id: 'lemon',       name: '柠檬',       unit: '个',  size: '80g/个（中等）', weightG: 80,              carbs: 7.2,  protein: 0.9, fat: 0.2 },
      { id: 'grapefruit',  name: '西柚',       unit: '个',  size: '300g/个（大果）', weightG: 300,              carbs: 24,   protein: 2.1, fat: 0.3 },
      { id: 'passion_fruit', name: '百香果',   unit: '个',  size: '50g/个（中等）', weightG: 50,               carbs: 11.5, protein: 1.1, fat: 0.4 },
      { id: 'grape',       name: '葡萄',       unit: '10颗', size: '100g/10颗（中等）', weightG: 100,          carbs: 10,   protein: 0.7, fat: 0.2 },
      { id: 'peach',       name: '桃子',       unit: '个',  size: '200g/个（中等）', weightG: 200,              carbs: 22,   protein: 1.8, fat: 0.6 },
      { id: 'watermelon',  name: '西瓜',       unit: '块',  size: '500g/块（厚切·去皮）', weightG: 500,         carbs: 38,   protein: 3,   fat: 1   },
      { id: 'kiwi',        name: '猕猴桃',     unit: '个',  size: '100g/个（中等）', weightG: 100,              carbs: 14.7, protein: 1.1, fat: 0.5 },
      { id: 'dragon_fruit',name: '火龙果',     unit: '个',  size: '400g/个（红心·去皮）', weightG: 400,         carbs: 52,   protein: 4.8, fat: 0   },
      { id: 'pineapple',   name: '菠萝',       unit: '块',  size: '200g/块（去皮去眼）', weightG: 200,         carbs: 26,   protein: 1,   fat: 0.2 },
      { id: 'pear',        name: '梨',         unit: '个',  size: '200g/个（中等）', weightG: 200,              carbs: 20,   protein: 0.8, fat: 0.2 },
    ],
  },
  // 常见菜品（混搭型）— 按 1 份=200g 估算，加多了油/糖所以三大营养素都有
  dishes: {
    label: '菜品',
    icon: '🍱',
    key: 'dishes',
    representativeId: null, // 菜品是混合型，不用于“≈ X 份”表达
    foods: [
      { id: 'tomato_egg',     name: '西红柿炒蛋',     unit: '份',   size: '200g/份', weightG: 200,          carbs: 12, protein: 14, fat: 18 },
      { id: 'tofu_skin',      name: '凉拌豆腐皮',     unit: '份',   size: '200g/份', weightG: 200,          carbs: 8,  protein: 20, fat: 8  },
      { id: 'potato_stir',    name: '酸辣土豆丝',     unit: '份',   size: '200g/份', weightG: 200,          carbs: 30, protein: 4,  fat: 10 },
      { id: 'cucumber_stir',  name: '拍黄瓜',         unit: '份',   size: '200g/份', weightG: 200,          carbs: 8,  protein: 3,  fat: 6  },
      { id: 'greens',         name: '炒青菜',         unit: '份',   size: '200g/份', weightG: 200,          carbs: 8,  protein: 3,  fat: 8  },
      { id: 'beef_noodle',    name: '牛肉面',         unit: '碗',   size: '500g/碗（带汤）', weightG: 500,   carbs: 60, protein: 25, fat: 15 },
      { id: 'fried_rice',     name: '炒饭',           unit: '份',   size: '300g/份', weightG: 300,          carbs: 80, protein: 15, fat: 18 },
      { id: 'dumpling_soup',  name: '馄饨',           unit: '碗',   size: '400g/碗（带汤）', weightG: 400,   carbs: 45, protein: 18, fat: 10 },
      { id: 'congee',         name: '皮蛋瘦肉粥',     unit: '碗',   size: '500g/碗', weightG: 500,          carbs: 50, protein: 15, fat: 5  },
      { id: 'hamburger',      name: '汉堡',           unit: '个',   size: '200g/个', weightG: 200,          carbs: 40, protein: 20, fat: 20 },
      { id: 'fried_chicken',  name: '炸鸡',           unit: '块',   size: '100g/块', weightG: 100,          carbs: 8,  protein: 20, fat: 20 },
      { id: 'french_fries',   name: '薯条',           unit: '份',   size: '100g/份', weightG: 100,          carbs: 35, protein: 3,  fat: 12 },
      { id: 'pizza',          name: '披萨',           unit: '块',   size: '100g/块', weightG: 100,          carbs: 25, protein: 10, fat: 12 },
      { id: 'sushi',          name: '寿司',           unit: '8个',  size: '200g/8个', weightG: 200,         carbs: 40, protein: 10, fat: 5  },
      // === 菜单菜品补充（与 menu-app SAMPLE_DISHES 对齐） ===
      { id: 'braised_pork',   name: '红烧肉',         unit: '份',   size: '100g/份（五花肉·微甜）', weightG: 100,   carbs: 5,  protein: 25, fat: 42 },
      { id: 'stir_greens',    name: '清炒时蔬',       unit: '份',   size: '200g/份（一盘青菜）', weightG: 200,       carbs: 8,  protein: 3,  fat: 5  },
      { id: 'boiled_fish',    name: '水煮鱼',         unit: '份',   size: '500g/份（带汤·多油）', weightG: 500,      carbs: 8,  protein: 45, fat: 28 },
      { id: 'guobaorou',      name: '锅包肉',         unit: '份',   size: '100g/份（裹糖醋·东北）', weightG: 100,   carbs: 16, protein: 45, fat: 43 },
      { id: 'disanxian',      name: '地三鲜',         unit: '份',   size: '130g/份（炸后烩）', weightG: 130,         carbs: 35, protein: 8,  fat: 30 },
      { id: 'yuxiang_pork',   name: '鱼香肉丝',       unit: '份',   size: '200g/份', weightG: 200,                  carbs: 15, protein: 20, fat: 14 },
      { id: 'yanduxian',      name: '腌笃鲜',         unit: '份',   size: '500g/份（汤主）', weightG: 500,          carbs: 8,  protein: 35, fat: 20 },
      { id: 'braised_ribs',   name: '红烧排骨',       unit: '份',   size: '125g/份（带骨肉）', weightG: 125,         carbs: 10, protein: 50, fat: 70 },
      { id: 'ribs_rice',      name: '排骨烱饭',       unit: '份',   size: '400g/份（排骨+米饭）', weightG: 400,      carbs: 80, protein: 35, fat: 28 },
      { id: 'kungpao',        name: '宫保鸡丁',       unit: '份',   size: '200g/份（鸡胸为主）', weightG: 200,      carbs: 15, protein: 25, fat: 22 },
      { id: 'mapo_tofu',      name: '麻婆豆腐',       unit: '份',   size: '300g/份（麻辣·1 盒豆腐）', weightG: 300, carbs: 12, protein: 22, fat: 14 },
      { id: 'sweet_sour_pork',name: '糖醋里脊',       unit: '份',   size: '100g/份（裹糖醋汁）', weightG: 100,      carbs: 50, protein: 22, fat: 45 },
      { id: 'potato_pancake', name: '土豆丝卷饼',     unit: '份',   size: '200g/份（1 张饼）', weightG: 200,         carbs: 60, protein: 12, fat: 18 },
      { id: 'sandwich',       name: '三明治',         unit: '个',   size: '200g/个（4 片吐司）', weightG: 200,      carbs: 40, protein: 18, fat: 18 },
      { id: 'cola_wings',     name: '可乐鸡翅',       unit: '份',   size: '300g/份（10 个翅中）', weightG: 300,     carbs: 35, protein: 35, fat: 30 },
      { id: 'egg_fried_rice', name: '蛋炒饭',         unit: '份',   size: '300g/份（2 碗饭+2 蛋）', weightG: 300,   carbs: 60, protein: 15, fat: 20 },
      { id: 'tomato_beef',    name: '西红柿炖牛腩',   unit: '份',   size: '500g/份（牛腩+番茄）', weightG: 500,      carbs: 15, protein: 45, fat: 35 },
      { id: 'cumin_lamb',     name: '孜然羊肉',       unit: '份',   size: '250g/份（羊里脊）', weightG: 250,         carbs: 8,  protein: 35, fat: 38 },
      { id: 'mushroom_chicken', name: '香菇滑鸡',     unit: '份',   size: '300g/份（鸡腿+香菇）', weightG: 300,     carbs: 10, protein: 30, fat: 18 },
      { id: 'poached_egg',    name: '荷包蛋',         unit: '个',   size: '50g/个（溏心）', weightG: 50,            carbs: 0.5,protein: 7,  fat: 7  },
      { id: 'cucumber_egg_soup', name: '黄瓜皮蛋汤',  unit: '份',   size: '400g/份（黄瓜+2 皮蛋）', weightG: 400,   carbs: 6,  protein: 10, fat: 8  },
      { id: 'jingj_rousi',     name: '京酱肉丝',     unit: '份',   size: '200g/份（豆腐皮+肉丝）', weightG: 200,  carbs: 14, protein: 22, fat: 14 },
      { id: 'ganbian_doujiao', name: '干煸豆角',     unit: '份',   size: '200g/份（豆角+肉末）', weightG: 200,    carbs: 18, protein: 14, fat: 16 },
      { id: 'doujiao_menmian', name: '豆角焖面',     unit: '份',   size: '400g/份（豆角+面条）', weightG: 400,    carbs: 70, protein: 18, fat: 14 },
    ],
  },
  // ========================================================
  // 酒水/调酒基酒（新增）：为菜单 16 种鸡尾酒服务
  //   1 shot = 45ml 烈酒；0g 蛋白/0g 碳几乎都是酒精热量（7kcal/g酒精）
  //   只算 carbs/protein/fat 三大宏量素，酒精热量另外标记
  // ========================================================
  drink: {
    label: '酒水',
    icon: '🍸',
    key: 'drink',
    representativeId: null, // 酒不参与「还差 ≈ X」换算
    foods: [
      { id: 'rum',       name: '白朗姆酒',   unit: 'shot', size: '45ml/shot（1 杯烈酒）', weightG: 45,       carbs: 0,    protein: 0, fat: 0 },
      { id: 'vodka',     name: '伏特加',     unit: 'shot', size: '45ml/shot', weightG: 45,                  carbs: 0,    protein: 0, fat: 0 },
      { id: 'gin',       name: '金酒',       unit: 'shot', size: '45ml/shot', weightG: 45,                  carbs: 0,    protein: 0, fat: 0 },
      { id: 'whiskey',   name: '威士忌',     unit: 'shot', size: '45ml/shot（波本为主）', weightG: 45,       carbs: 0,    protein: 0, fat: 0 },
      { id: 'tequila',   name: '龙舌兰',     unit: 'shot', size: '45ml/shot', weightG: 45,                  carbs: 0,    protein: 0, fat: 0 },
      { id: 'cointreau', name: '君度橙酒',   unit: 'shot', size: '30ml/shot（甘甜·含 7g 糖）', weightG: 30, carbs: 7,    protein: 0, fat: 0 },
    ],
  },
  // ========================================================
  // 调味料（新增）：东北菜/爆炒菜必备，对总量贡献小但不可忽略
  //   1 勺 = 10ml 液体 或 10g 酱料
  //   代表参考 = 蚝油（用得最多、客户认知高）
  // ========================================================
  seasoning: {
    label: '调料',
    icon: '🧂',
    key: 'seasoning',
    representativeId: 'soy_sauce',
    alternativeRepId: 'oyster_sauce',
    foods: [
      { id: 'soy_sauce',     name: '生抽',       unit: '勺',  size: '10ml/勺', weightG: 10,  carbs: 0.5, protein: 0.8, fat: 0   },
      { id: 'dark_soy',      name: '老抽',       unit: '勺',  size: '10ml/勺', weightG: 10,  carbs: 1,   protein: 0.5, fat: 0   },
      { id: 'oyster_sauce',  name: '蚝油',       unit: '勺',  size: '10g/勺', weightG: 10,   carbs: 2.5, protein: 0.5, fat: 0.1 },
      { id: 'doubanjiang',   name: '豆瓣酱',     unit: '勺',  size: '10g/勺', weightG: 10,   carbs: 3,   protein: 2,   fat: 1   },
      { id: 'huangdoujiang', name: '黄豆酱',     unit: '勺',  size: '10g/勺', weightG: 10,   carbs: 3,   protein: 2,   fat: 1.5 },
      { id: 'ketchup',       name: '番茄酱',     unit: '勺',  size: '10g/勺', weightG: 10,   carbs: 2,   protein: 0.1, fat: 0   },
      { id: 'sugar',         name: '白砂糖',     unit: '勺',  size: '10g/勺', weightG: 10,   carbs: 10,  protein: 0,   fat: 0   },
    ],
  },
};

// ========================================================
// 综合餐食模板（三种营养素各有 3 块食物，动态按 60/25/15 分配）
//   碳水 = 主食（米饭等高碳）+ 肉菜（糖醋里脊/锅包肉等带糖）+ 坚果/水果
//   蛋白 = 肉类（鸡腿等高蛋白）+ 蛋/豆（蛋/豆腐）+ 奶/粉（牛奶/蛋白粉）
//   脂肪 = 油类（山茶油等高脂）+ 肉菜肥肉（五花肉等）+ 坚果（腰果/核桃）
// 比“≈ 6 碗米饭”更贴地——一眼看出“一日餐食怎么安排”
// ⚠️ 必须独立于 FOOD_DB 导出，否则会被 Object.entries(FOOD_DB) 遍历到导致 cat.foods 为 undefined
// ========================================================
export const MEAL_TEMPLATES = {
  carbs: {
    main:   { id: 'rice',            label: '米饭' },         //  45g 碳/碗
    side:   { id: 'sweet_sour_pork', label: '糖醋里脊' },     //  50g 碳/份
    extra:  { id: 'sweet_potato',    label: '红薯' },         //  40g 碳/个，例：270g 碳 → 1 个
  },
  protein: {
    main:   { id: 'chicken_thigh',   label: '鸡大腿' },       //  16g 蛋白/个
    side:   { id: 'egg',             label: '鸡蛋' },         //   7g 蛋白/个
    extra:  { id: 'milk',            label: '牛奶' },         //   8g 蛋白/盒，例：165g 蛋白 → 3 盒
  },
  fat: {
    main:   { id: 'oil',             label: '山茶油' },       //  10g 脂肪/勺
    side:   { id: 'pork_belly',      label: '五花肉' },       //  30g 脂肪/块
    extra:  { id: 'cashew',          label: '腰果' },         //  14g 脂肪/把
  },
};

// 取所有食物的扁平列表（含分类信息 + 自定义食物叠加），供统一选择器使用
export function getAllFoods() {
  const all = [];
  for (const [catKey, cat] of Object.entries(FOOD_DB)) {
    if (!cat || !Array.isArray(cat.foods)) continue; // 跳过 MEAL_TEMPLATES 等非分类字段
    for (const f of cat.foods) {
      all.push({ ...f, category: catKey, categoryLabel: cat.label, categoryIcon: cat.icon });
    }
  }
  // 叠加用户自定义食物
  for (const f of readCustomFoods()) {
    const cat = FOOD_DB[f.category] || FOOD_DB.carbs;
    all.push({
      ...f,
      category: f.category,
      categoryLabel: cat.label,
      categoryIcon: cat.icon,
    });
  }
  return all;
}

// 在全库中按 id 找食物（内置 + 自定义，自动附加 weightG）
export function findFood(id) {
  if (!id) return null;
  // 1) 内置库
  for (const cat of Object.values(FOOD_DB)) {
    if (!cat || !Array.isArray(cat.foods)) continue; // 跳过 MEAL_TEMPLATES 等非分类字段
    const f = cat.foods.find((x) => x.id === id);
    if (f) {
      // 优先用食物本身显式 weightG 字段（独立于 size 字符串，禁得起本地化文本变化）
      const weightG = Number(f.weightG) > 0 ? Number(f.weightG) : parseSizeG(f.size);
      return { ...f, weightG, category: cat.key };
    }
  }
  // 2) 用户自定义库
  const custom = readCustomFoods().find((x) => x.id === id);
  if (custom) {
    const weightG = Number(custom.weightG) > 0 ? Number(custom.weightG) : parseSizeG(custom.size);
    return { ...custom, weightG, category: custom.category };
  }
  return null;
}

// 提取每份克数。兼容两种调用：
//   ① parseSizeG(food)      // 传食物对象，优先 food.weightG，回退 food.size
//   ② parseSizeG(sizeString) // 传字符串，走老逻辑（size 文本中取第一个 g/ml 数字）
export function parseSizeG(arg) {
  if (arg == null) return 100;
  if (typeof arg === 'object') {
    if (Number.isFinite(Number(arg.weightG)) && Number(arg.weightG) > 0) {
      return Number(arg.weightG);
    }
    if (arg.size) return parseSizeG(arg.size);
    return 100;
  }
  const s = String(arg);
  const m = s.match(/(\d+(?:\.\d+)?)\s*g/i);
  if (m) return parseFloat(m[1]);
  const ml = s.match(/(\d+(?:\.\d+)?)\s*ml/i);
  if (ml) return parseFloat(ml[1]);
  return 100;
}

// 按 100g 归一化（输入某食物，返回每 100g 的营养素）
export function per100g(food) {
  if (!food) return { carbs: 0, protein: 0, fat: 0 };
  // 优先用 weightG（数字字段，稳如狗）；fallback 才解析 size
  const sizeG = parseSizeG(food);
  const factor = 100 / sizeG;
  return {
    carbs:   Number(((Number(food.carbs)   || 0) * factor).toFixed(2)),
    protein: Number(((Number(food.protein) || 0) * factor).toFixed(2)),
    fat:     Number(((Number(food.fat)     || 0) * factor).toFixed(2)),
  };
}

// 按实际克数计算三大营养素（默认 100g）
export function calcByGrams(food, grams = 100) {
  const p = per100g(food);
  const g = Math.max(0, Number(grams) || 0);
  return {
    carbs:   p.carbs   * g / 100,
    protein: p.protein * g / 100,
    fat:     p.fat     * g / 100,
    kcal:    p.carbs * g / 100 * 4 + p.protein * g / 100 * 4 + p.fat * g / 100 * 9,
  };
}

/**
 * 综合餐食模板：把克数拆成「主食 + 肉菜 + 加餐」三块，动态按 60/25/15 分配
 * 例：碳水 270g  → "3.6 碗米饭 + 1.3 份糖醋里脊 + 5 把腰果"（一眼看出怎么吃）
 * 返回字符串或 { main, side, extra } 对象
 */
export function describeMacroMeal(grams, key, asObject = false) {
  const g = Math.round(Number(grams) || 0);
  const emptyObj = { main: null, side: null, extra: null, totalGrams: 0 };
  if (g <= 0) return asObject ? emptyObj : '';
  const tmpl = MEAL_TEMPLATES?.[key];
  if (!tmpl) return asObject ? emptyObj : '';

  const mainGrams  = g * 0.60;  // 主食占 60%
  const sideGrams  = g * 0.25;  // 配菜占 25%
  const extraGrams = g * 0.15;  // 加餐占 15%

  const calcOne = (entry) => {
    const food = findFood(entry.id);
    if (!food) return null;
    return calcRepRef(food, key === 'fat' && entry.id === 'pork_belly' ? sideGrams : (entry.id === 'rice' || entry.id === 'chicken_thigh' || entry.id === 'oil' ? mainGrams : (entry.id === 'milk' || entry.id === 'cashew' ? extraGrams : sideGrams)), key);
  };

  const main  = calcOne(tmpl.main);
  const side  = calcOne(tmpl.side);
  const extra = calcOne(tmpl.extra);

  if (asObject) return { main, side, extra, totalGrams: g };

  if (!main && !side && !extra) return '';
  const parts = [main, side, extra].filter(Boolean).map((p) => p.colloquial);
  return parts.join(' + ');
}

// ============================================================
// 自定义食物（用户自行添加的「我的常吃」）
// 持久化到 localStorage，使用 custom_<uuid> 前缀 id 避免与内置冲突
// 改改的版本不迁移，但字段格式与内置完全一致
// ============================================================
const CUSTOM_FOODS_KEY = 'menu_app_custom_foods_v1';
const CUSTOM_FOODS_EVENT = 'menu_app_custom_foods_changed';

function readCustomFoods() {
  try {
    const raw = window.localStorage.getItem(CUSTOM_FOODS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    return [];
  }
}

function writeCustomFoods(list) {
  try {
    window.localStorage.setItem(CUSTOM_FOODS_KEY, JSON.stringify(list));
    // 发送变更事件，页面上订阅后可重渲染
    window.dispatchEvent(new CustomEvent(CUSTOM_FOODS_EVENT));
  } catch (e) {
    // 静默：localStorage 满了
  }
}

export function getCustomFoods() {
  return readCustomFoods();
}

export function addCustomFood(food) {
  const id = `custom_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;
  const record = {
    id,
    name: String(food.name || '').trim(),
    category: food.category || 'carbs',
    unit: String(food.unit || '份').trim() || '份',
    size: String(food.size || '').trim() || `${Number(food.weightG) || 100}g/份`,
    weightG: Math.max(1, Math.round(Number(food.weightG) || 100)),
    carbs: Math.max(0, Number(food.carbs) || 0),
    protein: Math.max(0, Number(food.protein) || 0),
    fat: Math.max(0, Number(food.fat) || 0),
    isCustom: true,
    createdAt: Date.now(),
  };
  const list = readCustomFoods();
  list.push(record);
  writeCustomFoods(list);
  return record;
}

export function removeCustomFood(id) {
  const list = readCustomFoods().filter((f) => f.id !== id);
  writeCustomFoods(list);
}

export function isCustomFoodId(id) {
  return typeof id === 'string' && id.startsWith('custom_');
}

// 订阅自定义食物变化（返回取消订阅函数）
export function subscribeCustomFoods(handler) {
  const listener = () => handler();
  window.addEventListener(CUSTOM_FOODS_EVENT, listener);
  window.addEventListener('storage', (e) => {
    if (e.key === CUSTOM_FOODS_KEY) listener();
  });
  return () => window.removeEventListener(CUSTOM_FOODS_EVENT, listener);
}

// 把「食物+份量」列表算成克数（按指定营养素 key：carbs/protein/fat）
export function calcGrams(foodList, key) {
  if (!Array.isArray(foodList)) return 0;
  return foodList.reduce((sum, item) => {
    const food = findFood(item.id);
    if (!food) return sum;
    // 优先用 grams 字段（100g 基准），以 qty 作 fallback（老数据/含习们系统）
    const grams = Number(item.grams);
    if (Number.isFinite(grams) && grams > 0) {
      const p100 = per100g(food);
      return sum + (Number(p100[key]) || 0) * grams / 100;
    }
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
  // 复合单位（unit 长度≥2，如"10只""100g""汤匙"）与 qty 之间加空格，避免 "4.410只虾" 拼接拥挤
  const sep = rep.unit && rep.unit.length >= 2 ? ' ' : '';
  return {
    colloquial: `${qty}${sep}${rep.unit}${rep.name}`,
    precise: sizeInfo ? `共 ${totalUnitGram}${totalUnit}` : '',
    qty,
    totalUnitGram,
    totalUnit,
    rep,
  };
}

// 把克数换算成「≈ 5勺山茶油 或 2.5把核桃」类的多个代表参考
// 支持三级参考：主（representativeId）· 备（alternativeRepId）· 次（secondaryRepIds[]）
// 返回字符串或 { primary, alternative, extras } 对象（传 asObject=true 时）
export function describeMacro(grams, key, asObject = false) {
  const g = Math.round(Number(grams) || 0);
  const emptyObj = { primary: null, alternative: null, extras: [] };
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

  // 三级参考：secondaryRepIds（多个次级参考，同时展示）
  const extras = [];
  if (Array.isArray(cat.secondaryRepIds)) {
    for (const id of cat.secondaryRepIds) {
      const food = cat.foods.find((f) => f.id === id);
      if (food) {
        const ref = calcRepRef(food, g, key);
        if (ref && ref.colloquial) extras.push(ref);
      }
    }
  }

  if (asObject) {
    return { primary, alternative, extras };
  }

  // 合成最终提示
  if (!primary) return '';
  // 主备次用"或"连接（都是等价替代方案，不是叠加）
  const extrasText = extras.length > 0
    ? ' 或 ' + extras.map((e) => e.colloquial + (e.precise ? `（${e.precise}）` : '')).join(' 或 ')
    : '';
  if (!alternative || alternative.colloquial === primary.colloquial) {
    return primary.precise
      ? `≈ ${primary.colloquial}（${primary.precise}）${extrasText}`
      : `≈ ${primary.colloquial}${extrasText}`;
  }
  return primary.precise
    ? `≈ ${primary.colloquial}（${primary.precise}）或 ${alternative.colloquial}${alternative.precise ? `（${alternative.precise}）` : ''}${extrasText}`
    : `≈ ${primary.colloquial}或 ${alternative.colloquial}${extrasText}`;
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

// ========================================================
// 隐藏碳水不适用范围：水果/酒水/调料是「已知摄入」不是「隐藏」
// ========================================================

// 常规主食类碳水源 ID（米饭/馒头/面包/面条/红薯/玉米/土豆/饺子/粥/包子/燕麦）
// 这些是用户"明显知道自己吃了碳水"的来源，不算隐藏
const CARB_MAIN_IDS = new Set([
  'rice', 'rice_small', 'rice_big', 'mantou', 'bread', 'noodle',
  'sweet_potato', 'corn', 'corn_kernal', 'potato', 'dumpling',
  'porridge', 'baozi', 'oat',
]);

/**
 * 判断食物是否属于"隐藏碳水源"（用户容易漏算的碳水来源）
 * 规则：
 *   1. carbs 类里的常规主食（米饭/馒头/面包/燕麦等）→ 可见，不算隐藏
 *   2. dishes 类里 carbs ≥ 15g 的菜品（牛肉面/炒饭/披萨/汉堡/寿司/薯条/皮蛋瘦肉粥）→ 隐藏
 *   3. protein/fat/vegetable 类里 carbs ≥ 15g（牛奶不算，蛋白粉不算）→ 隐藏
 *
 * 例：牛肉面（dishes, 60g 碳水）→ 隐藏
 *     寿司（dishes, 40g 碳水）→ 隐藏
 *     牛奶（protein, 12g 碳水）→ 可见（< 15g）
 *     蛋白粉（protein, 3g 碳水）→ 可见
 */
export function isHiddenCarbSource(food) {
  if (!food) return false;
  const c = Number(food.carbs) || 0;
  if (c < 15) return false;
  if (food.category === 'carbs') {
    // carbs 类里的常规主食不算隐藏
    return !CARB_MAIN_IDS.has(food.id);
  }
  // 非 carbs 类（含 ≥ 15g 碳水）→ 隐藏
  return true;
}

/**
 * 把已吃食物列表按"碳水源"分组，返回多代表描述字符串
 * 输出形如：
 *   "3碗米饭 + 1片面包"   （仅主食碳水源）
 *   "1碗牛肉面(⚠️) + 3碗米饭"   （含隐藏碳水源）
 *   "3碗米饭 + ⚠️牛肉面 + 2项"
 *
 * @param {Array<{id, qty}>} foodList - 食物+份量列表
 * @param {number} maxItems - 最多展示几项（默认 3）
 * @returns {{text: string, hiddenGrams: number, hiddenItems: Array}}
 *   - text: 描述字符串（用于 UI 直接渲染）
 *   - hiddenGrams: 隐藏碳水的总克数
 *   - hiddenItems: 隐藏碳水的明细 [{name, unit, qty, grams}]
 */
export function describeCarbsMulti(foodList, maxItems = 3) {
  const empty = { text: '', hiddenGrams: 0, hiddenItems: [], totalGrams: 0 };
  if (!Array.isArray(foodList) || foodList.length === 0) return empty;
  const items = [];
  let totalGrams = 0;
  let hiddenGrams = 0;
  const hiddenItems = [];
  for (const it of foodList) {
    const food = findFood(it.id);
    if (!food) continue;
    const c = Number(food.carbs) || 0;
    if (c <= 0) continue;
    const qty = Number(it.qty) || 0;
    if (qty <= 0) continue;
    const contributed = Math.round(c * qty);
    if (contributed <= 0) continue;
    const isHidden = isHiddenCarbSource(food);
    items.push({
      name: food.name, unit: food.unit, qty, contributed, isHidden,
    });
    totalGrams += contributed;
    if (isHidden) {
      hiddenGrams += contributed;
      hiddenItems.push({ name: food.name, unit: food.unit, qty, grams: contributed });
    }
  }
  if (items.length === 0) return empty;
  // 按碳水贡献降序
  items.sort((a, b) => b.contributed - a.contributed);
  const top = items.slice(0, maxItems);
  const more = items.length - top.length;
  const parts = top.map((it) => {
    const flag = it.isHidden ? '⚠️' : '';
    return `${flag}${it.qty}${it.unit}${it.name}`;
  });
  const tail = more > 0 ? ` +${more}项` : '';
  return {
    text: parts.join(' + ') + tail,
    hiddenGrams,
    hiddenItems,
    totalGrams,
  };
}

// ========================================================
// 通用多营养素多源描述（重构后顶 macroRow / MacroBreakdown 调用）
// ========================================================

/**
 * 从「食物+份量」列表算出三大营养素各自的多源构成
 * @returns {{
 *   carbs:   { text, totalGrams, hiddenGrams, hiddenItems },
 *   protein: { text, totalGrams },
 *   fat:     { text, totalGrams },
 * }}
 */
export function describeFoods(foodList) {
  const result = {
    carbs:   { text: '', totalGrams: 0, hiddenGrams: 0, hiddenItems: [] },
    protein: { text: '', totalGrams: 0 },
    fat:     { text: '', totalGrams: 0 },
  };
  if (!Array.isArray(foodList) || foodList.length === 0) return result;

  for (const key of ['carbs', 'protein', 'fat']) {
    const items = [];
    let totalGrams = 0;
    for (const it of foodList) {
      const food = findFood(it.id);
      if (!food) continue;
      // 优先 grams 字段（100g 基准）；以 qty 作 fallback
      const grams = Number(it.grams);
      let contributed = 0;
      let label = '';
      if (Number.isFinite(grams) && grams > 0) {
        const p100 = per100g(food);
        contributed = (Number(p100[key]) || 0) * grams / 100;
        label = `${Math.round(grams)}g ${food.name}`;
      } else {
        const v = Number(food[key]) || 0;
        if (v <= 0) continue;
        const qty = Number(it.qty) || 0;
        if (qty <= 0) continue;
        contributed = v * qty;
        label = `${qty}${food.unit}${food.name}`;
      }
      contributed = Math.round(contributed);
      if (contributed <= 0) continue;
      items.push({ name: food.name, unit: food.unit, qty: Number(it.qty) || 0, grams: grams || 0, contributed });
      totalGrams += contributed;
    }
    if (items.length === 0) continue;
    items.sort((a, b) => b.contributed - a.contributed);
    const top = items.slice(0, 3);
    const more = items.length - top.length;
    const parts = top.map((it) => it.grams > 0 ? `${Math.round(it.grams)}g${it.name}` : `${it.qty}${it.unit}${it.name}`);
    const tail = more > 0 ? ` +${more}项` : '';
    result[key] = { text: parts.join(' + ') + tail, totalGrams, hiddenGrams: 0, hiddenItems: [] };
  }

  // 隐藏碳水告警（仅 carbs）
  for (const it of foodList) {
    const food = findFood(it.id);
    if (!food || !isHiddenCarbSource(food)) continue;
    let contributed = 0;
    const grams = Number(it.grams);
    if (Number.isFinite(grams) && grams > 0) {
      contributed = (per100g(food).carbs || 0) * grams / 100;
    } else {
      const qty = Number(it.qty) || 0;
      if (qty <= 0) continue;
      contributed = (Number(food.carbs) || 0) * qty;
    }
    contributed = Math.round(contributed);
    if (contributed <= 0) continue;
    result.carbs.hiddenGrams += contributed;
    result.carbs.hiddenItems.push({ name: food.name, unit: food.unit, qty: Number(it.qty) || 0, grams });
  }

  return result;
}

/**
 * 从「剩余克数」反推「主代表食物」文案（用于「还差 ≈ 3 碗米饭 + 2 个鸡腿 + 1 勺油」）
 * @param {number} carbsGap - 碳水剩余克数
 * @param {number} proteinGap - 蛋白剩余克数
 * @param {number} fatGap - 脂肪剩余克数
 * @returns {string} 拼接后的文案（无剩余返回空串）
 */
export function describeRemaining(carbsGap, proteinGap, fatGap) {
  const parts = [];
  const gaps = [
    { gap: carbsGap,   key: 'carbs'   },
    { gap: proteinGap, key: 'protein' },
    { gap: fatGap,     key: 'fat'     },
  ];
  for (const { gap, key } of gaps) {
    if (!gap || gap <= 0) continue;
    const cat = FOOD_DB[key];
    if (!cat || !cat.representativeId) continue;
    const rep = cat.foods.find((f) => f.id === cat.representativeId);
    if (!rep || !rep[key]) continue;
    const qtyRaw = gap / rep[key];
    const qty = qtyRaw < 0.05 ? 0 : Math.round(qtyRaw * 10) / 10;
    if (qty <= 0) continue;
    parts.push(`${qty}${rep.unit}${rep.name}`);
  }
  return parts.join(' + ');
}

// ========================================================
// 铁含量数据：每 100g 食物的铁含量（单位 mg）
// 数据来源：中国食物成分表（第 6 版/2023）
// ========================================================
export const IRON_MAP = {
  // === 动物肝脏/血类（极高，10-30mg/100g）===
  pork_liver: 22.6,
  duck_blood: 30.5,
  pig_blood: 8.7,
  // === 红肉类（中等，2-4mg/100g）===
  beef: 3.2,
  lamb: 2.7,
  pork_lean: 3.0,
  ribs: 2.0,
  cured_pork: 3.5,
  pork_belly: 1.5,
  bacon: 1.5,
  // === 禽肉/蛋类 ===
  chicken_breast: 1.0,
  chicken_thigh: 1.2,
  chicken_drumstick: 1.1,
  chicken_wing: 1.3,
  chicken_leg: 1.2,
  egg: 2.0,
  century_egg: 2.5,
  // === 海鲜 ===
  fish: 0.5,
  shrimp: 1.5,
  // === 蔬菜（深色绿叶）===
  spinach: 2.9,
  wood_ear: 5.5,
  shiitake: 1.3,
  // === 豆制品 ===
  tofu: 1.5,
  tofu_skin_knot: 3.0,
  // === 其他 ===
  oat: 4.7,
  nuts: 2.5,
  walnut: 2.9,
  cashew: 2.0,
  peanut: 2.5,
};

/**
 * 获取食物每 100g 铁含量（mg）
 */
export function getIronMgPer100g(foodId) {
  return IRON_MAP[foodId] || 0;
}

/**
 * 计算食物列表的铁总摄入（mg，保留 1 位小数）
 */
export function calcIronMg(foodList) {
  if (!Array.isArray(foodList)) return 0;
  let total = 0;
  for (const item of foodList) {
    const f = findFood(item.id);
    if (!f) continue;
    const per100 = getIronMgPer100g(item.id);
    if (per100 <= 0) continue;
    const grams = Number(item.grams);
    if (Number.isFinite(grams) && grams > 0) {
      total += per100 * grams / 100;
    } else {
      total += per100 * (Number(item.qty) || 0);
    }
  }
  return Math.round(total * 10) / 10;
}

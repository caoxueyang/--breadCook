/**
 * 食材卡路里数据库
 * 
 * 每项包含：
 *   keywords   - 匹配关键词（菜品材料中可能出现的名称）
 *   cal        - 每参考单位的卡路里
 *   refUnit    - 参考单位描述（如 "100g" / "个" / "碗"）
 *   refAmount  - 参考数量（100 = 100g, 1 = 1个/1碗）
 *   emoji      - 对应图标
 */

const CALORIE_DB = [
  // ==================== 主食 / 米面 ====================
  { keywords: ['米饭', '隔夜米饭', '大米'], cal: 116, refUnit: '100g', refAmount: 100, emoji: '🍚' },
  { keywords: ['面条', '挂面', '方便面'], cal: 110, refUnit: '100g（煮熟）', refAmount: 100, emoji: '🍜' },
  { keywords: ['面粉', '中筋面粉', '低筋面粉', '高筋面粉', '糯米粉'], cal: 360, refUnit: '100g', refAmount: 100, emoji: '🌾' },
  { keywords: ['吐司面包', '吐司', '面包'], cal: 65, refUnit: '片', refAmount: 1, emoji: '🍞' },
  { keywords: ['糯米', '酒酿'], cal: 350, refUnit: '100g', refAmount: 100, emoji: '🍚' },
  { keywords: ['燕麦', '麦片'], cal: 380, refUnit: '100g', refAmount: 100, emoji: '🥣' },
  { keywords: ['西米', '西米露'], cal: 360, refUnit: '100g', refAmount: 100, emoji: '🫧' },

  // ==================== 猪肉类 ====================
  { keywords: ['五花肉'], cal: 395, refUnit: '100g', refAmount: 100, emoji: '🥩' },
  { keywords: ['猪里脊肉', '里脊肉', '猪里脊', '里脊'], cal: 155, refUnit: '100g', refAmount: 100, emoji: '🥩' },
  { keywords: ['排骨', '猪排'], cal: 264, refUnit: '100g', refAmount: 100, emoji: '🍖' },
  { keywords: ['猪肉末', '肉末', '猪肉馅', '肉馅'], cal: 280, refUnit: '100g', refAmount: 100, emoji: '🥩' },
  { keywords: ['咸肉', '腊肉', '培根'], cal: 490, refUnit: '100g', refAmount: 100, emoji: '🥓' },
  { keywords: ['火腿', '火腿肠'], cal: 330, refUnit: '100g', refAmount: 100, emoji: '🥓' },
  { keywords: ['鲜肉'], cal: 250, refUnit: '100g（鲜猪肉）', refAmount: 100, emoji: '🥩' },
  { keywords: ['猪蹄', '猪脚'], cal: 260, refUnit: '100g', refAmount: 100, emoji: '🍖' },

  // ==================== 牛羊肉 ====================
  { keywords: ['牛腩', '牛肉', '牛腱'], cal: 125, refUnit: '100g（瘦）', refAmount: 100, emoji: '🥩' },
  { keywords: ['羊肉', '羊里脊', '羊腿'], cal: 135, refUnit: '100g（瘦）', refAmount: 100, emoji: '🐑' },
  { keywords: ['肥牛', '肥牛卷'], cal: 280, refUnit: '100g', refAmount: 100, emoji: '🥩' },

  // ==================== 禽肉 ====================
  { keywords: ['鸡胸肉', '鸡脯肉', '鸡小胸'], cal: 133, refUnit: '100g', refAmount: 100, emoji: '🍗' },
  { keywords: ['鸡腿肉', '鸡腿'], cal: 146, refUnit: '100g（去皮）', refAmount: 100, emoji: '🍗' },
  { keywords: ['鸡翅中', '鸡翅'], cal: 194, refUnit: '100g', refAmount: 100, emoji: '🍗' },
  { keywords: ['整鸡', '三黄鸡', '土鸡'], cal: 160, refUnit: '100g', refAmount: 100, emoji: '🍗' },
  { keywords: ['鸭', '鸭肉', '烤鸭'], cal: 240, refUnit: '100g', refAmount: 100, emoji: '🍗' },

  // ==================== 水产 ====================
  { keywords: ['草鱼', '鱼片', '鱼柳', '巴沙鱼'], cal: 110, refUnit: '100g', refAmount: 100, emoji: '🐟' },
  { keywords: ['虾', '虾仁', '大虾'], cal: 90, refUnit: '100g', refAmount: 100, emoji: '🦐' },
  { keywords: ['三文鱼', '鲑鱼'], cal: 160, refUnit: '100g', refAmount: 100, emoji: '🐟' },
  { keywords: ['金枪鱼', '吞拿鱼'], cal: 130, refUnit: '100g', refAmount: 100, emoji: '🐟' },
  { keywords: ['带鱼'], cal: 127, refUnit: '100g', refAmount: 100, emoji: '🐟' },
  { keywords: ['鲅鱼'], cal: 120, refUnit: '100g', refAmount: 100, emoji: '🐟' },
  { keywords: ['鱿鱼'], cal: 90, refUnit: '100g', refAmount: 100, emoji: '🦑' },
  { keywords: ['蛤蜊', '花蛤', '贝类', '扇贝', '蛏子', '海虹'], cal: 60, refUnit: '100g', refAmount: 100, emoji: '🦪' },
  { keywords: ['螃蟹', '梭子蟹', '大闸蟹'], cal: 95, refUnit: '100g', refAmount: 100, emoji: '🦀' },
  { keywords: ['鲍鱼'], cal: 85, refUnit: '100g', refAmount: 100, emoji: '🦪' },
  { keywords: ['海参'], cal: 55, refUnit: '100g（水发）', refAmount: 100, emoji: '🪸' },

  // ==================== 蛋类 ====================
  { keywords: ['鸡蛋', '鸡蛋黄', '蛋清', '鸡蛋清'], cal: 70, refUnit: '个', refAmount: 1, emoji: '🥚' },
  { keywords: ['鹌鹑蛋'], cal: 15, refUnit: '个', refAmount: 1, emoji: '🥚' },
  { keywords: ['咸鸭蛋', '皮蛋', '松花蛋'], cal: 90, refUnit: '个', refAmount: 1, emoji: '🥚' },

  // ==================== 豆制品 ====================
  { keywords: ['嫩豆腐', '豆腐', '老豆腐', '北豆腐', '南豆腐', '内酯豆腐'], cal: 80, refUnit: '100g', refAmount: 100, emoji: '🫘' },
  { keywords: ['百叶结', '千张', '豆皮', '腐竹'], cal: 260, refUnit: '100g', refAmount: 100, emoji: '🫘' },
  { keywords: ['豆芽', '黄豆芽', '绿豆芽'], cal: 18, refUnit: '100g', refAmount: 100, emoji: '🌱' },
  { keywords: ['红豆', '红豆沙', '赤小豆'], cal: 310, refUnit: '100g（干）', refAmount: 100, emoji: '🫘' },
  { keywords: ['绿豆'], cal: 320, refUnit: '100g（干）', refAmount: 100, emoji: '🫘' },
  { keywords: ['豆浆'], cal: 32, refUnit: '100ml', refAmount: 100, emoji: '🥛' },

  // ==================== 蔬菜 ====================
  { keywords: ['土豆', '马铃薯'], cal: 81, refUnit: '100g', refAmount: 100, emoji: '🥔' },
  { keywords: ['番茄', '西红柿', '圣女果', '千禧'], cal: 18, refUnit: '100g', refAmount: 100, emoji: '🍅' },
  { keywords: ['茄子'], cal: 25, refUnit: '100g', refAmount: 100, emoji: '🍆' },
  { keywords: ['青椒', '彩椒', '辣椒', '尖椒', '杭椒'], cal: 22, refUnit: '100g', refAmount: 100, emoji: '🫑' },
  { keywords: ['木耳', '黑木耳', '银耳', '雪耳', '白木耳'], cal: 20, refUnit: '100g（泡发）', refAmount: 100, emoji: '🍄' },
  { keywords: ['香菇', '蘑菇', '杏鲍菇', '金针菇', '菌菇', '海鲜菇'], cal: 20, refUnit: '100g', refAmount: 100, emoji: '🍄' },
  { keywords: ['胡萝卜'], cal: 32, refUnit: '100g', refAmount: 100, emoji: '🥕' },
  { keywords: ['黄瓜', '青瓜'], cal: 15, refUnit: '100g', refAmount: 100, emoji: '🥒' },
  { keywords: ['花生米', '花生', '花生碎'], cal: 563, refUnit: '100g', refAmount: 100, emoji: '🥜' },
  { keywords: ['春笋', '笋', '竹笋'], cal: 25, refUnit: '100g', refAmount: 100, emoji: '🎍' },
  { keywords: ['生菜'], cal: 15, refUnit: '100g', refAmount: 100, emoji: '🥬' },
  { keywords: ['洋葱', '洋葱头'], cal: 40, refUnit: '100g', refAmount: 100, emoji: '🧅' },
  { keywords: ['香菜', '芫荽'], cal: 23, refUnit: '100g', refAmount: 100, emoji: '🌿' },
  { keywords: ['南瓜', '倭瓜'], cal: 26, refUnit: '100g', refAmount: 100, emoji: '🎃' },
  { keywords: ['玉米', '甜玉米', '水果玉米'], cal: 112, refUnit: '100g', refAmount: 100, emoji: '🌽' },
  { keywords: ['西蓝花', '西兰花', '花椰菜', '菜花', '花菜'], cal: 34, refUnit: '100g', refAmount: 100, emoji: '🥦' },
  { keywords: ['菠菜'], cal: 23, refUnit: '100g', refAmount: 100, emoji: '🥬' },
  { keywords: ['白菜', '大白菜', '娃娃菜'], cal: 14, refUnit: '100g', refAmount: 100, emoji: '🥬' },
  { keywords: ['山药', '铁棍山药'], cal: 57, refUnit: '100g', refAmount: 100, emoji: '🥖' },
  { keywords: ['莲藕', '藕'], cal: 73, refUnit: '100g', refAmount: 100, emoji: '🪷' },
  { keywords: ['红薯', '地瓜', '甘薯', '红苕'], cal: 86, refUnit: '100g', refAmount: 100, emoji: '🍠' },
  { keywords: ['紫薯'], cal: 82, refUnit: '100g', refAmount: 100, emoji: '🍠' },
  { keywords: ['秋葵'], cal: 33, refUnit: '100g', refAmount: 100, emoji: '🫘' },
  { keywords: ['丝瓜'], cal: 20, refUnit: '100g', refAmount: 100, emoji: '🥒' },
  { keywords: ['空心菜'], cal: 24, refUnit: '100g', refAmount: 100, emoji: '🥬' },

  // ==================== 水果 ====================
  { keywords: ['芒果', '芒果丁'], cal: 35, refUnit: '100g', refAmount: 100, emoji: '🥭' },
  { keywords: ['草莓', '草莓丁'], cal: 32, refUnit: '100g', refAmount: 100, emoji: '🍓' },
  { keywords: ['蓝莓'], cal: 57, refUnit: '100g', refAmount: 100, emoji: '🫐' },
  { keywords: ['香蕉'], cal: 90, refUnit: '100g（约1根）', refAmount: 100, emoji: '🍌' },
  { keywords: ['苹果', '富士'], cal: 52, refUnit: '100g', refAmount: 100, emoji: '🍎' },
  { keywords: ['橙子', '脐橙', '桔子', '橘子', '柑', '橘'], cal: 47, refUnit: '100g', refAmount: 100, emoji: '🍊' },
  { keywords: ['柠檬', '青柠'], cal: 29, refUnit: '100g', refAmount: 100, emoji: '🍋' },
  { keywords: ['西柚', '葡萄柚', '柚子', '蜜柚', '沙田柚'], cal: 42, refUnit: '100g', refAmount: 100, emoji: '🍊' },
  { keywords: ['桃子', '桃', '水蜜桃', '黄桃', '蜜桃'], cal: 39, refUnit: '100g', refAmount: 100, emoji: '🍑' },
  { keywords: ['樱桃', '车厘子'], cal: 63, refUnit: '100g', refAmount: 100, emoji: '🍒' },
  { keywords: ['葡萄', '提子', '巨峰'], cal: 69, refUnit: '100g', refAmount: 100, emoji: '🍇' },
  { keywords: ['西瓜'], cal: 30, refUnit: '100g', refAmount: 100, emoji: '🍉' },
  { keywords: ['哈密瓜'], cal: 34, refUnit: '100g', refAmount: 100, emoji: '🍈' },
  { keywords: ['木瓜'], cal: 43, refUnit: '100g', refAmount: 100, emoji: '🫐' },
  { keywords: ['西梅'], cal: 46, refUnit: '100g', refAmount: 100, emoji: '🫐' },
  { keywords: ['牛油果', '鳄梨'], cal: 160, refUnit: '100g', refAmount: 100, emoji: '🥑' },
  { keywords: ['百香果', '西番莲'], cal: 97, refUnit: '100g', refAmount: 100, emoji: '🫐' },
  { keywords: ['荔枝'], cal: 66, refUnit: '100g', refAmount: 100, emoji: '🍇' },
  { keywords: ['龙眼', '桂圆'], cal: 71, refUnit: '100g', refAmount: 100, emoji: '🍇' },

  // ==================== 乳制品 ====================
  { keywords: ['牛奶', '纯牛奶', '全脂牛奶'], cal: 65, refUnit: '100ml', refAmount: 100, emoji: '🥛' },
  { keywords: ['淡奶油', '动物奶油', '稀奶油'], cal: 350, refUnit: '100ml', refAmount: 100, emoji: '🥛' },
  { keywords: ['芝士片', '芝士', '奶酪', '马苏里拉', '马斯卡彭', '奶油奶酪'], cal: 350, refUnit: '100g', refAmount: 100, emoji: '🧀' },
  { keywords: ['黄油'], cal: 716, refUnit: '100g', refAmount: 100, emoji: '🧈' },
  { keywords: ['酸奶', '发酵乳'], cal: 72, refUnit: '100g', refAmount: 100, emoji: '🥛' },
  { keywords: ['炼乳', '炼奶'], cal: 330, refUnit: '100g', refAmount: 100, emoji: '🥛' },
  { keywords: ['椰浆', '椰奶', '椰汁'], cal: 150, refUnit: '100ml', refAmount: 100, emoji: '🥥' },
  { keywords: ['冰淇淋', '冰激凌'], cal: 200, refUnit: '100g', refAmount: 100, emoji: '🍦' },

  // ==================== 甜品烘焙原料 ====================
  { keywords: ['白砂糖', '白糖', '蔗糖', '糖霜', '糖粉', '冰糖', '果糖'], cal: 400, refUnit: '100g', refAmount: 100, emoji: '🍬' },
  { keywords: ['蜂蜜'], cal: 320, refUnit: '100g', refAmount: 100, emoji: '🍯' },
  { keywords: ['糖浆', '枫糖浆'], cal: 320, refUnit: '100ml', refAmount: 100, emoji: '🍯' },
  { keywords: ['巧克力', '巧克力豆', '黑巧'], cal: 550, refUnit: '100g', refAmount: 100, emoji: '🍫' },
  { keywords: ['抹茶粉'], cal: 200, refUnit: '100g', refAmount: 100, emoji: '🍵' },
  { keywords: ['可可粉'], cal: 230, refUnit: '100g', refAmount: 100, emoji: '🍫' },
  { keywords: ['奥利奥', '饼干', '消化饼', '手指饼干', '苏打饼干'], cal: 490, refUnit: '100g', refAmount: 100, emoji: '🍪' },
  { keywords: ['吉利丁片', '吉利丁', '琼脂', '白凉粉', '果冻粉'], cal: 0, refUnit: '忽略不计', refAmount: 1, emoji: '🫧' },

  // ==================== 饮品 ====================
  { keywords: ['可乐', '雪碧', '汽水', '苏打水', '无糖可乐'], cal: 43, refUnit: '100ml（可乐）', refAmount: 100, emoji: '🥤' },
  { keywords: ['浓缩咖啡', '意式浓缩', '咖啡'], cal: 2, refUnit: '30ml（浓缩）', refAmount: 30, emoji: '☕' },

  // ==================== 酒类 ====================
  { keywords: ['白酒', '朗姆酒', '白朗姆酒', '威士忌', '波本', '金酒', '伏特加', '龙舌兰', '君度'], cal: 240, refUnit: '100ml（烈酒）', refAmount: 100, emoji: '🥃' },
  { keywords: ['红酒', '赤霞珠', '葡萄酒', '干红'], cal: 85, refUnit: '100ml', refAmount: 100, emoji: '🍷' },
  { keywords: ['啤酒', '精酿啤酒', 'IPA'], cal: 45, refUnit: '100ml', refAmount: 100, emoji: '🍺' },
  { keywords: ['梅酒', '青梅酒'], cal: 120, refUnit: '100ml', refAmount: 100, emoji: '🍶' },
  { keywords: ['清酒', '日本酒'], cal: 105, refUnit: '100ml', refAmount: 100, emoji: '🍶' },

  // ==================== 食用油 ====================
  { keywords: ['玉米油', '植物油', '食用油', '花生油', '菜籽油', '橄榄油', '大豆油'], cal: 900, refUnit: '100g', refAmount: 100, emoji: '🫒' },

  // ==================== 坚果/干货 ====================
  { keywords: ['红枣', '大枣', '和田枣'], cal: 125, refUnit: '100g', refAmount: 100, emoji: '🫐' },
  { keywords: ['葡萄干'], cal: 340, refUnit: '100g', refAmount: 100, emoji: '🍇' },
  { keywords: ['核桃', '核桃仁'], cal: 650, refUnit: '100g', refAmount: 100, emoji: '🥜' },
  { keywords: ['腰果'], cal: 560, refUnit: '100g', refAmount: 100, emoji: '🥜' },
  { keywords: ['芝麻', '芝麻酱', '黑芝麻', '白芝麻'], cal: 560, refUnit: '100g', refAmount: 100, emoji: '🫘' },
  { keywords: ['莲子', '去芯莲子'], cal: 250, refUnit: '100g（干）', refAmount: 100, emoji: '🪷' },
  { keywords: ['桃胶'], cal: 0, refUnit: '忽略不计', refAmount: 1, emoji: '🫧' },

  // ==================== 其他 ====================
  { keywords: ['西柚肉'], cal: 42, refUnit: '100g', refAmount: 100, emoji: '🍊' },
  { keywords: ['蛋黄酱', '美乃滋', '沙拉酱'], cal: 700, refUnit: '100g', refAmount: 100, emoji: '🫒' },
  { keywords: ['黄豆酱', '豆瓣酱', '甜面酱', '番茄酱', '辣椒酱', '老干妈', '蚝油'], cal: 100, refUnit: '100g', refAmount: 100, emoji: '🫙' },
  { keywords: ['珍珠粉圆', '珍珠', '波霸', '西米'], cal: 360, refUnit: '100g（干）', refAmount: 100, emoji: '🫧' },
];

// 忽略不计的调味料（热量极低，不参与计算）
const NEGLIGIBLE_KEYWORDS = [
  '盐', '食用盐', '海盐',
  '生抽', '老抽', '酱油', '蒸鱼豉油',
  '醋', '陈醋', '香醋', '白醋', '米醋',
  '料酒', '黄酒', '米酒',
  '香油', '麻油', '花椒油', '辣椒油',
  '黑胡椒', '白胡椒', '胡椒粉', '花椒粉', '花椒',
  '干辣椒', '辣椒面', '辣椒粉', '孜然粉', '孜然粒',
  '八角', '桂皮', '香叶', '陈皮',
  '葱', '葱花', '葱姜', '小葱', '大葱', '洋葱丝',
  '姜', '姜片', '姜丝', '蒜末', '蒜', '大蒜',
  '香菜', '芫荽', '薄荷', '薄荷叶',
  '淀粉', '玉米淀粉', '土豆淀粉', '红薯淀粉', '木薯淀粉', '水淀粉',
  '水', '清水', '热水', '温水', '凉水', '冰块', '冰',
  '西红柿', // 已经在主DB里的番茄用 keywords 匹配更准确，但这里防止重复
  '时令蔬菜', '蔬菜', '青菜',
  '酒曲', '酵母', '泡打粉', '小苏打',
  '香草精', '香草', '柠檬汁',
  '汤力水', '可乐', '雪碧', // drink 类已在主DB中
];

/** 在主数据库中查找食材 */
export function lookupIngredient(name) {
  if (!name) return null;
  const n = name.trim();
  // 先检查是否忽略不计
  if (NEGLIGIBLE_KEYWORDS.some(kw => n.includes(kw))) return null;
  return CALORIE_DB.find(entry =>
    entry.keywords.some(kw => n.includes(kw))
  );
}

/** ========== 卡路里估算函数 ========== */

/**
 * 从做法文本中提取食材列表
 * 匹配 "材料：" 后的内容，按顿号/逗号分割
 */
export function extractIngredients(recipe) {
  if (!recipe) return [];
  // 匹配 "材料：" 后面的内容，直到空行或 "做法"
  const match = recipe.match(/材料[：:]\s*([\s\S]*?)(?:\n\s*\n|\n做法|$)/);
  if (!match) return [];
  const text = match[1].trim();
  if (!text) return [];
  // 按顿号、逗号、中文逗号、行分割
  return text.split(/[、，,|\n]\s*/).map(s => s.trim()).filter(Boolean);
}

/**
 * 解析单个食材项
 * @param {string} item - 如 "五花肉500g"、"鸡蛋3个"、"番茄2个"、"可乐1罐"
 * @returns {{ name: string, amount: number|null, unit: string|null }}
 */
export function parseIngredient(item) {
  if (!item) return { name: '', amount: null, unit: null };
  // 匹配：中文名 + 数字 + 单位（可选）
  const match = item.match(/^([\u4e00-\u9fff_a-zA-Z]+)\s*(\d+\.?\d*)\s*([gG克kK千mM升lL个片条袋包盒罐勺份碗块mlML根朵颗粒枚只][gG]?|kg|KG)?/);
  if (!match) {
    // 没有数量的食材（如 "时令蔬菜"），返回 null amount
    const nameMatch = item.match(/^([\u4e00-\u9fff_a-zA-Z]+)/);
    return { name: nameMatch ? nameMatch[1] : item, amount: null, unit: null };
  }
  return {
    name: match[1],
    amount: parseFloat(match[2]),
    unit: (match[3] || '').toLowerCase(),
  };
}

/** 常见食材单个的重量/体积估算（克/ml），用于 "个/根/朵/块" 等无重量单位时估算 */
const PIECE_WEIGHT = {
  '个': { '鸡蛋': 50, '番茄': 150, '土豆': 150, '橙子': 200, '苹果': 200,
          '桃子': 180, '柠檬': 80, '西柚': 250, '芒果': 200, '百香果': 50,
          '橙': 200, '洋葱': 150, '梨': 200, '猕猴桃': 80, '香蕉': 120 },
  '根': { '春笋': 150, '胡萝卜': 80, '黄瓜': 100, '葱': 10, '香蕉': 120 },
  '朵': { '香菇': 20, '银耳': 15, '木耳': 10, '雪耳': 20 },
  '块': { '姜': 15, '冰糖': 10 },
  '片': { '芝士片': 20, '吐司': 40, '面包': 40 },
};

/** 常见容器的容量估算 */
const CONTAINER_VOLUME = {
  '碗': { '米饭': 150 },  // 一碗米饭约150g
  '罐': { '可乐': 330 },  // 一罐可乐330ml
};

/**
 * 估算单个食材的热量
 * @returns {{ name, amount, unit, calories, emoji, detail } | null}
 */
function estimateSingle(item) {
  const parsed = parseIngredient(item);
  if (!parsed.name) return null;

  const entry = lookupIngredient(parsed.name);
  if (!entry || entry.cal === 0) return null;

  // 没有数量 → 无法估算
  if (parsed.amount === null) return null;

  // 尝试把数量换算成克
  let effectiveGrams = null;

  if (parsed.unit === 'g' || parsed.unit === '克') {
    effectiveGrams = parsed.amount;
  } else if (parsed.unit === 'kg') {
    effectiveGrams = parsed.amount * 1000;
  } else if (parsed.unit === 'ml' || parsed.unit === '毫升' || parsed.unit === 'l' || parsed.unit === '升') {
    // 1ml ≈ 1g（液体近似）
    effectiveGrams = parsed.unit === 'l' || parsed.unit === '升' ? parsed.amount * 1000 : parsed.amount;
  } else if (parsed.unit && PIECE_WEIGHT[parsed.unit]) {
    // 按个/根/朵等估算重量
    const pw = PIECE_WEIGHT[parsed.unit];
    // 精确匹配食材名
    let perWeight = null;
    for (const [key, w] of Object.entries(pw)) {
      if (parsed.name.includes(key)) {
        perWeight = w;
        break;
      }
    }
    // 如果没有精确匹配，取该单位的默认值（如一个鸡蛋50g）
    if (perWeight === null) {
      const defaults = { '个': 50, '根': 100, '朵': 20, '块': 30, '片': 20, '颗': 10, '粒': 5, '只': 100 };
      perWeight = defaults[parsed.unit] || 50;
    }
    effectiveGrams = parsed.amount * perWeight;
  } else if (parsed.unit === '碗' && CONTAINER_VOLUME['碗']) {
    for (const [key, v] of Object.entries(CONTAINER_VOLUME['碗'])) {
      if (parsed.name.includes(key)) {
        effectiveGrams = parsed.amount * v;
        break;
      }
    }
    if (effectiveGrams === null) effectiveGrams = parsed.amount * 150; // 默认一碗150g
  } else if (parsed.unit === '罐' && CONTAINER_VOLUME['罐']) {
    for (const [key, v] of Object.entries(CONTAINER_VOLUME['罐'])) {
      if (parsed.name.includes(key)) {
        effectiveGrams = parsed.amount * v;
        break;
      }
    }
    if (effectiveGrams === null) effectiveGrams = parsed.amount * 330;
  }

  // 计算热量
  let calories = 0;
  let detail = '';

  if (effectiveGrams !== null) {
    if (entry.refAmount === 1) {
      // 一个/片计算
      calories = Math.round(entry.cal * parsed.amount);
      detail = `${parsed.amount}${parsed.unit || '份'} × 每${entry.refUnit} ${entry.cal}卡`;
    } else {
      // 按重量计算
      calories = Math.round(entry.cal * (effectiveGrams / entry.refAmount));
      detail = `约${effectiveGrams}g × 每${entry.refUnit} ${entry.cal}卡`;
    }
  }

  if (calories <= 0) return null;

  return {
    name: parsed.name,
    amount: parsed.amount,
    unit: parsed.unit || '',
    calories,
    detail,
    emoji: entry.emoji,
    effectiveGrams: effectiveGrams || 0,
  };
}

/**
 * 检测做法中是否涉及油炸/煎，估算吸油量
 * 裹糊油炸：肉每100g吸油约18g
 * 不裹糊油炸：肉每100g吸油约10g
 * 煎（少油）：肉每100g吸油约5g
 */
function estimateFryingOil(recipe, meatTotalGrams) {
  if (!recipe || !meatTotalGrams || meatTotalGrams <= 0) return { oilGrams: 0, type: null };

  const hasDeepFry = /(?:炸至金黄|复炸|油炸|下油锅|炸到|炸好|炸一下|高温油炸)/.test(recipe);
  // "炸"字但不属于上面油炸场景的（如"炒/炖/煮"等其他场景），额外检查
  const hasSimpleFry = /(?:炸)/.test(recipe) && !hasDeepFry;
  const hasPanFry = /(?:煎至两面金黄|煎一下|少油|中小火煎)/.test(recipe);

  // 检测是否裹糊（有淀粉/面粉挂糊）
  const hasBatter = /(?:裹糊|挂糊|裹上|淀粉糊|面糊)/.test(recipe);

  // 对于有"炸至金黄"或"复炸"这类明确油炸描述的，即使没出现"裹糊"也视为裹糊油炸（锅包肉典型做法）
  const isBatterFry = hasDeepFry && (hasBatter || /(?:炸至金黄|复炸|下油锅)/.test(recipe));

  let oilPer100g = 0;
  let type = null;

  if (isBatterFry) {
    oilPer100g = 18; // 裹糊油炸
    type = '裹糊油炸';
  } else if (hasDeepFry) {
    oilPer100g = 12; // 直接油炸
    type = '油炸';
  } else if (hasPanFry) {
    oilPer100g = 5;  // 煎
    type = '油煎';
  }

  if (oilPer100g <= 0) return { oilGrams: 0, type: null };

  const oilGrams = Math.round(meatTotalGrams * oilPer100g / 100);
  return { oilGrams, type };
}

/**
 * 估算一道菜的总热量
 * @param {string} recipe - 做法文本
 * @returns {{ total: number, items: Array, riceBowls: number, displayTotal: string, displayRice: string, hasData: boolean }}
 */
export function estimateCalories(recipe) {
  const items = extractIngredients(recipe);
  const results = [];
  let total = 0;

  // 第一遍：计算已有食材热量，同时累计肉类重量
  let meatTotalGrams = 0;
  for (const item of items) {
    const est = estimateSingle(item);
    if (est && est.calories > 0) {
      results.push(est);
      total += est.calories;
      // 累计算作主要蛋白质来源的食材重量（用于估算油炸吸油）
      if (['🥩', '🍖', '🍗', '🥓', '🐑'].includes(est.emoji) && est.effectiveGrams > 0) {
        meatTotalGrams += est.effectiveGrams;
      }
    }
  }

  // 第二遍：检测做法中的油炸/煎，估算吸油量
  const { oilGrams, type } = estimateFryingOil(recipe, meatTotalGrams);
  if (oilGrams > 0 && type) {
    const OIL_CAL_PER_G = 9; // 1g油 ≈ 9卡
    const oilCal = Math.round(oilGrams * OIL_CAL_PER_G);
    results.push({
      name: `${type}用油`,
      amount: oilGrams,
      unit: 'g',
      calories: oilCal,
      emoji: '🧈',
      detail: `约${oilGrams}g × 食用油 每100g 900卡`,
      isFryingOil: true,
    });
    total += oilCal;
  }

  const RICE_CAL = 100; // 一碗米饭约100卡
  const riceBowls = total > 0 ? Math.round(total / RICE_CAL) : 0;

  return {
    total,
    items: results,
    riceBowls,
    displayTotal: total > 0 ? `约 ${total} 卡` : '',
    displayRice: riceBowls > 0 ? `≈ ${riceBowls} 碗米饭 🍚` : '',
    hasData: total > 0,
  };
}

export default CALORIE_DB;

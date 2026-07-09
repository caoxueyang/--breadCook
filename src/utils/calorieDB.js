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

  // ==================== 饮品/冲料 ====================
  { keywords: ['乌梅', '酸梅', '话梅'], cal: 33, refUnit: '100g（干）', refAmount: 100, emoji: '🫐' },
  { keywords: ['山楂'], cal: 95, refUnit: '100g（干）', refAmount: 100, emoji: '🫐' },
  { keywords: ['甘草'], cal: 100, refUnit: '100g（干）', refAmount: 100, emoji: '🌿' },
  { keywords: ['陈皮'], cal: 80, refUnit: '100g（干）', refAmount: 100, emoji: '🍊' },
  { keywords: ['桂花', '干桂花', '糖桂花'], cal: 50, refUnit: '100g（干）', refAmount: 100, emoji: '🌼' },
  { keywords: ['荷花', '梅花'], cal: 30, refUnit: '100g（干）', refAmount: 100, emoji: '🌸' },

  // ==================== 通用时令/野味 ====================
  { keywords: ['时令蔬菜', '蔬菜', '青菜'], cal: 30, refUnit: '100g', refAmount: 100, emoji: '🥬' },
  { keywords: ['野菜', '山野菜', '婆婆丁', '马齿苋', '山苜楂'], cal: 30, refUnit: '100g', refAmount: 100, emoji: '🌿' },

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
  { keywords: ['蛋清', '鸡蛋清', '蛋白'], cal: 17, refUnit: '个（约30g）', refAmount: 1, emoji: '🥚' },
  { keywords: ['蛋黄', '鸡蛋黄'], cal: 55, refUnit: '个', refAmount: 1, emoji: '🥚' },
  { keywords: ['鸡蛋', '全蛋'], cal: 70, refUnit: '个', refAmount: 1, emoji: '🥚' },
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
  { keywords: ['白酒', '烈酒'], cal: 240, refUnit: '100ml（烈酒）', refAmount: 100, emoji: '🥃' },
  { keywords: ['白朗姆', '白朗姆酒', '朗姆酒', '朗姆'], cal: 230, refUnit: '100ml', refAmount: 100, emoji: '🥃' },
  { keywords: ['威士忌', '波本威士忌', '波本', '黑麦威士忌'], cal: 250, refUnit: '100ml', refAmount: 100, emoji: '🥃' },
  { keywords: ['金酒', '琴酒', '杜松子酒'], cal: 220, refUnit: '100ml', refAmount: 100, emoji: '🥃' },
  { keywords: ['伏特加'], cal: 230, refUnit: '100ml', refAmount: 100, emoji: '🥃' },
  { keywords: ['龙舌兰', ' tequila'], cal: 230, refUnit: '100ml', refAmount: 100, emoji: '🥃' },
  { keywords: ['君度', '君度橙皮酒', '橙皮酒', '柑兰酒', '白柑兰酒', '柑曼怡'], cal: 320, refUnit: '100ml（利口酒）', refAmount: 100, emoji: '🥃' },
  { keywords: ['红酒', '赤霞珠', '葡萄酒', '干红'], cal: 85, refUnit: '100ml', refAmount: 100, emoji: '🍷' },
  { keywords: ['啤酒', '精酿啤酒', 'IPA', '拉格', '世涛'], cal: 45, refUnit: '100ml', refAmount: 100, emoji: '🍺' },
  { keywords: ['梅酒', '青梅酒'], cal: 120, refUnit: '100ml', refAmount: 100, emoji: '🍶' },
  { keywords: ['清酒', '日本酒', '纯米大酿酿'], cal: 105, refUnit: '100ml', refAmount: 100, emoji: '🍶' },

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
  { keywords: ['南杏仁', '杏仁', '巴旦木', '美国大杏仁'], cal: 580, refUnit: '100g', refAmount: 100, emoji: '🥜' },
  { keywords: ['开心果'], cal: 560, refUnit: '100g', refAmount: 100, emoji: '🥜' },
  { keywords: ['榛子'], cal: 540, refUnit: '100g', refAmount: 100, emoji: '🥜' },
  { keywords: ['葵花籽', '瓜子'], cal: 580, refUnit: '100g', refAmount: 100, emoji: '🥜' },

  // ==================== 其他 ====================
  { keywords: ['西柚肉'], cal: 42, refUnit: '100g', refAmount: 100, emoji: '🍊' },
  { keywords: ['蛋黄酱', '美乃滋', '沙拉酱'], cal: 700, refUnit: '100g', refAmount: 100, emoji: '🫒' },
  { keywords: ['黄豆酱', '豆瓣酱', '甜面酱', '番茄酱', '辣椒酱', '老干妈', '蚝油'], cal: 100, refUnit: '100g', refAmount: 100, emoji: '🫙' },
  { keywords: ['辣酱油', '辣味酱油'], cal: 80, refUnit: '100g', refAmount: 100, emoji: '🫙' },
  { keywords: ['焦糖酱', '焦糖'], cal: 280, refUnit: '100g', refAmount: 100, emoji: '🍯' },
  { keywords: ['香草糖浆'], cal: 280, refUnit: '100ml', refAmount: 100, emoji: '🍯' },
  { keywords: ['番茄汁'], cal: 18, refUnit: '100ml', refAmount: 100, emoji: '🍅' },
  { keywords: ['柠檬汁'], cal: 25, refUnit: '100ml', refAmount: 100, emoji: '🍋' },
  { keywords: ['青柠汁', '青柠'], cal: 25, refUnit: '100ml', refAmount: 100, emoji: '🍋' },
  { keywords: ['芹菜'], cal: 16, refUnit: '100g', refAmount: 100, emoji: '🥬' },
  { keywords: ['芹菜盐'], cal: 0, refUnit: '少量调味', refAmount: 1, emoji: '🧂' },
  { keywords: ['蛋清'], cal: 17, refUnit: '个（约30g）', refAmount: 1, emoji: '🥚' },
  { keywords: ['冰块'], cal: 0, refUnit: '忽略不计', refAmount: 1, emoji: '🧊' },
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
  '酒曲', '酵母', '泡打粉', '小苏打',
  '香草精', '香草', '柠檬汁',
  '汤力水', '可乐', '雪碧', // drink 类已在主DB中
];

/** 在主数据库中查找食材（优先匹配更长的关键词，避免“鸡蛋”抢占“蛋清”） */
export function lookupIngredient(name) {
  if (!name) return null;
  const n = name.trim();
  // 先查主数据库：优先匹配更长的关键词
  let best = null;
  let bestKwLen = 0;
  for (const entry of CALORIE_DB) {
    for (const kw of entry.keywords) {
      if (n.includes(kw) && kw.length > bestKwLen) {
        best = entry;
        bestKwLen = kw.length;
      }
    }
  }
  if (best) return best;
  // 命中调味料忽略表才返回 null
  if (NEGLIGIBLE_KEYWORDS.some(kw => n.includes(kw))) return null;
  return null;
}

/** ========== 卡路里估算函数 ========== */

/**
 * 从做法文本中提取食材列表
 * 匹配 "材料：" 后的内容，按顿号/逗号分割
 * 兑底：若无 "材料：" 段，尝试从描述中识别默认饮品
 */
export function extractIngredients(recipe) {
  if (!recipe) return [];
  // 匹配 "材料：" 后面的内容，直到空行或 "做法"
  const match = recipe.match(/材料[：:]\s*([\s\S]*?)(?:\n\s*\n|\n做法|$)/);
  if (match) {
    const text = match[1].trim();
    if (text) {
      return text.split(/[、，,|\n]\s*/).map(s => s.trim()).filter(Boolean);
    }
  }
  // 兑底：从描述中识别类型，默认加一个典型量
  return extractFromDescription(recipe);
}

/**
 * 兑底：一些饮品/商品只写描述没写材料，从描述里推断默认量
 */
function extractFromDescription(recipe) {
  if (!recipe) return [];
  const items = [];
  // 红酒类：一杯 150ml
  if (/赤霞珠|葡萄酒|干红|红酒|梅多克/.test(recipe)) items.push('红酒150ml');
  // 啤酒类：一罐 330ml
  if (/啤酒|IPA|精酿|拉格|世涛/.test(recipe)) items.push('啤酒330ml');
  // 清酒：一杯 150ml
  if (/纯米|大酿酿|清酒|日本酒|吟酿/.test(recipe)) items.push('清酒150ml');
  // 单一酒名
  if (/茅台|五粮液|汾酒|泸州老窖/.test(recipe)) items.push('白酒50ml');
  if (/黄酒|绍兴酒|花雕/.test(recipe)) items.push('黄酒150ml');
  if (/朗姆|威士忌|伏特加|金酒|龙舌兰|白兰地/.test(recipe)) items.push('烈酒50ml');
  return items;
}

/**
 * 解析单个食材项
 * @param {string} item - 如 "五花肉500g"、"鸡蛋3个"、"番茄2个"、"可乐1罐"
 * @returns {{ name: string, amount: number|null, unit: string|null }}
 */
export function parseIngredient(item) {
  if (!item) return { name: '', amount: null, unit: null };
  // 重要：kg / ml 是两字符单位，必须放在字符类外面作为整体备选项
  const match = item.match(/^([\u4e00-\u9fff_a-zA-Z]+)\s*(\d+\.?\d*)?\s*(kg|KG|ml|ML|dl|DL|斤|两|克|[gG千mMlL个片条袋包盒罐勺份碗块根朵颗粒枚只])?/);
  if (!match) {
    // 没有数量的食材（如 "时令蔬菜"），返回 null amount
    const nameMatch = item.match(/^([\u4e00-\u9fff_a-zA-Z]+)/);
    return { name: nameMatch ? nameMatch[1] : item, amount: null, unit: null };
  }
  let unit = (match[3] || '').toLowerCase();
  // 兜底：单字符 "m" 其实是 "ml" 被错配的，保持原文以提高匹配准确率
  return {
    name: match[1],
    amount: match[2] !== undefined ? parseFloat(match[2]) : null,
    unit: unit || null,
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
 * 默认用量表（克/ml/个等），当材料中未指定数量时使用
 * 尽量贴合"一道菜里的常规用量"，避免估计算得过低
 */
const DEFAULT_AMOUNTS = {
  // ===== 蔬菜叶菜类（默认 200g/份）=====
  '时令蔬菜': { amount: 200, unit: 'g' },
  '青菜': { amount: 200, unit: 'g' },
  '绿叶菜': { amount: 200, unit: 'g' },
  '蔬菜': { amount: 200, unit: 'g' },
  '生菜': { amount: 100, unit: 'g' },
  '菠菜': { amount: 150, unit: 'g' },
  '白菜': { amount: 200, unit: 'g' },
  '油菜': { amount: 150, unit: 'g' },
  '油麦菜': { amount: 150, unit: 'g' },
  '茼蒿': { amount: 150, unit: 'g' },
  '芥蓝': { amount: 150, unit: 'g' },
  '韭菜': { amount: 100, unit: 'g' },
  '芹菜': { amount: 100, unit: 'g' },
  '苦菊': { amount: 80, unit: 'g' },
  '紫甘蓝': { amount: 100, unit: 'g' },
  '卷心菜': { amount: 150, unit: 'g' },
  '包菜': { amount: 150, unit: 'g' },
  '花菜': { amount: 150, unit: 'g' },
  '菜花': { amount: 150, unit: 'g' },
  '西蓝花': { amount: 150, unit: 'g' },
  '西兰花': { amount: 150, unit: 'g' },
  '豆苗': { amount: 100, unit: 'g' },
  '豆芽': { amount: 150, unit: 'g' },
  '绿豆芽': { amount: 150, unit: 'g' },
  '黄豆芽': { amount: 150, unit: 'g' },
  '春菜': { amount: 200, unit: 'g' },

  // ===== 根茎类 =====
  '土豆': { amount: 150, unit: 'g' },
  '马铃薯': { amount: 150, unit: 'g' },
  '胡萝卜': { amount: 80, unit: 'g' },
  '白萝卜': { amount: 150, unit: 'g' },
  '红薯': { amount: 200, unit: 'g' },
  '地瓜': { amount: 200, unit: 'g' },
  '甘薯': { amount: 200, unit: 'g' },
  '莲藕': { amount: 150, unit: 'g' },
  '藕': { amount: 150, unit: 'g' },
  '山药': { amount: 100, unit: 'g' },
  '芋头': { amount: 150, unit: 'g' },
  '紫薯': { amount: 150, unit: 'g' },

  // ===== 瓜茄类 =====
  '番茄': { amount: 150, unit: 'g' },
  '西红柿': { amount: 150, unit: 'g' },
  '茄子': { amount: 200, unit: 'g' },
  '黄瓜': { amount: 100, unit: 'g' },
  '青瓜': { amount: 100, unit: 'g' },
  '冬瓜': { amount: 200, unit: 'g' },
  '南瓜': { amount: 200, unit: 'g' },
  '苦瓜': { amount: 150, unit: 'g' },
  '丝瓜': { amount: 150, unit: 'g' },
  '西葫芦': { amount: 200, unit: 'g' },
  '青椒': { amount: 80, unit: 'g' },
  '辣椒': { amount: 50, unit: 'g' },
  '彩椒': { amount: 80, unit: 'g' },
  '杭椒': { amount: 50, unit: 'g' },
  '秋葵': { amount: 100, unit: 'g' },
  '洋葱': { amount: 100, unit: 'g' },

  // ===== 菌菇类 =====
  '香菇': { amount: 50, unit: 'g' },
  '蘑菇': { amount: 80, unit: 'g' },
  '杏鲍菇': { amount: 100, unit: 'g' },
  '金针菇': { amount: 100, unit: 'g' },
  '黑木耳': { amount: 30, unit: 'g' },
  '木耳': { amount: 30, unit: 'g' },
  '银耳': { amount: 20, unit: 'g' },
  '雪耳': { amount: 20, unit: 'g' },

  // ===== 豆制品 =====
  '豆腐': { amount: 300, unit: 'g' },
  '嫩豆腐': { amount: 300, unit: 'g' },
  '老豆腐': { amount: 300, unit: 'g' },
  '北豆腐': { amount: 300, unit: 'g' },
  '南豆腐': { amount: 300, unit: 'g' },
  '内酯豆腐': { amount: 300, unit: 'g' },
  '豆皮': { amount: 30, unit: 'g' },
  '千张': { amount: 30, unit: 'g' },
  '百叶结': { amount: 30, unit: 'g' },
  '腐竹': { amount: 30, unit: 'g' },
  '豆腐皮': { amount: 30, unit: 'g' },
  '豆腐干': { amount: 50, unit: 'g' },

  // ===== 鲜肉（默认 100g/份）=====
  '猪肉末': { amount: 100, unit: 'g' },
  '肉末': { amount: 100, unit: 'g' },
  '猪肉馅': { amount: 100, unit: 'g' },
  '肉馅': { amount: 100, unit: 'g' },
  '鲜肉': { amount: 100, unit: 'g' },

  // ===== 海鲜水产 =====
  '草鱼': { amount: 300, unit: 'g' },
  '草鱼片': { amount: 300, unit: 'g' },
  '鱼片': { amount: 250, unit: 'g' },
  '鱼': { amount: 300, unit: 'g' },
  '虾': { amount: 150, unit: 'g' },
  '虾仁': { amount: 100, unit: 'g' },
  '大虾': { amount: 150, unit: 'g' },
  '花蛤': { amount: 200, unit: 'g' },
  '蛤蜊': { amount: 200, unit: 'g' },
  '扇贝': { amount: 150, unit: 'g' },
  '蛏子': { amount: 150, unit: 'g' },
  '海虹': { amount: 200, unit: 'g' },
  '青口': { amount: 200, unit: 'g' },

  // ===== 加工肉 =====
  '火腿': { amount: 50, unit: 'g' },
  '火腿肠': { amount: 50, unit: 'g' },
  '培根': { amount: 50, unit: 'g' },
  '香肠': { amount: 50, unit: 'g' },
  '腊肠': { amount: 50, unit: 'g' },
  '咸肉': { amount: 100, unit: 'g' },
  '腊肉': { amount: 80, unit: 'g' },

  // ===== 甜品原料 =====
  '黄豆粉': { amount: 30, unit: 'g' },
  '马苏里拉': { amount: 50, unit: 'g' },
  '马斯卡彭': { amount: 100, unit: 'g' },
  '芝士片': { amount: 1, unit: '片' },
  '红豆沙': { amount: 80, unit: 'g' },
  '桃胶': { amount: 15, unit: 'g' },
  '桂圆': { amount: 30, unit: 'g' },
  '红枣': { amount: 30, unit: 'g' },
  '大枣': { amount: 30, unit: 'g' },
  '莲子': { amount: 30, unit: 'g' },
  '花生': { amount: 30, unit: 'g' },
  '花生米': { amount: 30, unit: 'g' },
  '芝麻': { amount: 10, unit: 'g' },
  '葡萄干': { amount: 20, unit: 'g' },
  '椰浆': { amount: 100, unit: 'ml' },
  '椰奶': { amount: 100, unit: 'ml' },
  '椰汁': { amount: 100, unit: 'ml' },
  '炼乳': { amount: 20, unit: 'g' },

  // ===== 酒水 =====
  '红酒': { amount: 150, unit: 'ml' },
  '啤酒': { amount: 330, unit: 'ml' },
  '苏打水': { amount: 150, unit: 'ml' },
  '汤力水': { amount: 150, unit: 'ml' },

  // ===== 通用兜底 =====
  '时令水果': { amount: 150, unit: 'g' },
  '水果': { amount: 150, unit: 'g' },

  // ===== 甜品/调昧凉拌酱 =====
  '蛋黄酱': { amount: 20, unit: 'g' },
  '美乃滋': { amount: 20, unit: 'g' },
  '沙拉酱': { amount: 20, unit: 'g' },
  '香菜': { amount: 10, unit: 'g' },
  '香葱': { amount: 10, unit: 'g' },
  '冰糖': { amount: 30, unit: 'g' },
  '麦芽糖': { amount: 30, unit: 'g' },
  '冰块': { amount: 100, unit: 'g' },

  // ===== 冲煮饮品材料 =====
  '乌梅': { amount: 30, unit: 'g' },
  '山楂': { amount: 20, unit: 'g' },
  '甘草': { amount: 5, unit: 'g' },
  '桂花': { amount: 3, unit: 'g' },
  '薄荷': { amount: 5, unit: 'g' },
  '荷叶': { amount: 5, unit: 'g' },
  '红茶包': { amount: 1, unit: '个' },
  '红茶': { amount: 5, unit: 'g' },
  '茶叶': { amount: 5, unit: 'g' },
  '咖啡': { amount: 30, unit: 'ml' },
  '浓缩咖啡': { amount: 30, unit: 'ml' },
  '意式浓缩': { amount: 30, unit: 'ml' },

  // ===== 调昧酱料 =======
  '蜂蜜': { amount: 10, unit: 'g' },
  '可可粉': { amount: 5, unit: 'g' },
  '香草糖浆': { amount: 10, unit: 'ml' },
  '糖浆': { amount: 10, unit: 'ml' },
  '枫糖浆': { amount: 10, unit: 'ml' },
  '焦糖酱': { amount: 15, unit: 'g' },
  '焦糖': { amount: 15, unit: 'g' },
  '炼乳': { amount: 20, unit: 'g' },
  '炼奶': { amount: 20, unit: 'g' },
  '辣酱油': { amount: 5, unit: 'g' },
  '辣味酱油': { amount: 5, unit: 'g' },

  // ===== 饮品装饰 ======
  '青柠角': { amount: 15, unit: 'g' },
  '青柠': { amount: 15, unit: 'g' },
  '柠檬角': { amount: 20, unit: 'g' },
  '柠檬片': { amount: 20, unit: 'g' },
  '冰块': { amount: 100, unit: 'g' },
  '薄荷叶': { amount: 5, unit: 'g' },
  '樱桃': { amount: 5, unit: 'g' },
  '橙皮': { amount: 5, unit: 'g' },
  '芹菜盐': { amount: 2, unit: 'g' },
  '芹菜棒': { amount: 20, unit: 'g' },

  // ===== 蛋类 =====
  '蛋黄': { amount: 1, unit: '个' },
  '蛋清': { amount: 1, unit: '个' },
  '鸡蛋黄': { amount: 1, unit: '个' },
  '鸡蛋清': { amount: 1, unit: '个' },

  // ===== 坚果/酱 ======
  '南杏仁': { amount: 30, unit: 'g' },
  '杏仁': { amount: 30, unit: 'g' },
};

/** 根据食材名获取默认用量 */
function getDefaultAmount(name) {
  if (!name) return null;
  for (const [key, val] of Object.entries(DEFAULT_AMOUNTS)) {
    if (name.includes(key)) return val;
  }
  return null;
}

/**
 * 估算单个食材的热量
 * @returns {{ name, amount, unit, calories, emoji, detail } | null}
 */
function estimateSingle(item) {
  const parsed = parseIngredient(item);
  if (!parsed.name) return null;

  const entry = lookupIngredient(parsed.name);
  if (!entry || entry.cal === 0) return null;

  // 没有数量 → 查默认用量表
  if (parsed.amount === null) {
    const def = getDefaultAmount(parsed.name);
    if (!def) return null;
    parsed.amount = def.amount;
    parsed.unit = def.unit;
  }

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
 * 估算一道菜中“烹饪用油”的总量
 * 返回 { oilGrams, type }，type 仅为提示用名
 *
 * 油炸/裹糊 需根据 meatGrams / vegGrams 分别按不同吸油率计算
 * 其余炝炒方式 按固定量估算
 */
function estimateCookingOil(recipe, meatGrams = 0, vegGrams = 0) {
  if (!recipe) return { oilGrams: 0, type: null };

  const hasText = (re) => re.test(recipe);

  // 高优先级：油炸（需计算）
  const hasDeepFry = hasText(/(?:炸至金黄|复炸|油炸|下油锅|炸到|炸好|炸一下|高温油炸)/);
  const hasBatter = hasText(/(?:裹糊|挂糊|裹上|淀粉糊|面糊)/);
  // 裹糊油炸：包含"炸至金黄/复炸/下油锅"等明确场景
  const isBatterFry = hasDeepFry && (hasBatter || hasText(/(?:炸至金黄|复炸|下油锅)/));

  if (isBatterFry) {
    // 裹糊吸油率：肉18g/100g，蔬果10g/100g
    const oil = meatGrams * 18 / 100 + vegGrams * 10 / 100;
    return { oilGrams: Math.round(oil), type: '裹糊油炸' };
  }
  if (hasDeepFry) {
    // 直接油炸：肉12g/100g，蔬果6g/100g
    const oil = meatGrams * 12 / 100 + vegGrams * 6 / 100;
    return { oilGrams: Math.round(oil), type: '油炸' };
  }

  // 油泼/激香（需要单独起油锅的结尾手法）
  if (hasText(/(?:浇热油激香|油泼|激油)/)) {
    return { oilGrams: 30, type: '油泼激香' };
  }
  // 爆炒/干煸
  if (hasText(/(?:爆炒|干煸)/)) {
    return { oilGrams: 20, type: '爆炒' };
  }
  // 红烧/焖（优先级高：避免“红烧肉”里出现“炒糖色”关键词被误判为清炒）
  if (hasText(/(?:红烧|焖|慢炖)/)) {
    return { oilGrams: 10, type: '红烧' };
  }
  // 清炒/滑炒
  if (hasText(/(?:清炒|滑炒|大火快炒|翻炒|煸炒|炒香|炒至|翻炒均匀)/)) {
    return { oilGrams: 12, type: '清炒' };
  }
  // 煎
  if (hasText(/(?:煎至两面金黄|煎一下|煎熟|中小火煎|小火煎)/)) {
    return { oilGrams: 5, type: '油煎' };
  }
  // 凉拌
  if (hasText(/(?:凉拌|拌入|拌匀)/)) {
    return { oilGrams: 5, type: '凉拌' };
  }
  // 炒豆酱/炒糖色/炒出红油
  if (hasText(/(?:炒出红油|炒糖色|炒香|煸出)/)) {
    return { oilGrams: 10, type: '炒香' };
  }

  return { oilGrams: 0, type: null };
}

/**
 * 估算一道菜的总热量
 * @param {string} recipe - 做法文本
 * @param {number} [servings] - 几人份（不传则按1份计）
 * @returns {{ total: number, perServing: number, servings: number, items: Array, riceBowls: number, displayTotal: string, displayPerServing: string, displayRice: string, hasData: boolean }}
 */
export function estimateCalories(recipe, servings = 1) {
  const items = extractIngredients(recipe);
  const results = [];
  let total = 0;

  // 累计肉类/蔬果类总重量（用于估算油炸吸油量）
  let meatGrams = 0;
  let vegGrams = 0;
  const MEAT_EMOJI = ['🥩', '🍖', '🍗', '🥓', '🐑', '🐟', '🦐', '🦀', '🦪', '🥚', '🦑'];
  const VEG_EMOJI = ['🥬', '🥔', '🥕', '🍆', '🥒', '🌽', '🥦', '🍄', '🫑', '🌶', '🫛', '🫘', '🌱', '🍅', '🍠'];

  for (const item of items) {
    const est = estimateSingle(item);
    if (est && est.calories > 0) {
      results.push(est);
      total += est.calories;
      if (est.effectiveGrams > 0) {
        if (MEAT_EMOJI.includes(est.emoji)) {
          meatGrams += est.effectiveGrams;
        } else if (VEG_EMOJI.includes(est.emoji)) {
          vegGrams += est.effectiveGrams;
        }
      }
    }
  }

  // 第二遍：检测做法中的烹饪用油
  const { oilGrams, type } = estimateCookingOil(recipe, meatGrams, vegGrams);
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
      isCookingOil: true,
    });
    total += oilCal;
  }

  // 按份数拆解
  const safeServings = Math.max(1, Number(servings) || 1);
  const perServing = Math.round(total / safeServings);
  const RICE_CAL = 100; // 一碗米饭约100卡
  const riceBowls = perServing > 0 ? Math.round(perServing / RICE_CAL) : 0;

  return {
    total,
    perServing,
    servings: safeServings,
    items: results,
    riceBowls,
    displayTotal: total > 0 ? `约 ${total} 卡` : '',
    displayPerServing: perServing > 0 ? `每份约 ${perServing} 卡` : '',
    displayRice: riceBowls > 0 ? `≈ ${riceBowls} 碗米饭 🍚` : '',
    hasData: total > 0,
  };
}

export default CALORIE_DB;

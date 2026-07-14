// localStorage CRUD 工具函数
const DISHES_KEY = 'menu_app_dishes';
const THEME_KEY = 'menu_app_theme';

// 预置示例菜品数据
// servings 字段：一道菜默认几人份（依据主食材量推定）
//   · 肉类主菜（500g）→ 4-5 份
//   · 蔬菜小菜 → 2 份
//   · 主食（饭/面）→ 2-4 份
//   · 饮品酒水 → 按容器算（1 杯/1 罐 = 1 份）
export const SAMPLE_DISHES = [
  // 菜品
  {
    id: '1', name: '红烧肉', category: 'dishes',
    tags: ['东北菜'],
    servings: 5, // 五花肉 500g / 1人 100g
    recipe: '材料：五花肉500g、生抽、老抽、冰糖、八角、桂皮、葱姜\n\n做法：\n1. 五花肉切块，冷水下锅焯水去血沫\n2. 锅中放油，加冰糖炒糖色\n3. 放入五花肉翻炒上色\n4. 加入生抽、老抽、八角、桂皮、葱姜\n5. 加热水没过肉块，大火烧开转小火炖1小时\n6. 大火收汁即可',
    image: '', createdAt: Date.now() - 86400000 * 5, updatedAt: Date.now() - 86400000 * 5
  },
  {
    id: '2', name: '清炒时蔬', category: 'dishes',
    tags: ['应季菜'],
    servings: 2, // 一盘青菜 2 人份
    recipe: '材料：时令蔬菜、蒜末、盐、食用油\n\n做法：\n1. 蔬菜洗净切段\n2. 热锅凉油，蒜末爆香\n3. 大火快炒蔬菜\n4. 加盐调味，翻炒均匀出锅',
    image: '', createdAt: Date.now() - 86400000 * 4, updatedAt: Date.now() - 86400000 * 4
  },
  {
    id: '3', name: '番茄炒蛋', category: 'dishes',
    tags: ['我的最爱'],
    servings: 2, // 3个蛋 2 人份
    recipe: '材料：番茄2个、鸡蛋3个、盐、糖、葱\n\n做法：\n1. 番茄切块，鸡蛋打散加少许盐\n2. 热油炒蛋液凝固盛出\n3. 锅中留油炒番茄，加少许糖\n4. 番茄出汁后加入炒蛋\n5. 加盐调味，撒葱花出锅',
    image: '', createdAt: Date.now() - 86400000 * 3, updatedAt: Date.now() - 86400000 * 3
  },
  {
    id: '4', name: '水煮鱼', category: 'dishes',
    tags: [],
    servings: 4, // 汤面多 4 人份
    recipe: '材料：草鱼片、豆芽、花椒、干辣椒、豆瓣酱、蒜\n\n做法：\n1. 鱼片用盐、料酒、淀粉腌制15分钟\n2. 豆芽焯水铺碗底\n3. 炒豆瓣酱出红油，加水煮开\n4. 下鱼片滑散，煮2分钟捞出\n5. 撒上花椒、干辣椒、蒜末\n6. 浇热油激香',
    image: '', createdAt: Date.now() - 86400000 * 2, updatedAt: Date.now() - 86400000 * 2
  },
  {
    id: '11', name: '锅包肉', category: 'dishes',
    tags: ['我的最爱', '东北菜'],
    servings: 3, // 里脊 300g 3 人份
    recipe: '材料：猪里脊肉300g、土豆淀粉、胡萝卜、香菜、白糖、白醋、番茄酱\n\n做法：\n1. 里脊肉切薄片，用盐、料酒腌制\n2. 土豆淀粉加水调成糊，肉片裹糊\n3. 油温六成熟下锅炸至金黄捞出\n4. 油温升高后复炸一次更酥脆\n5. 锅留底油，加白糖、白醋、番茄酱炒成糖醋汁\n6. 倒入肉片翻炒，加胡萝卜丝、香菜出锅',
    image: '', createdAt: Date.now() - 86400000 * 11, updatedAt: Date.now() - 86400000 * 11
  },
  {
    id: '12', name: '地三鲜', category: 'dishes',
    tags: ['我的最爱', '东北菜'],
    servings: 3, // 茄子+土豆+青椒 一大盘
    recipe: '材料：茄子、土豆、青椒、蒜末、生抽、老抽、蚝油、淀粉\n\n做法：\n1. 茄子、土豆切滚刀块，青椒切块\n2. 土豆和茄子分别炸至金黄捞出\n3. 锅留底油，炒香蒜末\n4. 加生抽、老抽、蚝油、糖、水调成酱汁\n5. 倒入炸好的土豆茄子翻炒\n6. 加入青椒炒匀，勾薄芡出锅',
    image: '', createdAt: Date.now() - 86400000 * 12, updatedAt: Date.now() - 86400000 * 12
  },
  {
    id: '13', name: '鱼香肉丝', category: 'dishes',
    tags: ['我的最爱'],
    servings: 2, // 里脊 200g 2 人份
    recipe: '材料：猪里脊肉200g、木耳、胡萝卜、青椒、豆瓣酱、醋、糖、淀粉\n\n做法：\n1. 里脊肉切丝，用盐、料酒、淀粉腌制\n2. 木耳、胡萝卜、青椒切丝\n3. 调鱼香汁：醋、糖、生抽、淀粉水\n4. 热油炒肉丝变色盛出\n5. 炒豆瓣酱出红油，加配菜翻炒\n6. 倒回肉丝，淋鱼香汁翻炒均匀',
    image: '', createdAt: Date.now() - 86400000 * 13, updatedAt: Date.now() - 86400000 * 13
  },
  {
    id: '14', name: '腌笃鲜', category: 'dishes',
    tags: ['应季菜', '包包的最爱'],
    servings: 5, // 汤多 5 人份
    recipe: '材料：咸肉200g、鲜肉200g、春笋2根、百叶结、葱姜、料酒\n\n做法：\n1. 咸肉和鲜肉分别焯水去血沫\n2. 春笋剥壳切滚刀块焯水去涩\n3. 砂锅中加足量水，放入咸肉和鲜肉\n4. 加葱姜、料酒，大火烧开转小火炖1小时\n5. 加入春笋和百叶结继续炖30分钟\n6. 加盐调味，撒葱花出锅',
    image: '', createdAt: Date.now() - 86400000 * 14, updatedAt: Date.now() - 86400000 * 14
  },
  {
    id: '15', name: '红烧排骨', category: 'dishes',
    tags: ['包包的最爱', '东北菜'],
    servings: 4, // 排骨 500g 4 人份
    recipe: '材料：排骨500g、生抽、老抽、冰糖、八角、桂皮、葱姜蒜\n\n做法：\n1. 排骨冷水下锅焯水去血沫\n2. 锅中放油，加冰糖炒糖色\n3. 放入排骨翻炒上色\n4. 加生抽、老抽、八角、桂皮\n5. 加热水没过排骨，大火烧开转小火炖40分钟\n6. 大火收汁，撒葱花出锅',
    image: '', createdAt: Date.now() - 86400000 * 15, updatedAt: Date.now() - 86400000 * 15
  },
  {
    id: '16', name: '排骨焖饭', category: 'dishes',
    tags: ['东北菜'],
    servings: 4, // 排骨+米 4 人份
    recipe: '材料：排骨300g、大米、土豆、胡萝卜、生抽、老抽、蚝油\n\n做法：\n1. 排骨焯水，用生抽、老抽、蚝油腌制\n2. 土豆、胡萝卜切丁\n3. 锅中放油，炒香排骨\n4. 加入土豆胡萝卜翻炒\n5. 大米洗净放入电饭煲，铺上炒好的排骨\n6. 加水没过食材，按煮饭键，熟后拌匀',
    image: '', createdAt: Date.now() - 86400000 * 16, updatedAt: Date.now() - 86400000 * 16
  },
  {
    id: '17', name: '酸辣土豆丝', category: 'dishes',
    tags: ['东北菜'],
    servings: 2, // 2个土豆 2 人份
    recipe: '材料：土豆2个、干辣椒、花椒、醋、盐、葱\n\n做法：\n1. 土豆切细丝，泡水去淀粉\n2. 热油炒花椒出香味捞出\n3. 加干辣椒、蒜片爆香\n4. 大火快炒土豆丝\n5. 加醋、盐调味\n6. 炒至断生，撒葱花出锅',
    image: '', createdAt: Date.now() - 86400000 * 17, updatedAt: Date.now() - 86400000 * 17
  },
  {
    id: '18', name: '宫保鸡丁', category: 'dishes',
    tags: [],
    servings: 2, // 鸡胸 300g 2 人份
    recipe: '材料：鸡胸肉300g、花生米、干辣椒、花椒、黄瓜、葱姜蒜\n\n做法：\n1. 鸡胸肉切丁，用盐、料酒、淀粉腌制\n2. 花生米炸至金黄备用\n3. 调宫保汁：醋、糖、生抽、淀粉水\n4. 热油炒鸡丁变色盛出\n5. 炒干辣椒、花椒、葱姜蒜\n6. 倒回鸡丁，淋宫保汁翻炒，撒花生米出锅',
    image: '', createdAt: Date.now() - 86400000 * 18, updatedAt: Date.now() - 86400000 * 18
  },
  {
    id: '19', name: '麻婆豆腐', category: 'dishes',
    tags: [],
    servings: 2, // 一盒豆腐 2 人份
    recipe: '材料：嫩豆腐1块、猪肉末100g、豆瓣酱、花椒粉、蒜末、葱花\n\n做法：\n1. 豆腐切小块，开水焯烫备用\n2. 热油炒肉末至变色\n3. 加豆瓣酱炒出红油\n4. 加水煮开，放入豆腐炖煮3分钟\n5. 勾芡收汁\n6. 撒花椒粉、葱花出锅',
    image: '', createdAt: Date.now() - 86400000 * 19, updatedAt: Date.now() - 86400000 * 19
  },
  {
    id: '20', name: '糖醋里脊', category: 'dishes',
    tags: ['包包的最爱', '东北菜'],
    servings: 3, // 里脊 300g 3 人份
    recipe: '材料：猪里脊肉300g、淀粉、白糖、醋、番茄酱、盐\n\n做法：\n1. 里脊肉切条，用盐、料酒腌制\n2. 裹上淀粉糊\n3. 油温六成熟炸至金黄捞出\n4. 复炸一次更酥脆\n5. 锅留底油，加白糖、醋、番茄酱炒成糖醋汁\n6. 倒入里脊翻炒均匀出锅',
    image: '', createdAt: Date.now() - 86400000 * 20, updatedAt: Date.now() - 86400000 * 20
  },
  {
    id: '31', name: '土豆丝卷饼', category: 'dishes',
    tags: ['东北菜'],
    servings: 4, // 200g面粉 出4张饼
    recipe: '材料：土豆1个、面粉200g、葱、生抽、蚝油、黄豆酱\n\n做法：\n1. 面粉加热水揉成面团，醒20分钟\n2. 土豆去皮擦丝，泡水去淀粉\n3. 热油炒香葱花，加入黄豆酱、蚝油、生抽炒匀\n4. 倒入土豆丝翻炒至断生\n5. 面团分剂子抨成薄饼，烙熟\n6. 薄饼卷入炒好的土豆丝即可',
    image: '', createdAt: Date.now() - 86400000 * 31, updatedAt: Date.now() - 86400000 * 31
  },
  {
    id: '32', name: '三明治', category: 'dishes',
    tags: ['白人饭'],
    servings: 2, // 4片吐司 = 2 个三明治
    recipe: '材料：吐司面包4片、火腿、芝士片、生菜、番茄、蛋黄酱\n\n做法：\n1. 吐司面包去边\n2. 生菜洗净沥干，番茄切片\n3. 取一片吐司，抹蛋黄酱\n4. 依次铺上生菜、番茄片、芝士、火腿\n5. 盖上另一片吐司压紧\n6. 对角切开即可食用',
    image: '', createdAt: Date.now() - 86400000 * 32, updatedAt: Date.now() - 86400000 * 32
  },
  {
    id: '33', name: '可乐鸡翅', category: 'dishes',
    tags: [],
    servings: 2, // 10个翅 2 人份（1人5个）
    recipe: '材料：鸡翅中10个、可乐1罐、生抽、老抽、葱姜、八角\n\n做法：\n1. 鸡翅两面划刀，冷水焯水去血沫\n2. 锅中少油，鸡翅煎至两面金黄\n3. 加葱姜、八角炒香\n4. 倒入生抽、老抽炒上色\n5. 倒入可乐没过鸡翅\n6. 大火烧开转小火炖20分钟，大火收汁',
    image: '', createdAt: Date.now() - 86400000 * 33, updatedAt: Date.now() - 86400000 * 33
  },
  {
    id: '34', name: '蛋炒饭', category: 'dishes',
    tags: [],
    servings: 2, // 2碗饭 2 人份
    recipe: '材料：隔夜米饭2碗、鸡蛋2个、葱花、盐、生抽\n\n做法：\n1. 鸡蛋打散加少许盐\n2. 热油炒蛋液凝固划散盛出\n3. 锅中留底油，倒入米饭炒散\n4. 加生抽上色调味\n5. 倒回鸡蛋炒匀\n6. 撒葱花出锅',
    image: '', createdAt: Date.now() - 86400000 * 34, updatedAt: Date.now() - 86400000 * 34
  },
  {
    id: '35', name: '西红柿炖牛腩', category: 'dishes',
    tags: ['东北菜'],
    servings: 5, // 牛腩 500g 5 人份
    recipe: '材料：牛腩500g、番茄2个、番茄酱、葱姜、八角、生抽、料酒\n\n做法：\n1. 牛腩切块，冷水焯水去血沫\n2. 热油炒香葱姜、八角\n3. 放入牛腩翻炒，加料酒\n4. 加番茄块炒出汁\n5. 加生抽、番茄酱、热水烧开\n6. 转小火炖1.5小时，加盐调味',
    image: '', createdAt: Date.now() - 86400000 * 35, updatedAt: Date.now() - 86400000 * 35
  },
  {
    id: '36', name: '孜然羊肉', category: 'dishes',
    tags: ['东北菜'],
    servings: 2, // 羊里脊 300g 2 人份
    recipe: '材料：羊里脊300g、洋葱、孜然粉、辣椒粉、生抽、料酒、香菜\n\n做法：\n1. 羊肉切薄片，用生抽、料酒、淀粉腌制\n2. 洋葱切丝\n3. 热油爆炒羊肉至变色盛出\n4. 炒香洋葱\n5. 倒回羊肉，撒孜然粉、辣椒粉\n6. 快速翻炒，撒香菜出锅',
    image: '', createdAt: Date.now() - 86400000 * 36, updatedAt: Date.now() - 86400000 * 36
  },
  {
    id: '37', name: '香菇滑鸡', category: 'dishes',
    tags: ['应季菜'],
    servings: 2, // 鸡腿 300g 2 人份
    recipe: '材料：鸡腿肉300g、香菇6朵、姜、葱、料酒、生抽、蚝油、淀粉\n\n做法：\n1. 鸡腿肉切块，加生抽、料酒、淀粉腌制\n2. 香菇去蒂切片\n3. 热油炒香姜片、鸡块\n4. 加香菇翻炒\n5. 加生抽、蚝油、清水\n6. 盖盖子小火8分钟，撒葱花出锅',
    image: '', createdAt: Date.now() - 86400000 * 37, updatedAt: Date.now() - 86400000 * 37
  },
  {
    id: '38', name: '荷包蛋', category: 'dishes',
    tags: ['白人饭'],
    servings: 1, // 1 份默认
    recipe: '材料：鸡蛋2个、盐、酱油、香油、葱花\n\n做法：\n1. 小火热锅少油\n2. 打入鸡蛋，蛋白周围起泡后微火煎\n3. 盖盖子焗2分钟，蛋黄呈溏心状\n4. 装盘后加少许生抽、香油\n5. 撒葱花即可',
    image: '', createdAt: Date.now() - 86400000 * 38, updatedAt: Date.now() - 86400000 * 38
  },
  // 酒品
  {
    id: '5', name: '桂花米酒', category: 'drinks',
    tags: ['酒'],
    servings: 10, // 糯米 500g 出 10 杯甜酒
    recipe: '材料：糯米500g、酒曲、干桂花\n\n做法：\n1. 糯米浸泡6小时后蒸熟\n2. 晾至30度左右拌入酒曲\n3. 中间挖洞，密封发酵2-3天\n4. 出酒后加入干桂花\n5. 冷藏后饮用更佳',
    image: '', createdAt: Date.now() - 86400000 * 6, updatedAt: Date.now() - 86400000 * 6
  },
  {
    id: '6', name: '酸梅汤', category: 'drinks',
    tags: ['饮料'],
    servings: 5, // 1 锅出 5 杯
    recipe: '材料：乌梅、山楂、甘草、冰糖、桂花\n\n做法：\n1. 乌梅、山楂、甘草洗净浸泡30分钟\n2. 大火煮开转小火煮40分钟\n3. 加入冰糖搅拌融化\n4. 过滤后撒入桂花\n5. 冷藏饮用',
    image: '', createdAt: Date.now() - 86400000 * 7, updatedAt: Date.now() - 86400000 * 7
  },
  {
    id: '7', name: '百香果莫吉托', category: 'drinks',
    tags: ['酒'],
    servings: 1, // 1 杯
    recipe: '材料：百香果2个、白朗姆酒、薄荷叶、青柠、糖浆、苏打水\n\n做法：\n1. 薄荷叶与青柠角捣碎\n2. 加入百香果果肉和糖浆\n3. 倒入朗姆酒搅匀\n4. 加满冰块\n5. 注入苏打水，轻轻搅拌',
    image: '', createdAt: Date.now() - 86400000 * 1, updatedAt: Date.now() - 86400000 * 1
  },
  {
    id: '21', name: '红酒', category: 'drinks',
    tags: ['酒'],
    servings: 1, // 1 杯 150ml
    recipe: '经典赤霞珠红酒，醒酒30分钟后饮用最佳。\n\n适宜搭配：牛排、烤羊排、红烩菜肴',
    image: '', createdAt: Date.now() - 86400000 * 21, updatedAt: Date.now() - 86400000 * 21
  },
  {
    id: '22', name: '精酿啤酒', category: 'drinks',
    tags: ['酒'],
    servings: 1, // 1 罐 330ml
    recipe: 'IPA风格精酿啤酒，柑橘花香，苦度适中。\n\n适宜搭配：炸物、烤肉、小龙虾',
    image: '', createdAt: Date.now() - 86400000 * 22, updatedAt: Date.now() - 86400000 * 22
  },
  {
    id: '23', name: '梅酒', category: 'drinks',
    servings: 10, // 1kg 青梅 1.8L 酒 泡 1 罐 约 10 杯
    tags: ['酒'],
    recipe: '材料：青梅1kg、冰糖500g、白酒1.8L\n\n做法：\n1. 青梅洗净去蒂，擦干水分\n2. 一层青梅一层冰糖放入容器\n3. 倒入白酒没过青梅\n4. 密封存放阴凉处\n5. 3个月后即可饮用\n6. 加冰饮用更佳',
    image: '', createdAt: Date.now() - 86400000 * 23, updatedAt: Date.now() - 86400000 * 23
  },
  {
    id: '24', name: '清酒', category: 'drinks',
    servings: 5, // 1 瓶 720ml 约 5 杯
    tags: ['酒'],
    recipe: '日本纯米大酿酿清酒，精米步合70%。\n\n适宜温度：冷饮10°C或热饮45°C\n适宜搭配：刺身、寿司、清淡菜肴',
    image: '', createdAt: Date.now() - 86400000 * 24, updatedAt: Date.now() - 86400000 * 24
  },
  {
    id: '25', name: '柠檬蜂蜜水', category: 'drinks',
    servings: 1, // 1 杯冲泡饮品
    tags: ['饮料'],
    recipe: '材料：柠檬1个、蜂蜜2勺、温水\n\n做法：\n1. 柠檬切片去籽\n2. 温水（不超过60°C）中加蜂蜜搅匀\n3. 放入柠檬片\n4. 冷藏后饮用更佳',
    image: '', createdAt: Date.now() - 86400000 * 25, updatedAt: Date.now() - 86400000 * 25
  },
  {
    id: '39', name: '珍珠奶茶', category: 'drinks',
    servings: 2, // 300ml 牛奶 1 锅 2 杯
    tags: ['饮料'],
    recipe: '材料：红茶包2包、牛奶300ml、珍珠粉圆、蜂蜜或果糖\n\n做法：\n1. 水烧开煮珍珠10分钟，关火焖10分钟\n2. 捞出珍珠过凉水备用\n3. 红茶包用开水泡5分钟\n4. 茶杯中加冰块、珍珠\n5. 倒入泡好的红茶\n6. 加入牛奶和蜂蜜搅匀',
    image: '', createdAt: Date.now() - 86400000 * 39, updatedAt: Date.now() - 86400000 * 39
  },
  {
    id: '40', name: '鲜榨橙汁', category: 'drinks',
    servings: 1, // 2 个橙子 1 杯
    tags: ['饮料'],
    recipe: '材料：新鲜橙子2个、冰块\n\n做法：\n1. 橙子去皮去籽\n2. 果肉放入榨汁机\n3. 启动榨汁机榨成汁\n4. 过滤果渣后倒入杯中\n5. 加冰块即可饮用',
    image: '', createdAt: Date.now() - 86400000 * 40, updatedAt: Date.now() - 86400000 * 40
  },
  {
    id: '41', name: '草莓奶昔', category: 'drinks',
    servings: 1, // 300ml 总量 1 杯
    tags: ['饮料'],
    recipe: '材料：草莓10颗、牛奶200ml、酸奶100ml、蜂蜜\n\n做法：\n1. 草莓洗净去蒂\n2. 草莓与牛奶、酸奶一起放入搅拌机\n3. 加一勺蜂蜜\n4. 高速搅拌1分钟至顺滑\n5. 倒入杯中装饰草莓',
    image: '', createdAt: Date.now() - 86400000 * 41, updatedAt: Date.now() - 86400000 * 41
  },
  {
    id: '42', name: '蓝莓奶昔', category: 'drinks',
    servings: 1, // 300ml 总量 1 杯
    tags: ['饮料'],
    recipe: '材料：蓝莓100g、香蕉1根、牛奶200ml、酸奶100ml\n\n做法：\n1. 蓝莓洗净沥干\n2. 香蕉切段\n3. 所有材料放入搅拌机\n4. 高速搅拌至顺滑\n5. 倒入杯中装饰蓝莓',
    image: '', createdAt: Date.now() - 86400000 * 42, updatedAt: Date.now() - 86400000 * 42
  },
  {
    id: '43', name: '拿铁咖啡', category: 'drinks',
    servings: 1, // 1 杯 230ml
    tags: ['白人饭', '饮料'],
    recipe: '材料：浓缩咖啡30ml、牛奶200ml\n\n做法：\n1. 用意式咖啡机萃取浓缩咖啡\n2. 牛奶用奶泡机打成绵密奶泡\n3. 杯中先倒入浓缩咖啡\n4. 缓缓注入打好的热牛奶\n5. 最后铺一层奶泡\n6. 可可粉拉花装饰',
    image: '', createdAt: Date.now() - 86400000 * 43, updatedAt: Date.now() - 86400000 * 43
  },
  {
    id: '44', name: '卡布奇诺', category: 'drinks',
    servings: 1, // 1 杯 180ml
    tags: ['白人饭', '饮料'],
    recipe: '材料：浓缩咖啡30ml、牛奶150ml、可可粉\n\n做法：\n1. 萃取浓缩咖啡倒入杯中\n2. 牛奶打泡成绵密奶泡\n3. 倒入咖啡中，1/3咖啡、1/3热牛奶、1/3奶泡\n4. 表面筛上可可粉',
    image: '', createdAt: Date.now() - 86400000 * 44, updatedAt: Date.now() - 86400000 * 44
  },
  {
    id: '45', name: '冰美式', category: 'drinks',
    servings: 1, // 1 杯 350ml
    tags: ['饮料'],
    recipe: '材料：浓缩咖啡60ml、冰块、水\n\n做法：\n1. 玻璃杯中加满冰块\n2. 倒入萃取好的浓缩咖啡\n3. 加冷水至杯满\n4. 搅匀即可',
    image: '', createdAt: Date.now() - 86400000 * 45, updatedAt: Date.now() - 86400000 * 45
  },
  {
    id: '46', name: '焦糖玛奇朵', category: 'drinks',
    servings: 1, // 1 杯 230ml
    tags: ['白人饭', '饮料'],
    recipe: '材料：浓缩咖啡30ml、牛奶200ml、香草糖浆、焦糖酱\n\n做法：\n1. 杯底加入香草糖浆\n2. 倒入打发的热牛奶\n3. 缓缓加入浓缩咖啡形成分层\n4. 表面淋上焦糖酱花纹',
    image: '', createdAt: Date.now() - 86400000 * 46, updatedAt: Date.now() - 86400000 * 46
  },
  {
    id: '47', name: '金汤力', category: 'drinks',
    servings: 1, // 1 杯 195ml
    tags: ['酒'],
    recipe: '材料：金酒45ml、汤力水150ml、青柠角、冰块\n\n做法：\n1. 古典杯中加满冰块\n2. 倒入金酒\n3. 缓缓注入汤力水\n4. 夹入青柠角，轻搅',
    image: '', createdAt: Date.now() - 86400000 * 47, updatedAt: Date.now() - 86400000 * 47
  },
  {
    id: '48', name: '莫吉托', category: 'drinks',
    servings: 1, // 1 杯单杯量
    tags: ['酒'],
    recipe: '材料：白朗姆酒60ml、新鲜薄荷叶、青柠、糖浆、苏打水\n\n做法：\n1. 杯中放入薄荷叶8片\n2. 加入青柠角和糖浆捣压\n3. 倒入白朗姆酒\n4. 加满碎冰\n5. 注入苏打水至杯满\n6. 薄荷枝装饰',
    image: '', createdAt: Date.now() - 86400000 * 48, updatedAt: Date.now() - 86400000 * 48
  },
  {
    id: '49', name: '玛格丽特', category: 'drinks',
    servings: 1, // 1 杯马天尼杯
    tags: ['酒'],
    recipe: '材料：龙舌兰45ml、君度橙皮酒20ml、青柠汁30ml、盐\n\n做法：\n1. 杯沿用青柠抹湿后蘸盐\n2. 冰块放入雪克壶\n3. 加入龙舌兰、君度、青柠汁\n4. 摇匀15秒\n5. 滤入马天尼杯',
    image: '', createdAt: Date.now() - 86400000 * 49, updatedAt: Date.now() - 86400000 * 49
  },
  {
    id: '50', name: '长岛冰茶', category: 'drinks',
    servings: 1, // 1 杯大杯
    tags: ['酒'],
    recipe: '材料：伏特加15ml、白朗姆15ml、金酒15ml、龙舌兰15ml、白柑兰酒15ml、柠檬汁30ml、糖浆、可乐\n\n做法：\n1. 冰块放入大杯中\n2. 依次加入五种酒\n3. 加入柠檬汁和糖浆\n4. 注入可乐至杯满\n5. 轻轻搅匀\n6. 柠檬片装饰',
    image: '', createdAt: Date.now() - 86400000 * 50, updatedAt: Date.now() - 86400000 * 50
  },
  {
    id: '51', name: '威士忌酸', category: 'drinks',
    servings: 1, // 1 杯古典杯
    tags: ['酒'],
    recipe: '材料：波本威士忌60ml、柠檬汁30ml、糖浆15ml、蛋清\n\n做法：\n1. 雪克壶中加冰\n2. 倒入威士忌、柠檬汁、糖浆、蛋清\n3. 不加冰干摇10秒出泡\n4. 加冰再摇10秒\n5. 滤入古典杯\n6. 樱桃和橙皮装饰',
    image: '', createdAt: Date.now() - 86400000 * 51, updatedAt: Date.now() - 86400000 * 51
  },
  {
    id: '52', name: '血腥玛丽', category: 'drinks',
    servings: 1, // 1 杯大杯
    tags: ['酒'],
    recipe: '材料：伏特加45ml、番茄汁120ml、柠檬汁15ml、辣酱油、芹菜盐、黑胡椒\n\n做法：\n1. 杯沿抹柠檬汁蘸芹菜盐\n2. 大杯中加冰块\n3. 倒入伏特加和番茄汁\n4. 加柠檬汁、辣酱油\n5. 撒黑胡椒\n6. 搅匀，芹菜棒装饰',
    image: '', createdAt: Date.now() - 86400000 * 52, updatedAt: Date.now() - 86400000 * 52
  },
  // 甜品
  {
    id: '8', name: '芒果西米露', category: 'desserts',
    servings: 2, // 1 锅 2 碗
    tags: ['甜品'],
    recipe: '材料：西米、芒果、椰浆、糖\n\n做法：\n1. 西米煮至透明，过凉水\n2. 芒果切丁，部分打成泥\n3. 椰浆加糖煮开晾凉\n4. 碗底铺西米\n5. 加芒果泥和椰浆\n6. 顶部放芒果丁装饰',
    image: '', createdAt: Date.now() - 86400000 * 8, updatedAt: Date.now() - 86400000 * 8
  },
  {
    id: '9', name: '双皮奶', category: 'desserts',
    servings: 3, // 500ml 牛奶 3 碗
    tags: ['甜品'],
    recipe: '材料：全脂牛奶500ml、蛋清3个、糖40g\n\n做法：\n1. 牛奶煮至微沸，倒入碗中静置结皮\n2. 蛋清加糖打散过滤\n3. 牛奶皮边缘戳小口，倒出牛奶与蛋清混合\n4. 沿碗边缓缓倒回，让奶皮浮起\n5. 盖保鲜膜，水开后蒸15分钟\n6. 冷藏后食用',
    image: '', createdAt: Date.now() - 86400000 * 9, updatedAt: Date.now() - 86400000 * 9
  },
  {
    id: '10', name: '抹茶提拉米苏', category: 'desserts',
    servings: 1, // 1 份单份甜品
    tags: ['白人饭', '甜品'],
    recipe: '材料：马斯卡彭奶酪、抹茶粉、手指饼干、淡奶油、糖\n\n做法：\n1. 抹茶粉用温水调成浓液\n2. 马斯卡彭加糖打顺滑\n3. 淡奶油打至六分发拌入\n4. 手指饼干蘸抹茶液铺底\n5. 铺一层奶酪糊，再铺饼干\n6. 冷藏4小时，撒抹茶粉装饰',
    image: '', createdAt: Date.now() - 86400000 * 10, updatedAt: Date.now() - 86400000 * 10
  },
  {
    id: '26', name: '冰淇淋', category: 'desserts',
    servings: 5, // 500ml 总量 5 球
    tags: ['甜品'],
    recipe: '材料：淡奶油300ml、牛奶200ml、糖60g、蛋黄3个\n\n做法：\n1. 蛋黄加糖打至发白\n2. 牛奶煮至微沸，缓缓倒入蛋黄中搅拌\n3. 回锅小火加热至浓稠\n4. 淡奶油打至六分发\n5. 混合后倒入容器\n6. 冷冻4小时以上',
    image: '', createdAt: Date.now() - 86400000 * 26, updatedAt: Date.now() - 86400000 * 26
  },
  {
    id: '27', name: '芝士蛋糕', category: 'desserts',
    servings: 6, // 1 个 6 寸 6 块
    tags: ['甜品', '白人饭'],
    recipe: '材料：奶油奶酪250g、消化饼干100g、黄油50g、糖60g、鸡蛋2个\n\n做法：\n1. 饼干碎加融化黄油压底\n2. 奶油奶酪加糖打顺滑\n3. 逐个加入鸡蛋搅匀\n4. 倒入模具\n5. 160°C烤45分钟\n6. 冷藏4小时后食用',
    image: '', createdAt: Date.now() - 86400000 * 27, updatedAt: Date.now() - 86400000 * 27
  },
  {
    id: '28', name: '舒芙蕾', category: 'desserts',
    servings: 3, // 3 个蛋 3 个
    tags: ['甜品'],
    recipe: '材料：鸡蛋3个、牛奶100ml、低筋面粉30g、糖40g、黄油20g\n\n做法：\n1. 黄油融化加面粉炒匀\n2. 加牛奶搅成糊\n3. 蛋黄加入搅匀\n4. 蛋白加糖打至硬性发泡\n5. 翻拌入蛋黄糊\n6. 倒入模具，180°C烤15分钟，出炉即食',
    image: '', createdAt: Date.now() - 86400000 * 28, updatedAt: Date.now() - 86400000 * 28
  },
  {
    id: '29', name: '焦糖布丁', category: 'desserts',
    servings: 4, // 3 个蛋 + 300ml 牛奶 4 杯
    tags: ['甜品'],
    recipe: '材料：鸡蛋3个、牛奶300ml、糖80g、香草精\n\n做法：\n1. 40g糖加少许水熬成焦糖倒入杯底\n2. 鸡蛋加40g糖打散\n3. 牛奶加香草精加热至微沸\n4. 缓缓倒入蛋液中搅拌\n5. 过滤后倒入焦糖杯中\n6. 150°C水浴法烤30分钟，冷藏后食用',
    image: '', createdAt: Date.now() - 86400000 * 29, updatedAt: Date.now() - 86400000 * 29
  },
  {
    id: '30', name: '杨枝甘露', category: 'desserts',
    servings: 3, // 2 个芒果 + 50g 西米 3 碗
    tags: ['甜品'],
    recipe: '材料：芒果2个、西柚半个、西米50g、椰浆200ml、淡奶油100ml\n\n做法：\n1. 西米煮至透明过凉水\n2. 芒果部分切丁，部分打成泥\n3. 椰浆加淡奶油搅匀\n4. 碗底铺西米\n5. 加芒果泥和椰奶\n6. 顶部放芒果丁和西柚肉',
    image: '', createdAt: Date.now() - 86400000 * 30, updatedAt: Date.now() - 86400000 * 30
  },
  {
    id: '53', name: '蛋挞', category: 'desserts',
    servings: 8, // 8 个挞皮 8 个
    tags: ['甜品'],
    recipe: '材料：蛋挞皮8个、鸡蛋黄3个、淡奶油100ml、牛奶80ml、糖40g\n\n做法：\n1. 蛋黄加糖搅打均匀\n2. 加入牛奶和淡奶油拌匀\n3. 蛋液过筛两次更细腻\n4. 蛋挞皮摆入烤盘\n5. 倒入蛋液8分满\n6. 烤箱200°C预热，烤20分钟至金黄',
    image: '', createdAt: Date.now() - 86400000 * 53, updatedAt: Date.now() - 86400000 * 53
  },
  {
    id: '54', name: '港式菠萝包', category: 'desserts',
    servings: 6, // 200g 面粉 6 个
    tags: ['甜品'],
    recipe: '材料：高筋面粉200g、奶粉10g、酵母3g、糖30g、鸡蛋1个、黄油\n酥皮：黄油60g、糖粉40g、鸡蛋1个、低筋面粉80g\n\n做法：\n1. 主面团材料揉成团发酵\n2. 酥皮材料搅打至顺滑\n3. 发酵好的面团分成小剂\n4. 包入酥皮，表面划出菱形格\n5. 二发后刷蛋液\n6. 180°C烤20分钟至金黄',
    image: '', createdAt: Date.now() - 86400000 * 54, updatedAt: Date.now() - 86400000 * 54
  },
  {
    id: '55', name: '驴打滚', category: 'desserts',
    servings: 8, // 150g 糯米粉 8 块
    tags: ['甜品'],
    recipe: '材料：糯米粉150g、红豆沙、黄豆粉\n\n做法：\n1. 糯米粉加温水揉成面团\n2. 面团擀成薄片上锅蒸15分钟\n3. 蒸熟后趁热揉光滑\n4. 黄豆粉铺底防粘\n5. 面团擀薄，铺上红豆沙\n6. 卷起切段，表面撒黄豆粉',
    image: '', createdAt: Date.now() - 86400000 * 55, updatedAt: Date.now() - 86400000 * 55
  },
  {
    id: '56', name: '蛋烘糕', category: 'desserts',
    servings: 10, // 100g 面粉 + 2 个蛋 10 个
    tags: ['甜品'],
    recipe: '材料：面粉100g、鸡蛋2个、酵母2g、糖30g、水100ml、红豆沙\n\n做法：\n1. 酵母用温水化开\n2. 面粉、鸡蛋、糖、酵母水调成稀面糊\n3. 发酵1小时至起泡\n4. 小火热锅不刷油\n5. 倒入一勺面糊摊成小圆饼\n6. 烤至起泡后加红豆沙对折',
    image: '', createdAt: Date.now() - 86400000 * 56, updatedAt: Date.now() - 86400000 * 56
  },
  {
    id: '57', name: '芒果班戟', category: 'desserts',
    servings: 6, // 2 个蛋 + 200ml 奶油 6 个
    tags: ['甜品'],
    recipe: '材料：鸡蛋2个、牛奶150ml、低筋面粉60g、糖30g、黄油、淡奶油200ml、芒果\n\n做法：\n1. 鸡蛋加糖打散\n2. 加牛奶、面粉调成稀糊\n3. 加融化黄油拌匀过筛\n4. 小火热锅摊成薄饼\n5. 淡奶油加糖打发\n6. 薄饼包入奶油和芒果丁',
    image: '', createdAt: Date.now() - 86400000 * 57, updatedAt: Date.now() - 86400000 * 57
  },
  {
    id: '58', name: '红豆沙', category: 'desserts',
    servings: 5, // 200g 红豆 1 锅 5 碗
    tags: ['甜品'],
    recipe: '材料：红豆200g、冰糖80g、陈皮1块\n\n做法：\n1. 红豆浸泡4小时\n2. 加水煮开后小火煮40分钟\n3. 红豆煮软后加陈皮、冰糖\n4. 继续煮至红豆起沙\n5. 捣成细腻的红豆沙\n6. 冷藏后食用',
    image: '', createdAt: Date.now() - 86400000 * 58, updatedAt: Date.now() - 86400000 * 58
  },
  {
    id: '59', name: '银耳莲子羹', category: 'desserts',
    servings: 4, // 1 朵银耳 1 锅 4 碗
    tags: ['应季菜', '甜品'],
    recipe: '材料：银耳1朵、莲子50g、红枣6颗、冰糖\n\n做法：\n1. 银耳泡发撕成小朵\n2. 莲子去芯\n3. 锅中加水、银耳、莲子、红枣\n4. 大火烧开转小火煮1小时\n5. 银耳出胶后加冰糖\n6. 继续煮10分钟即可',
    image: '', createdAt: Date.now() - 86400000 * 59, updatedAt: Date.now() - 86400000 * 59
  },
  {
    id: '60', name: '桃胶炖奶', category: 'desserts',
    servings: 2, // 1 锅 2 碗
    tags: ['甜品'],
    recipe: '材料：桃胶15g、牛奶200ml、蛋清1个、冰糖\n\n做法：\n1. 桃胶浸泡12小时至软\n2. 挑去杂质洗净\n3. 桃胶加水炖30分钟至软糯\n4. 加冰糖融化\n5. 牛奶加蛋清打匀\n6. 倒入桃胶中搅匀，炖10分钟',
    image: '', createdAt: Date.now() - 86400000 * 60, updatedAt: Date.now() - 86400000 * 60
  },
  {
    id: '61', name: '龟苓膏', category: 'desserts',
    servings: 4, // 600ml 1 锅 4 碗
    tags: ['白人饭', '甜品'],
    recipe: '材料：龟苓膏粉30g、清水600ml、蜂蜜或炼乳\n\n做法：\n1. 龟苓膏粉用少量凉水调匀\n2. 剩余水烧开\n3. 缓缓倒入龟苓膏糊搅匀\n4. 继续煮2分钟至浓稠\n5. 倒入容器冷却凝固\n6. 切成小块加蜂蜜食用',
    image: '', createdAt: Date.now() - 86400000 * 61, updatedAt: Date.now() - 86400000 * 61
  },
  {
    id: '62', name: '杏仁豆腐', category: 'desserts',
    servings: 3, // 200ml 牛奶 3 块
    tags: ['甜品'],
    recipe: '材料：南杏仁100g、牛奶200ml、琼脂5g、糖30g\n\n做法：\n1. 杏仁提前浸泡4小时\n2. 加牛奶放入豆浆机打成杏仁浆\n3. 杏仁浆过筛去渣\n4. 加琼脂、糖小火煮化\n5. 倒入容器冷却凝固\n6. 切块加冰糖水或水果',
    image: '', createdAt: Date.now() - 86400000 * 62, updatedAt: Date.now() - 86400000 * 62
  },
  {
    id: '63', name: '草莓大福', category: 'desserts',
    servings: 6, // 6 颗草莓 6 个
    tags: ['甜品'],
    recipe: '材料：糯米粉80g、玉米淀粉20g、牛奶120ml、糖30g、草莓6颗、红豆沙\n\n做法：\n1. 糯米粉、淀粉、糖、牛奶调匀\n2. 微波炉加热1分钟至凝固\n3. 取出搅拌再加热1分钟\n4. 戴手套将面团揉光滑\n5. 草莓包入红豆沙\n6. 用糯米皮包住草莓',
    image: '', createdAt: Date.now() - 86400000 * 63, updatedAt: Date.now() - 86400000 * 63
  },
  {
    id: '64', name: '抹茶毛巾卷', category: 'desserts',
    servings: 4, // 2 个蛋 + 200ml 奶油 4 个
    tags: ['白人饭', '甜品'],
    recipe: '材料：鸡蛋2个、牛奶200ml、低筋面粉80g、抹茶粉10g、黄油20g、淡奶油200ml\n\n做法：\n1. 鸡蛋、牛奶、面粉、抹茶粉调成稀糊\n2. 加融化黄油过筛\n3. 小火摊成薄饼\n4. 淡奶油加糖打发\n5. 三张薄饼叠加铺一层奶油\n6. 卷起包成毛巾卷形',
    image: '', createdAt: Date.now() - 86400000 * 64, updatedAt: Date.now() - 86400000 * 64
  },
  {
    id: '65', name: '芝士流心挞', category: 'desserts',
    servings: 8, // 8 个挞皮 8 个
    tags: ['甜品'],
    recipe: '材料：蛋挞皮8个、奶油奶酪150g、淡奶油80ml、鸡蛋1个、糖40g、柠檬汁\n\n做法：\n1. 奶油奶酪室温软化\n2. 加糖打至顺滑\n3. 加鸡蛋、淡奶油、柠檬汁拌匀\n4. 挞皮摆入烤盘\n5. 倒入奶酪糊8分满\n6. 180°C烤20分钟至金黄',
    image: '', createdAt: Date.now() - 86400000 * 65, updatedAt: Date.now() - 86400000 * 65
  },
  {
    id: '66', name: '木瓜雪耳糖水', category: 'desserts',
    servings: 4, // 1 锅 4 碗
    tags: ['应季菜', '甜品'],
    recipe: '材料：木瓜1个、雪耳1朵、冰糖、莲子\n\n做法：\n1. 雪耳泡发撕小朵\n2. 木瓜去皮去籽切块\n3. 锅中加水、雪耳、莲子\n4. 大火煮开转小火煮40分钟\n5. 加入木瓜块\n6. 加冰糖煮10分钟即可',
    image: '', createdAt: Date.now() - 86400000 * 66, updatedAt: Date.now() - 86400000 * 66
  },
  {
    id: '67', name: '黄瓜皮蛋汤', category: 'dishes',
    servings: 2, // 2 个皮蛋 1 锅 2 碗
    tags: ['应季菜'],
    recipe: '材料：黄瓜1根、皮蛋2个、姜丝、葱花、盐、香油\n\n做法：\n1. 黄瓜洗净去皮切薄片\n2. 皮蛋剥壳切小块\n3. 锅中加水烧开，放入皮蛋\n4. 加姜丝煮2分钟出味\n5. 放入黄瓜片烫30秒\n6. 加盐调味，撒葱花，淋几滴香油出锅',
    image: '', createdAt: Date.now() - 86400000 * 67, updatedAt: Date.now() - 86400000 * 67
  },
  // ═══════ P3-C 批次：6-8月应季家常菜补充 (id 68-97) ═══════
  {
    id: '68', name: '蒜蓉西兰花', category: 'dishes',
    servings: 2, // 西兰花 1 颗 2 人份
    tags: ['应季菜', '我的最爱'],
    recipe: '材料：西兰花1颗、蒜5瓣、盐、蚝油、食用油\n\n做法：\n1. 西兰花切小朵，加盐水浸泡10分钟\n2. 锅中水烧开，加少许盐和油\n3. 西兰花焯水2分钟，捞出过凉水\n4. 蒜末爆香，加西兰花翻炒\n5. 加蚝油、盐调味\n6. 大火翻炒均匀出锅',
    image: '', createdAt: Date.now() - 86400000 * 68, updatedAt: Date.now() - 86400000 * 68
  },
  {
    id: '69', name: '清炒西兰花', category: 'dishes',
    servings: 2, // 一颗西兰花 2 人份
    tags: ['应季菜', '白人饭'],
    recipe: '材料：西兰花1颗、蒜3瓣、盐、食用油\n\n做法：\n1. 西兰花切小朵浸泡洗净\n2. 烧水加盐焯水1分钟\n3. 蒜末爆香\n4. 加西兰花大火快炒\n5. 加盐调味出锅',
    image: '', createdAt: Date.now() - 86400000 * 69, updatedAt: Date.now() - 86400000 * 69
  },
  {
    id: '70', name: '西红柿炖牛腩', category: 'dishes',
    servings: 4, // 500g 牛腩 4 人份
    tags: ['包包的最爱'],
    recipe: '材料：牛腩500g、番茄3个、土豆2个、洋葱1个、葱姜、八角、生抽、料酒\n\n做法：\n1. 牛腩切块焯水去血沫\n2. 番茄去皮切块，土豆洋葱切块\n3. 热锅炒番茄出汁\n4. 加牛腩、葱姜、八角翻炒\n5. 加生抽、料酒、热水没过食材\n6. 小火炖1.5小时，加土豆洋葱炖30分钟',
    image: '', createdAt: Date.now() - 86400000 * 70, updatedAt: Date.now() - 86400000 * 70
  },
  {
    id: '71', name: '鱼香茄子', category: 'dishes',
    servings: 2, // 2 根茄子 2 人份
    tags: ['应季菜'],
    recipe: '材料：茄子2根、肉末100g、葱姜蒜、豆瓣酱、醋、糖、生抽、淀粉\n\n做法：\n1. 茄子切条撒盐腌10分钟挤出水分\n2. 调鱼香汁：糖3勺、醋2勺、生抽1勺、淀粉\n3. 热油炒茄子至软盛出\n4. 炒肉末加豆瓣酱出红油\n5. 加茄子、葱姜蒜翻炒\n6. 淋鱼香汁大火收汁',
    image: '', createdAt: Date.now() - 86400000 * 71, updatedAt: Date.now() - 86400000 * 71
  },
  {
    id: '72', name: '红烧茄子', category: 'dishes',
    servings: 2, // 2 根茄子 2 人份
    tags: ['应季菜'],
    recipe: '材料：茄子2根、蒜5瓣、生抽、老抽、糖、蚝油、葱姜\n\n做法：\n1. 茄子切滚刀块，盐水泡5分钟\n2. 热油炸茄子至金黄软糯\n3. 蒜末、葱姜爆香\n4. 加生抽、老抽、糖、蚝油、清水\n5. 倒入茄子小火焖5分钟\n6. 大火收汁出锅',
    image: '', createdAt: Date.now() - 86400000 * 72, updatedAt: Date.now() - 86400000 * 72
  },
  {
    id: '73', name: '蒜蓉空心菜', category: 'dishes',
    servings: 2, // 1 把空心菜 2 人份
    tags: ['应季菜'],
    recipe: '材料：空心菜1把、蒜5瓣、盐、蚝油、食用油\n\n做法：\n1. 空心菜洗净切段，茎叶分开\n2. 蒜末爆香\n3. 先下空心菜茎大火翻炒1分钟\n4. 加叶子快速翻炒\n5. 加盐、蚝油调味出锅',
    image: '', createdAt: Date.now() - 86400000 * 73, updatedAt: Date.now() - 86400000 * 73
  },
  {
    id: '74', name: '蚝油生菜', category: 'dishes',
    servings: 2, // 1 颗生菜 2 人份
    tags: ['应季菜', '白人饭'],
    recipe: '材料：生菜1颗、蚝油2勺、生抽1勺、糖半勺、蒜末、淀粉\n\n做法：\n1. 生菜洗净掰大片\n2. 烧水加盐油焯生菜10秒摆盘\n3. 蒜末爆香，加蚝油生抽糖水\n4. 水开勾薄芡\n5. 淋在生菜上',
    image: '', createdAt: Date.now() - 86400000 * 74, updatedAt: Date.now() - 86400000 * 74
  },
  {
    id: '75', name: '手撕包菜', category: 'dishes',
    servings: 2, // 半颗包菜 2 人份
    tags: ['应季菜'],
    recipe: '材料：包菜半颗、干辣椒5个、蒜3瓣、醋、生抽、盐、糖\n\n做法：\n1. 包菜手撕成块，洗净沥干\n2. 干辣椒蒜末爆香\n3. 大火炒包菜至断生\n4. 加醋、生抽、盐、糖\n5. 大火快炒出锅',
    image: '', createdAt: Date.now() - 86400000 * 75, updatedAt: Date.now() - 86400000 * 75
  },
  {
    id: '76', name: '醋溜白菜', category: 'dishes',
    servings: 2, // 半颗白菜 2 人份
    tags: ['应季菜', '白人饭'],
    recipe: '材料：白菜半颗、醋3勺、生抽1勺、糖1勺、干辣椒、葱姜蒜、淀粉\n\n做法：\n1. 白菜帮切片，叶撕段\n2. 调汁：醋糖生抽淀粉水\n3. 干辣椒葱姜蒜爆香\n4. 先炒白菜帮1分钟\n5. 加白菜叶大火翻炒\n6. 淋汁快速翻匀出锅',
    image: '', createdAt: Date.now() - 86400000 * 76, updatedAt: Date.now() - 86400000 * 76
  },
  {
    id: '77', name: '凉拌木耳', category: 'dishes',
    servings: 2, // 1 把干木耳 2 人份
    tags: ['应季菜'],
    recipe: '材料：干木耳30g、蒜3瓣、香菜、生抽、醋、香油、白糖、辣椒油\n\n做法：\n1. 干木耳温水泡发1小时\n2. 焯水3分钟捞出过凉水\n3. 蒜末、香菜切碎\n4. 加生抽、醋、香油、糖、辣椒油\n5. 拌匀腌10分钟入味',
    image: '', createdAt: Date.now() - 86400000 * 77, updatedAt: Date.now() - 86400000 * 77
  },
  {
    id: '78', name: '干锅花菜', category: 'dishes',
    servings: 2, // 1 颗花菜 2 人份
    tags: ['应季菜'],
    recipe: '材料：花菜1颗、五花肉100g、干辣椒、蒜苗、豆瓣酱、生抽\n\n做法：\n1. 花菜切小朵盐水浸泡\n2. 五花肉切片煸出油\n3. 加豆瓣酱干辣椒爆香\n4. 倒入花菜翻炒\n5. 加生抽、蒜苗\n6. 大火翻炒至花菜边缘微焦',
    image: '', createdAt: Date.now() - 86400000 * 78, updatedAt: Date.now() - 86400000 * 78
  },
  {
    id: '79', name: '干煸豆角', category: 'dishes',
    servings: 2, // 1 把豆角 2 人份
    tags: ['应季菜'],
    recipe: '材料：豆角1把、肉末100g、芽菜、葱姜蒜、干辣椒、花椒\n\n做法：\n1. 豆角切段，用厨房纸吸干\n2. 热油炸豆角至起皱\n3. 留底油爆香葱姜蒜花椒干辣椒\n4. 加肉末芽菜炒香\n5. 倒入豆角翻炒\n6. 加盐调味出锅',
    image: '', createdAt: Date.now() - 86400000 * 79, updatedAt: Date.now() - 86400000 * 79
  },
  {
    id: '80', name: '蒜苔炒肉', category: 'dishes',
    servings: 2, // 1 把蒜苔 2 人份
    tags: [],
    recipe: '材料：蒜苔1把、猪里脊150g、干辣椒、姜蒜、生抽、料酒、淀粉\n\n做法：\n1. 里脊切丝，加生抽料酒淀粉腌制\n2. 蒜苔切段，焯水30秒\n3. 热油滑炒肉丝变色盛出\n4. 干辣椒姜蒜爆香\n5. 加蒜苔肉丝翻炒\n6. 加盐调味出锅',
    image: '', createdAt: Date.now() - 86400000 * 80, updatedAt: Date.now() - 86400000 * 80
  },
  {
    id: '81', name: '土豆烧鸡', category: 'dishes',
    servings: 3, // 1 只鸡腿 + 2 个土豆 3 人份
    tags: ['应季菜', '东北菜'],
    recipe: '材料：鸡腿2只、土豆2个、青椒2个、葱姜蒜、八角、生抽、老抽、料酒\n\n做法：\n1. 鸡腿切块焯水\n2. 土豆切滚刀块\n3. 热油炒鸡块至金黄\n4. 加葱姜蒜八角爆香\n5. 加生抽老抽料酒翻炒上色\n6. 加热水土豆炖20分钟，收汁加青椒',
    image: '', createdAt: Date.now() - 86400000 * 81, updatedAt: Date.now() - 86400000 * 81
  },
  {
    id: '82', name: '香菇滑鸡', category: 'dishes',
    servings: 3, // 2 个鸡腿 + 香菇 3 人份
    tags: ['应季菜'],
    recipe: '材料：鸡腿2只、香菇8朵、葱姜、生抽、蚝油、淀粉、料酒\n\n做法：\n1. 鸡腿去骨切丁，加生抽料酒淀粉腌15分钟\n2. 香菇切十字花刀\n3. 热油滑炒鸡丁至变色盛出\n4. 爆香葱姜，加香菇翻炒\n5. 加鸡丁、蚝油、生抽翻炒\n6. 勾薄芡出锅',
    image: '', createdAt: Date.now() - 86400000 * 82, updatedAt: Date.now() - 86400000 * 82
  },
  {
    id: '83', name: '香菇青菜', category: 'dishes',
    servings: 2, // 1 把青菜 2 人份
    tags: ['应季菜', '白人饭'],
    recipe: '材料：上海青1把、香菇5朵、蚝油、生抽、盐、蒜末\n\n做法：\n1. 上海青洗净，香菇切片\n2. 烧水加盐油焯青菜1分钟\n3. 热油爆香蒜末、香菇片\n4. 加生抽蚝油调味\n5. 倒入青菜翻炒均匀出锅',
    image: '', createdAt: Date.now() - 86400000 * 83, updatedAt: Date.now() - 86400000 * 83
  },
  {
    id: '84', name: '清蒸鲈鱼', category: 'dishes',
    servings: 2, // 1 条鲈鱼 2 人份
    tags: ['应季菜', '白人饭'],
    recipe: '材料：鲈鱼1条、葱姜、红椒、蒸鱼豉油、料酒\n\n做法：\n1. 鲈鱼处理干净，背部划几刀\n2. 鱼身抹料酒，铺葱姜腌制10分钟\n3. 水开后大火蒸8分钟\n4. 倒掉盘内汁水，铺葱丝红椒丝\n5. 淋蒸鱼豉油\n6. 烧热油浇在葱姜上',
    image: '', createdAt: Date.now() - 86400000 * 84, updatedAt: Date.now() - 86400000 * 84
  },
  {
    id: '85', name: '红烧带鱼', category: 'dishes',
    servings: 3, // 1 条带鱼 3 人份
    tags: ['应季菜'],
    recipe: '材料：带鱼1条、葱姜蒜、八角、生抽、老抽、料酒、糖、醋\n\n做法：\n1. 带鱼切段，加盐料酒腌10分钟\n2. 热油煎带鱼至两面金黄\n3. 葱姜蒜八角爆香\n4. 加生抽老抽糖醋料酒\n5. 加水没过带鱼\n6. 小火炖15分钟大火收汁',
    image: '', createdAt: Date.now() - 86400000 * 85, updatedAt: Date.now() - 86400000 * 85
  },
  {
    id: '86', name: '油焖大虾', category: 'dishes',
    servings: 2, // 10 只大虾 2 人份
    tags: ['应季菜', '包包的最爱'],
    recipe: '材料：大虾10只、葱姜、番茄酱、生抽、糖、料酒\n\n做法：\n1. 大虾开背去虾线\n2. 热油爆香葱姜\n3. 放入大虾煎至两面变红\n4. 加番茄酱、生抽、糖、料酒\n5. 加半碗水小火焖3分钟\n6. 大火收汁出锅',
    image: '', createdAt: Date.now() - 86400000 * 86, updatedAt: Date.now() - 86400000 * 86
  },
  {
    id: '87', name: '蒜蓉粉丝蒸虾', category: 'dishes',
    servings: 2, // 8 只大虾 + 粉丝 2 人份
    tags: ['应季菜'],
    recipe: '材料：大虾8只、粉丝1把、蒜1头、葱、生抽、蚝油\n\n做法：\n1. 粉丝温水泡软铺盘底\n2. 大虾开背去虾线，铺粉丝上\n3. 蒜末爆香至金黄\n4. 加生抽蚝油拌匀\n5. 浇在大虾上\n6. 水开后大火蒸8分钟出锅',
    image: '', createdAt: Date.now() - 86400000 * 87, updatedAt: Date.now() - 86400000 * 87
  },
  {
    id: '88', name: '鲫鱼豆腐汤', category: 'dishes',
    servings: 2, // 1 条鲫鱼 + 1 块豆腐 2 人份
    tags: ['应季菜', '白人饭'],
    recipe: '材料：鲫鱼1条、嫩豆腐1块、姜、葱、盐、料酒\n\n做法：\n1. 鲫鱼处理干净，两面划几刀\n2. 热油煎鲫鱼至两面金黄\n3. 加开水、姜片、料酒\n4. 大火煮15分钟至汤色奶白\n5. 加豆腐块煮5分钟\n6. 加盐调味撒葱花',
    image: '', createdAt: Date.now() - 86400000 * 88, updatedAt: Date.now() - 86400000 * 88
  },
  {
    id: '89', name: '紫菜蛋花汤', category: 'dishes',
    servings: 1, // 1 碗 1 人份
    tags: ['白人饭'],
    recipe: '材料：紫菜10g、鸡蛋1个、葱花、盐、香油\n\n做法：\n1. 锅中加水烧开\n2. 放入紫菜煮1分钟\n3. 鸡蛋打散淋入成蛋花\n4. 加盐调味\n5. 撒葱花、淋几滴香油',
    image: '', createdAt: Date.now() - 86400000 * 89, updatedAt: Date.now() - 86400000 * 89
  },
  {
    id: '90', name: '凉拌黄瓜', category: 'dishes',
    servings: 2, // 2 根黄瓜 2 人份
    tags: ['应季菜', '白人饭'],
    recipe: '材料：黄瓜2根、蒜3瓣、生抽、醋、香油、白糖、辣椒油\n\n做法：\n1. 黄瓜洗净拍碎切段\n2. 加盐腌5分钟出水\n3. 蒜末、生抽、醋、香油、糖、辣椒油\n4. 拌匀腌10分钟入味\n5. 装盘即可',
    image: '', createdAt: Date.now() - 86400000 * 90, updatedAt: Date.now() - 86400000 * 90
  },
  {
    id: '91', name: '青岛啤酒', category: 'drinks',
    servings: 1, // 1 罐 1 人份
    tags: ['酒'],
    recipe: '材料：青岛啤酒1罐\n\n做法：\n1. 倒入杯中\n2. 7-10°C 冷藏后饮用更佳\n3. 配烤串、海鲜、辣菜',
    image: '', createdAt: Date.now() - 86400000 * 91, updatedAt: Date.now() - 86400000 * 91
  },
  {
    id: '92', name: '蜂蜜柠檬茶', category: 'drinks',
    servings: 1, // 1 杯 1 人份
    tags: ['饮料'],
    recipe: '材料：柠檬1个、蜂蜜2勺、红茶包1个\n\n做法：\n1. 红茶包用 200ml 热水泡3分钟\n2. 柠檬切片去籽\n3. 茶水放温后加柠檬片\n4. 加蜂蜜搅匀\n5. 加冰块饮用',
    image: '', createdAt: Date.now() - 86400000 * 92, updatedAt: Date.now() - 86400000 * 92
  },
  {
    id: '93', name: '冰镇酸梅汤', category: 'drinks',
    servings: 4, // 1 锅 4 杯
    tags: ['饮料'],
    recipe: '材料：乌梅50g、山楂30g、甘草5g、冰糖、桂花\n\n做法：\n1. 乌梅山楂甘草洗净\n2. 加 1.5L 水大火煮开\n3. 转小火煮 40 分钟\n4. 加冰糖搅匀\n5. 过滤后撒桂花\n6. 冷藏后饮用',
    image: '', createdAt: Date.now() - 86400000 * 93, updatedAt: Date.now() - 86400000 * 93
  },
  {
    id: '94', name: '杨梅酒', category: 'drinks',
    servings: 1, // 1 杯 1 人份
    tags: ['酒'],
    recipe: '材料：杨梅500g、冰糖150g、白酒1.5L\n\n做法：\n1. 杨梅洗净晾干\n2. 玻璃瓶消毒\n3. 一层杨梅一层冰糖\n4. 倒入白酒没过杨梅\n5. 密封阴凉处 30 天\n6. 滤渣后饮用',
    image: '', createdAt: Date.now() - 86400000 * 94, updatedAt: Date.now() - 86400000 * 94
  },
  {
    id: '95', name: '芒果西米露', category: 'desserts',
    servings: 2, // 2 碗 2 人份
    tags: ['甜品'],
    recipe: '材料：芒果2个、西米50g、椰浆200ml、牛奶100ml\n\n做法：\n1. 烧水煮西米 10 分钟至透明\n2. 捞出过凉水备用\n3. 芒果去皮切丁\n4. 椰浆+牛奶+糖煮开\n5. 加西米和芒果丁\n6. 冷藏后食用',
    image: '', createdAt: Date.now() - 86400000 * 95, updatedAt: Date.now() - 86400000 * 95
  },
  {
    id: '96', name: '草莓布丁', category: 'desserts',
    servings: 4, // 4 杯 4 人份
    tags: ['甜品'],
    recipe: '材料：草莓200g、牛奶250ml、淡奶油100ml、糖50g、吉利丁片2片\n\n做法：\n1. 吉利丁片冷水泡软\n2. 牛奶+奶油+糖小火加热至糖化\n3. 加吉利丁片搅匀\n4. 草莓切半铺杯底\n5. 倒入布丁液冷藏 4 小时\n6. 脱模淋蜂蜜',
    image: '', createdAt: Date.now() - 86400000 * 96, updatedAt: Date.now() - 86400000 * 96
  },
  {
    id: '97', name: '焦糖布丁', category: 'desserts',
    servings: 4, // 4 个布丁杯
    tags: ['甜品'],
    recipe: '材料：鸡蛋3个、牛奶300ml、糖80g、香草精\n\n做法：\n1. 60g 糖加少量水小火熬焦糖\n2. 焦糖液倒入布丁杯底部\n3. 鸡蛋打散加牛奶糖香草精\n4. 过筛入布丁杯\n5. 烤盘加水 150°C 烤 35 分钟\n6. 冷藏后倒扣脱模',
    image: '', createdAt: Date.now() - 86400000 * 97, updatedAt: Date.now() - 86400000 * 97
  },
  // ═══════ P3-D 批次 1/2：川菜×8 + 粤菜×5 + 海鲜×8 + 凉拌×5 + 主食×4 (id 98-127) ═══════
  {
    id: '98', name: '口水鸡', category: 'dishes',
    servings: 2, // 半只鸡 2 人份
    tags: ['川菜', '我的最爱'],
    recipe: '材料：三黄鸡半只、花生碎、芝麻、葱姜蒜、辣椒油、生抽、醋、糖\n\n做法：\n1. 鸡肉冷水下锅加姜葱煮15分钟\n2. 关火焖10分钟，捞出过冰水\n3. 砍块摆盘\n4. 调汁：辣椒油、生抽、醋、糖、蒜末拌匀\n5. 浇在鸡块上撒花生碎芝麻',
    image: '', createdAt: Date.now() - 86400000 * 98, updatedAt: Date.now() - 86400000 * 98
  },
  {
    id: '99', name: '辣子鸡', category: 'dishes',
    servings: 2, // 2 个鸡腿 2 人份
    tags: ['川菜'],
    recipe: '材料：鸡腿2个、干辣椒50g、花椒、葱姜蒜、料酒、生抽、糖、熟芝麻\n\n做法：\n1. 鸡腿切丁，加生抽料酒淀粉腌15分钟\n2. 油温七成热炸鸡丁至金黄捞出\n3. 留底油爆香花椒、干辣椒、葱姜蒜\n4. 倒入鸡丁翻炒\n5. 加糖、生抽调味，撒芝麻出锅',
    image: '', createdAt: Date.now() - 86400000 * 99, updatedAt: Date.now() - 86400000 * 99
  },
  {
    id: '100', name: '水煮肉片', category: 'dishes',
    servings: 3, // 一大锅 3 人份
    tags: ['川菜'],
    recipe: '材料：里脊肉300g、豆芽、白菜、郫县豆瓣酱、干辣椒、花椒、葱姜蒜、鸡蛋\n\n做法：\n1. 里脊切片，加盐、料酒、蛋清、淀粉腌制\n2. 豆芽、白菜焯水铺碗底\n3. 炒豆瓣酱出红油，加水煮开\n4. 下肉片滑散煮2分钟，连汤倒入碗中\n5. 撒花椒、干辣椒、蒜末\n6. 烧热油浇上激香',
    image: '', createdAt: Date.now() - 86400000 * 100, updatedAt: Date.now() - 86400000 * 100
  },
  {
    id: '101', name: '酸菜鱼', category: 'dishes',
    servings: 4, // 一大锅 4 人份
    tags: ['川菜', '包包的最爱'],
    recipe: '材料：草鱼1条、酸菜300g、蛋清、淀粉、干辣椒、花椒、葱姜蒜、料酒\n\n做法：\n1. 鱼肉片加盐、料酒、蛋清、淀粉腌制\n2. 酸菜切段洗净挤干\n3. 炒酸菜出香味加热水煮开\n4. 滑入鱼片煮3分钟\n5. 连汤倒入碗中\n6. 撒花椒干辣椒，浇热油激香',
    image: '', createdAt: Date.now() - 86400000 * 101, updatedAt: Date.now() - 86400000 * 101
  },
  {
    id: '102', name: '毛血旺', category: 'dishes',
    servings: 3, // 麻辣一锅 3 人份
    tags: ['川菜'],
    recipe: '材料：鸭血300g、午餐肉、豆芽、白菜、郫县豆瓣酱、干辣椒、花椒、葱姜蒜\n\n做法：\n1. 鸭血切片，午餐肉切片，豆芽白菜焯水\n2. 炒豆瓣酱出红油，加水煮开\n3. 加鸭血、午餐肉煮3分钟\n4. 倒入铺好豆芽白菜的碗中\n5. 撒花椒干辣椒蒜末\n6. 烧热油浇上激香',
    image: '', createdAt: Date.now() - 86400000 * 102, updatedAt: Date.now() - 86400000 * 102
  },
  {
    id: '103', name: '夫妻肺片', category: 'dishes',
    servings: 2, // 凉菜 2 人份
    tags: ['川菜', '凉菜'],
    recipe: '材料：牛腱200g、牛舌100g、牛肚100g、葱姜、八角、桂皮、花椒粉、辣椒油\n\n做法：\n1. 牛肉牛舌牛肚冷水下锅加葱姜八角煮40分钟\n2. 捞出放凉切薄片\n3. 调汁：酱油、醋、糖、花椒粉、辣椒油、蒜末\n4. 食材摆盘\n5. 浇上料汁拌匀\n6. 撒花生碎、香菜',
    image: '', createdAt: Date.now() - 86400000 * 103, updatedAt: Date.now() - 86400000 * 103
  },
  {
    id: '104', name: '盐煎肉', category: 'dishes',
    servings: 2, // 1 份 2 人份
    tags: ['川菜'],
    recipe: '材料：五花肉300g、豆瓣酱、豆豉、青蒜、料酒、甜面酱\n\n做法：\n1. 五花肉切薄片\n2. 热锅不放油，煸炒五花肉出油\n3. 加豆瓣酱、豆豉、甜面酱炒香\n4. 加料酒翻炒\n5. 加青蒜段快速翻炒出锅',
    image: '', createdAt: Date.now() - 86400000 * 104, updatedAt: Date.now() - 86400000 * 104
  },
  {
    id: '105', name: '干煸四季豆', category: 'dishes',
    servings: 2, // 1 份 2 人份
    tags: ['川菜'],
    recipe: '材料：四季豆300g、肉末100g、芽菜、干辣椒、花椒、葱姜蒜、生抽\n\n做法：\n1. 四季豆掰段，用厨房纸吸干\n2. 热油炸四季豆至起皱捞出\n3. 留底油爆香花椒干辣椒葱姜蒜\n4. 加肉末、芽菜炒香\n5. 倒入四季豆翻炒\n6. 加生抽调味出锅',
    image: '', createdAt: Date.now() - 86400000 * 105, updatedAt: Date.now() - 86400000 * 105
  },
  {
    id: '106', name: '白切鸡', category: 'dishes',
    servings: 3, // 半只鸡 3 人份
    tags: ['粤菜'],
    recipe: '材料：三黄鸡半只、姜、葱、料酒、蘸料（姜葱蒜末+生抽+香油）\n\n做法：\n1. 整只鸡冷水下锅加姜葱料酒\n2. 大火煮开后转小火煮15分钟\n3. 关火焖10分钟\n4. 捞出立即过冰水\n5. 砍块摆盘\n6. 配姜葱蘸料食用',
    image: '', createdAt: Date.now() - 86400000 * 106, updatedAt: Date.now() - 86400000 * 106
  },
  {
    id: '107', name: '广式叉烧', category: 'dishes',
    servings: 3, // 500g 猪肉 3 人份
    tags: ['粤菜', '我的最爱'],
    recipe: '材料：猪梅头肉500g、叉烧酱、蜂蜜、生抽、料酒、蒜末\n\n做法：\n1. 猪肉切条，加叉烧酱、蒜末、生抽、料酒腌4小时\n2. 烤箱预热200°C\n3. 烤盘铺锡纸放肉条\n4. 烤20分钟取出刷蜂蜜\n5. 翻面再烤15分钟\n6. 切片装盘',
    image: '', createdAt: Date.now() - 86400000 * 107, updatedAt: Date.now() - 86400000 * 107
  },
  {
    id: '108', name: '蒜蓉蒸排骨', category: 'dishes',
    servings: 2, // 500g 排骨 2 人份
    tags: ['粤菜', '白人饭'],
    recipe: '材料：排骨500g、蒜1头、豆豉、生抽、蚝油、糖、淀粉\n\n做法：\n1. 排骨斩段洗净沥干\n2. 加蒜末、豆豉、生抽、蚝油、糖、淀粉拌匀\n3. 腌制20分钟\n4. 摆盘铺平\n5. 水开后大火蒸15分钟\n6. 撒葱花出锅',
    image: '', createdAt: Date.now() - 86400000 * 108, updatedAt: Date.now() - 86400000 * 108
  },
  {
    id: '109', name: '白灼虾', category: 'dishes',
    servings: 2, // 10 只大虾 2 人份
    tags: ['粤菜', '应季菜'],
    recipe: '材料：基围虾10只、姜、葱、料酒、蘸料（生抽+醋+蒜末）\n\n做法：\n1. 大虾剪须开背去虾线\n2. 锅中加水、姜片、葱段、料酒\n3. 水开后下大虾\n4. 变红弯曲即捞出（3分钟）\n5. 摆盘配蘸料\n6. 冰镇后口感更佳',
    image: '', createdAt: Date.now() - 86400000 * 109, updatedAt: Date.now() - 86400000 * 109
  },
  {
    id: '110', name: '煲仔饭', category: 'dishes',
    servings: 2, // 1 锅 2 人份
    tags: ['粤菜'],
    recipe: '材料：大米200g、广式腊肠2根、腊肉100g、青菜、葱、酱油\n\n做法：\n1. 大米淘洗浸泡30分钟\n2. 砂锅刷油，加米和水大火烧开\n3. 转小火焖8分钟\n4. 铺上腊肠、腊肉继续焖8分钟\n5. 加青菜焖2分钟关火\n6. 淋酱油、撒葱花',
    image: '', createdAt: Date.now() - 86400000 * 110, updatedAt: Date.now() - 86400000 * 110
  },
  {
    id: '111', name: '蒜蓉蒸生蚝', category: 'dishes',
    servings: 2, // 6 个生蚝 2 人份
    tags: ['海鲜', '应季菜'],
    recipe: '材料：生蚝6个、蒜1头、粉丝、生抽、蚝油、葱、红椒\n\n做法：\n1. 生蚝开壳取肉洗净\n2. 粉丝温水泡软铺壳底\n3. 放上蚝肉\n4. 蒜末爆香加生抽蚝油拌匀\n5. 浇在蚝肉上\n6. 水开后大火蒸5分钟，撒葱花红椒',
    image: '', createdAt: Date.now() - 86400000 * 111, updatedAt: Date.now() - 86400000 * 111
  },
  {
    id: '112', name: '辣炒花蛤', category: 'dishes',
    servings: 2, // 500g 花蛤 2 人份
    tags: ['海鲜', '川菜'],
    recipe: '材料：花蛤500g、干辣椒、花椒、葱姜蒜、豆瓣酱、料酒、生抽、葱花\n\n做法：\n1. 花蛤盐水浸泡2小时吐沙\n2. 烧水加姜片、料酒，花蛤开口捞出\n3. 爆香葱姜蒜、干辣椒、花椒、豆瓣酱\n4. 倒入花蛤快速翻炒\n5. 加生抽调味\n6. 撒葱花出锅',
    image: '', createdAt: Date.now() - 86400000 * 112, updatedAt: Date.now() - 86400000 * 112
  },
  {
    id: '113', name: '香辣梭子蟹', category: 'dishes',
    servings: 2, // 2 只梭子蟹 2 人份
    tags: ['海鲜', '应季菜'],
    recipe: '材料：梭子蟹2只、葱姜蒜、干辣椒、花椒、豆瓣酱、生抽、料酒、淀粉\n\n做法：\n1. 梭子蟹处理干净切块\n2. 切口处蘸淀粉\n3. 油炸至金黄捞出\n4. 爆香葱姜蒜干辣椒花椒豆瓣酱\n5. 倒入蟹块翻炒\n6. 加生抽料酒焖2分钟出锅',
    image: '', createdAt: Date.now() - 86400000 * 113, updatedAt: Date.now() - 86400000 * 113
  },
  {
    id: '114', name: '椒盐皮皮虾', category: 'dishes',
    servings: 2, // 500g 皮皮虾 2 人份
    tags: ['海鲜'],
    recipe: '材料：皮皮虾500g、椒盐粉、葱姜、料酒、淀粉、蒜末\n\n做法：\n1. 皮皮虾洗净沥干\n2. 加料酒、姜片腌10分钟\n3. 表面拍一层薄淀粉\n4. 油温七成热炸至金黄酥脆\n5. 捞出沥油\n6. 撒椒盐粉、葱花、蒜末拌匀',
    image: '', createdAt: Date.now() - 86400000 * 114, updatedAt: Date.now() - 86400000 * 114
  },
  {
    id: '115', name: '姜葱炒蟹', category: 'dishes',
    servings: 2, // 1 只大闸蟹 2 人份
    tags: ['海鲜', '粤菜'],
    recipe: '材料：大闸蟹1只、姜、葱、蒜、料酒、生抽、糖、淀粉\n\n做法：\n1. 蟹洗净斩块，切口蘸淀粉\n2. 油炸至变色捞出\n3. 爆香大量姜葱蒜\n4. 倒入蟹块翻炒\n5. 加料酒、生抽、糖\n6. 盖盖子焖2分钟，撒葱段出锅',
    image: '', createdAt: Date.now() - 86400000 * 115, updatedAt: Date.now() - 86400000 * 115
  },
  {
    id: '116', name: '烤生蚝', category: 'dishes',
    servings: 2, // 6 只生蚝 2 人份
    tags: ['海鲜'],
    recipe: '材料：生蚝6只、蒜蓉、粉丝、葱、辣椒酱、生抽\n\n做法：\n1. 生蚝开壳留肉\n2. 粉丝泡软铺底\n3. 蒜蓉爆香加辣椒酱生抽\n4. 浇在蚝肉上\n5. 烤箱220°C烤10分钟\n6. 撒葱花出炉',
    image: '', createdAt: Date.now() - 86400000 * 116, updatedAt: Date.now() - 86400000 * 116
  },
  {
    id: '117', name: '清蒸大闸蟹', category: 'dishes',
    servings: 2, // 2 只大闸蟹 2 人份
    tags: ['海鲜', '应季菜'],
    recipe: '材料：大闸蟹2只、姜、葱、料酒、醋、姜丝\n\n做法：\n1. 大闸蟹刷洗干净\n2. 蒸锅水开后放蟹\n3. 大火蒸15分钟\n4. 取出摆盘\n5. 调蘸料：姜末+香醋\n6. 配黄酒食用',
    image: '', createdAt: Date.now() - 86400000 * 117, updatedAt: Date.now() - 86400000 * 117
  },
  {
    id: '118', name: '葱烧海参', category: 'dishes',
    servings: 2, // 4 只海参 2 人份
    tags: ['海鲜', '鲁菜'],
    recipe: '材料：海参4只、大葱白2根、蚝油、生抽、糖、料酒、淀粉\n\n做法：\n1. 海参发好洗净切条\n2. 焯水1分钟捞出\n3. 大葱切段煸至金黄出香味\n4. 加蚝油、生抽、糖、料酒\n5. 倒入海参烧3分钟\n6. 勾薄芡出锅',
    image: '', createdAt: Date.now() - 86400000 * 118, updatedAt: Date.now() - 86400000 * 118
  },
  {
    id: '119', name: '凉拌皮蛋豆腐', category: 'dishes',
    servings: 2, // 2 个皮蛋 1 块豆腐 2 人份
    tags: ['凉菜', '白人饭'],
    recipe: '材料：内酯豆腐1盒、皮蛋2个、葱、蒜、生抽、香油、醋、辣椒油\n\n做法：\n1. 豆腐倒扣盘中切块\n2. 皮蛋切碎铺豆腐上\n3. 撒葱花蒜末\n4. 加生抽、香油、醋、辣椒油\n5. 拌匀即可',
    image: '', createdAt: Date.now() - 86400000 * 119, updatedAt: Date.now() - 86400000 * 119
  },
  {
    id: '120', name: '凉拌海蜇', category: 'dishes',
    servings: 2, // 200g 海蜇 2 人份
    tags: ['凉菜', '海鲜'],
    recipe: '材料：海蜇200g、黄瓜丝、胡萝卜丝、蒜末、生抽、醋、香油、白糖\n\n做法：\n1. 海蜇清水浸泡2小时去盐\n2. 烧水烫10秒立即过冰水\n3. 黄瓜、胡萝卜切丝\n4. 加蒜末、生抽、醋、香油、糖\n5. 拌匀腌10分钟入味',
    image: '', createdAt: Date.now() - 86400000 * 120, updatedAt: Date.now() - 86400000 * 120
  },
  {
    id: '121', name: '凉拌三丝', category: 'dishes',
    servings: 2, // 一盘 2 人份
    tags: ['凉菜'],
    recipe: '材料：黄瓜1根、胡萝卜1根、豆腐皮1张、蒜末、香菜、生抽、醋、香油\n\n做法：\n1. 黄瓜、胡萝卜、豆腐皮切丝\n2. 烧水焯豆腐皮1分钟\n3. 三丝过凉水沥干\n4. 加蒜末、香菜、生抽、醋、香油\n5. 拌匀即可',
    image: '', createdAt: Date.now() - 86400000 * 121, updatedAt: Date.now() - 86400000 * 121
  },
  {
    id: '122', name: '凉拌藕片', category: 'dishes',
    servings: 2, // 1 节藕 2 人份
    tags: ['凉菜', '应季菜'],
    recipe: '材料：莲藕1节、蒜末、姜末、葱花、生抽、醋、香油、白糖、辣椒油\n\n做法：\n1. 莲藕去皮切薄片\n2. 清水浸泡去淀粉\n3. 烧水焯2分钟\n4. 捞出过冰水保持脆嫩\n5. 加蒜末姜末生抽醋香油糖辣椒油\n6. 拌匀撒葱花',
    image: '', createdAt: Date.now() - 86400000 * 122, updatedAt: Date.now() - 86400000 * 122
  },
  {
    id: '123', name: '凉拌金针菇', category: 'dishes',
    servings: 2, // 1 把金针菇 2 人份
    tags: ['凉菜'],
    recipe: '材料：金针菇1把、葱、蒜、小米辣、生抽、醋、香油、白糖\n\n做法：\n1. 金针菇去根撕小束\n2. 烧水焯3分钟\n3. 捞出过凉水沥干\n4. 葱蒜小米辣切碎\n5. 加生抽、醋、香油、糖\n6. 浇在金针菇上拌匀',
    image: '', createdAt: Date.now() - 86400000 * 123, updatedAt: Date.now() - 86400000 * 123
  },
  {
    id: '124', name: '葱油饼', category: 'dishes',
    servings: 2, // 200g 面粉 2 张饼
    tags: ['面食', '北方菜'],
    recipe: '材料：面粉200g、葱、盐、食用油\n\n做法：\n1. 面粉加温水揉成光滑面团醒20分钟\n2. 葱切碎，加盐、油拌成葱油酥\n3. 面团擀薄抹葱油酥卷起\n4. 盘成螺旋状再擀成饼\n5. 平底锅刷油小火煎至两面金黄',
    image: '', createdAt: Date.now() - 86400000 * 124, updatedAt: Date.now() - 86400000 * 124
  },
  {
    id: '125', name: '韭菜盒子', category: 'dishes',
    servings: 2, // 200g 面粉 4 个
    tags: ['面食'],
    recipe: '材料：面粉200g、韭菜1把、鸡蛋3个、虾皮、盐、香油\n\n做法：\n1. 面粉加热水揉成面团醒20分钟\n2. 韭菜切碎，鸡蛋炒熟切碎\n3. 加虾皮、盐、香油拌成馅\n4. 面团分剂擀薄包入馅料\n5. 边缘捏花封口\n6. 平底锅煎至两面金黄',
    image: '', createdAt: Date.now() - 86400000 * 125, updatedAt: Date.now() - 86400000 * 125
  },
  {
    id: '126', name: '担担面', category: 'dishes',
    servings: 1, // 1 碗
    tags: ['面食', '川菜'],
    recipe: '材料：细面条100g、猪肉末50g、芽菜、花生碎、葱花、芝麻酱、辣椒油、生抽、醋\n\n做法：\n1. 调酱汁：芝麻酱、生抽、醋、辣椒油、花椒粉\n2. 肉末煸香加芽菜炒成臊子\n3. 煮面至八成熟捞出\n4. 碗底放酱汁、臊子\n5. 加面、撒花生碎葱花\n6. 配蔬菜烫熟即可',
    image: '', createdAt: Date.now() - 86400000 * 126, updatedAt: Date.now() - 86400000 * 126
  },
  {
    id: '127', name: '老北京炸酱面', category: 'dishes',
    servings: 2, // 2 碗
    tags: ['面食', '北方菜'],
    recipe: '材料：手擀面200g、五花肉末150g、黄豆酱、甜面酱、黄瓜丝、胡萝卜丝、豆芽、葱姜\n\n做法：\n1. 五花肉末煸出油至微焦\n2. 加黄豆酱、甜面酱炒成炸酱\n3. 黄瓜、胡萝卜切丝，豆芽焯水\n4. 煮面捞出过凉水\n5. 碗中放面、菜码\n6. 浇上炸酱拌匀',
    image: '', createdAt: Date.now() - 86400000 * 127, updatedAt: Date.now() - 86400000 * 127
  },
  {
    id: '128', name: '西湖牛肉羹', category: 'dishes',
    servings: 2, // 1 锅 2-3 人份
    tags: ['汤羹', '浙菜'],
    recipe: '材料：牛里脊100g、鸡蛋1个、香菇3朵、香菜、姜、盐、料酒、水淀粉、胡椒粉\n\n做法：\n1. 牛里脊切末，加盐、料酒、淀粉腌10分钟\n2. 香菇切碎，鸡蛋打散\n3. 锅中加水烧开，放牛肉末打散\n4. 加香菇煮3分钟\n5. 淋水淀粉勾芡\n6. 淋蛋液成蛋花\n7. 撒胡椒粉、香菜末',
    image: '', createdAt: Date.now() - 86400000 * 128, updatedAt: Date.now() - 86400000 * 128
  },
  {
    id: '129', name: '酸辣汤', category: 'dishes',
    servings: 2, // 1 锅
    tags: ['汤羹', '川菜'],
    recipe: '材料：豆腐1块、木耳5朵、鸡蛋1个、香菇3朵、火腿肠1根、葱姜、醋、辣椒油、胡椒粉、生抽、水淀粉\n\n做法：\n1. 豆腐切丝，木耳、香菇、火腿切丝\n2. 锅中加水烧开，放所有丝煮2分钟\n3. 加醋、生抽、辣椒油、胡椒粉调味\n4. 淋水淀粉勾薄芡\n5. 淋蛋液成蛋花\n6. 撒葱花',
    image: '', createdAt: Date.now() - 86400000 * 129, updatedAt: Date.now() - 86400000 * 129
  },
  {
    id: '130', name: '冬瓜排骨汤', category: 'dishes',
    servings: 3, // 1 锅
    tags: ['汤羹', '家常菜'],
    recipe: '材料：猪排骨500g、冬瓜500g、葱姜、盐、料酒、枸杞\n\n做法：\n1. 排骨冷水下锅焯水去血沫\n2. 捞出冲洗干净\n3. 砂锅加水放排骨、葱姜、料酒\n4. 大火烧开转小火炖40分钟\n5. 冬瓜去皮切块放入\n6. 继续炖15分钟\n7. 加盐调味撒枸杞',
    image: '', createdAt: Date.now() - 86400000 * 130, updatedAt: Date.now() - 86400000 * 130
  },
  {
    id: '131', name: '银耳莲子羹', category: 'dishes',
    servings: 2, // 1 锅
    tags: ['汤羹', '甜品', '润燥'],
    recipe: '材料：银耳1朵、莲子50g、红枣8颗、枸杞、冰糖\n\n做法：\n1. 银耳冷水泡发2小时撕小朵\n2. 莲子去芯\n3. 银耳入锅加水大火烧开转小火炖40分钟\n4. 加莲子、红枣继续炖20分钟\n5. 加冰糖、枸杞煮5分钟\n6. 关火焖10分钟即可',
    image: '', createdAt: Date.now() - 86400000 * 131, updatedAt: Date.now() - 86400000 * 131
  },
  {
    id: '132', name: '猪肉炖粉条', category: 'dishes',
    servings: 3, // 1 锅
    tags: ['北方菜', '家常菜'],
    recipe: '材料：五花肉300g、红薯粉条1把、酸白菜半棵、葱姜、八角、酱油、盐\n\n做法：\n1. 五花肉切块冷水焯水\n2. 酸白菜切丝\n3. 锅中放油煸炒五花肉出油\n4. 加葱姜、八角爆香\n5. 加酸白菜翻炒\n6. 加水、酱油炖30分钟\n7. 粉条泡软放入炖10分钟',
    image: '', createdAt: Date.now() - 86400000 * 132, updatedAt: Date.now() - 86400000 * 132
  },
  {
    id: '133', name: '小鸡炖蘑菇', category: 'dishes',
    servings: 3, // 1 锅
    tags: ['北方菜', '家常菜'],
    recipe: '材料：小笨鸡半只、干榛蘑50g、粉条1把、葱姜、八角、酱油、料酒、盐\n\n做法：\n1. 榛蘑冷水泡发2小时\n2. 小鸡剁块冷水焯水\n3. 锅中放油煸炒鸡块至金黄\n4. 加葱姜、八角、料酒、酱油\n5. 加水、榛蘑大火烧开转小火炖40分钟\n6. 粉条泡软放入炖10分钟\n7. 加盐调味',
    image: '', createdAt: Date.now() - 86400000 * 133, updatedAt: Date.now() - 86400000 * 133
  },
  {
    id: '134', name: '东北酸菜白肉锅', category: 'dishes',
    servings: 4, // 1 锅 4-5 人
    tags: ['北方菜', '汤羹', '家常菜'],
    recipe: '材料：东北酸菜1棵、五花肉300g、冻豆腐1盒、粉条1把、海米、葱姜\n\n做法：\n1. 酸菜切细丝冲洗\n2. 五花肉整块冷水煮20分钟至八成熟\n3. 捞出切薄片\n4. 锅中放油爆香葱姜海米\n5. 放酸菜翻炒\n6. 加肉汤煮开\n7. 加五花肉片、冻豆腐、粉条煮10分钟',
    image: '', createdAt: Date.now() - 86400000 * 134, updatedAt: Date.now() - 86400000 * 134
  },
  {
    id: '135', name: '山东大包子', category: 'dishes',
    servings: 4, // 12 个包子
    tags: ['面食', '北方菜'],
    recipe: '材料：面粉500g、五花肉300g、韭菜1把、鸡蛋3个、粉条1把、葱姜、酵母、酱油、香油\n\n做法：\n1. 面粉加酵母、温水揉成面团发酵2小时\n2. 五花肉切丁煸炒出油\n3. 韭菜切碎、鸡蛋炒熟、粉条泡软切碎\n4. 所有馅料加葱姜、酱油、香油拌匀\n5. 面团排气分剂擀皮\n6. 包入馅料捏褶\n7. 醒发15分钟后蒸15分钟',
    image: '', createdAt: Date.now() - 86400000 * 135, updatedAt: Date.now() - 86400000 * 135
  },
  {
    id: '136', name: '锅包肉', category: 'dishes',
    servings: 2, // 1 盘
    tags: ['北方菜', '东北菜'],
    recipe: '材料：猪里脊300g、土豆淀粉100g、鸡蛋1个、白糖、白醋、番茄酱、葱姜蒜、香菜\n\n做法：\n1. 里脊切厚片，加盐、料酒腌10分钟\n2. 土豆淀粉加水成糊，加蛋清拌匀\n3. 肉片裹淀粉糊\n4. 五成油温炸至定型捞出\n5. 油温升至七成复炸至金黄\n6. 调糖醋汁：白糖、白醋、番茄酱、盐\n7. 锅留底油爆葱姜蒜，下糖醋汁\n8. 放肉片快速翻炒挂汁，撒香菜',
    image: '', createdAt: Date.now() - 86400000 * 136, updatedAt: Date.now() - 86400000 * 136
  },
  {
    id: '137', name: '九转大肠', category: 'dishes',
    servings: 2, // 1 盘
    tags: ['鲁菜'],
    recipe: '材料：猪大肠500g、葱姜蒜、白糖、醋、酱油、料酒、肉桂粉、砂仁粉、胡椒粉\n\n做法：\n1. 大肠清洗干净，冷水下锅煮八成熟\n2. 捞出切2cm 段\n3. 锅中放油煸炒大肠至微黄\n4. 加白糖炒至焦糖色\n5. 加葱姜蒜、酱油、料酒、醋\n6. 加水没过食材小火煨10分钟\n7. 大火收汁，撒肉桂粉、砂仁粉、胡椒粉',
    image: '', createdAt: Date.now() - 86400000 * 137, updatedAt: Date.now() - 86400000 * 137
  },
  {
    id: '138', name: '糖醋鲤鱼', category: 'dishes',
    servings: 2, // 1 条
    tags: ['鲁菜'],
    recipe: '材料：鲤鱼1条、葱姜蒜、白糖、醋、番茄酱、淀粉、酱油、料酒\n\n做法：\n1. 鲤鱼处理干净切花刀\n2. 加盐、料酒、姜片腌15分钟\n3. 拍干淀粉\n4. 七成油温炸至定型捞出\n5. 油温升至八成复炸至金黄酥脆\n6. 调糖醋汁：白糖、醋、番茄酱、酱油、水\n7. 锅留底油爆葱姜蒜\n8. 倒入糖醋汁烧开勾芡\n9. 浇在鱼上',
    image: '', createdAt: Date.now() - 86400000 * 138, updatedAt: Date.now() - 86400000 * 138
  },
  {
    id: '139', name: '四喜丸子', category: 'dishes',
    servings: 3, // 4 个丸子
    tags: ['鲁菜', '家常菜'],
    recipe: '材料：猪肉馅300g、荸荠4个、鸡蛋1个、葱姜、淀粉、酱油、料酒、盐\n\n做法：\n1. 荸荠去皮切碎\n2. 肉馅加荸荠、蛋液、葱姜末、淀粉、酱油、料酒、盐\n3. 顺一个方向搅打上劲\n4. 团成4个大丸子\n5. 五成油温炸至定型捞出\n6. 砂锅放葱姜垫底\n7. 放丸子，加酱油、料酒、水\n8. 大火烧开转小火炖40分钟',
    image: '', createdAt: Date.now() - 86400000 * 139, updatedAt: Date.now() - 86400000 * 139
  },
  {
    id: '140', name: '西湖醋鱼', category: 'dishes',
    servings: 1, // 1 条
    tags: ['浙菜', '杭帮菜'],
    recipe: '材料：草鱼1条、葱姜、白糖、醋、酱油、料酒、水淀粉\n\n做法：\n1. 草鱼饿养1天去土腥味\n2. 冷水下锅，加葱姜、料酒\n3. 烧开后小火煮3分钟\n4. 关火焖5分钟\n5. 鱼捞出装盘\n6. 原汤留半碗，加白糖、醋、酱油调糖醋汁\n7. 烧开勾薄芡\n8. 浇在鱼身上',
    image: '', createdAt: Date.now() - 86400000 * 140, updatedAt: Date.now() - 86400000 * 140
  },
  {
    id: '141', name: '小笼包', category: 'dishes',
    servings: 2, // 12 个
    tags: ['面食', '早餐', '小吃'],
    recipe: '材料：面粉300g、猪肉馅200g、皮冻100g、葱姜、酵母、酱油、料酒、盐、香油\n\n做法：\n1. 面粉加酵母、温水揉成面团发酵\n2. 皮冻切碎\n3. 肉馅加皮冻、葱姜、酱油、料酒、盐、香油\n4. 顺一个方向搅打上劲\n5. 面团分剂擀薄皮\n6. 包入馅料捏成小包子\n7. 蒸笼铺屉布，摆放小笼包\n8. 大火蒸10分钟',
    image: '', createdAt: Date.now() - 86400000 * 141, updatedAt: Date.now() - 86400000 * 141
  },
  {
    id: '142', name: '生煎包', category: 'dishes',
    servings: 2, // 12 个
    tags: ['面食', '早餐', '小吃'],
    recipe: '材料：面粉300g、猪肉馅200g、葱姜、酵母、芝麻、葱花、酱油、料酒、盐\n\n做法：\n1. 面粉加酵母、温水揉成面团发酵\n2. 肉馅加葱姜、酱油、料酒、盐搅打上劲\n3. 面团分剂擀皮\n4. 包入馅料捏褶封口\n5. 平底锅烧热放油\n6. 摆放生煎包煎2分钟\n7. 加半碗水盖盖子\n8. 中火煎至水干\n9. 撒芝麻葱花再煎30秒',
    image: '', createdAt: Date.now() - 86400000 * 142, updatedAt: Date.now() - 86400000 * 142
  },
  {
    id: '143', name: '煎饼果子', category: 'dishes',
    servings: 1, // 1 套
    tags: ['早餐', '小吃', '北方菜'],
    recipe: '材料：杂粮面糊、鸡蛋1个、油条1根、甜面酱、葱花、香菜、辣椒酱\n\n做法：\n1. 杂粮面粉加水调成稀糊\n2. 鏊子烧热刷油\n3. 倒入面糊摊成薄饼\n4. 打1个鸡蛋刮匀\n5. 撒葱花、香菜\n6. 翻面刷甜面酱、辣椒酱\n7. 放油条卷起切段',
    image: '', createdAt: Date.now() - 86400000 * 143, updatedAt: Date.now() - 86400000 * 143
  },
  {
    id: '144', name: '油条豆浆', category: 'dishes',
    servings: 2, // 2 套
    tags: ['早餐', '小吃'],
    recipe: '材料：面粉300g、黄豆100g、酵母、小苏打、盐、油、白糖\n\n做法：\n1. 面粉加酵母、小苏打、盐、温水揉成面团\n2. 盖湿布醒发2小时\n3. 黄豆泡发8小时入豆浆机打浆\n4. 豆浆煮开滤渣加白糖\n5. 面团擀成长条切小剂\n6. 两个小剂叠一起用筷子压痕\n7. 拉长下七成油温炸至金黄膨大',
    image: '', createdAt: Date.now() - 86400000 * 144, updatedAt: Date.now() - 86400000 * 144
  },
  {
    id: '145', name: '茅台', category: 'drinks',
    servings: 1, // 1 杯
    tags: ['酒', '白酒'],
    recipe: '材料：53 度飞天茅台100ml、品鉴杯\n\n做法：\n1. 茅台瓶静置10分钟让酒体稳定\n2. 倒入品鉴杯1/3 满\n3. 先观色：透明微黄\n4. 再闻香：酱香突出\n5. 小口品鉴：入口绵柔\n6. 空杯留香持久',
    image: '', createdAt: Date.now() - 86400000 * 145, updatedAt: Date.now() - 86400000 * 145
  },
  {
    id: '146', name: '威士忌', category: 'drinks',
    servings: 1, // 1 杯
    tags: ['酒', '洋酒'],
    recipe: '材料：单一麦芽威士忌50ml、古典杯、冰球\n\n做法：\n1. 古典杯放入大冰球\n2. 倒入威士忌50ml\n3. 静置2分钟让酒体与冰融合\n4. 闻香：泥煤、果干、香草\n5. 小口纯饮\n6. 可加2 滴水打开风味',
    image: '', createdAt: Date.now() - 86400000 * 146, updatedAt: Date.now() - 86400000 * 146
  },
  {
    id: '147', name: '莫吉托', category: 'drinks',
    servings: 1, // 1 杯
    tags: ['酒', '鸡尾酒'],
    recipe: '材料：白朗姆酒60ml、新鲜薄荷叶8片、青柠半颗、白糖2勺、苏打水、冰块\n\n做法：\n1. 薄荷叶、青柠片、白糖放入杯中\n2. 用吧勺轻轻捣压出薄荷汁\n3. 加冰块至杯2/3\n4. 倒入白朗姆酒\n5. 加苏打水至杯满\n6. 用吧勺搅拌\n7. 薄荷叶装饰',
    image: '', createdAt: Date.now() - 86400000 * 147, updatedAt: Date.now() - 86400000 * 147
  },
  {
    id: '148', name: '长岛冰茶', category: 'drinks',
    servings: 1, // 1 杯
    tags: ['酒', '鸡尾酒'],
    recipe: '材料：伏特加15ml、白朗姆酒15ml、金酒15ml、龙舌兰15ml、白君度15ml、柠檬汁30ml、糖浆15ml、可乐\n\n做法：\n1. 高球杯装满冰块\n2. 依次加入四种基酒和白君度\n3. 加柠檬汁和糖浆\n4. 倒入可乐至杯满\n5. 轻轻搅拌\n6. 杯口放柠檬片装饰',
    image: '', createdAt: Date.now() - 86400000 * 148, updatedAt: Date.now() - 86400000 * 148
  },
  {
    id: '149', name: '自制奶茶', category: 'drinks',
    servings: 1, // 1 杯
    tags: ['饮品', '甜品'],
    recipe: '材料：红茶包2包、热水200ml、全脂牛奶200ml、白糖30g、淡奶50ml\n\n做法：\n1. 红茶包用热水冲泡5分钟\n2. 取出茶包加白糖搅匀\n3. 牛奶加热至70度\n4. 倒入红茶中\n5. 加淡奶增加奶香\n6. 用奶泡器打出奶泡\n7. 倒入杯中奶泡浮面',
    image: '', createdAt: Date.now() - 86400000 * 149, updatedAt: Date.now() - 86400000 * 149
  },
  {
    id: '150', name: '蛋挞', category: 'desserts',
    servings: 3, // 12 个
    tags: ['甜品', '小吃'],
    recipe: '材料：蛋挞皮12个、鸡蛋2个、淡奶油150ml、牛奶100ml、白糖40g\n\n做法：\n1. 鸡蛋打散加白糖搅匀\n2. 加牛奶、淡奶油拌匀\n3. 过筛2次去蛋筋\n4. 倒入蛋挞皮8分满\n5. 烤箱预热200度\n6. 中层烤25分钟至表面焦糖色\n7. 取出晾5分钟',
    image: '', createdAt: Date.now() - 86400000 * 150, updatedAt: Date.now() - 86400000 * 150
  },
  {
    id: '151', name: '双皮奶', category: 'desserts',
    servings: 2, // 1 锅
    tags: ['甜品', '粤菜'],
    recipe: '材料：全脂牛奶500ml、鸡蛋清2个、白糖30g\n\n做法：\n1. 牛奶煮至微沸关火\n2. 倒入碗中静置20分钟结皮\n3. 小心挑起奶皮把牛奶倒入另一碗\n4. 留奶皮在碗底\n5. 蛋清加白糖打散\n6. 倒入温牛奶中搅匀\n7. 沿碗边慢慢倒回有奶皮的碗\n8. 盖保鲜膜蒸15分钟\n9. 撒红豆或芒果丁',
    image: '', createdAt: Date.now() - 86400000 * 151, updatedAt: Date.now() - 86400000 * 151
  },
  {
    id: '152', name: '提拉米苏', category: 'desserts',
    servings: 4, // 1 个 6 寸
    tags: ['甜品', '西餐'],
    recipe: '材料：马斯卡彭奶酪250g、鸡蛋3个、浓缩咖啡100ml、朗姆酒15ml、手指饼干1包、可可粉、白糖60g\n\n做法：\n1. 蛋黄加白糖隔水打发至浓稠\n2. 加马斯卡彭奶酪拌匀\n3. 蛋白打发至硬性发泡\n4. 分两次拌入奶酪糊\n5. 浓缩咖啡加朗姆酒\n6. 手指饼干快速蘸咖啡液\n7. 模具底层铺饼干\n8. 铺一层奶酪糊\n9. 重复一次\n10. 冷藏4小时\n11. 撒可可粉',
    image: '', createdAt: Date.now() - 86400000 * 152, updatedAt: Date.now() - 86400000 * 152
  },
  {
    id: '153', name: '抹茶蛋糕', category: 'desserts',
    servings: 6, // 1 个 6 寸
    tags: ['甜品', '西餐'],
    recipe: '材料：低筋面粉80g、鸡蛋4个、抹茶粉10g、白糖70g、牛奶50ml、玉米油40ml、淡奶油200ml\n\n做法：\n1. 蛋白蛋黄分离\n2. 蛋黄加牛奶、玉米油拌匀\n3. 筛入低筋面粉和抹茶粉\n4. 蛋白分3次加白糖打发至硬性\n5. 分两次拌入面糊\n6. 倒入6寸模具震气泡\n7. 烤箱预热150度\n8. 中下层烤50分钟\n9. 倒扣晾凉\n10. 淡奶油打发抹面装饰',
    image: '', createdAt: Date.now() - 86400000 * 153, updatedAt: Date.now() - 86400000 * 153
  },
  {
    id: '154', name: '芝士蛋糕', category: 'desserts',
    servings: 6, // 1 个 6 寸
    tags: ['甜品', '西餐'],
    recipe: '材料：奶油奶酪250g、消化饼干底100g、黄油40g、鸡蛋2个、白糖60g、淡奶油100ml、柠檬汁10ml\n\n做法：\n1. 消化饼干压碎加融化的黄油\n2. 铺在6寸模具底部压实\n3. 奶油奶酪室温软化加白糖打顺滑\n4. 分次加鸡蛋拌匀\n5. 加淡奶油、柠檬汁拌匀\n6. 过筛倒入模具\n7. 烤箱预热160度水浴法\n8. 烤50分钟\n9. 关火焖30分钟\n10. 冷藏4小时脱模',
    image: '', createdAt: Date.now() - 86400000 * 154, updatedAt: Date.now() - 86400000 * 154
  },
  {
    id: '155', name: '熔岩巧克力', category: 'desserts',
    servings: 2, // 2 个
    tags: ['甜品', '西餐'],
    recipe: '材料：黑巧克力100g、黄油50g、鸡蛋2个、白糖30g、低筋面粉30g\n\n做法：\n1. 黑巧克力和黄油隔水融化\n2. 鸡蛋打散加白糖\n3. 隔水加热至40度打发至浓稠\n4. 巧克力液倒入蛋液中拌匀\n5. 筛入低筋面粉拌匀\n6. 模具刷黄油撒面粉\n7. 面糊倒入模具八分满\n8. 烤箱预热200度\n9. 烤8分钟至边缘凝固中间软\n10. 立即脱模配冰淇淋',
    image: '', createdAt: Date.now() - 86400000 * 155, updatedAt: Date.now() - 86400000 * 155
  },
  {
    id: '156', name: '班戟', category: 'desserts',
    servings: 2, // 6 张
    tags: ['甜品', '港式'],
    recipe: '材料：低筋面粉60g、鸡蛋1个、牛奶150ml、黄油15g、淡奶油200ml、白糖40g、芒果1个\n\n做法：\n1. 鸡蛋打散加牛奶、白糖拌匀\n2. 筛入低筋面粉拌成稀面糊\n3. 加融化的黄油过筛\n4. 平底锅小火摊成薄饼\n5. 烙至两面微黄出锅\n6. 淡奶油加白糖打发\n7. 芒果切条\n8. 班戟皮放奶油、芒果条\n9. 四边折起包成正方形',
    image: '', createdAt: Date.now() - 86400000 * 156, updatedAt: Date.now() - 86400000 * 156
  },
  {
    id: '157', name: '雪媚娘', category: 'desserts',
    servings: 3, // 8 个
    tags: ['甜品', '日式'],
    recipe: '材料：糯米粉120g、玉米淀粉30g、牛奶180ml、白糖40g、黄油20g、淡奶油200ml、芒果1个、奥利奥饼干\n\n做法：\n1. 糯米粉、玉米淀粉、白糖、牛奶拌匀\n2. 盖保鲜膜蒸25分钟\n3. 加黄油揉成光滑面团\n4. 撒熟糯米粉防粘\n5. 面团分8份擀薄\n6. 淡奶油打发加糖\n7. 糯米皮放模具\n8. 放奶油、芒果丁或奥利奥碎\n9. 包起来收口向下\n10. 冷藏1小时',
    image: '', createdAt: Date.now() - 86400000 * 157, updatedAt: Date.now() - 86400000 * 157
  },
  // ═══════ 用户新增菜品 ═══════
  {
    id: '158', name: '泰式打抛饭', category: 'dishes',
    servings: 2, // 2 人份
    tags: ['泰式'],
    recipe: '材料：猪肉末200g、打抛叶（九层塔）1把、小米辣3个、蒜4瓣、鱼露1勺、生抽1勺、蚝油1勺、白糖半勺、鸡蛋1个、米饭2碗\n\n做法：\n1. 蒜和小米辣切碎\n2. 热油爆香蒜末辣椒\n3. 下肉末炒散至变色\n4. 加鱼露、生抽、蚝油、白糖翻炒\n5. 放入打抛叶快速翻炒至软\n6. 煎一个太阳蛋\n7. 盛一碗米饭，盖上肉末和煎蛋',
    image: '', createdAt: Date.now() - 86400000 * 158, updatedAt: Date.now() - 86400000 * 158
  },
  {
    id: '159', name: '辣椒茄子包', category: 'dishes',
    servings: 2, // 2-3 人份
    tags: ['素菜', '下饭菜'],
    recipe: '材料：青椒3个、茄子2个、蒜3瓣、生抽1勺、醋1勺、白糖半勺、淀粉1勺\n\n做法：\n1. 青椒洗净去籽，茄子切段\n2. 调汁：生抽、醋、白糖、淀粉加少许水搅匀\n3. 热油下青椒煎至表皮焦黄起皱\n4. 盛出青椒，下茄子煎软\n5. 倒入青椒和蒜末翻炒\n6. 淋入调好的料汁\n7. 大火收汁即可',
    image: '', createdAt: Date.now() - 86400000 * 159, updatedAt: Date.now() - 86400000 * 159
  },
  {
    id: '160', name: '清炖排骨', category: 'dishes',
    servings: 3, // 3 人份
    tags: ['汤', '家常'],
    recipe: '材料：排骨500g、姜3片、葱2根、料酒1勺、盐适量、枸杞少许、白胡椒粉少许\n\n做法：\n1. 排骨洗净冷水下锅，加姜片料酒焯水\n2. 煮沸撇去浮沫，捞出冲洗干净\n3. 排骨放入砂锅，加足量热水\n4. 加姜片葱段，大火煮沸转小火\n5. 慢炖1-1.5小时至排骨酥烂\n6. 出锅前加盐、枸杞、白胡椒粉调味\n7. 撒葱花即可',
    image: '', createdAt: Date.now() - 86400000 * 160, updatedAt: Date.now() - 86400000 * 160
  },
  {
    id: '161', name: '杏鲍菇虾滑', category: 'dishes',
    servings: 2, // 2 人份
    tags: ['创意菜', '我的最爱'],
    recipe: '材料：杏鲍菇2根、虾滑150g、生抽1勺、蚝油1勺、蒜2瓣、葱花少许、黑胡椒粉少许\n\n做法：\n1. 杏鲍菇切成厚片（约1cm厚）\n2. 虾滑挤在杏鲍菇片上抹平\n3. 不粘锅少许油，虾滑面朝下先煎\n4. 煎至金黄翻面，煎杏鲍菇面\n5. 调汁：生抽、蚝油、蒜末加少许水搅匀\n6. 倒入锅中焖2分钟\n7. 出锅撒黑胡椒粉和葱花',
    image: '', createdAt: Date.now() - 86400000 * 161, updatedAt: Date.now() - 86400000 * 161
  },
];

const DATA_VERSION_KEY = 'menu_app_data_version';
const CURRENT_DATA_VERSION = 7;
// 包包的最爱：仅以下三道
const BAOBAO_FAV_IDS = new Set(['14', '15', '20']); // 腌笃鲜、红烧排骨、糖醋里脊
// 我的最爱：仅以下四道
const WODE_FAV_IDS = new Set(['11', '12', '3', '13']); // 锅包肉、地三鲜、番茄炒蛋、鱼香肉丝

// 迁移到指定版本
function migrate(existing, fromVersion) {
  let data = existing;
  if (fromVersion < 1) {
    // 预留
  }
  if (fromVersion < 2) {
    // 预留
  }
  if (fromVersion < 3) {
    // v3: 清理 包包的最爱 标签，只保留三道
    data = data.map(dish => {
      if (!dish.tags) return dish;
      if (dish.tags.includes('包包的最爱')) {
        if (BAOBAO_FAV_IDS.has(dish.id)) return dish;
        return { ...dish, tags: dish.tags.filter(t => t !== '包包的最爱') };
      }
      return dish;
    });
    // 确保 腌笃鲜 (id=14) 带上该标签
    data = data.map(dish => {
      if (dish.id === '14' && (!dish.tags || !dish.tags.includes('包包的最爱'))) {
        return { ...dish, tags: [...(dish.tags || []), '包包的最爱'] };
      }
      return dish;
    });
  }
  if (fromVersion < 4) {
    // v4: 清理 我的最爱 标签，只保留四道（锅包肉、地三鲜、番茄炒蛋、鱼香肉丝）
    data = data.map(dish => {
      if (!dish.tags) return dish;
      if (dish.tags.includes('我的最爱')) {
        if (WODE_FAV_IDS.has(dish.id)) return dish;
        return { ...dish, tags: dish.tags.filter(t => t !== '我的最爱') };
      }
      return dish;
    });
    // 确保 地三鲜 (id=12) 带上该标签
    data = data.map(dish => {
      if (dish.id === '12' && (!dish.tags || !dish.tags.includes('我的最爱'))) {
        return { ...dish, tags: [...(dish.tags || []), '我的最爱'] };
      }
      return dish;
    });
  }
  if (fromVersion < 5) {
    // v5: 新增默认菜品 黄瓜皮蛋汤 (id=67)
    // merge 流程会通过 SAMPLE_DISHES 自动补齐，无需特殊处理
  }
  if (fromVersion < 6) {
    // v6: 批量扩展至 157 道（菜品 93 + 饮品 31 + 甜品 33）
    // merge 流程会通过 id 去重自动补齐 SAMPLE_DISHES 中的新项
  }
  if (fromVersion < 7) {
    // v7: 新增 4 道菜品：泰式打抛饭、辣椒茄子包、清炖排骨、杏鲍菇虾滑
    // merge 流程会通过 id 去重自动补齐 SAMPLE_DISHES 中的新项
  }
  return data;
}

// 获取所有菜品
export function getDishes() {
  try {
    const data = localStorage.getItem(DISHES_KEY);
    const version = parseInt(localStorage.getItem(DATA_VERSION_KEY) || '0');
    if (!data || version < CURRENT_DATA_VERSION) {
      if (data) {
        // 1) 迁移已有数据
        const migrated = migrate(JSON.parse(data), version);
        // 2) 合并示例数据中不存在的新项
        const existingIds = new Set(migrated.map(d => d.id));
        const newOnes = SAMPLE_DISHES.filter(d => !existingIds.has(d.id));
        const merged = [...migrated, ...newOnes];
        localStorage.setItem(DISHES_KEY, JSON.stringify(merged));
        localStorage.setItem(DATA_VERSION_KEY, String(CURRENT_DATA_VERSION));
        return merged;
      } else {
        localStorage.setItem(DISHES_KEY, JSON.stringify(SAMPLE_DISHES));
        localStorage.setItem(DATA_VERSION_KEY, String(CURRENT_DATA_VERSION));
        return SAMPLE_DISHES;
      }
    }
    return JSON.parse(data);
  } catch {
    return SAMPLE_DISHES;
  }
}

// 保存所有菜品
export function saveDishes(dishes) {
  localStorage.setItem(DISHES_KEY, JSON.stringify(dishes));
}

// 获取单个菜品
export function getDish(id) {
  const dishes = getDishes();
  return dishes.find(d => d.id === id) || null;
}

// 添加菜品
export function addDish(dish) {
  const dishes = getDishes();
  const newDish = {
    ...dish,
    id: Date.now().toString(),
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
  dishes.unshift(newDish);
  saveDishes(dishes);
  return newDish;
}

// 更新菜品
export function updateDish(id, updates) {
  const dishes = getDishes();
  const idx = dishes.findIndex(d => d.id === id);
  if (idx === -1) return null;
  dishes[idx] = { ...dishes[idx], ...updates, updatedAt: Date.now() };
  saveDishes(dishes);
  return dishes[idx];
}

// 删除菜品
export function deleteDish(id) {
  const dishes = getDishes();
  const filtered = dishes.filter(d => d.id !== id);
  saveDishes(filtered);
}

// 按分类获取
export function getDishesByCategory(category) {
  return getDishes().filter(d => d.category === category);
}

// 按标签筛选
export function getDishesByTag(tag) {
  return getDishes().filter(d => d.tags && d.tags.includes(tag));
}

// 按分类+标签筛选
export function getDishesByFilter(category, tag) {
  let dishes = getDishes();
  if (category) dishes = dishes.filter(d => d.category === category);
  if (tag) dishes = dishes.filter(d => d.tags && d.tags.includes(tag));
  return dishes;
}

// 主题
export function getTheme() {
  return localStorage.getItem(THEME_KEY) || 'pompompurin';
}

export function saveTheme(theme) {
  localStorage.setItem(THEME_KEY, theme);
}

// 导出/导入
export function exportData() {
  const dishes = getDishes();
  const theme = getTheme();
  return JSON.stringify({ dishes, theme, exportedAt: new Date().toISOString() }, null, 2);
}

export function importData(jsonStr) {
  try {
    const data = JSON.parse(jsonStr);
    if (data.dishes) saveDishes(data.dishes);
    if (data.theme) saveTheme(data.theme);
    return true;
  } catch {
    return false;
  }
}

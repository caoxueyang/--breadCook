// localStorage CRUD 工具函数
const DISHES_KEY = 'menu_app_dishes';
const THEME_KEY = 'menu_app_theme';

// 预置示例菜品数据
const SAMPLE_DISHES = [
  // 菜品
  {
    id: '1', name: '红烧肉', category: 'dishes',
    tags: ['东北菜'],
    recipe: '材料：五花肉500g、生抽、老抽、冰糖、八角、桂皮、葱姜\n\n做法：\n1. 五花肉切块，冷水下锅焯水去血沫\n2. 锅中放油，加冰糖炒糖色\n3. 放入五花肉翻炒上色\n4. 加入生抽、老抽、八角、桂皮、葱姜\n5. 加热水没过肉块，大火烧开转小火炖1小时\n6. 大火收汁即可',
    image: '', createdAt: Date.now() - 86400000 * 5, updatedAt: Date.now() - 86400000 * 5
  },
  {
    id: '2', name: '清炒时蔬', category: 'dishes',
    tags: ['应季菜'],
    recipe: '材料：时令蔬菜、蒜末、盐、食用油\n\n做法：\n1. 蔬菜洗净切段\n2. 热锅凉油，蒜末爆香\n3. 大火快炒蔬菜\n4. 加盐调味，翻炒均匀出锅',
    image: '', createdAt: Date.now() - 86400000 * 4, updatedAt: Date.now() - 86400000 * 4
  },
  {
    id: '3', name: '番茄炒蛋', category: 'dishes',
    tags: ['我的最爱'],
    recipe: '材料：番茄2个、鸡蛋3个、盐、糖、葱\n\n做法：\n1. 番茄切块，鸡蛋打散加少许盐\n2. 热油炒蛋液凝固盛出\n3. 锅中留油炒番茄，加少许糖\n4. 番茄出汁后加入炒蛋\n5. 加盐调味，撒葱花出锅',
    image: '', createdAt: Date.now() - 86400000 * 3, updatedAt: Date.now() - 86400000 * 3
  },
  {
    id: '4', name: '水煮鱼', category: 'dishes',
    tags: [],
    recipe: '材料：草鱼片、豆芽、花椒、干辣椒、豆瓣酱、蒜\n\n做法：\n1. 鱼片用盐、料酒、淀粉腌制15分钟\n2. 豆芽焯水铺碗底\n3. 炒豆瓣酱出红油，加水煮开\n4. 下鱼片滑散，煮2分钟捞出\n5. 撒上花椒、干辣椒、蒜末\n6. 浇热油激香',
    image: '', createdAt: Date.now() - 86400000 * 2, updatedAt: Date.now() - 86400000 * 2
  },
  {
    id: '11', name: '锅包肉', category: 'dishes',
    tags: ['我的最爱', '东北菜'],
    recipe: '材料：猪里脊肉300g、土豆淀粉、胡萝卜、香菜、白糖、白醋、番茄酱\n\n做法：\n1. 里脊肉切薄片，用盐、料酒腌制\n2. 土豆淀粉加水调成糊，肉片裹糊\n3. 油温六成熟下锅炸至金黄捞出\n4. 油温升高后复炸一次更酥脆\n5. 锅留底油，加白糖、白醋、番茄酱炒成糖醋汁\n6. 倒入肉片翻炒，加胡萝卜丝、香菜出锅',
    image: '', createdAt: Date.now() - 86400000 * 11, updatedAt: Date.now() - 86400000 * 11
  },
  {
    id: '12', name: '地三鲜', category: 'dishes',
    tags: ['我的最爱', '东北菜'],
    recipe: '材料：茄子、土豆、青椒、蒜末、生抽、老抽、蚝油、淀粉\n\n做法：\n1. 茄子、土豆切滚刀块，青椒切块\n2. 土豆和茄子分别炸至金黄捞出\n3. 锅留底油，炒香蒜末\n4. 加生抽、老抽、蚝油、糖、水调成酱汁\n5. 倒入炸好的土豆茄子翻炒\n6. 加入青椒炒匀，勾薄芡出锅',
    image: '', createdAt: Date.now() - 86400000 * 12, updatedAt: Date.now() - 86400000 * 12
  },
  {
    id: '13', name: '鱼香肉丝', category: 'dishes',
    tags: ['我的最爱'],
    recipe: '材料：猪里脊肉200g、木耳、胡萝卜、青椒、豆瓣酱、醋、糖、淀粉\n\n做法：\n1. 里脊肉切丝，用盐、料酒、淀粉腌制\n2. 木耳、胡萝卜、青椒切丝\n3. 调鱼香汁：醋、糖、生抽、淀粉水\n4. 热油炒肉丝变色盛出\n5. 炒豆瓣酱出红油，加配菜翻炒\n6. 倒回肉丝，淋鱼香汁翻炒均匀',
    image: '', createdAt: Date.now() - 86400000 * 13, updatedAt: Date.now() - 86400000 * 13
  },
  {
    id: '14', name: '腌笃鲜', category: 'dishes',
    tags: ['应季菜', '包包的最爱'],
    recipe: '材料：咸肉200g、鲜肉200g、春笋2根、百叶结、葱姜、料酒\n\n做法：\n1. 咸肉和鲜肉分别焯水去血沫\n2. 春笋剥壳切滚刀块焯水去涩\n3. 砂锅中加足量水，放入咸肉和鲜肉\n4. 加葱姜、料酒，大火烧开转小火炖1小时\n5. 加入春笋和百叶结继续炖30分钟\n6. 加盐调味，撒葱花出锅',
    image: '', createdAt: Date.now() - 86400000 * 14, updatedAt: Date.now() - 86400000 * 14
  },
  {
    id: '15', name: '红烧排骨', category: 'dishes',
    tags: ['包包的最爱', '东北菜'],
    recipe: '材料：排骨500g、生抽、老抽、冰糖、八角、桂皮、葱姜蒜\n\n做法：\n1. 排骨冷水下锅焯水去血沫\n2. 锅中放油，加冰糖炒糖色\n3. 放入排骨翻炒上色\n4. 加生抽、老抽、八角、桂皮\n5. 加热水没过排骨，大火烧开转小火炖40分钟\n6. 大火收汁，撒葱花出锅',
    image: '', createdAt: Date.now() - 86400000 * 15, updatedAt: Date.now() - 86400000 * 15
  },
  {
    id: '16', name: '排骨焖饭', category: 'dishes',
    tags: ['东北菜'],
    recipe: '材料：排骨300g、大米、土豆、胡萝卜、生抽、老抽、蚝油\n\n做法：\n1. 排骨焯水，用生抽、老抽、蚝油腌制\n2. 土豆、胡萝卜切丁\n3. 锅中放油，炒香排骨\n4. 加入土豆胡萝卜翻炒\n5. 大米洗净放入电饭煲，铺上炒好的排骨\n6. 加水没过食材，按煮饭键，熟后拌匀',
    image: '', createdAt: Date.now() - 86400000 * 16, updatedAt: Date.now() - 86400000 * 16
  },
  {
    id: '17', name: '酸辣土豆丝', category: 'dishes',
    tags: ['东北菜'],
    recipe: '材料：土豆2个、干辣椒、花椒、醋、盐、葱\n\n做法：\n1. 土豆切细丝，泡水去淀粉\n2. 热油炒花椒出香味捞出\n3. 加干辣椒、蒜片爆香\n4. 大火快炒土豆丝\n5. 加醋、盐调味\n6. 炒至断生，撒葱花出锅',
    image: '', createdAt: Date.now() - 86400000 * 17, updatedAt: Date.now() - 86400000 * 17
  },
  {
    id: '18', name: '宫保鸡丁', category: 'dishes',
    tags: [],
    recipe: '材料：鸡胸肉300g、花生米、干辣椒、花椒、黄瓜、葱姜蒜\n\n做法：\n1. 鸡胸肉切丁，用盐、料酒、淀粉腌制\n2. 花生米炸至金黄备用\n3. 调宫保汁：醋、糖、生抽、淀粉水\n4. 热油炒鸡丁变色盛出\n5. 炒干辣椒、花椒、葱姜蒜\n6. 倒回鸡丁，淋宫保汁翻炒，撒花生米出锅',
    image: '', createdAt: Date.now() - 86400000 * 18, updatedAt: Date.now() - 86400000 * 18
  },
  {
    id: '19', name: '麻婆豆腐', category: 'dishes',
    tags: [],
    recipe: '材料：嫩豆腐1块、猪肉末100g、豆瓣酱、花椒粉、蒜末、葱花\n\n做法：\n1. 豆腐切小块，开水焯烫备用\n2. 热油炒肉末至变色\n3. 加豆瓣酱炒出红油\n4. 加水煮开，放入豆腐炖煮3分钟\n5. 勾芡收汁\n6. 撒花椒粉、葱花出锅',
    image: '', createdAt: Date.now() - 86400000 * 19, updatedAt: Date.now() - 86400000 * 19
  },
  {
    id: '20', name: '糖醋里脊', category: 'dishes',
    tags: ['包包的最爱', '东北菜'],
    recipe: '材料：猪里脊肉300g、淀粉、白糖、醋、番茄酱、盐\n\n做法：\n1. 里脊肉切条，用盐、料酒腌制\n2. 裹上淀粉糊\n3. 油温六成熟炸至金黄捞出\n4. 复炸一次更酥脆\n5. 锅留底油，加白糖、醋、番茄酱炒成糖醋汁\n6. 倒入里脊翻炒均匀出锅',
    image: '', createdAt: Date.now() - 86400000 * 20, updatedAt: Date.now() - 86400000 * 20
  },
  {
    id: '31', name: '土豆丝卷饼', category: 'dishes',
    tags: ['东北菜'],
    recipe: '材料：土豆1个、面粉200g、葱、生抽、蚝油、黄豆酱\n\n做法：\n1. 面粉加热水揉成面团，醒20分钟\n2. 土豆去皮擦丝，泡水去淀粉\n3. 热油炒香葱花，加入黄豆酱、蚝油、生抽炒匀\n4. 倒入土豆丝翻炒至断生\n5. 面团分剂子抨成薄饼，烙熟\n6. 薄饼卷入炒好的土豆丝即可',
    image: '', createdAt: Date.now() - 86400000 * 31, updatedAt: Date.now() - 86400000 * 31
  },
  {
    id: '32', name: '三明治', category: 'dishes',
    tags: ['白人饭'],
    recipe: '材料：吐司面包4片、火腿、芝士片、生菜、番茄、蛋黄酱\n\n做法：\n1. 吐司面包去边\n2. 生菜洗净沥干，番茄切片\n3. 取一片吐司，抹蛋黄酱\n4. 依次铺上生菜、番茄片、芝士、火腿\n5. 盖上另一片吐司压紧\n6. 对角切开即可食用',
    image: '', createdAt: Date.now() - 86400000 * 32, updatedAt: Date.now() - 86400000 * 32
  },
  {
    id: '33', name: '可乐鸡翅', category: 'dishes',
    tags: [],
    recipe: '材料：鸡翅中10个、可乐1罐、生抽、老抽、葱姜、八角\n\n做法：\n1. 鸡翅两面划刀，冷水焯水去血沫\n2. 锅中少油，鸡翅煎至两面金黄\n3. 加葱姜、八角炒香\n4. 倒入生抽、老抽炒上色\n5. 倒入可乐没过鸡翅\n6. 大火烧开转小火炖20分钟，大火收汁',
    image: '', createdAt: Date.now() - 86400000 * 33, updatedAt: Date.now() - 86400000 * 33
  },
  {
    id: '34', name: '蛋炒饭', category: 'dishes',
    tags: [],
    recipe: '材料：隔夜米饭2碗、鸡蛋2个、葱花、盐、生抽\n\n做法：\n1. 鸡蛋打散加少许盐\n2. 热油炒蛋液凝固划散盛出\n3. 锅中留底油，倒入米饭炒散\n4. 加生抽上色调味\n5. 倒回鸡蛋炒匀\n6. 撒葱花出锅',
    image: '', createdAt: Date.now() - 86400000 * 34, updatedAt: Date.now() - 86400000 * 34
  },
  {
    id: '35', name: '西红柿炖牛腩', category: 'dishes',
    tags: ['东北菜'],
    recipe: '材料：牛腩500g、番茄2个、番茄酱、葱姜、八角、生抽、料酒\n\n做法：\n1. 牛腩切块，冷水焯水去血沫\n2. 热油炒香葱姜、八角\n3. 放入牛腩翻炒，加料酒\n4. 加番茄块炒出汁\n5. 加生抽、番茄酱、热水烧开\n6. 转小火炖1.5小时，加盐调味',
    image: '', createdAt: Date.now() - 86400000 * 35, updatedAt: Date.now() - 86400000 * 35
  },
  {
    id: '36', name: '孜然羊肉', category: 'dishes',
    tags: ['东北菜'],
    recipe: '材料：羊里脊300g、洋葱、孜然粉、辣椒粉、生抽、料酒、香菜\n\n做法：\n1. 羊肉切薄片，用生抽、料酒、淀粉腌制\n2. 洋葱切丝\n3. 热油爆炒羊肉至变色盛出\n4. 炒香洋葱\n5. 倒回羊肉，撒孜然粉、辣椒粉\n6. 快速翻炒，撒香菜出锅',
    image: '', createdAt: Date.now() - 86400000 * 36, updatedAt: Date.now() - 86400000 * 36
  },
  {
    id: '37', name: '香菇滑鸡', category: 'dishes',
    tags: ['应季菜'],
    recipe: '材料：鸡腿肉300g、香菇6朵、姜、葱、料酒、生抽、蚝油、淀粉\n\n做法：\n1. 鸡腿肉切块，加生抽、料酒、淀粉腌制\n2. 香菇去蒂切片\n3. 热油炒香姜片、鸡块\n4. 加香菇翻炒\n5. 加生抽、蚝油、清水\n6. 盖盖子小火8分钟，撒葱花出锅',
    image: '', createdAt: Date.now() - 86400000 * 37, updatedAt: Date.now() - 86400000 * 37
  },
  {
    id: '38', name: '荷包蛋', category: 'dishes',
    tags: ['白人饭'],
    recipe: '材料：鸡蛋2个、盐、酱油、香油、葱花\n\n做法：\n1. 小火热锅少油\n2. 打入鸡蛋，蛋白周围起泡后微火煎\n3. 盖盖子焗2分钟，蛋黄呈溏心状\n4. 装盘后加少许生抽、香油\n5. 撒葱花即可',
    image: '', createdAt: Date.now() - 86400000 * 38, updatedAt: Date.now() - 86400000 * 38
  },
  // 酒品
  {
    id: '5', name: '桂花米酒', category: 'drinks',
    tags: ['酒'],
    recipe: '材料：糯米500g、酒曲、干桂花\n\n做法：\n1. 糯米浸泡6小时后蒸熟\n2. 晾至30度左右拌入酒曲\n3. 中间挖洞，密封发酵2-3天\n4. 出酒后加入干桂花\n5. 冷藏后饮用更佳',
    image: '', createdAt: Date.now() - 86400000 * 6, updatedAt: Date.now() - 86400000 * 6
  },
  {
    id: '6', name: '酸梅汤', category: 'drinks',
    tags: ['饮料'],
    recipe: '材料：乌梅、山楂、甘草、冰糖、桂花\n\n做法：\n1. 乌梅、山楂、甘草洗净浸泡30分钟\n2. 大火煮开转小火煮40分钟\n3. 加入冰糖搅拌融化\n4. 过滤后撒入桂花\n5. 冷藏饮用',
    image: '', createdAt: Date.now() - 86400000 * 7, updatedAt: Date.now() - 86400000 * 7
  },
  {
    id: '7', name: '百香果莫吉托', category: 'drinks',
    tags: ['酒'],
    recipe: '材料：百香果2个、白朗姆酒、薄荷叶、青柠、糖浆、苏打水\n\n做法：\n1. 薄荷叶与青柠角捣碎\n2. 加入百香果果肉和糖浆\n3. 倒入朗姆酒搅匀\n4. 加满冰块\n5. 注入苏打水，轻轻搅拌',
    image: '', createdAt: Date.now() - 86400000 * 1, updatedAt: Date.now() - 86400000 * 1
  },
  {
    id: '21', name: '红酒', category: 'drinks',
    tags: ['酒'],
    recipe: '经典赤霞珠红酒，醒酒30分钟后饮用最佳。\n\n适宜搭配：牛排、烤羊排、红烩菜肴',
    image: '', createdAt: Date.now() - 86400000 * 21, updatedAt: Date.now() - 86400000 * 21
  },
  {
    id: '22', name: '精酿啤酒', category: 'drinks',
    tags: ['酒'],
    recipe: 'IPA风格精酿啤酒，柑橘花香，苦度适中。\n\n适宜搭配：炸物、烤肉、小龙虾',
    image: '', createdAt: Date.now() - 86400000 * 22, updatedAt: Date.now() - 86400000 * 22
  },
  {
    id: '23', name: '梅酒', category: 'drinks',
    tags: ['酒'],
    recipe: '材料：青梅1kg、冰糖500g、白酒1.8L\n\n做法：\n1. 青梅洗净去蒂，擦干水分\n2. 一层青梅一层冰糖放入容器\n3. 倒入白酒没过青梅\n4. 密封存放阴凉处\n5. 3个月后即可饮用\n6. 加冰饮用更佳',
    image: '', createdAt: Date.now() - 86400000 * 23, updatedAt: Date.now() - 86400000 * 23
  },
  {
    id: '24', name: '清酒', category: 'drinks',
    tags: ['酒'],
    recipe: '日本纯米大酿酿清酒，精米步合70%。\n\n适宜温度：冷饮10°C或热饮45°C\n适宜搭配：刺身、寿司、清淡菜肴',
    image: '', createdAt: Date.now() - 86400000 * 24, updatedAt: Date.now() - 86400000 * 24
  },
  {
    id: '25', name: '柠檬蜂蜜水', category: 'drinks',
    tags: ['饮料'],
    recipe: '材料：柠檬1个、蜂蜜2勺、温水\n\n做法：\n1. 柠檬切片去籽\n2. 温水（不超过60°C）中加蜂蜜搅匀\n3. 放入柠檬片\n4. 冷藏后饮用更佳',
    image: '', createdAt: Date.now() - 86400000 * 25, updatedAt: Date.now() - 86400000 * 25
  },
  {
    id: '39', name: '珍珠奶茶', category: 'drinks',
    tags: ['饮料'],
    recipe: '材料：红茶包2包、牛奶300ml、珍珠粉圆、蜂蜜或果糖\n\n做法：\n1. 水烧开煮珍珠10分钟，关火焖10分钟\n2. 捞出珍珠过凉水备用\n3. 红茶包用开水泡5分钟\n4. 茶杯中加冰块、珍珠\n5. 倒入泡好的红茶\n6. 加入牛奶和蜂蜜搅匀',
    image: '', createdAt: Date.now() - 86400000 * 39, updatedAt: Date.now() - 86400000 * 39
  },
  {
    id: '40', name: '鲜榨橙汁', category: 'drinks',
    tags: ['饮料'],
    recipe: '材料：新鲜橙子2个、冰块\n\n做法：\n1. 橙子去皮去籽\n2. 果肉放入榨汁机\n3. 启动榨汁机榨成汁\n4. 过滤果渣后倒入杯中\n5. 加冰块即可饮用',
    image: '', createdAt: Date.now() - 86400000 * 40, updatedAt: Date.now() - 86400000 * 40
  },
  {
    id: '41', name: '草莓奶昔', category: 'drinks',
    tags: ['饮料'],
    recipe: '材料：草莓10颗、牛奶200ml、酸奶100ml、蜂蜜\n\n做法：\n1. 草莓洗净去蒂\n2. 草莓与牛奶、酸奶一起放入搅拌机\n3. 加一勺蜂蜜\n4. 高速搅拌1分钟至顺滑\n5. 倒入杯中装饰草莓',
    image: '', createdAt: Date.now() - 86400000 * 41, updatedAt: Date.now() - 86400000 * 41
  },
  {
    id: '42', name: '蓝莓奶昔', category: 'drinks',
    tags: ['饮料'],
    recipe: '材料：蓝莓100g、香蕉1根、牛奶200ml、酸奶100ml\n\n做法：\n1. 蓝莓洗净沥干\n2. 香蕉切段\n3. 所有材料放入搅拌机\n4. 高速搅拌至顺滑\n5. 倒入杯中装饰蓝莓',
    image: '', createdAt: Date.now() - 86400000 * 42, updatedAt: Date.now() - 86400000 * 42
  },
  {
    id: '43', name: '拿铁咖啡', category: 'drinks',
    tags: ['白人饭', '饮料'],
    recipe: '材料：浓缩咖啡30ml、牛奶200ml\n\n做法：\n1. 用意式咖啡机萃取浓缩咖啡\n2. 牛奶用奶泡机打成绵密奶泡\n3. 杯中先倒入浓缩咖啡\n4. 缓缓注入打好的热牛奶\n5. 最后铺一层奶泡\n6. 可可粉拉花装饰',
    image: '', createdAt: Date.now() - 86400000 * 43, updatedAt: Date.now() - 86400000 * 43
  },
  {
    id: '44', name: '卡布奇诺', category: 'drinks',
    tags: ['白人饭', '饮料'],
    recipe: '材料：浓缩咖啡30ml、牛奶150ml、可可粉\n\n做法：\n1. 萃取浓缩咖啡倒入杯中\n2. 牛奶打泡成绵密奶泡\n3. 倒入咖啡中，1/3咖啡、1/3热牛奶、1/3奶泡\n4. 表面筛上可可粉',
    image: '', createdAt: Date.now() - 86400000 * 44, updatedAt: Date.now() - 86400000 * 44
  },
  {
    id: '45', name: '冰美式', category: 'drinks',
    tags: ['饮料'],
    recipe: '材料：浓缩咖啡60ml、冰块、水\n\n做法：\n1. 玻璃杯中加满冰块\n2. 倒入萃取好的浓缩咖啡\n3. 加冷水至杯满\n4. 搅匀即可',
    image: '', createdAt: Date.now() - 86400000 * 45, updatedAt: Date.now() - 86400000 * 45
  },
  {
    id: '46', name: '焦糖玛奇朵', category: 'drinks',
    tags: ['白人饭', '饮料'],
    recipe: '材料：浓缩咖啡30ml、牛奶200ml、香草糖浆、焦糖酱\n\n做法：\n1. 杯底加入香草糖浆\n2. 倒入打发的热牛奶\n3. 缓缓加入浓缩咖啡形成分层\n4. 表面淋上焦糖酱花纹',
    image: '', createdAt: Date.now() - 86400000 * 46, updatedAt: Date.now() - 86400000 * 46
  },
  {
    id: '47', name: '金汤力', category: 'drinks',
    tags: ['酒'],
    recipe: '材料：金酒45ml、汤力水150ml、青柠角、冰块\n\n做法：\n1. 古典杯中加满冰块\n2. 倒入金酒\n3. 缓缓注入汤力水\n4. 夹入青柠角，轻搅',
    image: '', createdAt: Date.now() - 86400000 * 47, updatedAt: Date.now() - 86400000 * 47
  },
  {
    id: '48', name: '莫吉托', category: 'drinks',
    tags: ['酒'],
    recipe: '材料：白朗姆酒60ml、新鲜薄荷叶、青柠、糖浆、苏打水\n\n做法：\n1. 杯中放入薄荷叶8片\n2. 加入青柠角和糖浆捣压\n3. 倒入白朗姆酒\n4. 加满碎冰\n5. 注入苏打水至杯满\n6. 薄荷枝装饰',
    image: '', createdAt: Date.now() - 86400000 * 48, updatedAt: Date.now() - 86400000 * 48
  },
  {
    id: '49', name: '玛格丽特', category: 'drinks',
    tags: ['酒'],
    recipe: '材料：龙舌兰45ml、君度橙皮酒20ml、青柠汁30ml、盐\n\n做法：\n1. 杯沿用青柠抹湿后蘸盐\n2. 冰块放入雪克壶\n3. 加入龙舌兰、君度、青柠汁\n4. 摇匀15秒\n5. 滤入马天尼杯',
    image: '', createdAt: Date.now() - 86400000 * 49, updatedAt: Date.now() - 86400000 * 49
  },
  {
    id: '50', name: '长岛冰茶', category: 'drinks',
    tags: ['酒'],
    recipe: '材料：伏特加15ml、白朗姆15ml、金酒15ml、龙舌兰15ml、白柑兰酒15ml、柠檬汁30ml、糖浆、可乐\n\n做法：\n1. 冰块放入大杯中\n2. 依次加入五种酒\n3. 加入柠檬汁和糖浆\n4. 注入可乐至杯满\n5. 轻轻搅匀\n6. 柠檬片装饰',
    image: '', createdAt: Date.now() - 86400000 * 50, updatedAt: Date.now() - 86400000 * 50
  },
  {
    id: '51', name: '威士忌酸', category: 'drinks',
    tags: ['酒'],
    recipe: '材料：波本威士忌60ml、柠檬汁30ml、糖浆15ml、蛋清\n\n做法：\n1. 雪克壶中加冰\n2. 倒入威士忌、柠檬汁、糖浆、蛋清\n3. 不加冰干摇10秒出泡\n4. 加冰再摇10秒\n5. 滤入古典杯\n6. 樱桃和橙皮装饰',
    image: '', createdAt: Date.now() - 86400000 * 51, updatedAt: Date.now() - 86400000 * 51
  },
  {
    id: '52', name: '血腥玛丽', category: 'drinks',
    tags: ['酒'],
    recipe: '材料：伏特加45ml、番茄汁120ml、柠檬汁15ml、辣酱油、芹菜盐、黑胡椒\n\n做法：\n1. 杯沿抹柠檬汁蘸芹菜盐\n2. 大杯中加冰块\n3. 倒入伏特加和番茄汁\n4. 加柠檬汁、辣酱油\n5. 撒黑胡椒\n6. 搅匀，芹菜棒装饰',
    image: '', createdAt: Date.now() - 86400000 * 52, updatedAt: Date.now() - 86400000 * 52
  },
  // 甜品
  {
    id: '8', name: '芒果西米露', category: 'desserts',
    tags: ['甜品'],
    recipe: '材料：西米、芒果、椰浆、糖\n\n做法：\n1. 西米煮至透明，过凉水\n2. 芒果切丁，部分打成泥\n3. 椰浆加糖煮开晾凉\n4. 碗底铺西米\n5. 加芒果泥和椰浆\n6. 顶部放芒果丁装饰',
    image: '', createdAt: Date.now() - 86400000 * 8, updatedAt: Date.now() - 86400000 * 8
  },
  {
    id: '9', name: '双皮奶', category: 'desserts',
    tags: ['甜品'],
    recipe: '材料：全脂牛奶500ml、蛋清3个、糖40g\n\n做法：\n1. 牛奶煮至微沸，倒入碗中静置结皮\n2. 蛋清加糖打散过滤\n3. 牛奶皮边缘戳小口，倒出牛奶与蛋清混合\n4. 沿碗边缓缓倒回，让奶皮浮起\n5. 盖保鲜膜，水开后蒸15分钟\n6. 冷藏后食用',
    image: '', createdAt: Date.now() - 86400000 * 9, updatedAt: Date.now() - 86400000 * 9
  },
  {
    id: '10', name: '抹茶提拉米苏', category: 'desserts',
    tags: ['白人饭', '甜品'],
    recipe: '材料：马斯卡彭奶酪、抹茶粉、手指饼干、淡奶油、糖\n\n做法：\n1. 抹茶粉用温水调成浓液\n2. 马斯卡彭加糖打顺滑\n3. 淡奶油打至六分发拌入\n4. 手指饼干蘸抹茶液铺底\n5. 铺一层奶酪糊，再铺饼干\n6. 冷藏4小时，撒抹茶粉装饰',
    image: '', createdAt: Date.now() - 86400000 * 10, updatedAt: Date.now() - 86400000 * 10
  },
  {
    id: '26', name: '冰淇淋', category: 'desserts',
    tags: ['甜品'],
    recipe: '材料：淡奶油300ml、牛奶200ml、糖60g、蛋黄3个\n\n做法：\n1. 蛋黄加糖打至发白\n2. 牛奶煮至微沸，缓缓倒入蛋黄中搅拌\n3. 回锅小火加热至浓稠\n4. 淡奶油打至六分发\n5. 混合后倒入容器\n6. 冷冻4小时以上',
    image: '', createdAt: Date.now() - 86400000 * 26, updatedAt: Date.now() - 86400000 * 26
  },
  {
    id: '27', name: '芝士蛋糕', category: 'desserts',
    tags: ['甜品', '白人饭'],
    recipe: '材料：奶油奶酪250g、消化饼干100g、黄油50g、糖60g、鸡蛋2个\n\n做法：\n1. 饼干碎加融化黄油压底\n2. 奶油奶酪加糖打顺滑\n3. 逐个加入鸡蛋搅匀\n4. 倒入模具\n5. 160°C烤45分钟\n6. 冷藏4小时后食用',
    image: '', createdAt: Date.now() - 86400000 * 27, updatedAt: Date.now() - 86400000 * 27
  },
  {
    id: '28', name: '舒芙蕾', category: 'desserts',
    tags: ['甜品'],
    recipe: '材料：鸡蛋3个、牛奶100ml、低筋面粉30g、糖40g、黄油20g\n\n做法：\n1. 黄油融化加面粉炒匀\n2. 加牛奶搅成糊\n3. 蛋黄加入搅匀\n4. 蛋白加糖打至硬性发泡\n5. 翻拌入蛋黄糊\n6. 倒入模具，180°C烤15分钟，出炉即食',
    image: '', createdAt: Date.now() - 86400000 * 28, updatedAt: Date.now() - 86400000 * 28
  },
  {
    id: '29', name: '焦糖布丁', category: 'desserts',
    tags: ['甜品'],
    recipe: '材料：鸡蛋3个、牛奶300ml、糖80g、香草精\n\n做法：\n1. 40g糖加少许水熬成焦糖倒入杯底\n2. 鸡蛋加40g糖打散\n3. 牛奶加香草精加热至微沸\n4. 缓缓倒入蛋液中搅拌\n5. 过滤后倒入焦糖杯中\n6. 150°C水浴法烤30分钟，冷藏后食用',
    image: '', createdAt: Date.now() - 86400000 * 29, updatedAt: Date.now() - 86400000 * 29
  },
  {
    id: '30', name: '杨枝甘露', category: 'desserts',
    tags: ['甜品'],
    recipe: '材料：芒果2个、西柚半个、西米50g、椰浆200ml、淡奶油100ml\n\n做法：\n1. 西米煮至透明过凉水\n2. 芒果部分切丁，部分打成泥\n3. 椰浆加淡奶油搅匀\n4. 碗底铺西米\n5. 加芒果泥和椰奶\n6. 顶部放芒果丁和西柚肉',
    image: '', createdAt: Date.now() - 86400000 * 30, updatedAt: Date.now() - 86400000 * 30
  },
  {
    id: '53', name: '蛋挞', category: 'desserts',
    tags: ['甜品'],
    recipe: '材料：蛋挞皮8个、鸡蛋黄3个、淡奶油100ml、牛奶80ml、糖40g\n\n做法：\n1. 蛋黄加糖搅打均匀\n2. 加入牛奶和淡奶油拌匀\n3. 蛋液过筛两次更细腻\n4. 蛋挞皮摆入烤盘\n5. 倒入蛋液8分满\n6. 烤箱200°C预热，烤20分钟至金黄',
    image: '', createdAt: Date.now() - 86400000 * 53, updatedAt: Date.now() - 86400000 * 53
  },
  {
    id: '54', name: '港式菠萝包', category: 'desserts',
    tags: ['甜品'],
    recipe: '材料：高筋面粉200g、奶粉10g、酵母3g、糖30g、鸡蛋1个、黄油\n酥皮：黄油60g、糖粉40g、鸡蛋1个、低筋面粉80g\n\n做法：\n1. 主面团材料揉成团发酵\n2. 酥皮材料搅打至顺滑\n3. 发酵好的面团分成小剂\n4. 包入酥皮，表面划出菱形格\n5. 二发后刷蛋液\n6. 180°C烤20分钟至金黄',
    image: '', createdAt: Date.now() - 86400000 * 54, updatedAt: Date.now() - 86400000 * 54
  },
  {
    id: '55', name: '驴打滚', category: 'desserts',
    tags: ['甜品'],
    recipe: '材料：糯米粉150g、红豆沙、黄豆粉\n\n做法：\n1. 糯米粉加温水揉成面团\n2. 面团擀成薄片上锅蒸15分钟\n3. 蒸熟后趁热揉光滑\n4. 黄豆粉铺底防粘\n5. 面团擀薄，铺上红豆沙\n6. 卷起切段，表面撒黄豆粉',
    image: '', createdAt: Date.now() - 86400000 * 55, updatedAt: Date.now() - 86400000 * 55
  },
  {
    id: '56', name: '蛋烘糕', category: 'desserts',
    tags: ['甜品'],
    recipe: '材料：面粉100g、鸡蛋2个、酵母2g、糖30g、水100ml、红豆沙\n\n做法：\n1. 酵母用温水化开\n2. 面粉、鸡蛋、糖、酵母水调成稀面糊\n3. 发酵1小时至起泡\n4. 小火热锅不刷油\n5. 倒入一勺面糊摊成小圆饼\n6. 烤至起泡后加红豆沙对折',
    image: '', createdAt: Date.now() - 86400000 * 56, updatedAt: Date.now() - 86400000 * 56
  },
  {
    id: '57', name: '芒果班戟', category: 'desserts',
    tags: ['甜品'],
    recipe: '材料：鸡蛋2个、牛奶150ml、低筋面粉60g、糖30g、黄油、淡奶油200ml、芒果\n\n做法：\n1. 鸡蛋加糖打散\n2. 加牛奶、面粉调成稀糊\n3. 加融化黄油拌匀过筛\n4. 小火热锅摊成薄饼\n5. 淡奶油加糖打发\n6. 薄饼包入奶油和芒果丁',
    image: '', createdAt: Date.now() - 86400000 * 57, updatedAt: Date.now() - 86400000 * 57
  },
  {
    id: '58', name: '红豆沙', category: 'desserts',
    tags: ['甜品'],
    recipe: '材料：红豆200g、冰糖80g、陈皮1块\n\n做法：\n1. 红豆浸泡4小时\n2. 加水煮开后小火煮40分钟\n3. 红豆煮软后加陈皮、冰糖\n4. 继续煮至红豆起沙\n5. 捣成细腻的红豆沙\n6. 冷藏后食用',
    image: '', createdAt: Date.now() - 86400000 * 58, updatedAt: Date.now() - 86400000 * 58
  },
  {
    id: '59', name: '银耳莲子羹', category: 'desserts',
    tags: ['应季菜', '甜品'],
    recipe: '材料：银耳1朵、莲子50g、红枣6颗、冰糖\n\n做法：\n1. 银耳泡发撕成小朵\n2. 莲子去芯\n3. 锅中加水、银耳、莲子、红枣\n4. 大火烧开转小火煮1小时\n5. 银耳出胶后加冰糖\n6. 继续煮10分钟即可',
    image: '', createdAt: Date.now() - 86400000 * 59, updatedAt: Date.now() - 86400000 * 59
  },
  {
    id: '60', name: '桃胶炖奶', category: 'desserts',
    tags: ['甜品'],
    recipe: '材料：桃胶15g、牛奶200ml、蛋清1个、冰糖\n\n做法：\n1. 桃胶浸泡12小时至软\n2. 挑去杂质洗净\n3. 桃胶加水炖30分钟至软糯\n4. 加冰糖融化\n5. 牛奶加蛋清打匀\n6. 倒入桃胶中搅匀，炖10分钟',
    image: '', createdAt: Date.now() - 86400000 * 60, updatedAt: Date.now() - 86400000 * 60
  },
  {
    id: '61', name: '龟苓膏', category: 'desserts',
    tags: ['白人饭', '甜品'],
    recipe: '材料：龟苓膏粉30g、清水600ml、蜂蜜或炼乳\n\n做法：\n1. 龟苓膏粉用少量凉水调匀\n2. 剩余水烧开\n3. 缓缓倒入龟苓膏糊搅匀\n4. 继续煮2分钟至浓稠\n5. 倒入容器冷却凝固\n6. 切成小块加蜂蜜食用',
    image: '', createdAt: Date.now() - 86400000 * 61, updatedAt: Date.now() - 86400000 * 61
  },
  {
    id: '62', name: '杏仁豆腐', category: 'desserts',
    tags: ['甜品'],
    recipe: '材料：南杏仁100g、牛奶200ml、琼脂5g、糖30g\n\n做法：\n1. 杏仁提前浸泡4小时\n2. 加牛奶放入豆浆机打成杏仁浆\n3. 杏仁浆过筛去渣\n4. 加琼脂、糖小火煮化\n5. 倒入容器冷却凝固\n6. 切块加冰糖水或水果',
    image: '', createdAt: Date.now() - 86400000 * 62, updatedAt: Date.now() - 86400000 * 62
  },
  {
    id: '63', name: '草莓大福', category: 'desserts',
    tags: ['甜品'],
    recipe: '材料：糯米粉80g、玉米淀粉20g、牛奶120ml、糖30g、草莓6颗、红豆沙\n\n做法：\n1. 糯米粉、淀粉、糖、牛奶调匀\n2. 微波炉加热1分钟至凝固\n3. 取出搅拌再加热1分钟\n4. 戴手套将面团揉光滑\n5. 草莓包入红豆沙\n6. 用糯米皮包住草莓',
    image: '', createdAt: Date.now() - 86400000 * 63, updatedAt: Date.now() - 86400000 * 63
  },
  {
    id: '64', name: '抹茶毛巾卷', category: 'desserts',
    tags: ['白人饭', '甜品'],
    recipe: '材料：鸡蛋2个、牛奶200ml、低筋面粉80g、抹茶粉10g、黄油20g、淡奶油200ml\n\n做法：\n1. 鸡蛋、牛奶、面粉、抹茶粉调成稀糊\n2. 加融化黄油过筛\n3. 小火摊成薄饼\n4. 淡奶油加糖打发\n5. 三张薄饼叠加铺一层奶油\n6. 卷起包成毛巾卷形',
    image: '', createdAt: Date.now() - 86400000 * 64, updatedAt: Date.now() - 86400000 * 64
  },
  {
    id: '65', name: '芝士流心挞', category: 'desserts',
    tags: ['甜品'],
    recipe: '材料：蛋挞皮8个、奶油奶酪150g、淡奶油80ml、鸡蛋1个、糖40g、柠檬汁\n\n做法：\n1. 奶油奶酪室温软化\n2. 加糖打至顺滑\n3. 加鸡蛋、淡奶油、柠檬汁拌匀\n4. 挞皮摆入烤盘\n5. 倒入奶酪糊8分满\n6. 180°C烤20分钟至金黄',
    image: '', createdAt: Date.now() - 86400000 * 65, updatedAt: Date.now() - 86400000 * 65
  },
  {
    id: '66', name: '木瓜雪耳糖水', category: 'desserts',
    tags: ['应季菜', '甜品'],
    recipe: '材料：木瓜1个、雪耳1朵、冰糖、莲子\n\n做法：\n1. 雪耳泡发撕小朵\n2. 木瓜去皮去籽切块\n3. 锅中加水、雪耳、莲子\n4. 大火煮开转小火煮40分钟\n5. 加入木瓜块\n6. 加冰糖煮10分钟即可',
    image: '', createdAt: Date.now() - 86400000 * 66, updatedAt: Date.now() - 86400000 * 66
  },
];

const DATA_VERSION_KEY = 'menu_app_data_version';
const CURRENT_DATA_VERSION = 4;
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

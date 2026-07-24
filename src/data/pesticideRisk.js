/**
 * 蔬果农药残留风险数据库
 *
 * 数据来源：
 *   - EWG 2026 Clean Fifteen / Dirty Dozen
 *   - 中国农业农村部近年蔬菜水果农药残留超标监测数据
 *   - 中国台湾地区蔬果农残检测数据
 *
 * 风险等级说明：
 *   low      = 农残极低，近60%零检出，放心买普通
 *   moderate = 有农残但多数不超标，正常清洗即可
 *   high     = 农残超标率高或检测频率高，建议预算允许时选有机
 *
 * 匹配规则：用食材名称中的关键词进行模糊匹配
 */

const RISK = {
  LOW: 'low',
  MODERATE: 'moderate',
  HIGH: 'high',
};

/**
 * 风险关键词映射：关键词 → 风险等级
 * 按优先级从高到低排列，前面的匹配优先
 */
const KEYWORD_RULES = [
  // ===== 产地/品种降低农残的特殊规则（优先匹配） =====
  // 放在最前面，避免被通用规则拦截
  { keywords: ['新疆苹果', '阿克苏苹果', '陕西洛川苹果', '洛川苹果'], level: RISK.LOW },
  { keywords: ['新疆库尔勒香梨', '库尔勒香梨', '新疆梨'], level: RISK.LOW },
  { keywords: ['新疆葡萄', '吐鲁番葡萄', '新疆吐鲁番葡萄'], level: RISK.LOW },
  { keywords: ['北京平谷大桃', '平谷大桃'], level: RISK.LOW },
  { keywords: ['大连樱桃', '山东烟台樱桃', '烟台樱桃'], level: RISK.LOW },
  { keywords: ['云南菠菜', '甘肃菠菜'], level: RISK.LOW },
  { keywords: ['云南韭菜'], level: RISK.LOW },
  { keywords: ['宁夏芹菜', '云南芹菜'], level: RISK.LOW },
  { keywords: ['宁夏番茄', '宁夏西红柿', '新疆番茄', '新疆西红柿', '普罗旺斯番茄', '普罗旺斯西红柿'], level: RISK.LOW },
  { keywords: ['贵州辣椒', '甘肃辣椒'], level: RISK.LOW },
  { keywords: ['贵州青椒', '甘肃青椒'], level: RISK.LOW },
  { keywords: ['内蒙古土豆', '内蒙古马铃薯', '甘肃定西土豆', '定西土豆'], level: RISK.LOW },
  { keywords: ['河北玉田白菜', '玉田白菜'], level: RISK.LOW },
  { keywords: ['宁夏油菜', '云南油菜'], level: RISK.LOW },
  { keywords: ['云南生菜', '甘肃生菜'], level: RISK.LOW },
  { keywords: ['山东姜', '山东大姜'], level: RISK.LOW },
  { keywords: ['江西赣南橙', '赣南橙'], level: RISK.LOW },
  { keywords: ['江西赣南桔', '赣南桔'], level: RISK.LOW },
  { keywords: ['福建平和柚', '平和琯溪蜜柚', '琯溪蜜柚'], level: RISK.LOW },
  // 新增高农残类
  { keywords: ['云南芸豆', '甘肃芸豆'], level: RISK.LOW },
  { keywords: ['云南豆角', '甘肃豆角'], level: RISK.LOW },
  { keywords: ['云南豇豆', '甘肃豇豆'], level: RISK.LOW },
  { keywords: ['云南四季豆', '甘肃四季豆'], level: RISK.LOW },
  { keywords: ['丹东草莓'], level: RISK.LOW },
  { keywords: ['海南荔枝', '广东茂名荔枝', '茂名荔枝'], level: RISK.LOW },
  { keywords: ['广东高州龙眼', '高州龙眼'], level: RISK.LOW },
  { keywords: ['浙江仙居杨梅', '仙居杨梅'], level: RISK.LOW },
  { keywords: ['陕西大荔冬枣', '大荔冬枣'], level: RISK.LOW },
  // 新增中等农残类
  { keywords: ['云南茼蒿', '甘肃茼蒿'], level: RISK.LOW },
  { keywords: ['云南荠菜'], level: RISK.LOW },
  { keywords: ['云南菜苔', '甘肃菜苔'], level: RISK.LOW },
  { keywords: ['云南蒜苗', '甘肃蒜苗', '云南大蒜苗'], level: RISK.LOW },
  { keywords: ['云南空心菜', '甘肃空心菜'], level: RISK.LOW },
  { keywords: ['云南苋菜', '甘肃苋菜'], level: RISK.LOW },
  { keywords: ['海南陵水圣女果', '陵水圣女果', '云南圣女果'], level: RISK.LOW },
  { keywords: ['山东章丘大葱', '章丘大葱', '甘肃大葱'], level: RISK.LOW },
  { keywords: ['福建云霄枇杷', '云霄枇杷'], level: RISK.LOW },
  { keywords: ['广东郁南黄皮', '郁南黄皮'], level: RISK.LOW },
  { keywords: ['广西武鸣沃柑', '武鸣沃柑', '四川眉山柑', '眉山柑'], level: RISK.LOW },
  // 特殊品种
  { keywords: ['安徽砀山黄桃', '砀山黄桃', '黄桃'], level: RISK.LOW },
  { keywords: ['广东连平鹰嘴桃', '连平鹰嘴桃', '鹰嘴桃'], level: RISK.LOW },

  // ===== 高农残 (HIGH) =====
  // 叶菜类重灾区
  { keywords: ['菠菜'], level: RISK.HIGH },
  { keywords: ['羽衣甘蓝'], level: RISK.HIGH },
  { keywords: ['芹菜'], level: RISK.HIGH },
  { keywords: ['韭菜'], level: RISK.HIGH },
  // 豆类重灾区
  { keywords: ['豇豆'], level: RISK.HIGH },
  { keywords: ['芸豆'], level: RISK.HIGH },
  { keywords: ['豆角'], level: RISK.HIGH },
  { keywords: ['四季豆'], level: RISK.HIGH },
  // 浆果类
  { keywords: ['草莓'], level: RISK.HIGH },
  { keywords: ['蓝莓'], level: RISK.HIGH },
  { keywords: ['黑莓'], level: RISK.HIGH },
  { keywords: ['树莓', '覆盆子'], level: RISK.HIGH },
  // 热带水果重灾区（中国监测超标率31.5%）
  { keywords: ['荔枝'], level: RISK.HIGH },
  { keywords: ['龙眼'], level: RISK.HIGH },
  { keywords: ['百香果'], level: RISK.HIGH },
  { keywords: ['杨梅'], level: RISK.HIGH },
  { keywords: ['榴莲'], level: RISK.HIGH },
  // EWG Dirty Dozen 常客
  { keywords: ['葡萄'], level: RISK.HIGH },
  { keywords: ['油桃'], level: RISK.HIGH },
  { keywords: ['桃子', '桃'], level: RISK.HIGH },
  { keywords: ['樱桃'], level: RISK.HIGH },
  { keywords: ['苹果'], level: RISK.HIGH },
  { keywords: ['梨'], level: RISK.HIGH },
  { keywords: ['枣'], level: RISK.HIGH },

  // ===== 中等农残 (MODERATE) =====
  { keywords: ['土豆', '马铃薯'], level: RISK.MODERATE },
  { keywords: ['辣椒', '青椒', '甜椒'], level: RISK.MODERATE },
  { keywords: ['姜'], level: RISK.MODERATE },
  { keywords: ['葱'], level: RISK.MODERATE },
  { keywords: ['蒜苗', '大蒜苗'], level: RISK.MODERATE },
  { keywords: ['油菜', '小油菜'], level: RISK.MODERATE },
  { keywords: ['白菜'], level: RISK.MODERATE },
  { keywords: ['生菜'], level: RISK.MODERATE },
  { keywords: ['茼蒿'], level: RISK.MODERATE },
  { keywords: ['荠菜'], level: RISK.MODERATE },
  { keywords: ['菜苔'], level: RISK.MODERATE },
  { keywords: ['空心菜'], level: RISK.MODERATE },
  { keywords: ['苋菜'], level: RISK.MODERATE },
  { keywords: ['橙'], level: RISK.MODERATE },
  { keywords: ['柑'], level: RISK.MODERATE },
  { keywords: ['桔', '橘'], level: RISK.MODERATE },
  { keywords: ['柚'], level: RISK.MODERATE },
  { keywords: ['圣女果', '小番茄'], level: RISK.MODERATE },
  { keywords: ['番茄'], level: RISK.MODERATE },
  { keywords: ['枇杷'], level: RISK.MODERATE },
  { keywords: ['黄皮'], level: RISK.MODERATE },

  // ===== 低农残 (LOW) =====
  // Clean Fifteen 成员
  { keywords: ['甜玉米', '玉米'], level: RISK.LOW },
  { keywords: ['洋葱'], level: RISK.LOW },
  { keywords: ['豌豆'], level: RISK.LOW },
  { keywords: ['荷兰豆'], level: RISK.LOW },
  { keywords: ['甜豆'], level: RISK.LOW },
  { keywords: ['芦笋'], level: RISK.LOW },
  { keywords: ['卷心菜', '包菜', '圆白菜'], level: RISK.LOW },
  { keywords: ['花菜', '菜花', '花椰菜'], level: RISK.LOW },
  { keywords: ['西兰花', '西蓝花', '青花菜'], level: RISK.LOW },
  { keywords: ['胡萝卜'], level: RISK.LOW },
  { keywords: ['蘑菇'], level: RISK.LOW },
  { keywords: ['香菇'], level: RISK.LOW },
  { keywords: ['金针菇'], level: RISK.LOW },
  { keywords: ['杏鲍菇'], level: RISK.LOW },
  { keywords: ['红薯', '地瓜'], level: RISK.LOW },
  { keywords: ['紫薯'], level: RISK.LOW },
  { keywords: ['山药'], level: RISK.LOW },
  { keywords: ['芋头'], level: RISK.LOW },
  { keywords: ['茄子'], level: RISK.LOW },
  { keywords: ['南瓜'], level: RISK.LOW },
  { keywords: ['冬瓜'], level: RISK.LOW },
  { keywords: ['丝瓜'], level: RISK.LOW },
  { keywords: ['苦瓜'], level: RISK.LOW },
  { keywords: ['黄瓜'], level: RISK.LOW },
  { keywords: ['萝卜'], level: RISK.LOW },
  { keywords: ['莴笋', '莴苣'], level: RISK.LOW },
  { keywords: ['莲藕', '藕'], level: RISK.LOW },
  { keywords: ['茭白'], level: RISK.LOW },
  { keywords: ['秋葵'], level: RISK.LOW },
  { keywords: ['香椿'], level: RISK.LOW },
  // 厚皮/热带水果低风险
  { keywords: ['菠萝', '凤梨'], level: RISK.LOW },
  { keywords: ['牛油果', '鳄梨'], level: RISK.LOW },
  { keywords: ['木瓜'], level: RISK.LOW },
  { keywords: ['西瓜'], level: RISK.LOW },
  { keywords: ['芒果'], level: RISK.LOW },
  { keywords: ['香蕉'], level: RISK.LOW },
  { keywords: ['猕猴桃', '奇异果'], level: RISK.LOW },
  { keywords: ['哈密瓜', '甜瓜', '蜜瓜'], level: RISK.LOW },
  { keywords: ['石榴'], level: RISK.LOW },
  { keywords: ['甘蔗'], level: RISK.LOW },
  { keywords: ['莲雾'], level: RISK.LOW },
  { keywords: ['青枣'], level: RISK.LOW },
  { keywords: ['李子', '三华李'], level: RISK.LOW },
  { keywords: ['无花果'], level: RISK.LOW },
  { keywords: ['柿子', '月柿'], level: RISK.LOW },
  { keywords: ['山楂'], level: RISK.LOW },
  // 野菜/野生类
  { keywords: ['婆婆丁', '蒲公英'], level: RISK.LOW },
  { keywords: ['马齿苋'], level: RISK.LOW },
  { keywords: ['山苜楂'], level: RISK.LOW },
];

/**
 * 产地/品种推荐：某些食材选择特定产地或品种可显著降低农残风险
 * 格式：{ 食材关键词: [{ origin, note, riskLevel }] }
 */
const ORIGIN_RECOMMENDATIONS = {
  // ==================== 高农残食材 ====================
  '苹果': [
    { origin: '新疆阿克苏', note: '高海拔昼夜温差大、病虫害少，果核附近糖分聚集，品质好农残低', riskLevel: RISK.LOW },
    { origin: '陕西洛川', note: '黄土高原最佳优生区，昼夜温差大、病虫害少，用药少', riskLevel: RISK.LOW },
  ],
  '梨': [
    { origin: '新疆库尔勒', note: '干燥少雨、病虫害少，香梨皮薄肉甜，农残低', riskLevel: RISK.LOW },
  ],
  '葡萄': [
    { origin: '新疆吐鲁番', note: '干燥少雨、日照充足、病虫害少，用药少', riskLevel: RISK.LOW },
  ],
  '桃子': [
    { origin: '北京平谷', note: '地理标志产品，标准化种植，农药可控', riskLevel: RISK.LOW },
  ],
  '樱桃': [
    { origin: '大连', note: '地理标志产品，冷凉气候病虫害少', riskLevel: RISK.LOW },
    { origin: '山东烟台', note: '传统优势产区，种植规范', riskLevel: RISK.LOW },
  ],
  '菠菜': [
    { origin: '云南', note: '高原冷凉气候病虫害少，用药少', riskLevel: RISK.LOW },
    { origin: '甘肃', note: '高原夏菜产区，冷凉气候病虫害少', riskLevel: RISK.LOW },
  ],
  '韭菜': [
    { origin: '云南', note: '高原冷凉气候病虫害少，用药少', riskLevel: RISK.LOW },
    { origin: '甘肃', note: '高原夏菜产区，病虫害少', riskLevel: RISK.LOW },
  ],
  '芹菜': [
    { origin: '宁夏', note: '冷凉蔬菜优势产区，病虫害少', riskLevel: RISK.LOW },
    { origin: '云南', note: '高原冷凉气候病虫害少，用药少', riskLevel: RISK.LOW },
  ],
  '芸豆': [
    { origin: '云南', note: '高原冷凉气候病虫害少，用药少', riskLevel: RISK.LOW },
    { origin: '甘肃', note: '高原夏菜产区，病虫害少', riskLevel: RISK.LOW },
  ],
  '豆角': [
    { origin: '云南', note: '高原冷凉气候病虫害少，用药少', riskLevel: RISK.LOW },
    { origin: '甘肃', note: '高原夏菜产区，病虫害少', riskLevel: RISK.LOW },
  ],
  '豇豆': [
    { origin: '云南', note: '高原冷凉气候病虫害少，用药少', riskLevel: RISK.LOW },
    { origin: '甘肃', note: '高原夏菜产区，病虫害少', riskLevel: RISK.LOW },
  ],
  '四季豆': [
    { origin: '云南', note: '高原冷凉气候病虫害少，用药少', riskLevel: RISK.LOW },
    { origin: '甘肃', note: '高原夏菜产区，病虫害少', riskLevel: RISK.LOW },
  ],
  '草莓': [
    { origin: '丹东', note: '地理标志产品，品质优良', riskLevel: RISK.MODERATE },
  ],
  '荔枝': [
    { origin: '海南', note: '早熟产区，标准化种植', riskLevel: RISK.MODERATE },
    { origin: '广东茂名', note: '传统优势产区，种植规范', riskLevel: RISK.MODERATE },
  ],
  '龙眼': [
    { origin: '广东高州', note: '地理标志产品，标准化种植', riskLevel: RISK.MODERATE },
  ],
  '杨梅': [
    { origin: '浙江仙居', note: '地理标志产品，标准化种植', riskLevel: RISK.MODERATE },
  ],
  '枣': [
    { origin: '陕西大荔', note: '地理标志产品，冬枣标准化种植', riskLevel: RISK.LOW },
  ],

  // ==================== 中等农残食材 ====================
  '番茄': [
    { origin: '普罗旺斯', note: '普罗旺斯番茄多为大棚种植，用药可控，农残低', riskLevel: RISK.LOW },
    { origin: '宁夏', note: '宁夏昼夜温差大、病虫害少，用药少，农残低', riskLevel: RISK.LOW },
    { origin: '新疆', note: '新疆干燥少雨、病虫害少，用药少，农残低', riskLevel: RISK.LOW },
  ],
  '辣椒': [
    { origin: '贵州', note: '高原冷凉气候病虫害少，遵义朝天椒等品种规范种植', riskLevel: RISK.LOW },
    { origin: '甘肃', note: '高原夏菜产区，冷凉气候病虫害少', riskLevel: RISK.LOW },
  ],
  '青椒': [
    { origin: '贵州', note: '高原冷凉气候病虫害少，青椒种植规范', riskLevel: RISK.LOW },
    { origin: '甘肃', note: '高原夏菜产区，冷凉气候病虫害少', riskLevel: RISK.LOW },
  ],
  '甜椒': [
    { origin: '贵州', note: '高原冷凉气候病虫害少，甜椒品质好', riskLevel: RISK.LOW },
    { origin: '甘肃', note: '高原夏菜产区，冷凉气候病虫害少', riskLevel: RISK.LOW },
  ],
  '土豆': [
    { origin: '内蒙古', note: '高海拔冷凉气候病虫害少，用药少', riskLevel: RISK.LOW },
    { origin: '甘肃定西', note: '优质马铃薯产区，高海拔冷凉病虫害少', riskLevel: RISK.LOW },
  ],
  '白菜': [
    { origin: '河北玉田', note: '地理标志产品，包尖白菜品质好', riskLevel: RISK.LOW },
  ],
  '油菜': [
    { origin: '宁夏', note: '冷凉蔬菜产区，病虫害少', riskLevel: RISK.LOW },
    { origin: '云南', note: '高原冷凉气候病虫害少', riskLevel: RISK.LOW },
  ],
  '生菜': [
    { origin: '云南', note: '高原冷凉气候病虫害少', riskLevel: RISK.LOW },
    { origin: '甘肃', note: '高原夏菜产区，病虫害少', riskLevel: RISK.LOW },
  ],
  '茼蒿': [
    { origin: '云南', note: '高原冷凉气候病虫害少', riskLevel: RISK.LOW },
    { origin: '甘肃', note: '高原夏菜产区，病虫害少', riskLevel: RISK.LOW },
  ],
  '荠菜': [
    { origin: '云南', note: '高原冷凉气候病虫害少', riskLevel: RISK.LOW },
  ],
  '菜苔': [
    { origin: '云南', note: '高原冷凉气候病虫害少', riskLevel: RISK.LOW },
    { origin: '甘肃', note: '高原夏菜产区，病虫害少', riskLevel: RISK.LOW },
  ],
  '蒜苗': [
    { origin: '云南', note: '高原冷凉气候病虫害少', riskLevel: RISK.LOW },
    { origin: '甘肃', note: '高原夏菜产区，病虫害少', riskLevel: RISK.LOW },
  ],
  '空心菜': [
    { origin: '云南', note: '高原冷凉气候病虫害少', riskLevel: RISK.LOW },
    { origin: '甘肃', note: '高原夏菜产区，病虫害少', riskLevel: RISK.LOW },
  ],
  '苋菜': [
    { origin: '云南', note: '高原冷凉气候病虫害少', riskLevel: RISK.LOW },
    { origin: '甘肃', note: '高原夏菜产区，病虫害少', riskLevel: RISK.LOW },
  ],
  '圣女果': [
    { origin: '海南陵水', note: '热带气候产区，标准化种植', riskLevel: RISK.LOW },
    { origin: '云南', note: '高原冷凉气候病虫害少', riskLevel: RISK.LOW },
  ],
  '葱': [
    { origin: '山东章丘', note: '地理标志产品，大葱标准化种植', riskLevel: RISK.LOW },
    { origin: '甘肃', note: '高原夏菜产区，病虫害少', riskLevel: RISK.LOW },
  ],
  '姜': [
    { origin: '山东', note: '大姜主产区，种植规范', riskLevel: RISK.LOW },
  ],
  '枇杷': [
    { origin: '福建云霄', note: '地理标志产品，标准化种植', riskLevel: RISK.LOW },
  ],
  '黄皮': [
    { origin: '广东郁南', note: '地理标志产品，标准化种植', riskLevel: RISK.LOW },
  ],
  '橙': [
    { origin: '江西赣南', note: '地理标志产品，标准化种植，农药可控', riskLevel: RISK.LOW },
  ],
  '柑': [
    { origin: '广西武鸣', note: '沃柑地理标志产品，标准化种植', riskLevel: RISK.LOW },
    { origin: '四川眉山', note: '爱媛/春见等品种优质产区', riskLevel: RISK.LOW },
  ],
  '桔': [
    { origin: '江西赣南', note: '地理标志产品，标准化种植，农药可控', riskLevel: RISK.LOW },
  ],
  '柚': [
    { origin: '福建平和', note: '琯溪蜜柚地理标志产品，标准化种植', riskLevel: RISK.LOW },
  ],
  '黄瓜': [
    { origin: '山东沂南', note: '中国黄瓜之乡，地理标志产品，冲积平原沙土地标准化种植', riskLevel: RISK.LOW },
    { origin: '青海大通', note: '高原冷凉气候病虫害少，新庄黄瓜地理标志产品', riskLevel: RISK.LOW },
    { origin: '甘肃合水', note: '板桥白黄瓜地理标志产品，传统优良品种皮薄质脆', riskLevel: RISK.LOW },
  ],

  // ==================== 特殊品种/产地精准匹配 ====================
  '黄桃': [
    { origin: '安徽砀山', note: '砀山黄桃地理标志产品，标准化种植', riskLevel: RISK.LOW },
  ],
  '鹰嘴桃': [
    { origin: '广东连平', note: '地理标志产品，标准化种植', riskLevel: RISK.LOW },
  ],
  '蓝莓': [
    { origin: '建议选有机', note: '蓝莓浆果病虫害多，常规种植农残高，优选有机产品', riskLevel: RISK.MODERATE },
  ],
};

/**
 * 判断单个食材/水果名称的农药残留风险等级
 * @param {string} name - 食材名称（如"红颜草莓"、"妃子笑荔枝"）
 * @returns {('low'|'moderate'|'high'|null)} 风险等级，null 表示未匹配
 */
export function getPesticideRisk(name) {
  if (!name) return null;
  const lower = name.toLowerCase();

  for (const rule of KEYWORD_RULES) {
    for (const keyword of rule.keywords) {
      if (lower.includes(keyword.toLowerCase())) {
        return rule.level;
      }
    }
  }

  return null; // 未知食材
}

/**
 * 判断食材农残风险并返回匹配的关键词（规范名称）
 * @param {string} name - 食材名称
 * @returns {{ level: 'low'|'moderate'|'high', matchedWord: string } | null}
 */
export function getPesticideRiskDetail(name) {
  if (!name) return null;
  const lower = name.toLowerCase();

  for (const rule of KEYWORD_RULES) {
    for (const keyword of rule.keywords) {
      if (lower.includes(keyword.toLowerCase())) {
        // 返回规范名称（关键词组第一个）和风险等级
        return { level: rule.level, matchedWord: rule.keywords[0] };
      }
    }
  }

  return null;
}

/**
 * 获取某食材的产地/品种推荐（选择哪些产地可降低农残）
 * @param {string} name - 食材名称
 * @returns {Array<{origin:string, note:string, riskLevel:string}> | null}
 */
export function getOriginRecommendations(name) {
  if (!name) return null;
  const lower = name.toLowerCase();

  for (const [foodKey, recommendations] of Object.entries(ORIGIN_RECOMMENDATIONS)) {
    if (lower.includes(foodKey.toLowerCase())) {
      return recommendations;
    }
  }

  return null;
}

/**
 * 搜索食材名，返回所有匹配的农残风险信息（正向+反向同时匹配）
 * 用于搜索框场景：输入"葡萄"同时匹配"葡萄"(高)和"新疆葡萄"(低)
 *
 * @param {string} name - 搜索词
 * @returns {Array<{ level: string, matchedWord: string }>}
 */
export function searchPesticideRisks(name) {
  if (!name) return [];
  const lower = name.trim().toLowerCase();
  const results = [];
  const seen = new Set();

  for (const rule of KEYWORD_RULES) {
    let matched = false;
    for (const keyword of rule.keywords) {
      const kw = keyword.toLowerCase();
      // 正向：搜索词包含关键词（原逻辑） OR 关键词包含搜索词（反向匹配）
      if (lower.includes(kw) || kw.includes(lower)) {
        matched = true;
        break;
      }
    }
    if (matched) {
      const matchedWord = rule.keywords[0];
      if (!seen.has(matchedWord)) {
        seen.add(matchedWord);
        results.push({ level: rule.level, matchedWord });
      }
    }
  }

  // 按风险等级排序：高 → 中 → 低，同级保持原有顺序
  const order = { high: 0, moderate: 1, low: 2 };
  results.sort(function(a, b) { return (order[a.level] || 9) - (order[b.level] || 9); });

  return results;
}

/**
 * 风险等级对应的显示文本
 */
export const RISK_LABELS = {
  low: { text: '低', label: '低农残', desc: '农残极低，放心买普通' },
  moderate: { text: '中', label: '中等', desc: '有农残，正常清洗即可' },
  high: { text: '高', label: '高农残', desc: '建议预算允许时选有机' },
};

/**
 * 风险等级对应的颜色（CSS 变量名或色值）
 */
export const RISK_COLORS = {
  low: { bg: '#E8F5E9', border: '#A5D6A7', text: '#2E7D32' },
  moderate: { bg: '#FFF8E1', border: '#FFD54F', text: '#F57F17' },
  high: { bg: '#FFEBEE', border: '#EF9A9A', text: '#C62828' },
};

/**
 * 从一个食材原始文本中提取核心名称
 * 去掉前导的 “1个/200g/2根/少许/适量” 等数量词
 * 例如 "五花肉500g" -> "五花肉"，"番茄2个" -> "番茄"
 */
function cleanIngredientName(raw) {
  if (!raw) return '';
  let name = String(raw).trim();
  // 去掉特殊前缀词
  name = name.replace(/^(少许|适量|若干|一点点|几个)/, '');
  // 从第一个数字处截断（处理 "五花肉500g" / "番茄2个" / "苹果2个"）
  const m = name.match(/^([^\d]+)/);
  if (m && m[1].trim()) name = m[1].trim();
  // 去掉括号说明
  name = name.replace(/[（(][^）)]*[）)]/g, '');
  return name.trim();
}

/**
 * 解析做法的"材料"段，提取每个食材及农残风险
 * @param {string} recipe - 做法原文
 * @returns {Array<{raw:string, name:string, risk:('low'|'moderate'|'high'|null)}>}
 */
export function parseRecipeIngredients(recipe) {
  if (!recipe) return [];
  const match = recipe.match(/材料[：:]\s*([\s\S]*?)(?:\n\s*\n|\n做法|$)/);
  if (!match) return [];
  const line = match[1].replace(/\n/g, '').trim();
  // 顿号或中英文逗号分隔
  const parts = line.split(/[、，,]/).map(s => s.trim()).filter(Boolean);
  return parts.map(raw => {
    const name = cleanIngredientName(raw);
    return {
      raw,
      name,
      risk: name ? getPesticideRisk(name) : null,
    };
  });
}

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
  { keywords: ['油菜', '小油菜', '白菜'], level: RISK.MODERATE },
  { keywords: ['生菜'], level: RISK.MODERATE },
  { keywords: ['茼蒿'], level: RISK.MODERATE },
  { keywords: ['荠菜'], level: RISK.MODERATE },
  { keywords: ['菜苔'], level: RISK.MODERATE },
  { keywords: ['空心菜'], level: RISK.MODERATE },
  { keywords: ['苋菜'], level: RISK.MODERATE },
  { keywords: ['橙', '柑', '桔', '橘', '柚'], level: RISK.MODERATE },
  { keywords: ['圣女果', '小番茄'], level: RISK.MODERATE },
  { keywords: ['番茄'], level: RISK.MODERATE },
  { keywords: ['枇杷'], level: RISK.MODERATE },
  { keywords: ['黄皮'], level: RISK.MODERATE },

  // ===== 低农残 (LOW) =====
  // Clean Fifteen 成员
  { keywords: ['甜玉米', '玉米'], level: RISK.LOW },
  { keywords: ['洋葱'], level: RISK.LOW },
  { keywords: ['豌豆', '荷兰豆', '甜豆'], level: RISK.LOW },
  { keywords: ['芦笋'], level: RISK.LOW },
  { keywords: ['卷心菜', '包菜', '圆白菜'], level: RISK.LOW },
  { keywords: ['花菜', '菜花', '花椰菜'], level: RISK.LOW },
  { keywords: ['西兰花', '西蓝花', '青花菜'], level: RISK.LOW },
  { keywords: ['胡萝卜'], level: RISK.LOW },
  { keywords: ['蘑菇', '香菇', '金针菇', '杏鲍菇'], level: RISK.LOW },
  { keywords: ['红薯', '地瓜', '紫薯'], level: RISK.LOW },
  { keywords: ['山药'], level: RISK.LOW },
  { keywords: ['芋头'], level: RISK.LOW },
  { keywords: ['茄子'], level: RISK.LOW },
  { keywords: ['南瓜', '冬瓜', '丝瓜', '苦瓜', '黄瓜'], level: RISK.LOW },
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

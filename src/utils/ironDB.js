// 每周铁摄入量日志存储
// localStorage 结构（version=1）：
//   [
//     { date: '2026-07-13', totalIronMg: 12.5, items: [{ id: 'pork_liver', name: '猪肝', grams: 100, ironMg: 22.6 }] },
//     ...
//   ]
// 数据条目保留最近 90 天，最多 90 条

import { findFood } from './foodDatabase';
import { getIronMgPer100g } from './foodDatabase';

const IRON_LOG_KEY = 'menu_app_iron_logs';
const MAX_LOGS = 90;

function todayKey(d = new Date()) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function readLogs() {
  try {
    const raw = localStorage.getItem(IRON_LOG_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeLogs(logs) {
  try {
    localStorage.setItem(IRON_LOG_KEY, JSON.stringify(logs));
  } catch {
    // localStorage 满或被禁用：静默忽略
  }
}

/**
 * 获取所有铁摄入日志（按日期倒序）
 */
export function getIronLogs() {
  const raw = readLogs();
  return Array.isArray(raw) ? raw.sort((a, b) => b.date.localeCompare(a.date)) : [];
}

/**
 * 记录今日铁摄入（从已吃食物列表计算）
 * @param {Array<{id:string, qty?:number, grams?:number}>} foodList
 * @returns {{ date: string, totalIronMg: number, items: Array }}
 */
export function logTodayIron(foodList) {
  const logs = readLogs();
  const today = todayKey();
  const items = [];
  let total = 0;

  for (const item of foodList) {
    const f = findFood(item.id);
    if (!f) continue;
    const per100 = getIronMgPer100g(item.id);
    if (per100 <= 0) continue;
    const grams = Number(item.grams);
    let ironMg;
    if (Number.isFinite(grams) && grams > 0) {
      ironMg = per100 * grams / 100;
    } else {
      ironMg = per100 * (Number(item.qty) || 0);
    }
    ironMg = Math.round(ironMg * 10) / 10;
    if (ironMg <= 0) continue;
    const recordGrams = Number.isFinite(grams) && grams > 0 ? Math.round(grams) : 0;
    items.push({ id: item.id, name: f.name, grams: recordGrams, ironMg });
    total += ironMg;
  }

  total = Math.round(total * 10) / 10;

  // 替换或追加今日记录
  const idx = logs.findIndex((l) => l.date === today);
  const entry = { date: today, totalIronMg: total, items };
  if (idx >= 0) {
    logs[idx] = entry;
  } else {
    logs.push(entry);
  }

  // 裁剪：只保留最近 90 天
  const trimmed = logs.sort((a, b) => b.date.localeCompare(a.date)).slice(0, MAX_LOGS);
  writeLogs(trimmed);
  return entry;
}

/**
 * 获取本周每日铁摄入统计
 * @returns {{ weekDays: Array, weeklyTotal: number, weeklyItems: Record<string, any> }}
 */
export function getWeekIron() {
  const logs = readLogs();
  const now = new Date();
  const dayOfWeek = now.getDay();
  // 周一作为周起始
  const monday = new Date(now);
  monday.setDate(now.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
  monday.setHours(0, 0, 0, 0);

  const weekDays = [];
  let weeklyTotal = 0;
  const weeklyItems = {};

  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    const key = todayKey(d);
    const log = logs.find((l) => l.date === key);
    const iron = log ? log.totalIronMg : 0;
    weekDays.push({ date: key, iron, items: log ? log.items : [] });
    weeklyTotal += iron;
    if (log && Array.isArray(log.items)) {
      for (const item of log.items) {
        if (!weeklyItems[item.id]) {
          weeklyItems[item.id] = { id: item.id, name: item.name, totalIronMg: 0, count: 0 };
        }
        weeklyItems[item.id].totalIronMg += item.ironMg;
        weeklyItems[item.id].count++;
      }
    }
  }

  return {
    weekDays,
    weeklyTotal: Math.round(weeklyTotal * 10) / 10,
    weeklyItems: Object.values(weeklyItems).sort((a, b) => b.totalIronMg - a.totalIronMg),
  };
}

/** 每周推荐铁摄入量（mg）：
 *  女性 20mg/天 × 7 = 140mg（生理期损失）
 *  男性  8mg/天 × 7 =  56mg（训练者基数）
 *  训练男性额外补 → 按 12mg/天（含训练红细胞代谢）× 7 = 84mg
 */
export function getWeeklyIronTarget(gender) {
  return gender === 'male' ? 84 : 140;
}

// ========================================================
// 每周限吃食物提醒（猪肝等高维A/高铁食物）
// ========================================================

/** 每周限吃食物清单 */
export const WEEKLY_LIMIT_MAP = {
  pork_liver:  { max: 1, reason: '🐷 猪肝 · 维A过量伤肝，一周最多 1 次' },
  duck_blood:  { max: 2, reason: '🦆 鸭血 · 铁含量极高，一周最多 2 次' },
  pig_blood:   { max: 3, reason: '🐷 猪血 · 高铁食物，一周最多 3 次' },
};

/**
 * 获取本周已吃过的限吃食物状态
 * @param {string} gender
 * @returns {Array<{id:string, name:string, count:number, max:number, remaining:number, reason:string, done:boolean}>}
 */
export function getWeeklyLimitStatus() {
  const weekData = getWeekIron(); // 复用 getWeekIron 获取本周数据
  const result = [];

  for (const [id, limit] of Object.entries(WEEKLY_LIMIT_MAP)) {
    // 从 weekData.weekDays 中统计该食物本周出现次数
    let count = 0;
    let lastDate = null;
    for (const day of weekData.weekDays) {
      if (!day.items) continue;
      const found = day.items.find((it) => it.id === id);
      if (found) {
        count++;
        lastDate = day.date;
      }
    }
    const remaining = Math.max(0, limit.max - count);
    result.push({
      id,
      name: limit.reason.split('·')[0].trim(), // 取 emoji+名称
      displayName: limit.reason,
      count,
      max: limit.max,
      remaining,
      done: count >= limit.max,
      lastDate,
    });
  }

  return result;
}

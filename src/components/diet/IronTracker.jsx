// 每周铁摄入量追踪面板
// 男女通用，自动根据 gender 切换 RDA 目标
// 展示：周总量 + 每日柱状图 + 本周铁来源排行

import { useEffect, useState } from 'react';
import { getWeekIron, getWeeklyIronTarget } from '../../utils/ironDB';

const WEEKDAY_LABELS = ['一', '二', '三', '四', '五', '六', '日'];

export default function IronTracker({ refreshTrigger, gender }) {
  const WEEKLY_IRON_TARGET = getWeeklyIronTarget(gender);
  const [data, setData] = useState(() => getWeekIron());

  useEffect(() => {
    setData(getWeekIron());
  }, [refreshTrigger]);

  // 监听 storage 事件（多标签同步）
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'menu_app_iron_logs') {
        setData(getWeekIron());
      }
    };
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, []);

  const { weekDays, weeklyTotal, weeklyItems } = data;
  const pct = Math.min(100, Math.round((weeklyTotal / WEEKLY_IRON_TARGET) * 100));
  const maxDay = Math.max(...weekDays.map((d) => d.iron), 1);
  const progressColor = pct >= 100 ? 'var(--dt-iron-ok)' : pct >= 50 ? 'var(--dt-iron-mid)' : 'var(--dt-iron-low)';

  // 本周日名（今天标为"今"）
  const todayStr = new Date().toISOString().slice(0, 10);

  return (
    <div className="dt-iron-tracker">
      <div className="dt-iron-header">
        <span className="dt-iron-title">🩸 本周铁摄入</span>
        <a
          className="dt-iron-learn"
          href="https://baike.baidu.com/item/%E9%93%81/8728492"
          target="_blank"
          rel="noopener noreferrer"
          title="了解补铁知识"
        >
          📖
        </a>
      </div>

      {/* 周总量 */}
      <div className="dt-iron-total-row">
        <div className="dt-iron-total-value">
          <span className="dt-iron-number">{weeklyTotal}</span>
          <span className="dt-iron-unit">mg</span>
          <span className="dt-iron-sep">/</span>
          <span className="dt-iron-target">{WEEKLY_IRON_TARGET} mg</span>
        </div>
        <div className="dt-iron-pct" style={{ color: progressColor }}>
          {pct}%
        </div>
      </div>
      <div className="dt-iron-bar-bg">
        <div
          className="dt-iron-bar-fill"
          style={{ width: `${Math.min(pct, 100)}%`, background: progressColor }}
        />
      </div>

      {/* 每日柱状图 */}
      <div className="dt-iron-days">
        {weekDays.map((d, i) => {
          const dayPct = maxDay > 0 ? (d.iron / maxDay) * 100 : 0;
          const isToday = d.date === todayStr;
          return (
            <div key={d.date} className={`dt-iron-day${isToday ? ' is-today' : ''}`}>
              <div className="dt-iron-day-label">
                {isToday ? '今' : WEEKDAY_LABELS[i]}
              </div>
              <div className="dt-iron-day-bar-wrap">
                <div
                  className="dt-iron-day-bar"
                  style={{ height: `${Math.max(dayPct, 2)}%` }}
                />
              </div>
              <div className="dt-iron-day-value">{d.iron > 0 ? d.iron.toFixed(1) : ''}</div>
            </div>
          );
        })}
      </div>

      {/* 本周铁来源排行 */}
      {weeklyItems.length > 0 && (
        <div className="dt-iron-top">
          <div className="dt-iron-top-title">本周补铁明星</div>
          <div className="dt-iron-top-list">
            {weeklyItems.slice(0, 4).map((item, i) => (
              <div key={item.id} className="dt-iron-top-item">
                <span className="dt-iron-top-rank">
                  {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}.`}
                </span>
                <span className="dt-iron-top-name">{item.name}</span>
                <span className="dt-iron-top-mg">
                  {item.totalIronMg.toFixed(1)}mg
                </span>
                <span className="dt-iron-top-count">×{item.count}次</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 补铁小贴士 · 男女专属 */}
      <div className="dt-iron-tip">
        {gender === 'male'
          ? <>💡 <b>男人铁需求低：</b>猪肝 100g 够一周 · 男性补铁过量伤肝
            <br />♂ 每周 84mg ≈ 每周 1 块猪肝 + 2 个鸡蛋就够了</>
          : <>💡 <b>补铁食物：</b>猪肝（22.6mg/100g）· 鸭血（30.5mg）· 菠菜（2.9mg）
            <br />♀ 搭配维 C（橙子/番茄）促进铁吸收 ☀️</>}
      </div>
    </div>
  );
}

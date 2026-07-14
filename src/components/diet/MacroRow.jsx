// 单条宏量营养素进度条（碳水 / 蛋白 / 脂肪 复用）
// 蛋白行专属：体重 g/kg 状态 + 参考区段下界/推荐/上界三条标线
// 从 DietTracker.jsx 拆出，依赖 utils/foodDatabase

import { useMemo } from 'react';
import { calcGrams, describeMacro, describeMacroMeal } from '../../utils/foodDatabase';

export default function MacroRow({ icon, label, name, valueList, targetList, color, profilePreset, weight }) {
  const value  = useMemo(() => Math.round(calcGrams(valueList,  name)), [valueList,  name]);
  const target = useMemo(() => Math.round(calcGrams(targetList, name)), [targetList, name]);
  const pct = target > 0 ? Math.max(0, Math.min(100, Math.round((value / target) * 100))) : 0;
  const remaining = Math.max(0, target - value);
  const over = value > target;
  const desc = describeMacro(remaining, name, true);
  const meal = describeMacroMeal(remaining, name, true);
  // 蛋白行专属：根据体重 + 档位推荐量 算出参考区段
  const isProtein = name === 'protein';
  const proteinPerKg = (weight && profilePreset) ? Math.round(value / weight * 100) / 100 : null;
  const proteinMin = weight && profilePreset ? Math.round(profilePreset.minPerKg * weight) : null;
  const proteinRec = weight && profilePreset ? Math.round(profilePreset.proteinPerKg * weight) : null;
  const proteinMax = weight && profilePreset ? Math.round(profilePreset.proteinMaxPerKg * weight) : null;
  let proteinState = null;
  if (isProtein && weight && profilePreset) {
    if (proteinPerKg < profilePreset.minPerKg) proteinState = { tier: 'low',  text: '🔵 低于保肌线',       color: '#3498DB' };
    else if (proteinPerKg < profilePreset.proteinPerKg) proteinState = { tier: 'mid', text: '🟡 未达推荐区',     color: '#F39C12' };
    else if (proteinPerKg <= profilePreset.proteinMaxPerKg) proteinState = { tier: 'ok', text: '🟢 推荐区',        color: '#27AE60' };
    else proteinState = { tier: 'over', text: '🔴 超安全线（注意减量）', color: '#E74C3C' };
  }
  return (
    <div className={`dt-macro-row ${over ? 'is-over' : ''}`}>
      <div className="dt-macro-head">
        <span className="dt-macro-icon" style={{ background: color + '33', color }}>{icon}</span>
        <span className="dt-macro-label">{label}</span>
        <span className="dt-macro-numbers">
          <b>{value}</b>
          <span className="dt-macro-sep">/</span>
          <span className="dt-macro-target">{target}</span>
          <span className="dt-macro-unit">g</span>
        </span>
      </div>
      <div className="dt-progress">
        <div
          className="dt-progress-fill"
          style={{ width: `${pct}%`, background: over ? 'var(--color-danger)' : color }}
        />
        {isProtein && proteinMin != null && (
          <div
            className="dt-progress-marker dt-progress-marker-min"
            style={{ left: `${Math.min(100, (proteinMin / Math.max(target, proteinMax || 1)) * 100)}%` }}
            title={`保肌下限 ${proteinMin}g (${profilePreset.minPerKg} g/kg)`}
          />
        )}
        {isProtein && proteinRec != null && (
          <div
            className="dt-progress-marker dt-progress-marker-rec"
            style={{ left: `${Math.min(100, (proteinRec / Math.max(target, proteinMax || 1)) * 100)}%` }}
            title={`推荐量 ${proteinRec}g (${profilePreset.proteinPerKg} g/kg)`}
          />
        )}
        {isProtein && proteinMax != null && (
          <div
            className="dt-progress-marker dt-progress-marker-max"
            style={{ left: `${Math.min(100, (proteinMax / Math.max(target, proteinMax || 1)) * 100)}%` }}
            title={`安全上限 ${proteinMax}g (${profilePreset.proteinMaxPerKg} g/kg)`}
          />
        )}
      </div>
      <div className="dt-macro-foot">
        {over ? (
          <span className="dt-macro-over">已超标 {value - target}g</span>
        ) : (
          <span className="dt-macro-remaining">
            还差 <b>{remaining}g</b>
            {meal.main && (
              <em className="dt-macro-meal">
                🍽️ <b className="dt-meal-qty">{meal.main.colloquial}</b>
                <span className="dt-meal-plus">+</span>
                <b className="dt-meal-qty">{meal.side.colloquial}</b>
                <span className="dt-meal-plus">+</span>
                <b className="dt-meal-qty">{meal.extra.colloquial}</b>
                <span className="dt-meal-hint">（一日餐食参考）</span>
              </em>
            )}
            {desc.primary && (
              <em className="dt-macro-desc">
                <span className="dt-desc-divider">·</span>
                ≈ <b className="dt-desc-qty">{desc.primary.colloquial}</b>
                {desc.primary.precise && <span className="dt-desc-precise">（{desc.primary.precise}）</span>}
                {desc.alternative && desc.alternative.colloquial !== desc.primary.colloquial && (
                  <>
                    <span className="dt-desc-or">或</span>
                    <b className="dt-desc-qty dt-desc-qty-alt">{desc.alternative.colloquial}</b>
                    {desc.alternative.precise && <span className="dt-desc-precise">（{desc.alternative.precise}）</span>}
                  </>
                )}
                {desc.extras && desc.extras.length > 0 && desc.extras.map((ex, i) => (
                  <span key={i}>
                    <span className="dt-desc-or">或</span>
                    <b className="dt-desc-qty dt-desc-qty-extra">{ex.colloquial}</b>
                    {ex.precise && <span className="dt-desc-precise">（{ex.precise}）</span>}
                  </span>
                ))}
              </em>
            )}
          </span>
        )}
        <span className="dt-macro-pct">{pct}%</span>
      </div>
      {isProtein && proteinPerKg != null && (
        <div className="dt-protein-meta" style={{ color: proteinState.color }}>
          <span className="dt-protein-tag">
            {profilePreset.label}
          </span>
          <span className="dt-protein-perkg">
            {proteinPerKg.toFixed(2)} g/kg
          </span>
          <span className="dt-protein-state">{proteinState.text}</span>
          <span className="dt-protein-range">
            参考 {profilePreset.minPerKg}–{profilePreset.proteinMaxPerKg} g/kg（{profilePreset.refSource}）
          </span>
        </div>
      )}
    </div>
  );
}

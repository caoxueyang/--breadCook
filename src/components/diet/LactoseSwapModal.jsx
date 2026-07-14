// 乳制品替换 Modal（5 选 1 + 等热量换算）
// 用法：
//   <LactoseSwapModal
//     open={open}
//     currentFood={food}      // 当前食物（含 id/name/carbs/protein/fat/weightG）
//     currentGrams={250}      // 当前克数
//     onClose={() => setOpen(false)}
//     onConfirm={(result) => {  // { newId, newGrams, ... }
//       updateItem(idx, { id: result.newId, grams: result.newGrams });
//     }}
//   />
import { useEffect, useMemo } from 'react';
import {
  getLactoseAlternatives,
  calcAltMacros,
  swapLactose,
} from '../../utils/lactoseAlternatives';
import './LactoseSwapModal.css';

export default function LactoseSwapModal({
  open,
  currentFood,
  currentGrams,
  onClose,
  onConfirm,
}) {
  // ESC 关闭
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  // 5 选 1（自动排除当前）
  const alternatives = useMemo(() => {
    if (!open) return [];
    return getLactoseAlternatives(currentFood);
  }, [open, currentFood]);

  // 当前食物的宏量素
  const currentMacros = useMemo(() => {
    if (!currentFood) return null;
    const g = Number(currentGrams) || 0;
    const cf = Number(currentFood.carbs) || 0;
    const pf = Number(currentFood.protein) || 0;
    const ff = Number(currentFood.fat) || 0;
    return {
      carbs: Number((cf * g / 100).toFixed(1)),
      protein: Number((pf * g / 100).toFixed(1)),
      fat: Number((ff * g / 100).toFixed(1)),
      kcal: Math.round((cf * 4 + pf * 4 + ff * 9) * g / 100),
    };
  }, [currentFood, currentGrams]);

  if (!open || !currentFood) return null;

  const handlePick = (alt) => {
    const result = swapLactose(currentFood, currentGrams, alt);
    if (onConfirm) onConfirm(result);
  };

  return (
    <div
      className="modal-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="乳制品替换"
    >
      <div className="modal-box lsm-modal" onClick={(e) => e.stopPropagation()}>
        {/* 头部 */}
        <div className="lsm-header">
          <div className="lsm-header-left">
            <span className="lsm-header-icon">🥛</span>
            <div>
              <div className="modal-title" style={{ textAlign: 'left', marginBottom: 0 }}>
                换一种乳制品
              </div>
              <div className="lsm-header-sub">等热量换算 · 总卡路里保持不变</div>
            </div>
          </div>
          <button
            type="button"
            className="dt-close-btn"
            onClick={onClose}
            aria-label="关闭"
          >
            ✕
          </button>
        </div>

        {/* 当前食物卡 */}
        <div className="lsm-current">
          <div className="lsm-current-label">当前</div>
          <div className="lsm-current-card">
            <span className="lsm-current-icon">{currentFood.categoryIcon || '🥛'}</span>
            <div className="lsm-current-body">
              <div className="lsm-current-name">{currentFood.name}</div>
              <div className="lsm-current-meta">
                {currentGrams}g · 🔥 {currentMacros.kcal} kcal
              </div>
              <div className="lsm-current-macros">
                {currentMacros.carbs > 0 && <span>🍚 {currentMacros.carbs}g</span>}
                {currentMacros.protein > 0 && <span>🥩 {currentMacros.protein}g</span>}
                {currentMacros.fat > 0 && <span>🥑 {currentMacros.fat}g</span>}
              </div>
            </div>
          </div>
        </div>

        {/* 5 选 1 列表 */}
        <div className="lsm-list">
          {alternatives.map((alt) => {
            const swap = swapLactose(currentFood, currentGrams, alt);
            return (
              <button
                key={alt.id}
                type="button"
                className="lsm-card"
                onClick={() => handlePick(alt)}
              >
                <div className="lsm-card-head">
                  <span className="lsm-card-icon">{alt.icon}</span>
                  <div className="lsm-card-title-row">
                    <span className="lsm-card-name">{alt.name}</span>
                    <span className="lsm-card-tag">{alt.tag}</span>
                  </div>
                  <div className="lsm-card-grams">→ {swap.newGrams}g</div>
                </div>
                <div className="lsm-card-macros">
                  {swap.newC > 0 && <span>🍚 {swap.newC}g</span>}
                  <span className="lsm-card-protein">🥩 {swap.newP}g</span>
                  {swap.newF > 0 && <span>🥑 {swap.newF}g</span>}
                  <span className="lsm-card-kcal">🔥 {swap.newKcal} kcal</span>
                </div>
                <div className="lsm-card-pros">{alt.pros}</div>
                <div className="lsm-card-deltas">
                  {swap.deltaP !== 0 && (
                    <span className={swap.deltaP > 0 ? 'lsm-delta-up' : 'lsm-delta-down'}>
                      蛋白 {swap.deltaP > 0 ? '+' : ''}{swap.deltaP}g
                    </span>
                  )}
                  {swap.deltaF !== 0 && (
                    <span className={swap.deltaF > 0 ? 'lsm-delta-up' : 'lsm-delta-down'}>
                      脂肪 {swap.deltaF > 0 ? '+' : ''}{swap.deltaF}g
                    </span>
                  )}
                  {swap.deltaC !== 0 && (
                    <span className={swap.deltaC > 0 ? 'lsm-delta-up' : 'lsm-delta-down'}>
                      碳水 {swap.deltaC > 0 ? '+' : ''}{swap.deltaC}g
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        <div className="lsm-hint">
          💡 所有选项保持「总热量不变」，只调整宏量素结构。点选后自动替换当前条目。
        </div>
      </div>
    </div>
  );
}

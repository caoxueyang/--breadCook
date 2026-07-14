// 用户档位切换器（训练者 / 普通居民）+ 体重/体脂/活动量微调
// 从 DietTracker.jsx 拆出，保持 props 一致便于主组件调用

import { useState } from 'react';

// 性别默认模板
//   male：   偏口鱼·80kg 训练者模板
//   female： 偏口鱼夫人·60kg 普通居民模板
export const GENDER_PRESETS = {
  male: {
    gender: 'male', age: 33, height: 180, weight: 80, bodyFat: 22, activity: 4, role: 'trainer',
  },
  female: {
    gender: 'female', age: 30, height: 170, weight: 60, bodyFat: 25, activity: 3, role: 'resident',
  },
};

// 档位定义：训练者 vs 普通居民
//   trainer：ISSN/Helms 国际标准（力量训练者，减脂保肌）
//   resident：中国 RNI/2024 减重指南（普通居民/减重者）
export const PROFILE_PRESETS = {
  trainer: {
    label: '💪 训练者',
    desc: 'ISSN / Helms 国际标准（减脂保肌）',
    proteinPerKg: 2.3,
    proteinMaxPerKg: 3.1,
    minPerKg: 1.6,
    speedMax: 1.0,
    fatPctMax: 35,
    carbPctMin: 35,
    refSource: 'ISSN 2017 + Helms 2014',
  },
  resident: {
    label: '🧘 普通居民',
    desc: '中国 RNI 2023 + 2024 减重指南',
    proteinPerKg: 1.0,
    proteinMaxPerKg: 1.5,
    minPerKg: 0.83,
    speedMax: 1.0,
    fatPctMax: 30,
    carbPctMin: 50,
    refSource: '中国卫健委 2023/2024',
  },
};

/**
 * 根据体重/体脂/活动推断推荐档位
 * 规则：BMI≥24 OR 体脂≥25% OR 每周训练≥3次 → 训练者
 */
export function recommendProfile(p) {
  if (!p || !p.weight || !p.height) return 'trainer';
  const bmi = p.weight / Math.pow(p.height / 100, 2);
  const bf = Number(p.bodyFat) || 22;
  if (bmi >= 24 || bf >= 25 || (p.activity && p.activity >= 3)) return 'trainer';
  return 'resident';
}

export default function ProfileSwitcher({ profile, setProfile, recommend, gender, onGenderSwitch }) {
  const [open, setOpen] = useState(false);
  const recPreset = PROFILE_PRESETS[recommend];
  const isMismatch = (profile.role || recommend) !== recommend;
  const curGender = gender || profile.gender || 'male';

  const handleGenderSwitch = (g) => {
    if (onGenderSwitch) {
      onGenderSwitch(g);
    }
  };

  return (
    <div className="dt-profile-switcher">
      {/* 性别切换 */}
      <div className="dt-profile-row">
        <span className="dt-profile-label">👤 性别</span>
        <div className="dt-profile-toggle dt-gender-toggle">
          <button
            type="button"
            className={`dt-profile-tab ${curGender === 'male' ? 'active' : ''}`}
            onClick={() => handleGenderSwitch('male')}
            title="男生·80kg 训练者模板"
          >
            ♂ 男生
          </button>
          <button
            type="button"
            className={`dt-profile-tab ${curGender === 'female' ? 'active' : ''}`}
            onClick={() => handleGenderSwitch('female')}
            title="女生·60kg 普通居民模板"
          >
            ♀ 女生
          </button>
        </div>
      </div>
      <div className="dt-profile-row">
        <span className="dt-profile-label">📊 参考档位</span>
        <div className="dt-profile-toggle">
          {['trainer', 'resident'].map((k) => {
            const p = PROFILE_PRESETS[k];
            const active = (profile.role || recommend) === k;
            return (
              <button
                key={k}
                type="button"
                className={`dt-profile-tab ${active ? 'active' : ''}`}
                onClick={() => setProfile({ ...profile, role: k })}
                title={p.desc}
              >
                {p.label}
              </button>
            );
          })}
        </div>
        <button
          type="button"
          className="dt-profile-edit"
          onClick={() => setOpen((v) => !v)}
          title="微调体重/体脂/活动量"
        >
          {open ? '▲' : '⚙️'}
        </button>
      </div>
      {isMismatch && (
        <div className="dt-profile-hint">
          💡 根据您的 {profile.height}cm/{profile.weight}kg/体脂{profile.bodyFat}%，自动推荐
          <b> {recPreset.label}</b>（{recPreset.desc}）
          <button
            type="button"
            className="dt-profile-apply"
            onClick={() => setProfile({ ...profile, role: recommend })}
          >
            采用推荐
          </button>
        </div>
      )}
      {open && (
        <div className="dt-profile-fields">
          <label>
            <span>年龄</span>
            <input
              type="number"
              min="10" max="100"
              value={profile.age || ''}
              onChange={(e) => setProfile({ ...profile, age: Number(e.target.value) || 0 })}
            />
          </label>
          <label>
            <span>身高 cm</span>
            <input
              type="number"
              min="100" max="250"
              value={profile.height || ''}
              onChange={(e) => setProfile({ ...profile, height: Number(e.target.value) || 0 })}
            />
          </label>
          <label>
            <span>体重 kg</span>
            <input
              type="number"
              min="30" max="200" step="0.1"
              value={profile.weight || ''}
              onChange={(e) => setProfile({ ...profile, weight: Number(e.target.value) || 0 })}
            />
          </label>
          <label>
            <span>体脂 %</span>
            <input
              type="number"
              min="3" max="60" step="0.1"
              value={profile.bodyFat || ''}
              onChange={(e) => setProfile({ ...profile, bodyFat: Number(e.target.value) || 0 })}
            />
          </label>
          <label>
            <span>每周训练</span>
            <select
              value={profile.activity || 0}
              onChange={(e) => setProfile({ ...profile, activity: Number(e.target.value) })}
            >
              <option value={0}>0 天（久坐）</option>
              <option value={1}>1 天（低活动）</option>
              <option value={2}>2 天（轻活动）</option>
              <option value={3}>3 天（中活动）</option>
              <option value={4}>4 天（高活动）</option>
              <option value={5}>5 天（很高活动）</option>
              <option value={6}>6 天（运动员）</option>
              <option value={7}>7 天（专业训练）</option>
            </select>
          </label>
        </div>
      )}
    </div>
  );
}

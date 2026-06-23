import { estimateCalories } from './src/utils/calorieDB.js';

// 从 storage.js 提取所有示例菜品进行测试
import { SAMPLE_DISHES } from './src/utils/storage.js';

let pass = 0, fail = 0;
const failed = [];
for (const d of SAMPLE_DISHES) {
  const e = estimateCalories(d.recipe);
  if (e.hasData && e.total > 0) {
    pass++;
  } else {
    fail++;
    failed.push(`${d.name}(${d.category}): "${(d.recipe || '').slice(0, 50)}"`);
  }
}

console.log(`✅ ${pass} 道菜有卡路里估算`);
console.log(`❌ ${fail} 道菜无估算：`);
failed.forEach(s => console.log('  - ' + s));

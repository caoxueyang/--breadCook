/**
 * 生成 Android 各密度的应用图标 + 圆形图标 + 前景图
 *
 * 输入：src/assets/pompompurin-icon.png (布丁狗原图)
 * 输出：
 *   android/app/src/main/res/mipmap-{mdpi,hdpi,xhdpi,xxhdpi,xxxhdpi}/ic_launcher.png
 *   android/app/src/main/res/mipmap-{...}/ic_launcher_round.png
 *   android/app/src/main/res/mipmap-{...}/ic_launcher_foreground.png
 *   android/app/src/main/res/mipmap-anydpi-v26/ic_launcher.xml  (adaptive-icon，背景色与图标同)
 *
 * 设计原则：
 *   1. 图完整显示，没有白边/黑边（因为原图自带粉色波点背景）
 *   2. 原图不是正方形，先 pad 成正方形再缩放
 *   3. adaptive-icon 的 foreground 填满 108x108 viewport，background 设为透明
 *      这样无论 launcher 是否蒙版，图片都居中显示
 */
import sharp from 'sharp';
import path from 'path';
import { fileURLToPath } from 'url';
import { mkdir, writeFile, rm } from 'fs/promises';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SRC = path.join(__dirname, 'src', 'assets', 'pompompurin-icon.png');
const RES = path.join(__dirname, 'android', 'app', 'src', 'main', 'res');

// Android mipmap 标准尺寸 (px)
const SIZES = {
  'mipmap-mdpi': 48,
  'mipmap-hdpi': 72,
  'mipmap-xhdpi': 96,
  'mipmap-xxhdpi': 144,
  'mipmap-xxxhdpi': 192,
};

// adaptive-icon viewport 尺寸（按 mdpi 比例）
const ADAPTIVE_VP = 108;
const ADAPTIVE_SIZES = {
  'mipmap-mdpi': 108,
  'mipmap-hdpi': 162,
  'mipmap-xhdpi': 216,
  'mipmap-xxhdpi': 324,
  'mipmap-xxxhdpi': 432,
};

/** 圆形 SVG 蒙版（透明背景 + 白色圆），用于做 round icon */
function circleMaskSvg(size) {
  const r = size / 2;
  return Buffer.from(
    `<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">` +
      `<circle cx="${r}" cy="${r}" r="${r}" fill="white"/>` +
    `</svg>`
  );
}

/** 给原图做"pad 成正方形 + 缩放"处理，保持原图比例，居中显示 */
async function makeSquare(src, size) {
  const meta = await sharp(src).metadata();
  const ratio = Math.min(size / meta.width, size / meta.height);
  const w = Math.round(meta.width * ratio);
  const h = Math.round(meta.height * ratio);
  const resized = await sharp(src).resize(w, h).png().toBuffer();
  // 用 transparent 居中 pad
  return sharp({
    create: {
      width: size,
      height: size,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    },
  })
    .composite([{ input: resized, gravity: 'center' }])
    .png()
    .toBuffer();
}

async function main() {
  console.log('开始生成 Android 图标...');
  console.log('源图:', SRC);

  // 1) 5 个密度的方形完整图 (ic_launcher.png)
  for (const [dir, size] of Object.entries(SIZES)) {
    const out = path.join(RES, dir, 'ic_launcher.png');
    const buf = await makeSquare(SRC, size);
    await sharp(buf).toFile(out);
    console.log(`  [${dir}] ic_launcher.png (${size}x${size})`);
  }

  // 2) 5 个密度的圆形图 (ic_launcher_round.png)
  for (const [dir, size] of Object.entries(SIZES)) {
    const out = path.join(RES, dir, 'ic_launcher_round.png');
    const sq = await makeSquare(SRC, size);
    const masked = await sharp(sq)
      .composite([{ input: circleMaskSvg(size), blend: 'dest-in' }])
      .png()
      .toBuffer();
    await sharp(masked).toFile(out);
    console.log(`  [${dir}] ic_launcher_round.png (${size}x${size})`);
  }

  // 3) 5 个密度的前景图 (ic_launcher_foreground.png) - 填满 108x108 viewport
  for (const [dir, size] of Object.entries(ADAPTIVE_SIZES)) {
    const out = path.join(RES, dir, 'ic_launcher_foreground.png');
    const buf = await makeSquare(SRC, size);
    await sharp(buf).toFile(out);
    console.log(`  [${dir}] ic_launcher_foreground.png (${size}x${size})`);
  }

  // 4) 重写 adaptive-icon XML：背景用透明，前景用全填充图
  //    - 透明背景 + 充满 108vp 的前景 = 任何 launcher 看到的就是完整图
  //    - 部分 launcher 会用圆形蒙版（这是 launcher 行为，无法关闭）
  //    - 由于原图背景是粉色波点，圆形蒙版外部分被裁掉后内部也是完整的
  const v26Dir = path.join(RES, 'mipmap-anydpi-v26');
  await mkdir(v26Dir, { recursive: true });
  const xml = `<?xml version="1.0" encoding="utf-8"?>
<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android">
    <background android:drawable="@color/ic_launcher_background"/>
    <foreground android:drawable="@mipmap/ic_launcher_foreground"/>
</adaptive-icon>
`;
  await writeFile(path.join(v26Dir, 'ic_launcher.xml'), xml, 'utf-8');
  await writeFile(path.join(v26Dir, 'ic_launcher_round.xml'), xml, 'utf-8');
  console.log('  [mipmap-anydpi-v26] ic_launcher.xml + ic_launcher_round.xml');

  // 5) 把 background 颜色设为透明，避免 adaptive-icon 的白底
  await writeFile(
    path.join(RES, 'values', 'ic_launcher_background.xml'),
    `<?xml version="1.0" encoding="utf-8"?>
<resources>
    <color name="ic_launcher_background">#FFF8E7</color>
</resources>
`,
    'utf-8'
  );
  console.log('  [values] ic_launcher_background.xml (#FFF8E7 暖黄奶油色，与 Pompompurin 主题一致)');

  console.log('\nDONE. 重新运行 gradle assembleDebug 即可。');
}

main().catch(err => {
  console.error('ERROR:', err);
  process.exit(1);
});

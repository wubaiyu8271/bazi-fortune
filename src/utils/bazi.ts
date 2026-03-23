// 八字命理计算工具

export interface BaziResult {
  yearPillar: string;    // 年柱
  monthPillar: string;   // 月柱
  dayPillar: string;     // 日柱
  hourPillar: string;    // 时柱
  wuxing: WuxingResult;  // 五行分析
  personality: string;   // 性格特点
}

export interface WuxingResult {
  gold: number;    // 金
  wood: number;    // 木
  water: number;   // 水
  fire: number;    // 火
  earth: number;   // 土
  dominant: string; // 主导五行
  lacking: string;  // 缺失五行
}

// 天干
const TIAN_GAN = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
// 地支
const DI_ZHI = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

// 天干五行属性
const TIAN_GAN_WUXING: Record<string, string> = {
  '甲': '木', '乙': '木',
  '丙': '火', '丁': '火',
  '戊': '土', '己': '土',
  '庚': '金', '辛': '金',
  '壬': '水', '癸': '水'
};

// 地支五行属性
const DI_ZHI_WUXING: Record<string, string> = {
  '子': '水', '丑': '土', '寅': '木', '卯': '木',
  '辰': '土', '巳': '火', '午': '火', '未': '土',
  '申': '金', '酉': '金', '戌': '土', '亥': '水'
};

// 时辰对应表
const SHI_CHEN = [
  { name: '子时', start: 0, end: 1, dizhi: '子' },
  { name: '丑时', start: 1, end: 3, dizhi: '丑' },
  { name: '寅时', start: 3, end: 5, dizhi: '寅' },
  { name: '卯时', start: 5, end: 7, dizhi: '卯' },
  { name: '辰时', start: 7, end: 9, dizhi: '辰' },
  { name: '巳时', start: 9, end: 11, dizhi: '巳' },
  { name: '午时', start: 11, end: 13, dizhi: '午' },
  { name: '未时', start: 13, end: 15, dizhi: '未' },
  { name: '申时', start: 15, end: 17, dizhi: '申' },
  { name: '酉时', start: 17, end: 19, dizhi: '酉' },
  { name: '戌时', start: 19, end: 21, dizhi: '戌' },
  { name: '亥时', start: 21, end: 23, dizhi: '亥' },
];

/**
 * 根据公历日期计算八字
 * @param year 年
 * @param month 月（1-12）
 * @param day 日
 * @param hour 时（0-23）
 * @returns 八字结果
 */
export function calculateBazi(year: number, month: number, day: number, hour: number): BaziResult {
  // 计算年柱
  const yearGan = TIAN_GAN[(year - 4) % 10];
  const yearZhi = DI_ZHI[(year - 4) % 12];
  const yearPillar = yearGan + yearZhi;

  // 计算月柱（基于节气）
  const monthPillar = calculateMonthPillar(year, month, day);

  // 计算日柱（使用简化算法）
  const dayPillar = calculateDayPillar(year, month, day);

  // 计算时柱
  const shiChenInfo = SHI_CHEN.find(sc => hour >= sc.start && hour < sc.end) || SHI_CHEN[0];
  const dayGanIndex = TIAN_GAN.indexOf(dayPillar[0]);
  const hourGanIndex = (dayGanIndex % 5) * 2 + DI_ZHI.indexOf(shiChenInfo.dizhi);
  const hourGan = TIAN_GAN[hourGanIndex % 10];
  const hourPillar = hourGan + shiChenInfo.dizhi;

  // 计算五行
  const wuxing = calculateWuxing(yearPillar, monthPillar, dayPillar, hourPillar);

  // 生成性格描述
  const personality = generatePersonality(wuxing, dayPillar);

  return {
    yearPillar,
    monthPillar,
    dayPillar,
    hourPillar,
    wuxing,
    personality
  };
}

/**
 * 计算月柱（基于节气）
 * 八字月份以节气为界，不是以公历月份为界
 */
function calculateMonthPillar(year: number, month: number, day: number): string {
  // 获取年干
  const yearGan = TIAN_GAN[(year - 4) % 10];
  
  // 根据节气和日期确定月支
  // 简化的节气表（大约日期，实际节气每年略有不同）
  const jieQiTable: Record<number, Array<{ day: number; zhi: string; zhiIndex: number }>> = {
    1: [{ day: 1, zhi: '丑', zhiIndex: 1 }],  // 1月：小寒后丑月
    2: [{ day: 1, zhi: '寅', zhiIndex: 2 }],  // 2月：立春后寅月
    3: [{ day: 1, zhi: '卯', zhiIndex: 3 }],  // 3月：惊蛰后卯月
    4: [{ day: 1, zhi: '辰', zhiIndex: 4 }],  // 4月：清明后辰月
    5: [{ day: 1, zhi: '巳', zhiIndex: 5 }],  // 5月：立夏后巳月
    6: [{ day: 1, zhi: '午', zhiIndex: 6 }],  // 6月：芒种后午月
    7: [{ day: 7, zhi: '未', zhiIndex: 7 }, { day: 1, zhi: '午', zhiIndex: 6 }],  // 7月：小暑(约7日)后未月
    8: [{ day: 7, zhi: '申', zhiIndex: 8 }, { day: 1, zhi: '未', zhiIndex: 7 }],  // 8月：立秋(约7日)后申月
    9: [{ day: 7, zhi: '酉', zhiIndex: 9 }, { day: 1, zhi: '申', zhiIndex: 8 }],  // 9月：白露(约7日)后酉月
    10: [{ day: 8, zhi: '戌', zhiIndex: 10 }, { day: 1, zhi: '酉', zhiIndex: 9 }], // 10月：寒露(约8日)后戌月
    11: [{ day: 7, zhi: '亥', zhiIndex: 11 }, { day: 1, zhi: '戌', zhiIndex: 10 }], // 11月：立冬(约7日)后亥月
    12: [{ day: 7, zhi: '子', zhiIndex: 0 }, { day: 1, zhi: '亥', zhiIndex: 11 }],  // 12月：大雪(约7日)后子月
  };
  
  // 确定月支
  const jieQiList = jieQiTable[month];
  let monthZhiIndex: number;
  
  if (jieQiList.length === 1) {
    monthZhiIndex = jieQiList[0].zhiIndex;
  } else {
    // 有节气切换的月份
    if (day >= jieQiList[0].day) {
      monthZhiIndex = jieQiList[0].zhiIndex; // 节气后
    } else {
      monthZhiIndex = jieQiList[1].zhiIndex; // 节气前
    }
  }
  
  const monthZhi = DI_ZHI[monthZhiIndex];
  
  // 五虎遁月：根据年干推算月干
  // 甲己之年丙作首，乙庚之岁戊为头
  // 丙辛之岁寻庚起，丁壬壬位顺行流
  // 戊癸何方发，甲寅之上好追求
  const wuHuDunYue: Record<string, number> = {
    '甲': 2, '己': 2,  // 丙
    '乙': 4, '庚': 4,  // 戊
    '丙': 6, '辛': 6,  // 庚
    '丁': 8, '壬': 8,  // 壬
    '戊': 0, '癸': 0,  // 甲
  };
  
  // 寅月(正月)的月干索引
  const firstMonthGanIndex = wuHuDunYue[yearGan];
  
  // 寅月索引是2，计算当前月份相对于寅月的偏移
  const monthOffset = monthZhiIndex - 2;
  const monthGanIndex = (firstMonthGanIndex + monthOffset + 10) % 10;
  const monthGan = TIAN_GAN[monthGanIndex];
  
  return monthGan + monthZhi;
}

/**
 * 计算日柱（简化算法）
 */
function calculateDayPillar(year: number, month: number, day: number): string {
  // 使用基准日期计算
  const baseDate = new Date(1900, 0, 31); // 1900-01-31 是甲辰日
  const targetDate = new Date(year, month - 1, day);
  const diffDays = Math.floor((targetDate.getTime() - baseDate.getTime()) / (1000 * 60 * 60 * 24));
  
  const ganIndex = (diffDays + 0) % 10;
  const zhiIndex = (diffDays + 4) % 12;
  
  return TIAN_GAN[ganIndex] + DI_ZHI[zhiIndex];
}

/**
 * 计算五行属性
 */
function calculateWuxing(year: string, month: string, day: string, hour: string): WuxingResult {
  const pillars = [year, month, day, hour];
  const counts = { gold: 0, wood: 0, water: 0, fire: 0, earth: 0 };
  
  const wuxingMap: Record<string, keyof typeof counts> = {
    '金': 'gold',
    '木': 'wood',
    '水': 'water',
    '火': 'fire',
    '土': 'earth'
  };
  
  pillars.forEach(pillar => {
    const gan = pillar[0];
    const zhi = pillar[1];
    
    const ganWuxing = TIAN_GAN_WUXING[gan];
    const zhiWuxing = DI_ZHI_WUXING[zhi];
    
    if (ganWuxing) counts[wuxingMap[ganWuxing]]++;
    if (zhiWuxing) counts[wuxingMap[zhiWuxing]]++;
  });
  
  // 找出主导和缺失的五行
  const entries = Object.entries(counts);
  const maxEntry = entries.reduce((a, b) => a[1] > b[1] ? a : b);
  const minEntry = entries.reduce((a, b) => a[1] < b[1] ? a : b);
  
  const wuxingNames: Record<string, string> = {
    'gold': '金',
    'wood': '木',
    'water': '水',
    'fire': '火',
    'earth': '土'
  };
  
  return {
    ...counts,
    dominant: wuxingNames[maxEntry[0]],
    lacking: minEntry[1] === 0 ? wuxingNames[minEntry[0]] : ''
  };
}

/**
 * 生成性格描述
 */
function generatePersonality(_wuxing: WuxingResult, dayPillar: string): string {
  const personalities: Record<string, string> = {
    '金': '刚毅果断，重情重义，有领导才能',
    '木': '仁慈宽厚，富有创造力，善于规划',
    '水': '聪明机智，适应力强，善于交际',
    '火': '热情开朗，积极向上，富有感染力',
    '土': '稳重踏实，诚信可靠，善于理财'
  };
  
  const dayGan = dayPillar[0];
  const dayWuxing = TIAN_GAN_WUXING[dayGan];
  
  return personalities[dayWuxing] || '性格平和，处事稳重';
}

/**
 * 获取时辰列表
 */
export function getShiChenList() {
  return SHI_CHEN.map((sc, index) => ({
    value: index,
    label: sc.name,
    timeRange: `${String(sc.start).padStart(2, '0')}:00-${String(sc.end).padStart(2, '0')}:00`
  }));
}

/**
 * 生成AI解读用的提示词
 */
export function generateAIPrompt(bazi: BaziResult, name: string, gender: string): string {
  // 使用bazi参数避免未使用警告
  const wuxingInfo = `金${bazi.wuxing.gold}木${bazi.wuxing.wood}水${bazi.wuxing.water}火${bazi.wuxing.fire}土${bazi.wuxing.earth}`;
  
  return `请为${name}（${gender}）进行八字命理分析。

八字信息：
- 年柱：${bazi.yearPillar}
- 月柱：${bazi.monthPillar}
- 日柱：${bazi.dayPillar}
- 时柱：${bazi.hourPillar}

五行分析：${wuxingInfo}
- 主导五行：${bazi.wuxing.dominant}
${bazi.wuxing.lacking ? `- 五行缺：${bazi.wuxing.lacking}` : ''}

请从以下几个方面进行分析：
1. 性格特点（详细）
2. 事业运势
3. 婚姻感情
4. 财运分析
5. 健康建议
6. 2026年流年运势

请用传统命理术语，语言要有神秘感但易懂，适当使用悬念引导用户付费查看完整版。`;
}

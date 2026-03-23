/**
 * 盲派命理过三关推断引擎
 * 基于JSON口诀库进行八字推断
 */

import koujueData from '../data/mangpai-koujue.json';

// 八字数据结构
export interface BaziData {
  yearPillar: string;   // 年柱，如 "甲子"
  monthPillar: string;  // 月柱，如 "乙丑"
  dayPillar: string;    // 日柱，如 "丙寅"
  timePillar: string;   // 时柱，如 "丁卯"
  gender: 'male' | 'female';
}

// 推断结果
export interface InferResult {
  type: string;
  detail: string;
  confidence: '高' | '中' | '低';
  koujue?: string;
}

// 过三关结果
export interface GuoSanGuanResult {
  parents: InferResult[];
  siblings: InferResult[];
  children: InferResult[];
}

// 天干地支对应表
const TIAN_GAN = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
const DI_ZHI = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

// 五行对应
const GAN_WUXING: Record<string, string> = {
  '甲': '木', '乙': '木',
  '丙': '火', '丁': '火',
  '戊': '土', '己': '土',
  '庚': '金', '辛': '金',
  '壬': '水', '癸': '水'
};

const ZHI_WUXING: Record<string, string> = {
  '子': '水', '丑': '土', '寅': '木', '卯': '木',
  '辰': '土', '巳': '火', '午': '火', '未': '土',
  '申': '金', '酉': '金', '戌': '土', '亥': '水'
};

// 十神关系（以日干为主）
const SHI_SHEN_RELATIONS: Record<string, Record<string, string>> = {
  '甲': { '甲': '比肩', '乙': '劫财', '丙': '食神', '丁': '伤官', '戊': '偏财', '己': '正财', '庚': '七杀', '辛': '正官', '壬': '偏印', '癸': '正印' },
  '乙': { '甲': '劫财', '乙': '比肩', '丙': '伤官', '丁': '食神', '戊': '正财', '己': '偏财', '庚': '正官', '辛': '七杀', '壬': '正印', '癸': '偏印' },
  '丙': { '甲': '偏印', '乙': '正印', '丙': '比肩', '丁': '劫财', '戊': '食神', '己': '伤官', '庚': '偏财', '辛': '正财', '壬': '七杀', '癸': '正官' },
  '丁': { '甲': '正印', '乙': '偏印', '丙': '劫财', '丁': '比肩', '戊': '伤官', '己': '食神', '庚': '正财', '辛': '偏财', '壬': '正官', '癸': '七杀' },
  '戊': { '甲': '七杀', '乙': '正官', '丙': '偏印', '丁': '正印', '戊': '比肩', '己': '劫财', '庚': '食神', '辛': '伤官', '壬': '偏财', '癸': '正财' },
  '己': { '甲': '正官', '乙': '七杀', '丙': '正印', '丁': '偏印', '戊': '劫财', '己': '比肩', '庚': '伤官', '辛': '食神', '壬': '正财', '癸': '偏财' },
  '庚': { '甲': '偏财', '乙': '正财', '丙': '七杀', '丁': '正官', '戊': '偏印', '己': '正印', '庚': '比肩', '辛': '劫财', '壬': '食神', '癸': '伤官' },
  '辛': { '甲': '正财', '乙': '偏财', '丙': '正官', '丁': '七杀', '戊': '正印', '己': '偏印', '庚': '劫财', '辛': '比肩', '壬': '伤官', '癸': '食神' },
  '壬': { '甲': '食神', '乙': '伤官', '丙': '偏财', '丁': '正财', '戊': '七杀', '己': '正官', '庚': '偏印', '辛': '正印', '壬': '比肩', '癸': '劫财' },
  '癸': { '甲': '伤官', '乙': '食神', '丙': '正财', '丁': '偏财', '戊': '正官', '己': '七杀', '庚': '正印', '辛': '偏印', '壬': '劫财', '癸': '比肩' }
};

// 地支藏干
const ZHI_CANG_GAN: Record<string, string[]> = {
  '子': ['癸'],
  '丑': ['己', '癸', '辛'],
  '寅': ['甲', '丙', '戊'],
  '卯': ['乙'],
  '辰': ['戊', '乙', '癸'],
  '巳': ['丙', '庚', '戊'],
  '午': ['丁', '己'],
  '未': ['己', '丁', '乙'],
  '申': ['庚', '壬', '戊'],
  '酉': ['辛'],
  '戌': ['戊', '辛', '丁'],
  '亥': ['壬', '甲']
};

// 解析柱为天干地支
function parsePillar(pillar: string): { gan: string; zhi: string } {
  return {
    gan: pillar[0],
    zhi: pillar[1]
  };
}

// 获取日干
function getDayGan(bazi: BaziData): string {
  return parsePillar(bazi.dayPillar).gan;
}

// 获取十神
function getShiShen(dayGan: string, targetGan: string): string {
  return SHI_SHEN_RELATIONS[dayGan]?.[targetGan] || '';
}

// 计算某十神在八字中出现的次数
function countShiShen(bazi: BaziData, shiShen: string): number {
  const dayGan = getDayGan(bazi);
  let count = 0;
  
  const pillars = [bazi.yearPillar, bazi.monthPillar, bazi.dayPillar, bazi.timePillar];
  
  pillars.forEach(pillar => {
    const { gan, zhi } = parsePillar(pillar);
    // 检查天干
    if (getShiShen(dayGan, gan) === shiShen) {
      count++;
    }
    // 检查地支藏干
    const cangGan = ZHI_CANG_GAN[zhi] || [];
    cangGan.forEach(cg => {
      if (getShiShen(dayGan, cg) === shiShen) {
        count++;
      }
    });
  });
  
  return count;
}

// 检查是否有某个十神
function hasShiShen(bazi: BaziData, shiShen: string): boolean {
  return countShiShen(bazi, shiShen) > 0;
}

// 检查年月是否相冲
function isYearMonthChong(bazi: BaziData): boolean {
  const yearZhi = parsePillar(bazi.yearPillar).zhi;
  const monthZhi = parsePillar(bazi.monthPillar).zhi;
  
  // 六冲：子午冲、丑未冲、寅申冲、卯酉冲、辰戌冲、巳亥冲
  const chongPairs = [
    ['子', '午'], ['午', '子'],
    ['丑', '未'], ['未', '丑'],
    ['寅', '申'], ['申', '寅'],
    ['卯', '酉'], ['酉', '卯'],
    ['辰', '戌'], ['戌', '辰'],
    ['巳', '亥'], ['亥', '巳']
  ];
  
  return chongPairs.some(pair => pair[0] === yearZhi && pair[1] === monthZhi);
}

// 推断父母关 - 基于盲派口诀
function inferParents(bazi: BaziData): InferResult[] {
  const results: InferResult[] = [];
  const dayGan = getDayGan(bazi);
  
  // 解析各柱
  const yearPillar = parsePillar(bazi.yearPillar);
  const monthPillar = parsePillar(bazi.monthPillar);
  const dayPillar = parsePillar(bazi.dayPillar);
  const timePillar = parsePillar(bazi.timePillar);
  
  // 确定父星和母星（以日干论）
  // 偏财为父，正印为母
  const fatherStar = '偏财';
  const motherStar = '正印';
  
  // 检查父星（偏财）情况
  const fatherCount = countShiShen(bazi, fatherStar);
  const fatherGan = getPillarGanByShiShen(bazi, fatherStar);
  const hasFatherInGan = fatherGan.length > 0; // 偏财是否透干
  
  // 检查母星（正印）情况
  const motherCount = countShiShen(bazi, motherStar);
  const motherGan = getPillarGanByShiShen(bazi, motherStar);
  const hasMotherInGan = motherGan.length > 0; // 正印是否透干
  
  // 检查年月是否相冲（父母离异或分离）
  const yearMonthChong = isYearMonthChong(bazi);
  
  // 检查父星是否入墓（偏财为己土，墓在辰）
  const fatherInMu = isFatherInMu(bazi, dayGan);
  
  // 比劫数量
  const biJieCount = countShiShen(bazi, '比肩') + countShiShen(bazi, '劫财');
  
  // ===== 口诀1：年月相冲父母离 =====
  if (yearMonthChong) {
    results.push({
      type: '父母关系',
      detail: '年月相冲，父母缘薄，幼年可能父母离异或早分离',
      confidence: '高',
      koujue: '年月相冲父母离，幼年父母早分离。'
    });
  }
  
  // ===== 口诀2：偏财入墓又逢冲，岁运逢墓父寿终 =====
  if (fatherInMu && yearMonthChong) {
    results.push({
      type: '父缘',
      detail: '偏财入墓逢冲，父缘浅薄，需防早年丧父',
      confidence: '高',
      koujue: '偏财入墓又逢冲，岁运逢墓父寿终。'
    });
  }
  
  // ===== 口诀3：比劫重重虽克父，不见偏财命也固 =====
  if (biJieCount >= 3) {
    if (!hasFatherInGan) {
      results.push({
        type: '父缘',
        detail: '比劫重重克父，偏财不透，父缘浅薄或早年别离',
        confidence: '高',
        koujue: '比劫重重虽克父，不见偏财命也固。岁运若逢偏财来，父死非命无救助。'
      });
    } else {
      results.push({
        type: '父缘',
        detail: '比劫重重，父星受克，父亲身体欠佳或缘薄',
        confidence: '中',
        koujue: '比劫叠叠父难安，偏财隐遁命自宽。'
      });
    }
  }
  
  // ===== 新增：父星不透藏支中，弱而受克父早亡 =====
  if (!hasFatherInGan && fatherCount > 0) {
    // 父星不透干，只在藏干中
    const fatherWeak = isFatherWeak(bazi, dayGan);
    if (fatherWeak) {
      results.push({
        type: '父缘',
        detail: '偏财不透，藏在支中受克泄，父缘浅薄或早年丧父',
        confidence: '高',
        koujue: '偏财不透藏支中，弱而受克父早亡。'
      });
    }
  }
  
  // ===== 新增：父星全无 =====
  if (fatherCount === 0) {
    results.push({
      type: '父缘',
      detail: '命中不见偏财，父缘极薄，或早年别离',
      confidence: '高',
      koujue: '命中无偏财，父缘难觅。'
    });
  }
  
  // ===== 口诀4：印绶无损父母全 =====
  if (motherCount >= 1 && !yearMonthChong && biJieCount < 3) {
    if (hasMotherInGan) {
      results.push({
        type: '母缘',
        detail: '印星透干无伤，母亲健在有力，与母缘分深',
        confidence: '高',
        koujue: '印绶无损父母全，十岁内外无祸延。'
      });
    } else {
      results.push({
        type: '母缘',
        detail: '印星无伤，母亲健在',
        confidence: '中',
        koujue: '印绶无损父母全。'
      });
    }
  }
  
  // ===== 新增：母强父弱 =====
  if (hasMotherInGan && !hasFatherInGan) {
    results.push({
      type: '父母关系',
      detail: '印星透干而偏财不透，母强父弱，与母缘分深于父',
      confidence: '中',
      koujue: '印透财藏，母强父弱。'
    });
  }
  
  // ===== 口诀5：年上比劫出身贫 =====
  const yearShiShen = getShiShen(dayGan, yearPillar.gan);
  if (yearShiShen === '比肩' || yearShiShen === '劫财') {
    results.push({
      type: '家境出身',
      detail: '年上比劫，出身贫寒，祖业凋零，需白手起家',
      confidence: '高',
      koujue: '年上比劫出身贫，祖业凋零家道寒。'
    });
  } else if (yearShiShen === '正财' || yearShiShen === '偏财') {
    results.push({
      type: '家境出身',
      detail: '年上财星，家境尚可，祖业有承',
      confidence: '中',
      koujue: '年上财官出身好，祖业丰厚家道昌。'
    });
  } else if (yearShiShen === '正印' || yearShiShen === '偏印') {
    results.push({
      type: '家境出身',
      detail: '年上印星，出身书香门第，或得长辈庇护',
      confidence: '中',
      koujue: '年上印星，祖上或有文名。'
    });
  } else {
    results.push({
      type: '家境出身',
      detail: '年柱' + yearShiShen + '，家境平常，平淡中见真情',
      confidence: '低'
    });
  }
  
  // 如果没有匹配到特定口诀，给默认推断
  if (results.length === 0) {
    results.push({
      type: '父母缘',
      detail: '父母缘信息不显，需结合大运流年细推',
      confidence: '低'
    });
  }
  
  return results;
}

// 辅助函数：获取某十神所在的天干柱
function getPillarGanByShiShen(bazi: BaziData, shiShen: string): string[] {
  const dayGan = getDayGan(bazi);
  const result: string[] = [];
  const pillars = [
    { name: '年', pillar: bazi.yearPillar },
    { name: '月', pillar: bazi.monthPillar },
    { name: '日', pillar: bazi.dayPillar },
    { name: '时', pillar: bazi.timePillar }
  ];
  
  pillars.forEach(({ name, pillar }) => {
    const gan = pillar[0];
    if (getShiShen(dayGan, gan) === shiShen) {
      result.push(name);
    }
  });
  
  return result;
}

// 辅助函数：检查父星是否入墓
function isFatherInMu(bazi: BaziData, dayGan: string): boolean {
  // 偏财为己土（乙日主），墓在辰
  const muZhi = '辰';
  const pillars = [bazi.yearPillar, bazi.monthPillar, bazi.dayPillar, bazi.timePillar];
  return pillars.some(pillar => pillar[1] === muZhi);
}

// 辅助函数：判断父星是否弱而受制
function isFatherWeak(bazi: BaziData, dayGan: string): boolean {
  // 父星弱的情况：
  // 1. 父星不透干
  // 2. 父星所在支被冲克
  // 3. 父星五行被旺神所泄耗
  
  const fatherGan = getFatherGan(dayGan);
  const fatherWuxing = getWuxingByGan(fatherGan);
  
  // 检查全局五行旺衰
  const wuxingCount = countWuxingInBazi(bazi);
  
  // 如果火旺而父星是土，则火炎土焦，父星受制
  if (fatherWuxing === '土' && wuxingCount['火'] >= 3) {
    return true;
  }
  
  // 如果木旺而父星是土，则木克土太过
  if (fatherWuxing === '土' && wuxingCount['木'] >= 4) {
    return true;
  }
  
  return false;
}

// 辅助函数：根据日主获取父星天干
function getFatherGan(dayGan: string): string {
  // 偏财为父
  const fatherMap: Record<string, string> = {
    '甲': '戊', '乙': '己', '丙': '庚', '丁': '辛',
    '戊': '壬', '己': '癸', '庚': '甲', '辛': '乙',
    '壬': '丙', '癸': '丁'
  };
  return fatherMap[dayGan] || '';
}

// 辅助函数：获取天干五行
function getWuxingByGan(gan: string): string {
  const map: Record<string, string> = {
    '甲': '木', '乙': '木', '丙': '火', '丁': '火',
    '戊': '土', '己': '土', '庚': '金', '辛': '金',
    '壬': '水', '癸': '水'
  };
  return map[gan] || '';
}

// 辅助函数：统计八字中各五行数量
function countWuxingInBazi(bazi: BaziData): Record<string, number> {
  const count: Record<string, number> = { '金': 0, '木': 0, '水': 0, '火': 0, '土': 0 };
  const pillars = [bazi.yearPillar, bazi.monthPillar, bazi.dayPillar, bazi.timePillar];
  
  pillars.forEach(pillar => {
    const gan = pillar[0];
    const zhi = pillar[1];
    
    // 天干五行
    const ganWuxing = getWuxingByGan(gan);
    if (ganWuxing) count[ganWuxing]++;
    
    // 地支五行
    const zhiWuxing = ZHI_WUXING[zhi];
    if (zhiWuxing) count[zhiWuxing]++;
  });
  
  return count;
}

// 推断兄弟关 - 基于盲派口诀
function inferSiblings(bazi: BaziData): InferResult[] {
  const results: InferResult[] = [];
  const dayGan = getDayGan(bazi);
  const dayPillar = parsePillar(bazi.dayPillar);
  const timePillar = parsePillar(bazi.timePillar);
  
  // 判断日主旺衰（简化版）
  const isDayGanStrong = isDayGanStrongSimplified(bazi);
  
  // 统计兄弟星数量
  let siblingCount = 0;
  let siblingShiShen: string[] = [];
  
  if (isDayGanStrong) {
    // 口诀1：身旺官杀论手足
    siblingShiShen = ['正官', '七杀'];
    siblingCount = countShiShen(bazi, '正官') + countShiShen(bazi, '七杀');
  } else {
    // 口诀2：身衰比劫印枭齐
    siblingShiShen = ['比肩', '劫财', '正印', '偏印'];
    siblingCount = countShiShen(bazi, '比肩') + countShiShen(bazi, '劫财') + 
                   countShiShen(bazi, '正印') + countShiShen(bazi, '偏印');
  }
  
  // 口诀3：比劫不见手足单，独子独女命中现
  const biJieCount = countShiShen(bazi, '比肩') + countShiShen(bazi, '劫财');
  if (biJieCount === 0) {
    results.push({
      type: '手足缘',
      detail: '命中无比劫，独子或独女，性格独立，与表亲或挚友缘分更深',
      confidence: '高',
      koujue: '比劫不见手足单，独子独女命中现。'
    });
  } else if (siblingCount >= 4) {
    results.push({
      type: '手足缘',
      detail: `命中${isDayGanStrong ? '官杀' : '比劫印枭'}多现，手足众多，热闹中亦有竞争`,
      confidence: '中',
      koujue: isDayGanStrong ? '身旺官杀论手足' : '身衰比劫印枭齐'
    });
  } else if (siblingCount >= 1) {
    results.push({
      type: '手足缘',
      detail: `有兄弟姐妹相伴，数目约${siblingCount}人左右`,
      confidence: '中',
      koujue: '日干、比、劫、刃、禄、支藏日干五行之总数'
    });
  }
  
  // 口诀4：甲寅丙午不见劫，辛亥壬子日时现，不是独子是老大
  const isLaoDa = checkIsLaoDa(bazi);
  if (isLaoDa) {
    results.push({
      type: '排行',
      detail: '命中老大或独子之象',
      confidence: '中',
      koujue: '甲寅丙午不见劫，辛亥壬子日时现，不是独子是老大。'
    });
  }
  
  // 口诀5：时落己丑是伤官，直断三四是老小
  const isLaoXiao = checkIsLaoXiao(bazi);
  if (isLaoXiao) {
    results.push({
      type: '排行',
      detail: '命中老小之象，排行偏末',
      confidence: '中',
      koujue: '时落己丑是伤官，直断三四是老小。'
    });
  }
  
  // 口诀6：年月相冲或相合，养子信息命中藏
  const yearMonthRelation = getYearMonthRelation(bazi);
  if (yearMonthRelation === '冲' || yearMonthRelation === '合') {
    results.push({
      type: '特殊信息',
      detail: '年月柱有特殊关系，或有养子、过继之象',
      confidence: '低',
      koujue: '年月相冲或相合，养子信息命中藏。'
    });
  }
  
  // 如果没有匹配到特定口诀
  if (results.length === 0) {
    results.push({
      type: '手足缘',
      detail: '手足缘信息不显，需结合大运流年细推',
      confidence: '低'
    });
  }
  
  return results;
}

// 辅助函数：判断是否为老大
function checkIsLaoDa(bazi: BaziData): boolean {
  const dayGan = getDayGan(bazi);
  const dayPillar = parsePillar(bazi.dayPillar);
  const timePillar = parsePillar(bazi.timePillar);
  
  // 甲寅、丙午日柱不见劫财
  const noJieCai = countShiShen(bazi, '劫财') === 0;
  if ((dayPillar.gan + dayPillar.zhi === '甲寅' || dayPillar.gan + dayPillar.zhi === '丙午') && noJieCai) {
    return true;
  }
  
  // 时柱辛亥、壬子
  if (timePillar.gan + timePillar.zhi === '辛亥' || timePillar.gan + timePillar.zhi === '壬子') {
    return true;
  }
  
  // 时干正财
  const timeGanShiShen = getShiShen(dayGan, timePillar.gan);
  if (timeGanShiShen === '正财') {
    return true;
  }
  
  return false;
}

// 辅助函数：判断是否为老小
function checkIsLaoXiao(bazi: BaziData): boolean {
  const dayGan = getDayGan(bazi);
  const dayPillar = parsePillar(bazi.dayPillar);
  const timePillar = parsePillar(bazi.timePillar);
  const monthPillar = parsePillar(bazi.monthPillar);
  
  // 口诀1：时落己丑是伤官，直断三四是老小
  if (timePillar.gan + timePillar.zhi === '己丑') {
    return true;
  }
  
  // 口诀2：时干伤官
  const timeGanShiShen = getShiShen(dayGan, timePillar.gan);
  if (timeGanShiShen === '伤官') {
    return true;
  }
  
  // 新增口诀3：时干正官，非老大之象（可能是老小或中间）
  // 正官代表规矩、管束，老小往往更受父母管教
  if (timeGanShiShen === '正官') {
    // 结合其他条件判断
    const biJieCount = countShiShen(bazi, '比肩') + countShiShen(bazi, '劫财');
    if (biJieCount >= 1) {
      // 有比劫但时干正官，可能是老小
      return true;
    }
  }
  
  // 新增口诀4：日主坐绝地，时柱财官，老小之象
  // 乙酉日柱，酉是乙的绝地，时柱庚辰（正官正财）
  const dayZhi = dayPillar.zhi;
  const jueDiTable: Record<string, string[]> = {
    '甲': ['申'], '乙': ['酉'], '丙': ['亥'], '丁': ['子'],
    '戊': ['亥'], '己': ['子'], '庚': ['寅'], '辛': ['卯'],
    '壬': ['巳'], '癸': ['午']
  };
  
  if (jueDiTable[dayGan]?.includes(dayZhi)) {
    // 日主坐绝地
    if (timeGanShiShen === '正官' || timeGanShiShen === '正财') {
      return true;
    }
  }
  
  // 新增口诀5：月柱比劫旺，时柱财官，非老大
  const monthGanShiShen = getShiShen(dayGan, monthPillar.gan);
  if ((monthGanShiShen === '比肩' || monthGanShiShen === '劫财') && 
      (timeGanShiShen === '正官' || timeGanShiShen === '正财')) {
    return true;
  }
  
  return false;
}

// 辅助函数：判断年月关系
function getYearMonthRelation(bazi: BaziData): string {
  const yearZhi = parsePillar(bazi.yearPillar).zhi;
  const monthZhi = parsePillar(bazi.monthPillar).zhi;
  
  // 六冲
  const chongPairs = [
    ['子', '午'], ['丑', '未'], ['寅', '申'],
    ['卯', '酉'], ['辰', '戌'], ['巳', '亥']
  ];
  if (chongPairs.some(pair => 
    (pair[0] === yearZhi && pair[1] === monthZhi) || 
    (pair[1] === yearZhi && pair[0] === monthZhi)
  )) {
    return '冲';
  }
  
  // 六合
  const hePairs = [
    ['子', '丑'], ['寅', '亥'], ['卯', '戌'],
    ['辰', '酉'], ['巳', '申'], ['午', '未']
  ];
  if (hePairs.some(pair => 
    (pair[0] === yearZhi && pair[1] === monthZhi) || 
    (pair[1] === yearZhi && pair[0] === monthZhi)
  )) {
    return '合';
  }
  
  return '';
}

// 辅助函数：简化版判断日主旺衰
function isDayGanStrongSimplified(bazi: BaziData): boolean {
  const dayGan = getDayGan(bazi);
  const dayZhi = parsePillar(bazi.dayPillar).zhi;
  
  // 得令（月令生扶日主）
  const dayGanWuxing = GAN_WUXING[dayGan];
  const monthZhiWuxing = ZHI_WUXING[parsePillar(bazi.monthPillar).zhi];
  const isDeLing = 
    (dayGanWuxing === '木' && ['寅', '卯'].includes(parsePillar(bazi.monthPillar).zhi)) ||
    (dayGanWuxing === '火' && ['巳', '午'].includes(parsePillar(bazi.monthPillar).zhi)) ||
    (dayGanWuxing === '土' && ['辰', '戌', '丑', '未'].includes(parsePillar(bazi.monthPillar).zhi)) ||
    (dayGanWuxing === '金' && ['申', '酉'].includes(parsePillar(bazi.monthPillar).zhi)) ||
    (dayGanWuxing === '水' && ['亥', '子'].includes(parsePillar(bazi.monthPillar).zhi));
  
  // 得地（日支生扶或同五行）
  const isDeDi = 
    (dayGanWuxing === '木' && ['寅', '卯', '亥', '子'].includes(dayZhi)) ||
    (dayGanWuxing === '火' && ['巳', '午', '寅', '卯'].includes(dayZhi)) ||
    (dayGanWuxing === '土' && ['辰', '戌', '丑', '未', '巳', '午'].includes(dayZhi)) ||
    (dayGanWuxing === '金' && ['申', '酉', '辰', '戌', '丑', '未'].includes(dayZhi)) ||
    (dayGanWuxing === '水' && ['亥', '子', '申', '酉'].includes(dayZhi));
  
  // 得势（印比多）
  const yinBiCount = countShiShen(bazi, '比肩') + countShiShen(bazi, '劫财') + 
                     countShiShen(bazi, '正印') + countShiShen(bazi, '偏印');
  const isDeShi = yinBiCount >= 3;
  
  // 得令、得地、得势占两个以上为身旺
  let score = 0;
  if (isDeLing) score++;
  if (isDeDi) score++;
  if (isDeShi) score++;
  
  return score >= 2;
}

// 推断子女关 - 基于盲派口诀
function inferChildren(bazi: BaziData): InferResult[] {
  const results: InferResult[] = [];
  const dayGan = getDayGan(bazi);
  
  // 检查是否有财星
  const hasCaiXing = countShiShen(bazi, '正财') + countShiShen(bazi, '偏财') > 0;
  
  // 确定子女星
  let sonShiShen: string;    // 儿子
  let daughterShiShen: string;  // 女儿
  
  if (bazi.gender === 'male') {
    // 口诀1：男命有财星则以七杀为儿正官为女，无财星则以食神为儿伤官为女
    if (hasCaiXing) {
      sonShiShen = '七杀';
      daughterShiShen = '正官';
    } else {
      sonShiShen = '食神';
      daughterShiShen = '伤官';
    }
  } else {
    // 口诀2：女命以食神为女伤官为儿
    sonShiShen = '伤官';
    daughterShiShen = '食神';
  }
  
  const sonCount = countShiShen(bazi, sonShiShen);
  const daughterCount = countShiShen(bazi, daughterShiShen);
  const totalZiNv = sonCount + daughterCount;
  
  // 子女缘判断
  if (totalZiNv >= 3) {
    results.push({
      type: '子女缘',
      detail: `${bazi.gender === 'male' ? '官杀' : '食伤'}叠叠，子女缘旺，儿女双全之象`,
      confidence: '中',
      koujue: '官杀叠叠子女多，食伤重重儿女全。'
    });
  } else if (totalZiNv >= 1) {
    results.push({
      type: '子女缘',
      detail: `命中${totalZiNv}个子女星，有子嗣之缘`,
      confidence: '中',
      koujue: bazi.gender === 'male' 
        ? (hasCaiXing ? '男命：有财星则以七杀为儿正官为女' : '无财星则以食神为儿伤官为女')
        : '女命：以食神为女伤官为儿'
    });
  } else {
    // 口诀3：时逢七煞本无儿，食伤太过必夭损
    const timePillar = parsePillar(bazi.timePillar);
    const timeGanShiShen = getShiShen(dayGan, timePillar.gan);
    
    if (timeGanShiShen === '七杀') {
      results.push({
        type: '子女缘',
        detail: '时柱逢七杀，子女缘薄，或求子较艰难',
        confidence: '中',
        koujue: '时逢七煞本无儿，食伤太过必夭损。'
      });
    } else {
      results.push({
        type: '子女缘',
        detail: '命中子女星不显，子女缘较淡，或来得较晚',
        confidence: '低',
        koujue: '时柱无子女星，缘薄或晚得。'
      });
    }
  }
  
  // 口诀4：头胎性别判断（时柱阴阳）
  const timePillar = parsePillar(bazi.timePillar);
  const headTaiGender = inferHeadTaiGender(bazi, sonShiShen, daughterShiShen);
  if (headTaiGender) {
    results.push({
      type: '头胎性别',
      detail: `头胎倾向${headTaiGender}，供参考`,
      confidence: '低',
      koujue: '时柱两阳则生女，时柱两阴则生男。男女难辨男看支，一男一女女看干。'
    });
  }
  
  // 口诀5：以年月日时为序，以第一个出现的子女星为头胎性别
  const firstZiNv = findFirstZiNvXing(bazi, sonShiShen, daughterShiShen);
  if (firstZiNv) {
    results.push({
      type: '头胎推断',
      detail: `按顺序第一个子女星为${firstZiNv.shiShen}，头胎可能为${firstZiNv.gender}`,
      confidence: '低',
      koujue: '以年月日时为序，以第一个出现的子女星为头胎性别，男杀官，女伤食，同柱以干为主。'
    });
  }
  
  // 口诀6：时柱空亡子女稀
  const isTimeKongWang = checkTimeKongWang(bazi);
  if (isTimeKongWang) {
    results.push({
      type: '子女缘',
      detail: '时柱临空亡，子女缘薄，或子女来得晚',
      confidence: '中',
      koujue: '时柱空亡子女稀，求子艰难命中定。'
    });
  }
  
  // 育儿建议
  if (totalZiNv > 0) {
    results.push({
      type: '育儿建议',
      detail: '子女有缘分，宜宽严相济，多陪伴少苛责',
      confidence: '低'
    });
  } else {
    results.push({
      type: '育儿建议',
      detail: '子女缘待引动，宜顺其自然，宽心以待',
      confidence: '低'
    });
  }
  
  return results;
}

// 辅助函数：推断头胎性别（时柱阴阳）
function inferHeadTaiGender(bazi: BaziData, sonShiShen: string, daughterShiShen: string): string {
  const dayGan = getDayGan(bazi);
  const timePillar = parsePillar(bazi.timePillar);
  
  // 阳干：甲丙戊庚壬
  // 阴干：乙丁己辛癸
  const yangGan = ['甲', '丙', '戊', '庚', '壬'];
  const yangZhi = ['子', '寅', '辰', '午', '申', '戌'];
  
  const isTimeGanYang = yangGan.includes(timePillar.gan);
  const isTimeZhiYang = yangZhi.includes(timePillar.zhi);
  
  // 时柱两阳则生女，时柱两阴则生男
  if (isTimeGanYang && isTimeZhiYang) {
    return '女';
  } else if (!isTimeGanYang && !isTimeZhiYang) {
    return '男';
  }
  
  // 一阳一阴，看子女星哪个先出现
  return '';
}

// 辅助函数：找第一个出现的子女星
function findFirstZiNvXing(bazi: BaziData, sonShiShen: string, daughterShiShen: string): { shiShen: string; gender: string } | null {
  const dayGan = getDayGan(bazi);
  const pillars = [
    { name: '年', pillar: bazi.yearPillar },
    { name: '月', pillar: bazi.monthPillar },
    { name: '日', pillar: bazi.dayPillar },
    { name: '时', pillar: bazi.timePillar }
  ];
  
  for (const { pillar } of pillars) {
    const gan = pillar[0];
    const zhi = pillar[1];
    const shiShen = getShiShen(dayGan, gan);
    
    if (shiShen === sonShiShen) {
      return { shiShen: sonShiShen, gender: '男' };
    }
    if (shiShen === daughterShiShen) {
      return { shiShen: daughterShiShen, gender: '女' };
    }
    
    // 检查藏干（优先级次于天干）
    const cangGan = ZHI_CANG_GAN[zhi] || [];
    for (const cg of cangGan) {
      const cgShiShen = getShiShen(dayGan, cg);
      if (cgShiShen === sonShiShen) {
        return { shiShen: sonShiShen, gender: '男' };
      }
      if (cgShiShen === daughterShiShen) {
        return { shiShen: daughterShiShen, gender: '女' };
      }
    }
  }
  
  return null;
}

// 辅助函数：检查时柱是否空亡
function checkTimeKongWang(bazi: BaziData): boolean {
  // 简化版空亡判断
  // 空亡根据日柱推算，这里简化处理
  const dayZhi = parsePillar(bazi.dayPillar).zhi;
  const timeZhi = parsePillar(bazi.timePillar).zhi;
  
  // 空亡表（简化）
  const kongWangTable: Record<string, string[]> = {
    '甲子': ['戌', '亥'], '甲戌': ['申', '酉'], '甲申': ['午', '未'],
    '甲午': ['辰', '巳'], '甲辰': ['寅', '卯'], '甲寅': ['子', '丑']
  };
  
  // 找到对应的空亡
  for (const [dayPillar, kongWang] of Object.entries(kongWangTable)) {
    if (dayPillar[0] === bazi.dayPillar[0]) {
      return kongWang.includes(timeZhi);
    }
  }
  
  return false;
}

// 主推断函数
export function inferGuoSanGuan(bazi: BaziData): GuoSanGuanResult {
  return {
    parents: inferParents(bazi),
    siblings: inferSiblings(bazi),
    children: inferChildren(bazi)
  };
}

// 获取口诀原文
export function getKoujue(category: 'parents' | 'siblings' | 'children'): string[] {
  const rules = koujueData.categories[category].rules;
  return rules.map(r => r.koujue);
}

export default {
  inferGuoSanGuan,
  getKoujue
};

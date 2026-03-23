import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { UserInfo, FortuneResult } from '../types';
import { PaymentModal } from './PaymentModal';
import { WechatGuide } from './WechatGuide';
import { ChevronLeft, Lock } from 'lucide-react';
import { inferGuoSanGuan, InferResult } from '../utils/mangpai-infer';

// 总结函数：将推断结果汇总为一句话
function summarizeParents(results: InferResult[]): string {
  const parts: string[] = [];
  
  // 提取关键信息
  const hasFatherWeak = results.some(r => r.type.includes('父') && r.detail.includes('不透'));
  const hasMotherStrong = results.some(r => r.type.includes('母') && r.detail.includes('透干'));
  const hasMotherFatherRelation = results.some(r => r.type.includes('父母') && r.detail.includes('母强父弱'));
  
  if (hasFatherWeak) parts.push('偏财不透父缘薄');
  if (hasMotherStrong) parts.push('印星透干母缘深');
  if (hasMotherFatherRelation) parts.push('母强父弱');
  
  // 如果没有匹配到，用第一个结果
  if (parts.length === 0 && results.length > 0) {
    return results[0].detail;
  }
  
  return parts.join('，') || '父母缘信息不显';
}

function summarizeSiblings(results: InferResult[]): string {
  const parts: string[] = [];
  
  // 提取关键信息
  const bodyStrength = results.find(r => r.detail.includes('身旺') || r.detail.includes('身弱'));
  const siblingCount = results.find(r => r.type.includes('手足') && r.detail.match(/\d+/));
  const isLaoDa = results.some(r => r.type.includes('排行') && r.detail.includes('老大'));
  const isLaoXiao = results.some(r => r.type.includes('排行') && r.detail.includes('老小'));
  
  // 1. 盲派口诀（身旺身弱论）
  if (bodyStrength) {
    const strength = bodyStrength.detail.includes('身旺') ? '身旺' : '身弱';
    const theory = bodyStrength.detail.includes('官杀') ? '以官杀论手足' : '以比劫印枭论手足';
    parts.push(`${strength}${theory}`);
  }
  
  // 2. 手足数量
  if (siblingCount) {
    const match = siblingCount.detail.match(/(\d+)/);
    if (match) {
      const count = parseInt(match[1]);
      if (count >= 4) parts.push('手足众多');
      else if (count >= 2) parts.push('手足多');
      else if (count === 1) parts.push('手足少');
      else parts.push('独子独女');
    }
  }
  
  // 3. 排行
  if (isLaoDa) parts.push('倾向老大');
  else if (isLaoXiao) parts.push('倾向老小');
  else parts.push('排行居中');
  
  return parts.join('，') || '手足缘信息不显';
}

function summarizeChildren(results: InferResult[]): string {
  const parts: string[] = [];
  
  // 提取关键信息
  const ziNvXing = results.find(r => r.type.includes('子女缘') && (r.detail.includes('官杀') || r.detail.includes('食伤')));
  const countInfo = results.find(r => r.detail.includes('七杀') || r.detail.includes('正官'));
  const headTai = results.find(r => r.type.includes('头胎') || r.detail.includes('头胎'));
  
  if (ziNvXing) {
    if (ziNvXing.detail.includes('官杀')) parts.push('官杀为子女');
    else if (ziNvXing.detail.includes('食伤')) parts.push('食伤为子女');
  }
  
  if (countInfo) {
    const qiShaMatch = countInfo.detail.match(/七杀(\d+)/);
    const zhengGuanMatch = countInfo.detail.match(/正官(\d+)/);
    const counts: string[] = [];
    if (qiShaMatch) counts.push(`七杀${qiShaMatch[1]}`);
    if (zhengGuanMatch) counts.push(`正官${zhengGuanMatch[1]}`);
    if (counts.length > 0) parts.push(counts.join(''));
  }
  
  if (headTai) {
    if (headTai.detail.includes('男')) parts.push('头胎倾向男');
    else if (headTai.detail.includes('女')) parts.push('头胎倾向女');
  }
  
  return parts.join('，') || '子女缘信息不显';
}

interface ResultPageProps {
  userInfo: UserInfo;
  result: FortuneResult;
  onBack: () => void;
  onPaymentSuccess: () => void;
}

// 传统风格图标组件
const IconYe = () => (
  <div className="w-full h-full flex items-center justify-center font-bold" style={{ fontFamily: "'Ma Shan Zheng', serif" }}>
    业
  </div>
);

const IconYuan = () => (
  <div className="w-full h-full flex items-center justify-center font-bold" style={{ fontFamily: "'Ma Shan Zheng', serif" }}>
    缘
  </div>
);

const IconCai = () => (
  <div className="w-full h-full flex items-center justify-center font-bold" style={{ fontFamily: "'Ma Shan Zheng', serif" }}>
    财
  </div>
);

const IconJian = () => (
  <div className="w-full h-full flex items-center justify-center font-bold" style={{ fontFamily: "'Ma Shan Zheng', serif" }}>
    健
  </div>
);

const IconLiu = () => (
  <div className="w-full h-full flex items-center justify-center font-bold" style={{ fontFamily: "'Ma Shan Zheng', serif" }}>
    运
  </div>
);

// 过三关图标 - 父母
const IconFuMu = () => (
  <div className="w-full h-full flex items-center justify-center font-bold text-lg" style={{ fontFamily: "'Ma Shan Zheng', serif" }}>
    亲
  </div>
);

// 过三关图标 - 兄弟
const IconXiongDi = () => (
  <div className="w-full h-full flex items-center justify-center font-bold text-lg" style={{ fontFamily: "'Ma Shan Zheng', serif" }}>
    兄
  </div>
);

// 过三关图标 - 子女
const IconZiNv = () => (
  <div className="w-full h-full flex items-center justify-center font-bold text-lg" style={{ fontFamily: "'Ma Shan Zheng', serif" }}>
    嗣
  </div>
);

// 太极图标
const TaiChiIcon = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    <circle cx="50" cy="50" r="48" fill="none" stroke="#4a4a4a" strokeWidth="2"/>
    <path d="M50 2 A48 48 0 0 1 50 98 A24 24 0 0 1 50 50 A24 24 0 0 0 50 2" fill="#4a4a4a"/>
    <circle cx="50" cy="26" r="6" fill="#f5f5f5"/>
    <circle cx="50" cy="74" r="6" fill="#4a4a4a"/>
  </svg>
);

export function ResultPage({ userInfo, result, onBack, onPaymentSuccess }: ResultPageProps) {
  const [showPayment, setShowPayment] = useState(false);

  // 计算用户年龄
  const userAge = useMemo(() => {
    const birthDate = new Date(userInfo.birthDate);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }, [userInfo.birthDate]);

  // 过三关推断
  const guoSanGuan = useMemo(() => {
    const baziData = {
      yearPillar: result.bazi.yearPillar,
      monthPillar: result.bazi.monthPillar,
      dayPillar: result.bazi.dayPillar,
      timePillar: result.bazi.hourPillar,
      gender: userInfo.gender
    };
    return inferGuoSanGuan(baziData);
  }, [result.bazi, userInfo.gender]);

  const lockedSections = [
    { 
      key: 'career', 
      Icon: IconYe, 
      title: '事业运势', 
      summary: result.career.summary,
    },
    { 
      key: 'marriage', 
      Icon: IconYuan, 
      title: '婚姻感情', 
      summary: result.marriage.summary,
    },
    { 
      key: 'wealth', 
      Icon: IconCai, 
      title: '财运分析', 
      summary: result.wealth.summary,
    },
    { 
      key: 'health', 
      Icon: IconJian, 
      title: '健康预警', 
      summary: result.health.summary,
    },
    { 
      key: 'liunian', 
      Icon: IconLiu, 
      title: '流年大运', 
      summary: result.liunian.summary,
    },
  ];

  // 五行颜色映射（水墨风格）
  const getWuxingStyle = (type: string) => {
    const styles: Record<string, { bg: string; border: string; text: string }> = {
      '金': { bg: 'bg-gray-100', border: 'border-gray-400', text: 'text-gray-700' },
      '木': { bg: 'bg-green-50', border: 'border-green-400', text: 'text-green-700' },
      '水': { bg: 'bg-blue-50', border: 'border-blue-400', text: 'text-blue-700' },
      '火': { bg: 'bg-red-50', border: 'border-red-400', text: 'text-red-700' },
      '土': { bg: 'bg-yellow-50', border: 'border-yellow-600', text: 'text-yellow-700' },
    };
    return styles[type] || { bg: 'bg-gray-100', border: 'border-gray-400', text: 'text-gray-700' };
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen py-6 px-4 pb-32"
      style={{ background: 'linear-gradient(180deg, #f8f8f8 0%, #fafafa 50%, #f0f0f0 100%)' }}
    >
      {/* 返回按钮 */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-ink-600 hover:text-ink-800 mb-4 transition-colors font-calligraphy"
      >
        <ChevronLeft className="w-5 h-5" />
        <span>重新测算</span>
      </button>

      <div className="max-w-lg mx-auto space-y-5">
        {/* 标题 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h2 
            className="text-2xl font-bold mb-1"
            style={{ fontFamily: "'Ma Shan Zheng', serif", color: '#1a1a1a', letterSpacing: '0.15em' }}
          >
            您的八字命盘
          </h2>
          <p 
            className="text-sm"
            style={{ color: '#666', fontFamily: "'ZCOOL XiaoWei', serif" }}
          >
            {userInfo.name} · {userInfo.gender === 'male' ? '男' : '女'} · {userInfo.birthDate}
          </p>
        </motion.div>

        {/* 八字排盘 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-5 rounded"
          style={{
            background: 'linear-gradient(180deg, #fafafa 0%, #f5f5f5 100%)',
            border: '2px solid #333',
            boxShadow: '0 0 0 3px #f5f5f5, 0 0 0 5px #666, 0 8px 30px rgba(0,0,0,0.15)'
          }}
        >
          <h3 
            className="text-lg font-bold mb-4 text-center"
            style={{ fontFamily: "'Ma Shan Zheng', serif", color: '#2a2a2a' }}
          >
            四柱八字
          </h3>
          <div className="grid grid-cols-4 gap-2">
            {[
              { label: '年柱', value: result.bazi.yearPillar },
              { label: '月柱', value: result.bazi.monthPillar },
              { label: '日柱', value: result.bazi.dayPillar },
              { label: '时柱', value: result.bazi.hourPillar },
            ].map((pillar, index) => (
              <div key={index} className="text-center">
                <div 
                  className="text-xs mb-1"
                  style={{ color: '#666', fontFamily: "'ZCOOL XiaoWei', serif" }}
                >
                  {pillar.label}
                </div>
                <div 
                  className="rounded py-3 px-1"
                  style={{ background: 'linear-gradient(135deg, #f0f0f0 0%, #e8e8e8 100%)', border: '1px solid #c0c0c0' }}
                >
                  <span 
                    className="text-xl font-bold"
                    style={{ fontFamily: "'Ma Shan Zheng', serif", color: '#1a1a1a' }}
                  >
                    {pillar.value}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* 五行分析 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-5 rounded"
          style={{
            background: 'linear-gradient(180deg, #fafafa 0%, #f5f5f5 100%)',
            border: '2px solid #333',
            boxShadow: '0 0 0 3px #f5f5f5, 0 0 0 5px #666, 0 8px 30px rgba(0,0,0,0.15)'
          }}
        >
          <h3 
            className="text-lg font-bold mb-4 text-center"
            style={{ fontFamily: "'Ma Shan Zheng', serif", color: '#2a2a2a' }}
          >
            五行分析
          </h3>
          <div className="space-y-3">
            {[
              { label: '金', value: result.wuxing.gold },
              { label: '木', value: result.wuxing.wood },
              { label: '水', value: result.wuxing.water },
              { label: '火', value: result.wuxing.fire },
              { label: '土', value: result.wuxing.earth },
            ].map((wx) => {
              const _style = getWuxingStyle(wx.label);
              return (
                <div key={wx.label} className="flex items-center gap-3">
                  <span 
                    className="w-6 font-bold"
                    style={{ fontFamily: "'Ma Shan Zheng', serif", color: '#333' }}
                  >
                    {wx.label}
                  </span>
                  <div 
                    className="flex-1 h-2 rounded-full overflow-hidden"
                    style={{ background: '#e0e0e0' }}
                  >
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(wx.value / 8) * 100}%` }}
                      transition={{ duration: 1, delay: 0.5 }}
                      className="h-full rounded-full"
                      style={{ background: '#4a4a4a' }}
                    />
                  </div>
                  <span 
                    className="w-6 text-right text-sm"
                    style={{ color: '#666', fontFamily: "'ZCOOL XiaoWei', serif" }}
                  >
                    {wx.value}
                  </span>
                </div>
              );
            })}
          </div>
          
          {result.wuxing.lacking && (
            <div 
              className="mt-4 p-3 rounded-lg border"
              style={{ background: '#fafafa', borderColor: '#999' }}
            >
              <p 
                className="text-center"
                style={{ fontFamily: "'ZCOOL XiaoWei', serif", color: '#333' }}
              >
                <span style={{ fontFamily: "'Ma Shan Zheng', serif" }}>五行缺{result.wuxing.lacking}</span>
                <span className="text-sm ml-2">建议在生活中适当补充{result.wuxing.lacking}元素</span>
              </p>
            </div>
          )}
        </motion.div>

        {/* 过三关 - 盲派核心推断 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="p-5 rounded"
          style={{
            background: 'linear-gradient(180deg, #fafafa 0%, #f5f5f5 100%)',
            border: '2px solid #333',
            boxShadow: '0 0 0 3px #f5f5f5, 0 0 0 5px #666, 0 8px 30px rgba(0,0,0,0.15)'
          }}
        >
          {/* 标题 */}
          <h3 
            className="text-lg font-bold mb-2 text-center"
            style={{ fontFamily: "'Ma Shan Zheng', serif", color: '#2a2a2a' }}
          >
            盲派过三关
          </h3>
          
          {/* 过三关解释 */}
          <div 
            className="mb-4 p-3 rounded-lg"
            style={{ background: 'linear-gradient(135deg, #f8f8f8 0%, #f0f0f0 100%)', border: '1px dashed #999' }}
          >
            <p 
              className="text-sm leading-relaxed"
              style={{ color: '#555', fontFamily: "'ZCOOL XiaoWei', serif" }}
            >
              <span style={{ fontFamily: "'Ma Shan Zheng', serif", color: '#333' }}>「过三关」</span>
              是盲派命理的核心技法，通过八字推断
              <span style={{ color: '#c00' }}>父母、兄弟、子女</span>
              三大关口的具体情况，包括父母缘分、家境出身、手足关系、子女缘等信息。
              这是检验命理师水平的重要标准。
            </p>
          </div>

          {/* 三关内容 - 简洁一句话总结 */}
          <div className="space-y-3">
            {/* 父母关 */}
            <div 
              className="p-3 rounded-lg"
              style={{ background: 'linear-gradient(135deg, #f5f5f5 0%, #f0f0f0 100%)', border: '1px solid #c0c0c0' }}
            >
              <div className="flex items-center gap-2 mb-2">
                <div 
                  className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, #f0f0f0 0%, #e0e0e0 100%)', border: '1px solid #c0c0c0' }}
                >
                  <IconFuMu />
                </div>
                <h4 
                  className="font-bold"
                  style={{ fontFamily: "'Ma Shan Zheng', serif", color: '#2a2a2a' }}
                >
                  父母关
                </h4>
              </div>
              <p 
                className="text-sm leading-relaxed"
                style={{ color: '#333', fontFamily: "'ZCOOL XiaoWei', serif" }}
              >
                {summarizeParents(guoSanGuan.parents)}
              </p>
            </div>

            {/* 兄弟关 */}
            <div 
              className="p-3 rounded-lg"
              style={{ background: 'linear-gradient(135deg, #f5f5f5 0%, #f0f0f0 100%)', border: '1px solid #c0c0c0' }}
            >
              <div className="flex items-center gap-2 mb-2">
                <div 
                  className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, #f0f0f0 0%, #e0e0e0 100%)', border: '1px solid #c0c0c0' }}
                >
                  <IconXiongDi />
                </div>
                <h4 
                  className="font-bold"
                  style={{ fontFamily: "'Ma Shan Zheng', serif", color: '#2a2a2a' }}
                >
                  兄弟关
                </h4>
              </div>
              <p 
                className="text-sm leading-relaxed"
                style={{ color: '#333', fontFamily: "'ZCOOL XiaoWei', serif" }}
              >
                {summarizeSiblings(guoSanGuan.siblings)}
              </p>
            </div>

            {/* 子女关 */}
            <div 
              className="p-3 rounded-lg"
              style={{ background: 'linear-gradient(135deg, #f5f5f5 0%, #f0f0f0 100%)', border: '1px solid #c0c0c0' }}
            >
              <div className="flex items-center gap-2 mb-2">
                <div 
                  className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, #f0f0f0 0%, #e0e0e0 100%)', border: '1px solid #c0c0c0' }}
                >
                  <IconZiNv />
                </div>
                <h4 
                  className="font-bold"
                  style={{ fontFamily: "'Ma Shan Zheng', serif", color: '#2a2a2a' }}
                >
                  子女关
                </h4>
              </div>
              <p 
                className="text-sm leading-relaxed"
                style={{ color: '#333', fontFamily: "'ZCOOL XiaoWei', serif" }}
              >
                {summarizeChildren(guoSanGuan.children)}
              </p>
              {/* 适龄提示 */}
              {userAge < 22 && (
                <p 
                  className="text-xs mt-2 pt-2"
                  style={{ color: '#888', fontFamily: "'ZCOOL XiaoWei', serif", borderTop: '1px dashed #ccc' }}
                >
                  （您当前{userAge}岁，子女缘待成年成家后更为显现）
                </p>
              )}
            </div>
          </div>

          {/* 提示 */}
          <div 
            className="mt-3 p-2 rounded text-center"
            style={{ background: 'rgba(0,0,0,0.03)' }}
          >
            <p 
              className="text-xs"
              style={{ color: '#888', fontFamily: "'ZCOOL XiaoWei', serif" }}
            >
              以上推断基于盲派传统口诀，实际需结合大运流年综合判断
            </p>
          </div>
        </motion.div>

        {/* 性格预览（免费版） */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="p-5 rounded"
          style={{
            background: 'linear-gradient(180deg, #fafafa 0%, #f5f5f5 100%)',
            border: '2px solid #333',
            boxShadow: '0 0 0 3px #f5f5f5, 0 0 0 5px #666, 0 8px 30px rgba(0,0,0,0.15)'
          }}
        >
          <h3 
            className="text-lg font-bold mb-4 text-center"
            style={{ fontFamily: "'Ma Shan Zheng', serif", color: '#2a2a2a' }}
          >
            性格画像
          </h3>
          <div 
            className="rounded-lg p-4"
            style={{ background: 'linear-gradient(135deg, #f5f5f5 0%, #f0f0f0 100%)', border: '1px solid #d0d0d0' }}
          >
            <p 
              className="leading-relaxed"
              style={{ color: '#333', fontFamily: "'ZCOOL XiaoWei', serif" }}
            >
              {result.personality.summary}
            </p>
            <div 
              className="mt-4 p-3 rounded border-l-4"
              style={{ background: 'rgba(255,255,255,0.7)', borderLeftColor: '#666' }}
            >
              <p 
                className="text-sm italic"
                style={{ color: '#555', fontFamily: "'ZCOOL XiaoWei', serif" }}
              >
                "您的命格中藏着一个
                <span style={{ color: '#c00', fontFamily: "'Ma Shan Zheng', serif" }}>重大机遇</span>，
                将在35岁前后出现。这个机遇与
                <span style={{ color: '#c00', fontFamily: "'Ma Shan Zheng', serif" }}>贵人</span>
                有关，可能改变你一生的..."
              </p>
              <button
                onClick={() => setShowPayment(true)}
                className="mt-2 text-sm font-medium hover:underline"
                style={{ color: '#666', fontFamily: "'Ma Shan Zheng', serif" }}
              >
                【点击解锁查看完整性格分析】
              </button>
            </div>
          </div>
        </motion.div>

        {/* 锁定模块 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-4"
        >
          <h3 
            className="text-lg font-bold text-center"
            style={{ fontFamily: "'Ma Shan Zheng', serif", color: '#2a2a2a' }}
          >
            完整命书解读
          </h3>
          
          {lockedSections.map((section, index) => (
            <motion.div
              key={section.key}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              className="p-4 relative overflow-hidden rounded"
              style={{
                background: 'linear-gradient(180deg, #fafafa 0%, #f5f5f5 100%)',
                border: '1px solid #c0c0c0',
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
              }}
            >
              {/* 锁定遮罩 */}
              <div 
                className="absolute inset-0 z-10 flex flex-col items-center justify-end pb-4"
                style={{ background: 'linear-gradient(to bottom, transparent 0%, rgba(255,255,255,0.6) 50%, rgba(255,255,255,0.9) 100%)' }}
              >
                <Lock className="w-8 h-8 mb-2" style={{ color: '#999' }} />
                <span 
                  className="text-sm"
                  style={{ color: '#888', fontFamily: "'ZCOOL XiaoWei', serif" }}
                >
                  解锁查看完整内容
                </span>
              </div>
              
              <div className="flex items-center gap-3 mb-2">
                <div 
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, #f0f0f0 0%, #e0e0e0 100%)', border: '1px solid #c0c0c0' }}
                >
                  <section.Icon />
                </div>
                <h4 
                  className="font-bold"
                  style={{ fontFamily: "'Ma Shan Zheng', serif", color: '#2a2a2a' }}
                >
                  {section.title}
                </h4>
              </div>
              <p 
                className="text-sm line-clamp-2"
                style={{ color: '#666', fontFamily: "'ZCOOL XiaoWei', serif" }}
              >
                {section.summary}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* 解锁提示 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="p-6 rounded"
          style={{
            background: 'linear-gradient(180deg, #f5f5f5 0%, #e8e8e8 100%)',
            border: '2px solid #333',
            boxShadow: '0 0 0 3px #f5f5f5, 0 0 0 5px #666, 0 8px 30px rgba(0,0,0,0.15)'
          }}
        >
          <div className="text-center">
            <div className="w-10 h-10 mx-auto mb-3 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #f0f0f0 0%, #e0e0e0 100%)', border: '1px solid #c0c0c0' }}>
              <TaiChiIcon size={24} />
            </div>
            <h3 
              className="text-xl font-bold mb-2"
              style={{ fontFamily: "'Ma Shan Zheng', serif", color: '#1a1a1a' }}
            >
              解锁完整命书
            </h3>
            <p 
              className="mb-4"
              style={{ color: '#555', fontFamily: "'ZCOOL XiaoWei', serif" }}
            >
              超过 <span style={{ color: '#c00', fontFamily: "'Ma Shan Zheng', serif" }}>8000字</span> 详细解读
            </p>
            <div className="flex items-center justify-center gap-3 mb-4">
              <span 
                className="text-2xl font-bold"
                style={{ color: '#c00', fontFamily: "'Ma Shan Zheng', serif" }}
              >
                ¥19.90
              </span>
              <span 
                className="line-through"
                style={{ color: '#999', fontFamily: "'ZCOOL XiaoWei', serif" }}
              >
                ¥99.00
              </span>
            </div>
            <button
              onClick={() => setShowPayment(true)}
              className="w-full py-3 rounded text-lg"
              style={{
                fontFamily: "'Ma Shan Zheng', serif",
                letterSpacing: '0.15em',
                background: 'linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 100%)',
                color: '#f5f5f5',
                border: '2px solid #4a4a4a',
                boxShadow: '0 4px 15px rgba(0,0,0,0.3)'
              }}
            >
              立即解锁完整版
            </button>
            <p 
              className="text-xs mt-3"
              style={{ color: '#888', fontFamily: "'ZCOOL XiaoWei', serif" }}
            >
              已有 88,888 人解锁完整命书
            </p>
          </div>
        </motion.div>

        {/* 免费页私域引流 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
        >
          <WechatGuide
            variant="compact"
            title="添加天机阁主微信"
            benefits={[
              '免费领取五行补救建议',
              '获取2026流年简批'
            ]}
          />
        </motion.div>
      </div>

      {/* 支付弹窗 */}
      {showPayment && (
        <PaymentModal
          userInfo={userInfo}
          result={result}
          onClose={() => setShowPayment(false)}
          onPaymentSuccess={onPaymentSuccess}
        />
      )}
    </motion.div>
  );
}

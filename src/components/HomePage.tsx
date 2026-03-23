import { motion } from 'framer-motion';
import { Bagua } from './Bagua';
import { ChevronDown } from 'lucide-react';
import { useState, useEffect } from 'react';

// 传统风格图标组件 - 使用书法字符
const IconMing = () => (
  <div className="w-full h-full flex items-center justify-center font-bold text-xl" style={{ fontFamily: "'Ma Shan Zheng', serif" }}>
    命
  </div>
);

const IconYuan = () => (
  <div className="w-full h-full flex items-center justify-center font-bold text-xl" style={{ fontFamily: "'Ma Shan Zheng', serif" }}>
    缘
  </div>
);

const IconCai = () => (
  <div className="w-full h-full flex items-center justify-center font-bold text-xl" style={{ fontFamily: "'Ma Shan Zheng', serif" }}>
    财
  </div>
);

const IconYe = () => (
  <div className="w-full h-full flex items-center justify-center font-bold text-xl" style={{ fontFamily: "'Ma Shan Zheng', serif" }}>
    业
  </div>
);

// 太极图标
const TaiChiIcon = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" className="mx-auto">
    <circle cx="50" cy="50" r="48" fill="none" stroke="#4a4a4a" strokeWidth="2"/>
    <path d="M50 2 A48 48 0 0 1 50 98 A24 24 0 0 1 50 50 A24 24 0 0 0 50 2" fill="#4a4a4a"/>
    <circle cx="50" cy="26" r="6" fill="#f5f5f5"/>
    <circle cx="50" cy="74" r="6" fill="#4a4a4a"/>
  </svg>
);

// 云纹装饰
const CloudIcon = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 100 60" className="mx-auto">
    <path 
      d="M10 40 Q20 20 40 30 Q50 10 70 25 Q90 15 95 35 Q100 55 80 50 L20 50 Q0 50 10 40" 
      fill="none" 
      stroke="#4a4a4a" 
      strokeWidth="3"
      strokeLinecap="round"
    />
  </svg>
);

// 钱币图标
const CoinIcon = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" className="mx-auto">
    <circle cx="50" cy="50" r="45" fill="none" stroke="#4a4a4a" strokeWidth="3"/>
    <rect x="42" y="30" width="16" height="40" fill="#4a4a4a"/>
    <rect x="30" y="42" width="40" height="16" fill="#4a4a4a"/>
  </svg>
);

// 人物图标
const PersonIcon = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" className="mx-auto">
    <circle cx="50" cy="30" r="18" fill="none" stroke="#4a4a4a" strokeWidth="3"/>
    <path d="M20 85 Q20 55 50 55 Q80 55 80 85" fill="none" stroke="#4a4a4a" strokeWidth="3"/>
  </svg>
);

// 建筑/官印图标
const SealIcon = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" className="mx-auto">
    <rect x="20" y="20" width="60" height="60" fill="none" stroke="#4a4a4a" strokeWidth="3"/>
    <text x="50" y="62" textAnchor="middle" fontSize="28" fill="#4a4a4a" style={{ fontFamily: "'Ma Shan Zheng', serif" }}>印</text>
  </svg>
);

interface HomePageProps {
  onStart: () => void;
}

// 十种命格 - 水墨风格
const mingGeList = [
  '正官格', '七杀格', '食神格', '伤官格', '正印格',
  '偏印格', '正财格', '偏财格', '建禄格',
];

// 人群痛点 - 水墨灰色调（使用传统图标）
const painPoints = [
  {
    icon: TaiChiIcon,
    title: '运势较差',
    desc: '总觉得好运气都躲着走，想知道什么时候有好运气',
  },
  {
    icon: CoinIcon,
    title: '财运不济',
    desc: '赚钱赚不到，还经常破财，想要知晓发财时机',
  },
  {
    icon: PersonIcon,
    title: '感情困惑',
    desc: '感情里总是受挫的一方，面对感情毫无头绪',
  },
  {
    icon: SealIcon,
    title: '事业受阻',
    desc: '生意明明认真付出，总是失败想要事业方向',
  },
];

export function HomePage({ onStart }: HomePageProps) {
  const [showBottomBtn, setShowBottomBtn] = useState(true);

  const scrollToForm = () => {
    const formSection = document.getElementById('form-section');
    formSection?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    const handleScroll = () => {
      const formSection = document.getElementById('form-section');
      if (formSection) {
        const rect = formSection.getBoundingClientRect();
        setShowBottomBtn(rect.top > window.innerHeight - 100);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen pb-20 bg-gradient-to-b from-[#f8f8f8] via-[#fafafa] to-[#f0f0f0]">
      {/* 徽派建筑屋顶装饰 */}
      <div className="relative w-full h-24 overflow-hidden">
        <img 
          src="/roof.png" 
          alt="徽派建筑屋顶" 
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-[#f8f8f8] to-transparent" />
      </div>

      {/* 首屏 Hero Section - 紧凑布局 */}
      <section className="relative flex flex-col items-center justify-center px-4 pt-4 pb-8">
        {/* 八卦背景 */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-10">
          <Bagua size={350} />
        </div>
        
        {/* 主标题区域 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-center"
        >
          {/* 八卦图标 */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-3"
          >
            <Bagua size={80} className="mx-auto" />
          </motion.div>
          
          {/* 天机阁标题 - 书法字体 */}
          <h1 
            className="text-5xl md:text-6xl font-bold mb-2 text-shadow"
            style={{ 
              fontFamily: "'Ma Shan Zheng', 'ZCOOL XiaoWei', serif",
              color: '#1a1a1a',
              letterSpacing: '0.2em'
            }}
          >
            天机阁
          </h1>
          
          {/* 副标题 */}
          <p 
            className="text-lg md:text-xl mb-4"
            style={{ 
              fontFamily: "'ZCOOL XiaoWei', serif",
              color: '#4a4a4a',
              letterSpacing: '0.15em'
            }}
          >
            八字命理 · 洞察天命
          </p>
          
          <div className="w-20 h-0.5 bg-gradient-to-r from-transparent via-[#666] to-transparent mx-auto mb-6" />
        </motion.div>
        
        {/* 痛点引导 - 紧凑卷轴 */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="relative z-10 max-w-xl mx-auto text-center mb-6"
        >
          <div 
            className="p-5 mx-2 rounded"
            style={{
              background: 'linear-gradient(180deg, #fafafa 0%, #f5f5f5 100%)',
              border: '2px solid #333',
              boxShadow: '0 0 0 3px #f5f5f5, 0 0 0 5px #666, 0 8px 30px rgba(0,0,0,0.15)'
            }}
          >
            <h2 
              className="text-xl font-bold mb-4"
              style={{ 
                fontFamily: "'Ma Shan Zheng', serif",
                color: '#2a2a2a',
                letterSpacing: '0.1em'
              }}
            >
              解答你的人生困惑
            </h2>
            <div className="grid grid-cols-2 gap-3 text-left">
              {[
                '事业迷茫，不知何去何从？',
                '姻缘未到，正缘何时出现？',
                '财运起伏，如何把握机遇？',
                '健康隐患，如何趋吉避凶？',
              ].map((text, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.08 }}
                  className="flex items-center gap-2 p-2 rounded"
                  style={{ background: 'rgba(0,0,0,0.03)' }}
                >
                  <span className="w-5 h-5 flex items-center justify-center flex-shrink-0 text-[#666] font-bold" style={{ fontFamily: "'Ma Shan Zheng', serif" }}>
                    {['事', '姻', '财', '健'][index]}
                  </span>
                  <span 
                    className="text-sm"
                    style={{ color: '#3a3a3a', fontFamily: "'ZCOOL XiaoWei', serif" }}
                  >
                    {text}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
        
        {/* CTA按钮 */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="relative z-10 text-center"
        >
          <button
            onClick={onStart}
            className="btn-primary text-lg px-10 py-4"
            style={{ fontFamily: "'Ma Shan Zheng', serif", letterSpacing: '0.15em' }}
          >
            立即测算
          </button>
          
          {/* 统计数字 - 紧邻按钮 */}
          <p 
            className="text-sm mt-3"
            style={{ color: '#666', fontFamily: "'ZCOOL XiaoWei', serif" }}
          >
            已有 <span className="font-bold text-[#333]">128,888</span> 人获取命理分析
          </p>
        </motion.div>
        
        {/* 向下滚动提示 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="mt-6"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="text-[#999]"
          >
            <ChevronDown className="w-6 h-6" />
          </motion.div>
        </motion.div>
      </section>
      
      {/* 服务介绍 Section - 紧凑间距 */}
      <section className="py-10 px-4">
        <div className="max-w-4xl mx-auto">
          {/* 标题区域 - 紧邻上方内容 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8"
          >
            <h2 
              className="text-2xl md:text-3xl font-bold mb-2"
              style={{ 
                fontFamily: "'Ma Shan Zheng', serif",
                color: '#1a1a1a',
                letterSpacing: '0.1em'
              }}
            >
              揭秘你的先天命格大运
            </h2>
            <p 
              className="text-base"
              style={{ color: '#555', fontFamily: "'ZCOOL XiaoWei', serif" }}
            >
              你先天是什么命格？注定富贵还是贫穷？
            </p>
          </motion.div>
          
          {/* 命格标签 - 水墨风格 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-10"
          >
            <div 
              className="p-6 rounded"
              style={{
                background: 'linear-gradient(180deg, #fafafa 0%, #f5f5f5 100%)',
                border: '2px solid #333',
                boxShadow: '0 0 0 3px #f5f5f5, 0 0 0 5px #666, 0 8px 30px rgba(0,0,0,0.15)'
              }}
            >
              <h3 
                className="text-lg font-bold text-center mb-2"
                style={{ fontFamily: "'Ma Shan Zheng', serif", color: '#2a2a2a' }}
              >
                揭晓你先天命运大运
              </h3>
              <p 
                className="text-center text-sm mb-5"
                style={{ color: '#555', fontFamily: "'ZCOOL XiaoWei', serif" }}
              >
                先天是什么命格？富贵还是贫穷
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {mingGeList.map((name, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.03 }}
                    className="px-4 py-2 rounded text-sm"
                    style={{
                      background: 'linear-gradient(135deg, #3a3a3a 0%, #2a2a2a 100%)',
                      color: '#f0f0f0',
                      border: '1px solid #555',
                      fontFamily: "'ZCOOL XiaoWei', serif"
                    }}
                  >
                    {name}
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
          
          {/* 四大服务 - 水墨卡片（使用书法字符图标） */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
            {[
              { Icon: IconMing, label: '八字排盘', desc: '四柱详解' },
              { Icon: IconYuan, label: '姻缘分析', desc: '正缘预测' },
              { Icon: IconCai, label: '财运解析', desc: '财富密码' },
              { Icon: IconYe, label: '事业指导', desc: '发展方向' },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
                className="text-center p-4 rounded-lg"
                style={{
                  background: 'linear-gradient(180deg, #fafafa 0%, #f0f0f0 100%)',
                  border: '1px solid #d0d0d0',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
                }}
              >
                <div className="w-10 h-10 mx-auto mb-2 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #f0f0f0 0%, #e0e0e0 100%)', border: '1px solid #c0c0c0' }}>
                  <item.Icon />
                </div>
                <h3 
                  className="font-bold text-base mb-1"
                  style={{ fontFamily: "'Ma Shan Zheng', serif", color: '#2a2a2a' }}
                >
                  {item.label}
                </h3>
                <p 
                  className="text-xs"
                  style={{ color: '#666', fontFamily: "'ZCOOL XiaoWei', serif" }}
                >
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* 人群痛点 Section - 灰色调 */}
      <section className="py-10 px-4" style={{ background: 'linear-gradient(180deg, #f0f0f0 0%, #e8e8e8 100%)' }}>
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8"
          >
            <h2 
              className="text-2xl md:text-3xl font-bold mb-2"
              style={{ 
                fontFamily: "'Ma Shan Zheng', serif",
                color: '#1a1a1a',
                letterSpacing: '0.1em'
              }}
            >
              哪类人群需要运势解析
            </h2>
            <p 
              className="text-base"
              style={{ color: '#555', fontFamily: "'ZCOOL XiaoWei', serif" }}
            >
              与其毫无头绪，不如"指南针式"解读
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {painPoints.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
                className="flex items-start gap-3 p-4 rounded-lg"
                style={{
                  background: 'linear-gradient(135deg, #fafafa 0%, #f5f5f5 100%)',
                  border: '1px solid #d0d0d0',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                }}
              >
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: 'linear-gradient(135deg, #f0f0f0 0%, #e0e0e0 100%)', border: '1px solid #c0c0c0' }}
                >
                  <item.icon size={24} />
                </div>
                <div>
                  <h3 
                    className="text-base font-bold mb-1"
                    style={{ fontFamily: "'Ma Shan Zheng', serif", color: '#2a2a2a' }}
                  >
                    {item.title}
                  </h3>
                  <p 
                    className="text-sm leading-relaxed"
                    style={{ color: '#555', fontFamily: "'ZCOOL XiaoWei', serif" }}
                  >
                    {item.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* 表单区域 */}
      <section id="form-section" className="py-12 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-md mx-auto"
        >
          <div 
            className="p-6 rounded"
            style={{
              background: 'linear-gradient(180deg, #fafafa 0%, #f5f5f5 100%)',
              border: '2px solid #333',
              boxShadow: '0 0 0 3px #f5f5f5, 0 0 0 5px #666, 0 8px 30px rgba(0,0,0,0.15)'
            }}
          >
            <h2 
              className="text-xl font-bold text-center mb-6"
              style={{ fontFamily: "'Ma Shan Zheng', serif", color: '#2a2a2a' }}
            >
              请输入测算所需信息
            </h2>
            
            <button
              onClick={onStart}
              className="w-full py-4 text-lg rounded"
              style={{
                fontFamily: "'Ma Shan Zheng', serif",
                letterSpacing: '0.15em',
                background: 'linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 100%)',
                color: '#f5f5f5',
                border: '2px solid #4a4a4a',
                boxShadow: '0 4px 15px rgba(0,0,0,0.3)'
              }}
            >
              开始测算
            </button>
            
            <p 
              className="text-center text-sm mt-4"
              style={{ color: '#666', fontFamily: "'ZCOOL XiaoWei', serif" }}
            >
              专业八字分析，助你洞察人生机遇
            </p>
          </div>
        </motion.div>
      </section>
      
      {/* 底部版权 */}
      <footer className="py-6 px-4 text-center" style={{ borderTop: '1px solid #d0d0d0' }}>
        <p 
          className="text-sm"
          style={{ color: '#666', fontFamily: "'ZCOOL XiaoWei', serif" }}
        >
          © 2026 柏诚文化传播有限公司 · 天机阁
        </p>
        <p 
          className="text-xs mt-1"
          style={{ color: '#888', fontFamily: "'ZCOOL XiaoWei', serif" }}
        >
          本测算结果仅供参考，请理性看待
        </p>
      </footer>
      
      {/* 底部固定按钮 - 水墨风格 */}
      {showBottomBtn && (
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-3"
        >
          <motion.button
            onClick={onStart}
            animate={{ scale: [1, 1.02, 1] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="w-full py-3 rounded"
            style={{
              fontFamily: "'Ma Shan Zheng', serif",
              letterSpacing: '0.2em',
              fontSize: '1.1rem',
              background: 'linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 100%)',
              color: '#f0f0f0',
              border: '2px solid #4a4a4a',
              boxShadow: '0 -4px 20px rgba(0,0,0,0.3)'
            }}
          >
            立即测算
          </motion.button>
        </motion.div>
      )}
    </div>
  );
}

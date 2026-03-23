import { motion } from 'framer-motion';
import { Bagua } from './Bagua';
import { ChevronDown, Sparkles, BookOpen, Heart, Coins, Briefcase, TrendingDown, Wallet, Users, Building } from 'lucide-react';
import { useState, useEffect } from 'react';

interface HomePageProps {
  onStart: () => void;
}

// 十种命格
const mingGeList = [
  { name: '正官格', color: 'bg-amber-700' },
  { name: '七杀格', color: 'bg-amber-700' },
  { name: '食神格', color: 'bg-amber-700' },
  { name: '伤官格', color: 'bg-amber-700' },
  { name: '正印格', color: 'bg-amber-700' },
  { name: '偏印格', color: 'bg-purple-700' },
  { name: '正财格', color: 'bg-amber-700' },
  { name: '偏财格', color: 'bg-amber-700' },
  { name: '建禄格', color: 'bg-amber-700' },
];

// 人群痛点
const painPoints = [
  {
    icon: TrendingDown,
    title: '运势较差',
    desc: '总觉得好运气都躲着走，想知道什么时候有好运气',
    bg: 'from-red-50 to-orange-50'
  },
  {
    icon: Wallet,
    title: '财运不济',
    desc: '赚钱赚不到，还经常破财，想要知晓发财时机',
    bg: 'from-yellow-50 to-amber-50'
  },
  {
    icon: Users,
    title: '感情困惑',
    desc: '感情里总是受挫的一方，面对感情毫无头绪',
    bg: 'from-pink-50 to-rose-50'
  },
  {
    icon: Building,
    title: '事业受阻',
    desc: '生意明明认真付出，总是失败想要事业方向',
    bg: 'from-blue-50 to-indigo-50'
  },
];

export function HomePage({ onStart }: HomePageProps) {
  const [showBottomBtn, setShowBottomBtn] = useState(true);

  const scrollToForm = () => {
    const formSection = document.getElementById('form-section');
    formSection?.scrollIntoView({ behavior: 'smooth' });
  };

  // 监听滚动，到表单区域时隐藏底部按钮
  useEffect(() => {
    const handleScroll = () => {
      const formSection = document.getElementById('form-section');
      if (formSection) {
        const rect = formSection.getBoundingClientRect();
        // 当表单区域进入视口时隐藏按钮
        setShowBottomBtn(rect.top > window.innerHeight - 100);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen pb-20">
      {/* 徽派建筑屋顶装饰 */}
      <div className="relative w-full h-24 overflow-hidden">
        {/* 天空背景 */}
        <div className="absolute inset-0 bg-gradient-to-b from-sky-100 to-sky-50" />
        
        {/* 远山 */}
        <div 
          className="absolute bottom-0 left-0 right-0 h-16 opacity-30"
          style={{
            background: `
              radial-gradient(ellipse 80px 40px at 10% 100%, #9CA3AF 0%, transparent 50%),
              radial-gradient(ellipse 100px 50px at 30% 100%, #9CA3AF 0%, transparent 50%),
              radial-gradient(ellipse 90px 45px at 55% 100%, #9CA3AF 0%, transparent 50%),
              radial-gradient(ellipse 85px 42px at 80% 100%, #9CA3AF 0%, transparent 50%)
            `
          }}
        />
        
        {/* 马头墙 - 徽派建筑特色 */}
        <div className="absolute bottom-0 left-0 right-0 flex justify-center items-end">
          {/* 左侧马头墙 */}
          <div className="relative">
            <div 
              className="w-20 h-16 bg-gradient-to-b from-gray-100 to-gray-200"
              style={{
                clipPath: 'polygon(0% 100%, 0% 40%, 20% 20%, 40% 40%, 40% 100%)'
              }}
            />
            {/* 墙顶黑瓦 */}
            <div 
              className="absolute top-0 left-0 w-20 h-4 bg-gray-800"
              style={{
                clipPath: 'polygon(0% 100%, 20% 20%, 40% 100%)'
              }}
            />
          </div>
          
          {/* 中间主建筑 */}
          <div className="relative mx-2">
            <div 
              className="w-32 h-20 bg-gradient-to-b from-gray-50 to-gray-200"
              style={{
                clipPath: 'polygon(0% 100%, 0% 30%, 15% 15%, 30% 30%, 30% 20%, 50% 0%, 70% 20%, 70% 30%, 85% 15%, 100% 30%, 100% 100%)'
              }}
            />
            {/* 主屋顶黑瓦 */}
            <div 
              className="absolute top-0 left-0 w-32 h-6 bg-gray-800"
              style={{
                clipPath: 'polygon(0% 100%, 15% 15%, 30% 100%, 30% 100%, 50% 0%, 70% 100%, 85% 15%, 100% 100%)'
              }}
            />
            {/* 屋檐装饰 */}
            <div className="absolute top-5 left-1/2 -translate-x-1/2 w-1 h-3 bg-gray-700" />
          </div>
          
          {/* 右侧马头墙 */}
          <div className="relative">
            <div 
              className="w-20 h-16 bg-gradient-to-b from-gray-100 to-gray-200"
              style={{
                clipPath: 'polygon(60% 100%, 60% 40%, 80% 20%, 100% 40%, 100% 100%)'
              }}
            />
            {/* 墙顶黑瓦 */}
            <div 
              className="absolute top-0 left-0 w-20 h-4 bg-gray-800"
              style={{
                clipPath: 'polygon(60% 100%, 80% 20%, 100% 100%)'
              }}
            />
          </div>
        </div>
        
        {/* 底部白墙 */}
        <div className="absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-r from-gray-100 via-white to-gray-100" />
      </div>

      {/* 首屏 Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-4 py-20">
        {/* 八卦背景 */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-20">
          <Bagua size={400} />
        </div>
        
        {/* 主标题 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="relative z-10 text-center"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-6"
          >
            <Bagua size={120} className="mx-auto" />
          </motion.div>
          
          <h1 className="font-serif text-5xl md:text-7xl font-bold text-gradient-gold mb-4 text-shadow">
            天机阁
          </h1>
          <p className="font-serif text-xl md:text-2xl text-ink-600 mb-2">
            八字命理 · 洞察天命
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-gold-600 to-transparent mx-auto mb-8" />
        </motion.div>
        
        {/* 痛点引导 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="relative z-10 max-w-2xl mx-auto text-center mb-12"
        >
          <div className="scroll-decoration p-8 mx-4">
            <h2 className="font-serif text-2xl font-bold text-cinnabar-800 mb-6">
              解答你的人生困惑
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
              {[
                '事业迷茫，不知何去何从？',
                '姻缘未到，正缘何时出现？',
                '财运起伏，如何把握机遇？',
                '健康隐患，如何趋吉避凶？',
              ].map((text, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                  className="flex items-center gap-3 p-3 rounded-lg bg-gold-50/50"
                >
                  <Sparkles className="w-5 h-5 text-gold-600 flex-shrink-0" />
                  <span className="text-ink-700">{text}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
        
        {/* CTA按钮 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="relative z-10"
        >
          <button
            onClick={scrollToForm}
            className="btn-primary text-xl px-12 py-5 animate-pulse-glow"
          >
            立即测算
          </button>
          <p className="text-ink-500 text-sm mt-4 text-center">
            已有 128,888 人获取命理分析
          </p>
        </motion.div>
        
        {/* 向下滚动提示 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="text-ink-400"
          >
            <ChevronDown className="w-8 h-8" />
          </motion.div>
        </motion.div>
      </section>
      
      {/* 服务介绍 Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-serif text-3xl font-bold text-ink-800 mb-4">
              揭秘你的先天命格大运
            </h2>
            <p className="text-ink-600">
              你先天是什么命格？注定富贵还是贫穷？
            </p>
          </motion.div>
          
          {/* 命格标签 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <div className="scroll-decoration p-8">
              <h3 className="font-serif text-xl font-bold text-center text-ink-800 mb-6">
                揭晓你先天命运大运
              </h3>
              <p className="text-center text-ink-600 mb-6">
                先天是什么命格？富贵还是贫穷
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                {mingGeList.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05 }}
                    className={`${item.color} text-white px-5 py-2.5 rounded-lg font-medium text-sm shadow-md`}
                  >
                    {item.name}
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
          
          {/* 四大服务 */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
            {[
              { icon: BookOpen, label: '八字排盘', desc: '四柱详解' },
              { icon: Heart, label: '姻缘分析', desc: '正缘预测' },
              { icon: Coins, label: '财运解析', desc: '财富密码' },
              { icon: Briefcase, label: '事业指导', desc: '发展方向' },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center p-6 rounded-xl bg-gradient-to-b from-gold-50 to-paper border border-gold-200"
              >
                <item.icon className="w-10 h-10 text-gold-600 mx-auto mb-3" />
                <h3 className="font-serif font-bold text-ink-800">{item.label}</h3>
                <p className="text-sm text-ink-500">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* 人群痛点 Section */}
      <section className="py-16 px-4 bg-gradient-to-b from-ink-50 to-paper">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-serif text-3xl font-bold text-ink-800 mb-4">
              哪类人群需要运势解析
            </h2>
            <p className="text-ink-600">
              与其毫无头绪，不如"指南针式"解读
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {painPoints.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`flex items-start gap-4 p-6 rounded-xl bg-gradient-to-r ${item.bg} border border-ink-100`}
              >
                <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-md flex-shrink-0">
                  <item.icon className="w-7 h-7 text-cinnabar-600" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-ink-800 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-ink-600 text-sm leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* 表单区域 */}
      <section id="form-section" className="py-20 px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-md mx-auto"
        >
          <div className="scroll-decoration p-8">
            <h2 className="font-serif text-2xl font-bold text-center text-cinnabar-800 mb-8">
              请输入测算所需信息
            </h2>
            
            <button
              onClick={onStart}
              className="btn-gold w-full text-lg"
            >
              开始测算
            </button>
            
            <p className="text-center text-ink-500 text-sm mt-6">
              专业八字分析，助你洞察人生机遇
            </p>
          </div>
        </motion.div>
      </section>
      
      {/* 底部版权 */}
      <footer className="py-8 px-4 text-center border-t border-ink-200">
        <p className="text-ink-500 text-sm">
          © 2026 柏诚文化传播有限公司 · 天机阁
        </p>
        <p className="text-ink-400 text-xs mt-2">
          本测算结果仅供参考，请理性看待
        </p>
      </footer>
      
      {/* 底部固定全宽按钮 - 传统牌匾风格 */}
      {showBottomBtn && (
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          className="fixed bottom-0 left-0 right-0 z-50 px-6 pb-4"
        >
          <motion.button
            onClick={scrollToForm}
            animate={{ 
              scale: [1, 1.02, 1],
            }}
            transition={{ 
              duration: 1.5, 
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="w-full relative"
            style={{
              clipPath: 'polygon(20px 0%, calc(100% - 20px) 0%, 100% 50%, calc(100% - 20px) 100%, 20px 100%, 0% 50%)'
            }}
          >
            {/* 外边框 - 红色镶边 */}
            <div 
              className="absolute inset-0 bg-gradient-to-r from-red-900 via-red-700 to-red-900"
              style={{
                clipPath: 'polygon(20px 0%, calc(100% - 20px) 0%, 100% 50%, calc(100% - 20px) 100%, 20px 100%, 0% 50%)'
              }}
            />
            
            {/* 内边框 - 金色 */}
            <div 
              className="absolute inset-[3px] bg-gradient-to-r from-yellow-600 via-yellow-400 to-yellow-600"
              style={{
                clipPath: 'polygon(19px 0%, calc(100% - 19px) 0%, 100% 50%, calc(100% - 19px) 100%, 19px 100%, 0% 50%)'
              }}
            />
            
            {/* 按钮主体 - 金色牌匾 */}
            <div 
              className="relative m-1.5 bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-200 py-4 overflow-hidden"
              style={{
                clipPath: 'polygon(18px 0%, calc(100% - 18px) 0%, 100% 50%, calc(100% - 18px) 100%, 18px 100%, 0% 50%)'
              }}
            >
              {/* 纹理质感 */}
              <div 
                className="absolute inset-0 opacity-30"
                style={{
                  backgroundImage: `
                    repeating-linear-gradient(
                      90deg,
                      transparent,
                      transparent 2px,
                      rgba(139,69,19,0.1) 2px,
                      rgba(139,69,19,0.1) 4px
                    )
                  `
                }}
              />
              
              {/* 光泽效果 */}
              <div className="absolute inset-0 bg-gradient-to-b from-white/60 via-transparent to-amber-600/20" />
              
              {/* 两端装饰 */}
              <div className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-8 border-2 border-red-800/30 rounded-sm transform -skew-x-12" />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-8 border-2 border-red-800/30 rounded-sm transform skew-x-12" />
              
              {/* 文字 */}
              <span className="relative z-10 text-2xl font-bold tracking-[0.2em] text-red-900 drop-shadow-sm font-serif">
                立即测算
              </span>
              
              {/* 底部阴影 */}
              <div className="absolute -bottom-2 left-12 right-12 h-4 bg-amber-600/30 blur-lg" />
            </div>
          </motion.button>
        </motion.div>
      )}
    </div>
  );
}

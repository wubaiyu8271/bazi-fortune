import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserInfo, FortuneResult } from '../types';
import { WechatGuide } from './WechatGuide';
import { ChevronLeft, ChevronDown, ChevronUp, Download, Share2, RefreshCw, CheckCircle } from 'lucide-react';

interface PaidResultPageProps {
  userInfo: UserInfo;
  result: FortuneResult;
  orderId: string;
  onBack: () => void;
}

interface SectionProps {
  title: string;
  icon: React.ReactNode;
  content: { summary: string; detail: string };
  defaultOpen?: boolean;
}

function AccordionSection({ title, icon, content, defaultOpen = false }: SectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="bg-white rounded-xl border border-ink-200 overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 hover:bg-ink-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gold-100 rounded-lg flex items-center justify-center text-gold-600">
            {icon}
          </div>
          <span className="font-serif font-bold text-ink-800">{title}</span>
        </div>
        {isOpen ? <ChevronUp className="w-5 h-5 text-ink-400" /> : <ChevronDown className="w-5 h-5 text-ink-400" />}
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="p-4 pt-0 border-t border-ink-100">
              <p className="text-ink-700 leading-relaxed whitespace-pre-line">
                {content.detail}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function PaidResultPage({ userInfo, result, orderId, onBack }: PaidResultPageProps) {
  const [showShareTip, setShowShareTip] = useState(false);

  const handleSave = () => {
    alert('演示模式：这里将生成PDF或图片供用户保存');
  };

  const handleShare = () => {
    setShowShareTip(true);
    setTimeout(() => setShowShareTip(false), 3000);
  };

  const sections = [
    {
      title: '性格深度解析',
      icon: <span className="text-xl">🧘</span>,
      content: result.personality,
      defaultOpen: true,
    },
    {
      title: '事业运势详解',
      icon: <span className="text-xl">💼</span>,
      content: result.career,
    },
    {
      title: '婚姻感情分析',
      icon: <span className="text-xl">💕</span>,
      content: result.marriage,
    },
    {
      title: '财运流年预测',
      icon: <span className="text-xl">💰</span>,
      content: result.wealth,
    },
    {
      title: '健康预警建议',
      icon: <span className="text-xl">🏥</span>,
      content: result.health,
    },
    {
      title: '2026流年大运',
      icon: <span className="text-xl">🔮</span>,
      content: result.liunian,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen py-8 px-4 pb-32"
    >
      {/* 返回按钮 */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-ink-600 hover:text-ink-800 mb-6 transition-colors"
      >
        <ChevronLeft className="w-5 h-5" />
        <span>返回首页</span>
      </button>

      <div className="max-w-lg mx-auto space-y-6">
        {/* 支付成功提示 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200"
        >
          <div className="flex items-center gap-3 mb-2">
            <CheckCircle className="w-8 h-8 text-green-500" />
            <div>
              <h2 className="font-serif text-xl font-bold text-green-800">已解锁完整命书</h2>
              <p className="text-green-600 text-sm">订单号：{orderId}</p>
            </div>
          </div>
        </motion.div>

        {/* 用户信息 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="scroll-decoration p-6"
        >
          <h3 className="font-serif text-lg font-bold text-ink-800 mb-4 text-center">
            {userInfo.name}的八字命盘
          </h3>
          <div className="grid grid-cols-4 gap-3 mb-4">
            {[
              { label: '年柱', value: result.bazi.yearPillar },
              { label: '月柱', value: result.bazi.monthPillar },
              { label: '日柱', value: result.bazi.dayPillar },
              { label: '时柱', value: result.bazi.hourPillar },
            ].map((pillar, index) => (
              <div key={index} className="text-center">
                <div className="text-xs text-ink-500 mb-1">{pillar.label}</div>
                <div className="bg-gold-50 rounded-lg py-2">
                  <span className="font-serif text-lg font-bold text-ink-800">{pillar.value}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center text-sm text-ink-600">
            <p>主导五行：<span className="font-bold text-cinnabar-700">{result.wuxing.dominant}</span></p>
            {result.wuxing.lacking && (
              <p className="mt-1">五行缺：<span className="font-bold text-cinnabar-700">{result.wuxing.lacking}</span></p>
            )}
          </div>
        </motion.div>

        {/* 命书内容 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          <h3 className="font-serif text-lg font-bold text-ink-800 text-center">
            完整命书解读
          </h3>
          
          {sections.map((section, index) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
            >
              <AccordionSection {...section} />
            </motion.div>
          ))}
        </motion.div>

        {/* 私域引流 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <WechatGuide
            title="📱 添加命理师微信"
            subtitle="一对一为您解答运势疑问"
          />
        </motion.div>

        {/* 操作按钮 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="flex gap-3"
        >
          <button
            onClick={handleSave}
            className="flex-1 flex items-center justify-center gap-2 py-3 bg-ink-100 text-ink-700 rounded-xl hover:bg-ink-200 transition-colors"
          >
            <Download className="w-5 h-5" />
            保存命书
          </button>
          <button
            onClick={handleShare}
            className="flex-1 flex items-center justify-center gap-2 py-3 bg-ink-100 text-ink-700 rounded-xl hover:bg-ink-200 transition-colors"
          >
            <Share2 className="w-5 h-5" />
            分享好友
          </button>
        </motion.div>

        {/* 重新测算 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="text-center"
        >
          <button
            onClick={onBack}
            className="flex items-center gap-2 mx-auto text-ink-500 hover:text-ink-700 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            为他人测算
          </button>
        </motion.div>

        {/* 分享提示 */}
        {showShareTip && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="fixed bottom-20 left-1/2 -translate-x-1/2 bg-ink-800 text-white px-6 py-3 rounded-full shadow-lg z-50"
          >
            演示模式：分享功能待接入
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

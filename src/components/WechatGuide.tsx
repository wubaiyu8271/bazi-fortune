import { motion } from 'framer-motion';
import { MessageCircle, Copy, Check } from 'lucide-react';
import { useState } from 'react';

interface WechatGuideProps {
  variant?: 'default' | 'compact' | 'payment';
  title?: string;
  subtitle?: string;
  benefits?: string[];
}

export function WechatGuide({ 
  variant = 'default',
  title = '添加天机阁主微信',
  subtitle = '一对一命理咨询服务',
  benefits
}: WechatGuideProps) {
  const [copied, setCopied] = useState(false);
  const wechatId = 'TJgezhu666';

  const handleCopy = () => {
    navigator.clipboard.writeText(wechatId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (variant === 'compact') {
    return (
      <div className="bg-gradient-to-r from-gold-50 to-cinnabar-50 rounded-xl p-4 border border-gold-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
            <MessageCircle className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-ink-800">想深入了解您的命盘？</p>
            <p className="text-xs text-ink-500">加微信领五行补救建议</p>
          </div>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 px-3 py-1.5 bg-green-500 text-white text-sm rounded-full hover:bg-green-600 transition-colors"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copied ? '已复制' : '复制'}
          </button>
        </div>
      </div>
    );
  }

  if (variant === 'payment') {
    return (
      <div className="bg-gradient-to-br from-gold-50 to-cinnabar-50 rounded-xl p-6 border-2 border-gold-300">
        <div className="text-center mb-4">
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3">
            <MessageCircle className="w-8 h-8 text-white" />
          </div>
          <h3 className="font-serif text-lg font-bold text-ink-800">支付遇到问题？</h3>
          <p className="text-sm text-ink-500 mt-1">或想先咨询再决定</p>
        </div>
        
        <div className="bg-white rounded-lg p-4 mb-4">
          <p className="text-sm text-ink-600 text-center mb-2">添加微信人工服务</p>
          <div className="flex items-center justify-center gap-2">
            <span className="font-mono text-lg font-bold text-ink-800">{wechatId}</span>
            <button
              onClick={handleCopy}
              className="p-2 hover:bg-ink-100 rounded-lg transition-colors"
            >
              {copied ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5 text-ink-400" />}
            </button>
          </div>
        </div>
        
        <div className="w-32 h-32 bg-white rounded-lg mx-auto flex items-center justify-center border-2 border-dashed border-ink-300">
          <span className="text-xs text-ink-400 text-center">二维码<br/>占位</span>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-gold-50 to-cinnabar-50 rounded-2xl p-6 border-2 border-gold-300"
    >
      <div className="text-center mb-6">
        <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
          <MessageCircle className="w-10 h-10 text-white" />
        </div>
        <h3 className="font-serif text-xl font-bold text-ink-800">{title}</h3>
        <p className="text-ink-500 mt-1">{subtitle}</p>
      </div>

      {benefits && benefits.length > 0 && (
        <div className="space-y-3 mb-6">
          {benefits.map((benefit, index) => (
            <div key={index} className="flex items-center gap-3">
              <div className="w-6 h-6 bg-gold-500 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white text-xs font-bold">{index + 1}</span>
              </div>
              <span className="text-ink-700">{benefit}</span>
            </div>
          ))}
        </div>
      )}

      <div className="bg-white rounded-xl p-4 mb-4">
        <p className="text-sm text-ink-500 text-center mb-2">微信号</p>
        <div className="flex items-center justify-center gap-3">
          <span className="font-mono text-2xl font-bold text-ink-800">{wechatId}</span>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 px-4 py-2 bg-gold-500 text-white rounded-lg hover:bg-gold-600 transition-colors"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copied ? '已复制' : '复制'}
          </button>
        </div>
      </div>

      <div className="w-40 h-40 bg-white rounded-xl mx-auto flex items-center justify-center border-2 border-dashed border-ink-300">
        <span className="text-sm text-ink-400 text-center">微信二维码<br/>占位区域<br/>（建议替换为真实二维码）</span>
      </div>

      <p className="text-center text-ink-400 text-sm mt-4">
        扫码添加，备注"天机阁"优先通过
      </p>
    </motion.div>
  );
}

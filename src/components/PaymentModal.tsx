import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PayPalScriptProvider, PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';
import { UserInfo, FortuneResult } from '../types';
import { X, Clock, Shield, CheckCircle } from 'lucide-react';

interface PaymentModalProps {
  userInfo: UserInfo;
  result: FortuneResult;
  onClose: () => void;
  onPaymentSuccess: () => void;
}

function PayPalCheckout({ userInfo, result, onSuccess, onClose }: {
  userInfo: UserInfo;
  result: FortuneResult;
  onSuccess: () => void;
  onClose: () => void;
}) {
  const [{ isPending, isRejected, isResolved }] = usePayPalScriptReducer();
  const [error, setError] = useState<string | null>(null);

  // 检查PayPal脚本加载状态
  useEffect(() => {
    console.log('PayPal脚本状态:', { isPending, isRejected, isResolved });
    if (isRejected) {
      setError('PayPal加载失败，请刷新页面重试');
    }
  }, [isPending, isRejected, isResolved]);

  // 使用PayPal SDK直接创建订单（不需要后端服务器）
  const createOrder = (_data: any, actions: any) => {
    console.log('开始创建PayPal订单...');
    return actions.order.create({
      purchase_units: [{
        amount: {
          currency_code: 'USD',
          value: '2.99',
        },
        description: '八字命理详批',
      }],
    }).then((orderID: string) => {
      console.log('订单创建成功:', orderID);
      return orderID;
    }).catch((err: any) => {
      console.error('创建订单失败:', err);
      alert('创建订单失败: ' + err.message);
      throw err;
    });
  };

  // 使用PayPal SDK直接捕获支付（不需要后端服务器）
  const onApprove = (data: any, actions: any) => {
    console.log('支付已批准，正在捕获...');
    return actions.order.capture().then((details: any) => {
      console.log('支付成功:', details);
      if (details.status === 'COMPLETED') {
        onSuccess();
      }
    }).catch((err: any) => {
      console.error('支付捕获失败:', err);
      alert('支付确认失败: ' + err.message);
    });
  };

  // 如果有错误，显示错误信息
  if (error) {
    return (
      <div className="text-center p-4">
        <p className="text-cinnabar-600 mb-2">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-cinnabar-600 text-white rounded-lg hover:bg-cinnabar-700"
        >
          刷新页面
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* PayPal按钮容器 */}
      <div className="paypal-button-container" style={{ minHeight: '50px' }}>
        <PayPalButtons
          style={{
            layout: 'vertical',
            color: 'gold',
            shape: 'rect',
            label: 'pay',
            height: 45
          }}
          disabled={false}
          forceReRender={[userInfo, result]}
          createOrder={createOrder}
          onApprove={onApprove}
          onError={(err) => {
            console.error('PayPal错误:', err);
            setError('支付初始化失败，请重试');
          }}
          onInit={(_data, _actions) => {
            console.log('PayPal按钮初始化完成');
          }}
          onClick={() => {
            console.log('PayPal按钮被点击');
          }}
        />
      </div>

      {/* 安全提示 */}
      <div className="flex items-center justify-center gap-4 text-ink-400 text-xs mt-4">
        <div className="flex items-center gap-1">
          <Shield className="w-3 h-3" />
          <span>PayPal买家保护</span>
        </div>
        <div className="flex items-center gap-1">
          <CheckCircle className="w-3 h-3" />
          <span>SSL加密</span>
        </div>
      </div>

      {/* 加载状态 */}
      {isPending && (
        <div className="text-center text-ink-400 text-sm">
          <div className="w-5 h-5 border-2 border-ink-300 border-t-cinnabar-600 rounded-full animate-spin mx-auto mb-2" />
          加载PayPal...
        </div>
      )}
    </div>
  );
}

export function PaymentModal({ userInfo, result, onClose, onPaymentSuccess }: PaymentModalProps) {
  const [timeLeft, setTimeLeft] = useState(30 * 60); // 30分钟倒计时

  // 倒计时
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          return 30 * 60; // 重置倒计时
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const getDayPillarText = () => {
    const dayGan = result.bazi.dayPillar[0];
    const wuxingMap: Record<string, string> = {
      '甲': '木', '乙': '木',
      '丙': '火', '丁': '火',
      '戊': '土', '己': '土',
      '庚': '金', '辛': '金',
      '壬': '水', '癸': '水'
    };
    return `${dayGan}${wuxingMap[dayGan] || ''}`;
  };

  // 使用环境变量或默认的Client ID
  const paypalClientId = (import.meta as any).env?.VITE_PAYPAL_CLIENT_ID || 'ASxlnI4dqQ78Lo8x5BnpEAFWomKUsMNDkzOAM0PMKR7IWT7w4gAh_ifuUE2tn7cUun3-Tam8oIRod8n0';
  
  console.log('PayPal Client ID:', paypalClientId?.substring(0, 10) + '...');

  return (
    <PayPalScriptProvider 
      options={{
        clientId: paypalClientId,
        currency: 'USD',
        intent: 'capture',
        'enable-funding': 'paypal',
        'disable-funding': 'card,credit,paylater',
      } as any}
    >
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end md:items-center justify-center"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="bg-paper w-full max-w-md rounded-t-3xl md:rounded-3xl p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 关闭按钮 */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-ink-100 transition-colors"
            >
              <X className="w-5 h-5 text-ink-500" />
            </button>

            {/* 标题 */}
            <div className="text-center mb-6">
              <h3 className="font-serif text-xl font-bold text-ink-800">
                {userInfo.name}的命理详批
              </h3>
              <p className="text-ink-500 text-sm mt-1">
                阳历：{userInfo.birthDate}
              </p>
            </div>

            {/* 八字信息卡片 */}
            <div className="bg-gradient-to-br from-gold-50 to-cinnabar-50 rounded-xl p-4 mb-6">
              <div className="text-center mb-3">
                <span className="font-serif text-lg font-bold text-cinnabar-800">
                  {result.bazi.yearPillar} {result.bazi.monthPillar} {result.bazi.dayPillar} {result.bazi.hourPillar}
                </span>
              </div>
              <div className="text-center text-sm text-ink-600">
                <p>先天格局：<span className="font-bold text-cinnabar-700">{getDayPillarText()}日主</span></p>
                <p className="mt-1">
                  命盘显示，2026年你的感情、事业、财运会出现
                  <span className="text-cinnabar-600 font-bold">重要变动</span>
                </p>
              </div>
            </div>

            {/* 价格和倒计时 */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-cinnabar-600">$2.99</span>
                  <span className="text-ink-400 line-through">$14.99</span>
                </div>
                <p className="text-gold-700 text-sm font-medium">限时结缘价</p>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1 text-cinnabar-600">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm">优惠结束仅剩</span>
                </div>
                <div className="font-mono text-xl font-bold text-cinnabar-700 bg-cinnabar-100 px-3 py-1 rounded-lg mt-1">
                  {formatTime(timeLeft)}
                </div>
              </div>
            </div>

            {/* PayPal支付按钮 */}
            <PayPalCheckout 
              userInfo={userInfo}
              result={result}
              onSuccess={onPaymentSuccess}
              onClose={onClose}
            />

            <p className="text-center text-ink-400 text-xs mt-4">
              8000字详细解读 · 天机阁主亲批
            </p>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </PayPalScriptProvider>
  );
}

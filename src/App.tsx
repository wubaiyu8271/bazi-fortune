import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clouds } from './components/Clouds';
import { HomePage } from './components/HomePage';
import { FormPage } from './components/FormPage';
import { LoadingPage } from './components/LoadingPage';
import { ResultPage } from './components/ResultPage';
import { PaidResultPage } from './components/PaidResultPage';
import { UserInfo, FortuneResult, PageState } from './types';
import { calculateBazi } from './utils/bazi';
import { getFortuneTemplate, isStrongBody } from './utils/fortuneTemplates';

// 模拟AI生成命理解读
async function generateFortuneResult(userInfo: UserInfo, bazi: ReturnType<typeof calculateBazi>): Promise<FortuneResult> {
  // 获取模板数据
  const dayGan = bazi.dayPillar[0] as '甲' | '乙' | '丙' | '丁' | '戊' | '己' | '庚' | '辛' | '壬' | '癸';
  const isStrong = isStrongBody(bazi.wuxing, dayGan);
  const template = getFortuneTemplate(dayGan, bazi.wuxing.lacking, isStrong);

  // 返回完整结果
  return {
    bazi: {
      yearPillar: bazi.yearPillar,
      monthPillar: bazi.monthPillar,
      dayPillar: bazi.dayPillar,
      hourPillar: bazi.hourPillar,
    },
    wuxing: {
      gold: bazi.wuxing.gold,
      wood: bazi.wuxing.wood,
      water: bazi.wuxing.water,
      fire: bazi.wuxing.fire,
      earth: bazi.wuxing.earth,
      dominant: bazi.wuxing.dominant,
      lacking: bazi.wuxing.lacking,
    },
    personality: template.personality,
    career: template.career,
    marriage: template.marriage,
    wealth: template.wealth,
    health: template.health,
    liunian: template.liunian,
  };
}

function App() {
  const [pageState, setPageState] = useState<PageState>('home');
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [fortuneResult, setFortuneResult] = useState<FortuneResult | null>(null);
  const [isPaid, setIsPaid] = useState(false);
  const [orderId, setOrderId] = useState('');

  const handleStart = () => {
    setPageState('form');
  };

  const handleSubmit = async (info: UserInfo) => {
    setUserInfo(info);
    setPageState('loading');

    // 计算八字
    const date = new Date(info.birthDate);
    const bazi = calculateBazi(
      date.getFullYear(),
      date.getMonth() + 1,
      date.getDate(),
      info.birthHour
    );

    // 生成AI解读（模拟）
    const result = await generateFortuneResult(info, bazi);
    setFortuneResult(result);
  };

  const handleLoadingComplete = () => {
    setPageState('result');
  };

  const handleBack = () => {
    setPageState('home');
    setUserInfo(null);
    setFortuneResult(null);
    setIsPaid(false);
    setOrderId('');
  };

  const handlePayment = () => {
    const newOrderId = 'TJ' + Date.now();
    setOrderId(newOrderId);
    setIsPaid(true);
    setPageState('paidResult');
  };

  return (
    <div className="min-h-screen bg-paper relative overflow-x-hidden">
      {/* 祥云背景 */}
      <Clouds />

      {/* 页面内容 */}
      <div className="relative z-10">
        <AnimatePresence mode="wait">
          {pageState === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <HomePage onStart={handleStart} />
            </motion.div>
          )}

          {pageState === 'form' && (
            <motion.div
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <FormPage onSubmit={handleSubmit} onBack={handleBack} />
            </motion.div>
          )}

          {pageState === 'loading' && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <LoadingPage onComplete={handleLoadingComplete} />
            </motion.div>
          )}

          {pageState === 'result' && userInfo && fortuneResult && (
            <motion.div
              key="result"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <ResultPage
                userInfo={userInfo}
                result={fortuneResult}
                onBack={handleBack}
                onPaymentSuccess={handlePayment}
              />
            </motion.div>
          )}

          {pageState === 'paidResult' && userInfo && fortuneResult && (
            <motion.div
              key="paidResult"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <PaidResultPage
                userInfo={userInfo}
                result={fortuneResult}
                orderId={orderId}
                onBack={handleBack}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default App;

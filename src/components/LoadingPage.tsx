import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Bagua } from './Bagua';

interface LoadingPageProps {
  onComplete: () => void;
}

const loadingSteps = [
  { text: '正在排四柱八字...', duration: 1500 },
  { text: '正在推算五行属性...', duration: 1500 },
  { text: '正在分析命格格局...', duration: 1500 },
  { text: '正在生成运势解读...', duration: 1500 },
];

export function LoadingPage({ onComplete }: LoadingPageProps) {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [displayText, setDisplayText] = useState(loadingSteps[0].text);

  useEffect(() => {
    const totalDuration = loadingSteps.reduce((sum, step) => sum + step.duration, 0);
    const interval = 50;
    const increment = 100 / (totalDuration / interval);
    
    const progressTimer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressTimer);
          return 100;
        }
        return prev + increment;
      });
    }, interval);

    let stepIndex = 0;
    let accumulatedTime = 0;
    
    const stepTimer = setInterval(() => {
      accumulatedTime += 100;
      
      if (stepIndex < loadingSteps.length - 1) {
        if (accumulatedTime >= loadingSteps.slice(0, stepIndex + 1).reduce((sum, s) => sum + s.duration, 0)) {
          stepIndex++;
          setCurrentStep(stepIndex);
          setDisplayText(loadingSteps[stepIndex].text);
        }
      }
    }, 100);

    const completeTimer = setTimeout(() => {
      onComplete();
    }, totalDuration + 500);

    return () => {
      clearInterval(progressTimer);
      clearInterval(stepTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen flex flex-col items-center justify-center px-4 py-20"
    >
      {/* 八卦动画 */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="mb-12"
      >
        <Bagua size={150} />
      </motion.div>

      {/* 标题 */}
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="font-serif text-2xl md:text-3xl font-bold text-ink-800 mb-8 text-center"
      >
        正在推演天机...
      </motion.h2>

      {/* 进度条容器 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="w-full max-w-md"
      >
        {/* 墨汁晕染进度条 */}
        <div className="relative h-4 bg-ink-200 rounded-full overflow-hidden mb-4">
          {/* 背景墨迹效果 */}
          <div 
            className="absolute inset-0 opacity-30"
            style={{
              background: 'radial-gradient(ellipse at center, rgba(120, 53, 15, 0.3) 0%, transparent 70%)',
            }}
          />
          
          {/* 进度填充 */}
          <motion.div
            className="absolute left-0 top-0 h-full rounded-full"
            style={{
              width: `${progress}%`,
              background: 'linear-gradient(90deg, #92400e 0%, #b45309 50%, #d97706 100%)',
              boxShadow: '0 0 20px rgba(217, 119, 6, 0.5)',
            }}
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.1 }}
          >
            {/* 墨滴效果 */}
            <motion.div
              className="absolute right-0 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full"
              style={{
                background: 'radial-gradient(circle at 30% 30%, #fbbf24, #92400e)',
                filter: 'blur(2px)',
              }}
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.8, 1, 0.8],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
              }}
            />
          </motion.div>
        </div>

        {/* 进度百分比 */}
        <div className="flex justify-between items-center mb-6">
          <span className="text-ink-500 text-sm">测算进度</span>
          <span className="font-serif text-xl font-bold text-gold-700">
            {Math.round(progress)}%
          </span>
        </div>

        {/* 当前步骤 */}
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <p className="text-ink-700 font-medium">{displayText}</p>
        </motion.div>

        {/* 步骤指示器 */}
        <div className="flex justify-center gap-2 mt-6">
          {loadingSteps.map((_, index) => (
            <motion.div
              key={index}
              className={`w-2 h-2 rounded-full ${
                index <= currentStep ? 'bg-gold-600' : 'bg-ink-300'
              }`}
              animate={{
                scale: index === currentStep ? [1, 1.3, 1] : 1,
              }}
              transition={{
                duration: 0.5,
                repeat: index === currentStep ? Infinity : 0,
              }}
            />
          ))}
        </div>
      </motion.div>

      {/* 底部提示 */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="text-ink-400 text-sm mt-12 text-center"
      >
        天机阁主正在为您精心推算，请稍候...
      </motion.p>
    </motion.div>
  );
}

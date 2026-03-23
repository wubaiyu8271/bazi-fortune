import { motion } from 'framer-motion';

export function Clouds() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {/* 祥云1 */}
      <motion.div
        className="absolute w-64 h-32 opacity-20"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(255,255,255,0.9) 0%, transparent 70%)',
          filter: 'blur(30px)',
          top: '10%',
          left: '-10%',
        }}
        animate={{
          x: [0, 100, 0],
          y: [0, -20, 0],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      
      {/* 祥云2 */}
      <motion.div
        className="absolute w-96 h-48 opacity-15"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(255,255,255,0.8) 0%, transparent 70%)',
          filter: 'blur(40px)',
          top: '30%',
          right: '-20%',
        }}
        animate={{
          x: [0, -80, 0],
          y: [0, 30, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 3,
        }}
      />
      
      {/* 祥云3 */}
      <motion.div
        className="absolute w-80 h-40 opacity-10"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(251, 191, 36, 0.6) 0%, transparent 70%)',
          filter: 'blur(35px)',
          bottom: '20%',
          left: '10%',
        }}
        animate={{
          x: [0, 60, 0],
          y: [0, -30, 0],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 6,
        }}
      />
      
      {/* 祥云4 */}
      <motion.div
        className="absolute w-72 h-36 opacity-15"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(185, 28, 28, 0.4) 0%, transparent 70%)',
          filter: 'blur(25px)',
          bottom: '40%',
          right: '20%',
        }}
        animate={{
          x: [0, -50, 0],
          y: [0, 20, 0],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 2,
        }}
      />
      
      {/* 水墨晕染背景 */}
      <div 
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `
            radial-gradient(circle at 20% 30%, rgba(120, 53, 15, 0.3) 0%, transparent 40%),
            radial-gradient(circle at 80% 70%, rgba(185, 28, 28, 0.2) 0%, transparent 35%),
            radial-gradient(circle at 50% 50%, rgba(0, 0, 0, 0.1) 0%, transparent 50%)
          `,
        }}
      />
    </div>
  );
}

import { motion } from 'framer-motion';

export function Bagua({ size = 200, className = '' }: { size?: number; className?: string }) {
  return (
    <motion.div
      className={`relative ${className}`}
      style={{ width: size, height: size }}
      animate={{ rotate: 360 }}
      transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
    >
      {/* 外圈 */}
      <svg
        viewBox="0 0 200 200"
        className="w-full h-full"
        style={{ filter: 'drop-shadow(0 0 20px rgba(217, 119, 6, 0.3))' }}
      >
        {/* 外圆 */}
        <circle
          cx="100"
          cy="100"
          r="95"
          fill="none"
          stroke="#b45309"
          strokeWidth="2"
        />
        
        {/* 八卦符号 */}
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, index) => {
          const trigrams = ['☰', '☱', '☲', '☳', '☴', '☵', '☶', '☷'];
          const rad = (angle * Math.PI) / 180;
          const x = 100 + 80 * Math.cos(rad);
          const y = 100 + 80 * Math.sin(rad);
          
          return (
            <text
              key={angle}
              x={x}
              y={y}
              textAnchor="middle"
              dominantBaseline="middle"
              fill="#92400e"
              fontSize="20"
              fontFamily="serif"
              transform={`rotate(${angle + 90}, ${x}, ${y})`}
            >
              {trigrams[index]}
            </text>
          );
        })}
        
        {/* 内圈装饰 */}
        <circle
          cx="100"
          cy="100"
          r="60"
          fill="none"
          stroke="#d97706"
          strokeWidth="1"
          strokeDasharray="5,5"
        />
        
        {/* 中心太极 */}
        <g transform="translate(70, 70)">
          <circle cx="30" cy="30" r="28" fill="#1a1a1a" />
          <path
            d="M30,2 A28,28 0 0,1 30,58 A14,14 0 0,1 30,30 A14,14 0 0,0 30,2"
            fill="#faf8f3"
          />
          <circle cx="30" cy="16" r="5" fill="#1a1a1a" />
          <circle cx="30" cy="44" r="5" fill="#faf8f3" />
        </g>
      </svg>
    </motion.div>
  );
}

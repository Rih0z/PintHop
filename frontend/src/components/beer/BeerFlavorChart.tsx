import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { motion } from 'framer-motion';
import { modernColors } from '../../styles/modern-design-system';

interface FlavorProfile {
  hoppy?: number;
  malty?: number;
  bitter?: number;
  sweet?: number;
  citrus?: number;
  roasted?: number;
  fruity?: number;
  spicy?: number;
}

interface BeerFlavorChartProps {
  flavorProfile: FlavorProfile;
  showLabels?: boolean;
  animated?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

/**
 * ビールフレーバープロファイルのレーダーチャート
 */
export const BeerFlavorChart: React.FC<BeerFlavorChartProps> = ({
  flavorProfile,
  showLabels = true,
  animated = true,
  size = 'md'
}) => {
  // フレーバーデータの準備
  const data = [
    { flavor: 'Hoppy', value: flavorProfile.hoppy || 0, fullMark: 10 },
    { flavor: 'Malty', value: flavorProfile.malty || 0, fullMark: 10 },
    { flavor: 'Bitter', value: flavorProfile.bitter || 0, fullMark: 10 },
    { flavor: 'Sweet', value: flavorProfile.sweet || 0, fullMark: 10 },
    { flavor: 'Citrus', value: flavorProfile.citrus || 0, fullMark: 10 },
    { flavor: 'Roasted', value: flavorProfile.roasted || 0, fullMark: 10 },
    { flavor: 'Fruity', value: flavorProfile.fruity || 0, fullMark: 10 },
    { flavor: 'Spicy', value: flavorProfile.spicy || 0, fullMark: 10 }
  ];

  const sizeMap = {
    sm: { width: 200, height: 200 },
    md: { width: 300, height: 300 },
    lg: { width: 400, height: 400 }
  };

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  return (
    <motion.div
      className="relative"
      variants={containerVariants}
      initial={animated ? "hidden" : "visible"}
      animate="visible"
    >
      <ResponsiveContainer width={sizeMap[size].width} height={sizeMap[size].height}>
        <RadarChart data={data}>
          <PolarGrid 
            stroke={modernColors.neutral[700]}
            strokeWidth={1}
            radialLines={false}
          />
          <PolarAngleAxis 
            dataKey="flavor"
            tick={{ fill: modernColors.neutral[300], fontSize: 12 }}
            className="font-medium"
          />
          <PolarRadiusAxis
            domain={[0, 10]}
            tick={false}
            axisLine={false}
          />
          <Radar
            name="Flavor Profile"
            dataKey="value"
            stroke={modernColors.primary[500]}
            fill={modernColors.primary[500]}
            fillOpacity={0.6}
            strokeWidth={2}
            animationDuration={animated ? 1500 : 0}
            animationEasing="ease-out"
          />
          <Tooltip
            contentStyle={{
              backgroundColor: modernColors.neutral[900],
              border: `1px solid ${modernColors.primary[500]}`,
              borderRadius: '8px',
              padding: '8px 12px'
            }}
            itemStyle={{ color: modernColors.neutral[100] }}
            labelStyle={{ color: modernColors.neutral[200] }}
          />
        </RadarChart>
      </ResponsiveContainer>

      {/* フレーバー強度インジケーター */}
      {showLabels && (
        <div className="absolute bottom-0 left-0 right-0 flex justify-center gap-2 mt-4">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-amber-500/20" />
            <span className="text-xs text-gray-400">Mild</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-amber-500/60" />
            <span className="text-xs text-gray-400">Medium</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-amber-500" />
            <span className="text-xs text-gray-400">Strong</span>
          </div>
        </div>
      )}
    </motion.div>
  );
};

/**
 * IBU（苦味）メーター
 */
export const IBUMeter: React.FC<{
  ibu: number;
  maxIBU?: number;
  showScale?: boolean;
}> = ({ ibu, maxIBU = 120, showScale = true }) => {
  const percentage = (ibu / maxIBU) * 100;
  
  // 苦味レベルの判定
  const getBitternessLevel = (ibu: number) => {
    if (ibu < 20) return { label: 'Mild', color: modernColors.accent.green[400] };
    if (ibu < 40) return { label: 'Moderate', color: modernColors.primary[400] };
    if (ibu < 60) return { label: 'Hoppy', color: modernColors.primary[500] };
    if (ibu < 80) return { label: 'Very Hoppy', color: modernColors.primary[600] };
    return { label: 'Extreme', color: modernColors.primary[700] };
  };

  const bitternessLevel = getBitternessLevel(ibu);

  return (
    <div className="w-full">
      <div className="flex justify-between items-baseline mb-2">
        <span className="text-sm font-medium text-gray-300">IBU</span>
        <span className="text-2xl font-bold" style={{ color: bitternessLevel.color }}>
          {ibu}
        </span>
      </div>
      
      {/* メーターバー */}
      <div className="relative h-8 bg-gray-900/50 rounded-full overflow-hidden">
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full"
          style={{
            background: `linear-gradient(to right, ${modernColors.accent.green[400]}, ${bitternessLevel.color})`,
          }}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          {/* ホップのテクスチャ */}
          <div className="absolute inset-0 opacity-30">
            <div className="h-full w-full bg-repeat-x" 
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='10' cy='10' r='3' fill='white'/%3E%3C/svg%3E")`,
                backgroundSize: '20px 20px'
              }}
            />
          </div>
        </motion.div>
      </div>
      
      {/* ビタネスレベル表示 */}
      <div className="mt-2 text-center">
        <span className="text-sm font-medium" style={{ color: bitternessLevel.color }}>
          {bitternessLevel.label}
        </span>
      </div>
      
      {/* スケール表示 */}
      {showScale && (
        <div className="flex justify-between mt-1 text-xs text-gray-500">
          <span>0</span>
          <span>40</span>
          <span>80</span>
          <span>120</span>
        </div>
      )}
    </div>
  );
};

/**
 * ABV（アルコール度数）ゲージ
 */
export const ABVGauge: React.FC<{
  abv: number;
  style: string;
}> = ({ abv, style }) => {
  // スタイル別の典型的なABV範囲
  const getStyleRange = (style: string): { min: number; max: number; optimal: number } => {
    const styleRanges: { [key: string]: { min: number; max: number; optimal: number } } = {
      'Light Lager': { min: 3.5, max: 5.0, optimal: 4.2 },
      'IPA': { min: 5.5, max: 7.5, optimal: 6.5 },
      'Stout': { min: 4.5, max: 8.0, optimal: 6.0 },
      'Belgian Tripel': { min: 7.5, max: 12.0, optimal: 9.0 },
      'Imperial Stout': { min: 8.0, max: 14.0, optimal: 10.0 },
    };
    return styleRanges[style] || { min: 4.0, max: 7.0, optimal: 5.5 };
  };

  const range = getStyleRange(style);
  const isInRange = abv >= range.min && abv <= range.max;

  return (
    <div className="relative">
      <div className="text-center mb-2">
        <span className="text-3xl font-bold text-amber-500">{abv}%</span>
        <span className="text-sm text-gray-400 ml-2">ABV</span>
      </div>
      
      {/* ビールグラスの形のゲージ */}
      <svg width="120" height="140" viewBox="0 0 120 140" className="mx-auto">
        {/* グラスの輪郭 */}
        <path
          d="M30 30 Q30 10 40 10 L80 10 Q90 10 90 30 L85 110 Q85 120 75 120 L45 120 Q35 120 35 110 Z"
          fill="none"
          stroke={modernColors.neutral[700]}
          strokeWidth="2"
        />
        
        {/* ビールの液体 */}
        <motion.path
          d={`M35 ${120 - (abv / 15) * 100} L35 115 Q35 120 45 120 L75 120 Q85 120 85 115 L85 ${120 - (abv / 15) * 100}`}
          fill={isInRange ? modernColors.primary[500] : modernColors.accent.red[400]}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 0.8, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
        
        {/* 泡 */}
        <motion.ellipse
          cx="60"
          cy={120 - (abv / 15) * 100}
          rx="25"
          ry="5"
          fill={modernColors.neutral[200]}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        />
      </svg>
      
      {/* スタイル範囲表示 */}
      <div className="mt-4 text-center">
        <p className="text-xs text-gray-500">
          {style} typical range: {range.min}-{range.max}%
        </p>
        {!isInRange && (
          <p className="text-xs text-amber-500 mt-1">
            Outside typical range
          </p>
        )}
      </div>
    </div>
  );
};

export default {
  BeerFlavorChart,
  IBUMeter,
  ABVGauge
};
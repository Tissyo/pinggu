
import React from 'react';

interface RadarData {
  label: string;
  value: number; // 0 to 100
}

interface Props {
  data: RadarData[];
  size?: number;
}

const RadarChart: React.FC<Props> = ({ data, size = 300 }) => {
  const center = size / 2;
  const radius = (size / 2) * 0.7;
  const numAxes = data.length;

  // Calculate vertex coordinates
  const points = data.map((d, i) => {
    const angle = (Math.PI * 2 * i) / numAxes - Math.PI / 2;
    const r = (radius * d.value) / 100;
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle),
    };
  });

  const polygonPath = points.map(p => `${p.x},${p.y}`).join(' ');

  // Grid lines (concentric polygons)
  const gridLevels = [25, 50, 75, 100];

  return (
    <div className="flex flex-col items-center">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="overflow-visible">
        {/* Background Grids */}
        {gridLevels.map(level => (
          <polygon
            key={level}
            points={data.map((_, i) => {
              const angle = (Math.PI * 2 * i) / numAxes - Math.PI / 2;
              const r = (radius * level) / 100;
              return `${center + r * Math.cos(angle)},${center + r * Math.sin(angle)}`;
            }).join(' ')}
            fill="none"
            stroke="#e2e8f0"
            strokeWidth="1"
          />
        ))}

        {/* Axis lines */}
        {data.map((_, i) => {
          const angle = (Math.PI * 2 * i) / numAxes - Math.PI / 2;
          return (
            <line
              key={i}
              x1={center}
              y1={center}
              x2={center + radius * Math.cos(angle)}
              y2={center + radius * Math.sin(angle)}
              stroke="#e2e8f0"
              strokeWidth="1"
            />
          );
        })}

        {/* Data polygon */}
        <polygon
          points={polygonPath}
          fill="rgba(13, 148, 136, 0.2)"
          stroke="#0d9488"
          strokeWidth="2"
          className="transition-all duration-500 ease-in-out"
        />

        {/* Data points */}
        {points.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="4" fill="#0d9488" />
        ))}

        {/* Labels */}
        {data.map((d, i) => {
          const angle = (Math.PI * 2 * i) / numAxes - Math.PI / 2;
          const labelR = radius + 25;
          const x = center + labelR * Math.cos(angle);
          const y = center + labelR * Math.sin(angle);
          return (
            <text
              key={i}
              x={x}
              y={y}
              textAnchor="middle"
              alignmentBaseline="middle"
              className="text-[12px] font-bold fill-slate-600"
            >
              {d.label}
            </text>
          );
        })}
      </svg>
    </div>
  );
};

export default RadarChart;

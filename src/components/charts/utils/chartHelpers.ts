const RADIAN = Math.PI / 180;

interface PieChartLabelProps {
  cx: number;
  cy: number;
  midAngle: number;
  innerRadius: number;
  outerRadius: number;
  percent: number;
}

export const renderPieChartLabel = ({ 
  cx, 
  cy, 
  midAngle, 
  innerRadius, 
  outerRadius, 
  percent 
}: PieChartLabelProps) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  // Return the properties object instead of JSX
  return {
    x,
    y,
    fill: 'white',
    textAnchor: x > cx ? 'start' : 'end',
    dominantBaseline: 'central',
    content: `${(percent * 100).toFixed(0)}%`
  };
};
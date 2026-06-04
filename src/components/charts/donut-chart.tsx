import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'

interface DonutChartProps {
  percentage: number
  color?: string
  size?: number
  strokeWidth?: number
}

export function DonutChart({
  percentage,
  color = '#2970FF',
  size = 160,
  strokeWidth = 18,
}: DonutChartProps) {
  const data = [
    { value: percentage },
    { value: 100 - percentage },
  ]

  const innerRadius = (size / 2) - strokeWidth - 4
  const outerRadius = (size / 2) - 4

  return (
    <div style={{ width: size, height: size }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={innerRadius}
            outerRadius={outerRadius}
            startAngle={90}
            endAngle={-270}
            dataKey="value"
            strokeWidth={0}
          >
            <Cell fill={color} />
            <Cell fill="var(--bg-secondary-hover)" />
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

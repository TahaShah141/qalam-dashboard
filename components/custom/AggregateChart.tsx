import { BarChart, YAxis, XAxis, Bar, LabelList } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "../ui/chart"
import { CourseGradeBookType } from "@/lib/types"
import { getWeightedAverages } from "@/lib/utils"

type AggregateChartProps = {
  selectedData: string
  grades: CourseGradeBookType
}

export const AggregateChart = ({selectedData, grades}: AggregateChartProps) => {

  const chartConfig = {
    obtained: {
      label: "Obtained",
      color: "#e5e5e5",
    },
    average: {
      label: "Average",
      color: "#525252",
    },
  } satisfies ChartConfig

  const data = grades.find(g => g.name === selectedData)!
  const { average: averageAggregate, obtained: obtainedAggregate } = getWeightedAverages(data)

  console.log({averageAggregate, obtainedAggregate})

  const chartData = [
    { type: "Obtained", "%age": +((obtainedAggregate*100).toFixed(2)), fill: "var(--color-obtained)" },
    { type: "Average", "%age": +((averageAggregate*100).toFixed(2)), fill: "var(--color-average)"},
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Aggregate
        </CardTitle>
        <CardDescription>
          {`Aggregate for the ${selectedData} component`}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer layout="vertical" data={chartData}>
            <YAxis 
              width={65}
              dataKey={"type"}
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <XAxis
              type="number"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <ChartTooltip 
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Bar dataKey="%age" layout="vertical" radius={5} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

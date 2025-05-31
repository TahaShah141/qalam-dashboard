import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card"

import { GradingComponentType } from "@/lib/types"
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "../ui/chart"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { Label } from "../ui/label"

export const GradingComponentCard = ({name, weight, components}: GradingComponentType) => {

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

  const chartData = components.map(({name, obtainedMarks, averageMarks, maxMarks}) => ({
    name,
    obtained: Math.round((obtainedMarks/maxMarks)*1000) / 10,
    average: Math.round((averageMarks/maxMarks)*1000) / 10
  })).filter(d => d.average !== 0)

  const totalObtained = chartData.reduce((acc, curr) => acc + curr.obtained, 0);
  const totalAverage = chartData.reduce((acc, curr) => acc + curr.average, 0);

  if (chartData.length < 1) return null

  return (
    <Card className="flex-1">
      <CardHeader>
        <CardTitle>
          {name}
        </CardTitle>
        <CardDescription>
          {`${weight}% weightage`}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <YAxis
              width={25}
              tickLine={false}
              tickMargin={0}
              axisLine={false}
            />
            <XAxis
              dataKey={"name"}
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value, i) => chartData.length <= 6 ? value : `${i+1}`}
            />
            <ChartTooltip 
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Bar className="w-[40px]" dataKey="obtained" fill="var(--color-obtained)" radius={chartData.length <= 6 ? 2 : 0} />
            <Bar dataKey="average" fill="var(--color-average)" radius={chartData.length <= 6 ? 2 : 0} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex flex-wrap gap-2 justify-between">
        <div className="flex gap-2 items-center p-2 rounded-md bg-secondary">
          <Label className="font-bold">Obtained</Label>
          <Label>{`${(totalObtained / chartData.length).toFixed(2)}%`}</Label>
        </div>          
        <div className="flex gap-2 items-center p-2 rounded-md bg-secondary">
          <Label className="font-bold">Average</Label>
          <Label>{`${(totalAverage / chartData.length).toFixed(2)}%`}</Label>
        </div>          
      </CardFooter>
    </Card>
  )
}

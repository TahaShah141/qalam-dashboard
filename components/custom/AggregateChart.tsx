import { BarChart, YAxis, XAxis, Bar } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "../ui/chart"
import { CourseGradeBookType } from "@/lib/types"
import { getOverallData, getWeightedAverages } from "@/lib/utils"
import { DropdownMenu, DropdownMenuContent, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuTrigger } from "../ui/dropdown-menu"
import { buttonVariants } from "../ui/button"
import { useEffect, useState } from "react"
import { Label } from "@radix-ui/react-label"

type AggregateChartProps = {
  containsLab: boolean
  selectedData: string
  grades: CourseGradeBookType
}

export const AggregateChart = ({containsLab, selectedData, grades}: AggregateChartProps) => {

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

  const [dataKey, setDataKey] = useState(selectedData)
  useEffect(() => {
    setDataKey(selectedData)
  }, [selectedData])

  const data = dataKey !== "Overall" ? grades.find(g => g.name === selectedData)! : getOverallData(grades)
  const { average: averageAggregate, obtained: obtainedAggregate } = getWeightedAverages(data)

  const chartData = [
    { type: "Obtained", "%age": +((obtainedAggregate*100).toFixed(2)), fill: "var(--color-obtained)" },
    { type: "Average", "%age": +((averageAggregate*100).toFixed(2)), fill: "var(--color-average)"},
  ]

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <CardTitle>
            Aggregate
          </CardTitle>
          {containsLab && 
          <DropdownMenu>
            <DropdownMenuTrigger className={`${buttonVariants({variant: "secondary", size: "smlg"})} font-bold text-xs capitalize w-24`}>
              <svg className="size-3" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m7 15l5 5l5-5M7 9l5-5l5 5"/></svg>
              <Label>{dataKey}</Label>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuRadioGroup value={dataKey} onValueChange={(v) => setDataKey(v)}>
                {[selectedData, "Overall"].map((type) => (
                  <DropdownMenuRadioItem key={type} value={type}>
                    {type}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>}
        </div>
        <CardDescription>
          {`Aggregate for the ${containsLab ? `${dataKey} ${dataKey === "Overall" ? "Course" : "component"}` : "Overall Course"}`}
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

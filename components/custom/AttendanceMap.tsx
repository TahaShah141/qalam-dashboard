import { HoverCard, HoverCardContent, HoverCardTrigger } from "../ui/hover-card"

import { AttendanceListType } from "@/lib/types"
import { formatDate } from "date-fns"
import { useState } from "react"

type AttendanceMapProps = {
  heading?: string
  horizontal: boolean
  totalClasses: number
  attendances: AttendanceListType
}

export const AttendanceMap = ({attendances, heading="", horizontal, totalClasses}: AttendanceMapProps) => {

  const getAttendanceColor = (i: number): string => {
    if (i >= attendances.length) return "from-neutral-700 to-black border-neutral-800"
    return attendances[i].isPresent ? "from-green-700 to-black border-green-500" : "from-red-700 to-black border-red-500"
  } 

  const [dateOpen, setDateOpen] = useState(-1)
  
  return (
    <div className={`grid ${horizontal ? "" : "grid-rows-3 grid-flow-col"} w-fit gap-1.5 rounded`} style={{ gridTemplateColumns: `repeat(16, minmax(0, 1fr))` }}>
      {Array.from({length: totalClasses}, (_, i) => (
        <HoverCard key={i} openDelay={1000} open={dateOpen === i} onOpenChange={() => {}}>
          <HoverCardTrigger onMouseEnter={() => setDateOpen(d => i)} onMouseLeave={() => setTimeout(() => setDateOpen(d => d === i ? -1 : d), 250)} onClick={() => setDateOpen(d => d === i ? -1 : i)} className="underline">
            <div className={`size-7 rounded-sm border-2 shadow bg-gradient-to-br ${getAttendanceColor(i)}`} />
          </HoverCardTrigger>
          <HoverCardContent className="w-fit">
            {i < attendances.length ? formatDate(attendances[i].date, "do MMM") : "TBD"}
          </HoverCardContent>
        </HoverCard>
      ))}
    </div>
  )
}

import { HoverCard, HoverCardContent, HoverCardTrigger } from "../ui/hover-card"
import { useEffect, useState } from "react"

import { AttendanceListType } from "@/lib/types"
import { formatDate } from "date-fns"

type AttendanceMapProps = {
  horizontal: boolean
  rows: number
  attendances: AttendanceListType
}

export const AttendanceMap = ({attendances, horizontal, rows}: AttendanceMapProps) => {

  const totalClasses = rows * 16

  const getAttendanceColor = (i: number): string => {
    // if (i >= attendances.length) return "from-neutral-700 to-black border-neutral-800"
    // return attendances[i].isPresent ? "from-green-700 to-black border-green-500" : "from-red-700 to-black border-red-500"
    if (i >= attendances.length) return "bg-secondary/50 border-black"
    return attendances[i].isPresent ? "bg-primary border-black" : "bg-primary/50 border-black"
  } 

  const [dateOpen, setDateOpen] = useState(-1)
  const [visibleCount, setVisibleCount] = useState(0);

  useEffect(() => {
    setVisibleCount(0)
  }, [totalClasses, attendances])

  useEffect(() => {
    if (visibleCount < totalClasses) {
      const timeout = setTimeout(() => {
        setVisibleCount(visibleCount + 1);
      }, 10);
      return () => clearTimeout(timeout);
    }
  }, [visibleCount, totalClasses]);
  
  return (
    <div className={`grid ${horizontal ? "" : "grid-rows-3 grid-flow-col"} w-fit gap-1 sm:gap-1.5`} style={{ gridTemplateColumns: `repeat(16, minmax(0, 1fr))`, gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))` }}>
      {Array.from({length: totalClasses}, (_, i) => (
        <HoverCard key={i} openDelay={1000} open={dateOpen === i} onOpenChange={() => {}}>
          <HoverCardTrigger onMouseEnter={() => setDateOpen(d => d ? i : i)} onMouseLeave={() => setTimeout(() => setDateOpen(d => d === i ? -1 : d), 250)} onClick={() => setDateOpen(d => d === i ? -1 : i)} className="underline">
            <div className={`size-4 min-[450px]:size-5 sm:size-7 md:size-6 lg:size-7 rounded-xs sm:rounded-sm border sm:border-2 shadow bg-gradient-to-br transition-opacity duration-300 ${getAttendanceColor(i)} ${i < visibleCount ? 'opacity-100' : 'opacity-0'}`} />
          </HoverCardTrigger>
          <HoverCardContent className="w-fit">
            {i < attendances.length ? formatDate(attendances[i].date, "do MMM") : "TBD"}
          </HoverCardContent>
        </HoverCard>
      ))}
    </div>
  )
}

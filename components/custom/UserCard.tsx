import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { Button, buttonVariants } from "../ui/button"
import { Card, CardContent, CardDescription, CardTitle } from "../ui/card"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"

import { Label } from "../ui/label"
import { UserType } from "@/lib/types"

type UserCardProps = UserType & {
  onReload: () => void
  lastUpdated: string
}


export const UserCard = ({name, cms, department, pfp, onReload, lastUpdated}: UserCardProps) => {
  
  const PopoverOptions = () => {
    return (
      <Popover>
        <PopoverTrigger className={buttonVariants({variant: "ghost", size: "icon"})}>
          <svg className="size-4" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></g></svg>
        </PopoverTrigger>
        <PopoverContent className="flex flex-col gap-2 p-0 w-min">
          <Button onClick={() => {localStorage.clear(); location.reload();}} variant={"ghost"}>
            <svg className="size-4" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m16 17l5-5l-5-5m5 5H9m0 9H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/></svg>
            Logout
          </Button>
          <Button onClick={onReload} variant={"ghost"}>
            <svg className="size-4" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M12 17q-1.825 0-3.187-1.137T7.1 13h1.55q.325 1.1 1.238 1.8t2.112.7q1.45 0 2.475-1.025T15.5 12t-1.025-2.475T12 8.5q-.725 0-1.35.263t-1.1.737H11V11H7V7h1.5v1.425q.675-.65 1.575-1.037T12 7q2.075 0 3.538 1.463T17 12t-1.463 3.538T12 17m-7 4q-.825 0-1.412-.587T3 19v-4h2v4h4v2zm10 0v-2h4v-4h2v4q0 .825-.587 1.413T19 21zM3 9V5q0-.825.588-1.412T5 3h4v2H5v4zm16 0V5h-4V3h4q.825 0 1.413.588T21 5v4z"/></svg>
            Reload
          </Button>
        </PopoverContent>
      </Popover>
    )
  }

  return (
    <Card>
      <CardContent className="flex flex-wrap gap-4 justify-between items-center">
        <div className="flex gap-4 items-center">
          <Avatar className="size-20">
            <AvatarImage src={pfp} alt={"pfp"}/>
            <AvatarFallback>TS</AvatarFallback>
          </Avatar>
          <div className="flex flex-col gap-2 justify-center">
            <CardTitle>{name}</CardTitle>
            <CardDescription>{cms}</CardDescription>
            <CardDescription>{department}</CardDescription>
          </div>
        </div>
        <div className="hidden md:flex gap-2 items-center">
          <div className="flex flex-col gap-2">
            <Label className="gap-0">
              Last Updated
              <Button onClick={onReload} variant={"ghost"} size={"icon"} className="size-6 p-1">
                <svg className="size-full" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M12.077 19q-2.931 0-4.966-2.033q-2.034-2.034-2.034-4.964t2.034-4.966T12.077 5q1.783 0 3.339.847q1.555.847 2.507 2.365V5.5q0-.213.144-.356T18.424 5t.356.144t.143.356v3.923q0 .343-.232.576t-.576.232h-3.923q-.212 0-.356-.144t-.144-.357t.144-.356t.356-.143h3.2q-.78-1.496-2.197-2.364Q13.78 6 12.077 6q-2.5 0-4.25 1.75T6.077 12t1.75 4.25t4.25 1.75q1.787 0 3.271-.968q1.485-.969 2.202-2.573q.085-.196.274-.275q.19-.08.388-.013q.211.067.28.275t-.015.404q-.833 1.885-2.56 3.017T12.077 19"/></svg>
              </Button>
            </Label>
            <Label className="text-muted-foreground">{lastUpdated}</Label>
          </div>
          <PopoverOptions />
        </div>
        <div className="absolute md:hidden top-6 right-6 text-muted-foreground">
          <PopoverOptions />
        </div>
      </CardContent>
    </Card>
  )
}

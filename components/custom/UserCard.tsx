import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { Card, CardContent, CardDescription, CardTitle } from "../ui/card"

import { Button } from "../ui/button"
import { Label } from "../ui/label"
import { UserType } from "@/lib/types"

type UserCardProps = UserType & {
  onReload: () => void
  lastUpdated: string
}

export const UserCard = ({name, cms, department, pfp, onReload, lastUpdated}: UserCardProps) => {
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
        <div className="hidden md:flex flex-col gap-2">
          <Label className="gap-0">
            Last Updated
            <Button onClick={onReload} variant={"ghost"} size={"icon"} className="size-6 p-1">
              <svg className="size-full" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M12.077 19q-2.931 0-4.966-2.033q-2.034-2.034-2.034-4.964t2.034-4.966T12.077 5q1.783 0 3.339.847q1.555.847 2.507 2.365V5.5q0-.213.144-.356T18.424 5t.356.144t.143.356v3.923q0 .343-.232.576t-.576.232h-3.923q-.212 0-.356-.144t-.144-.357t.144-.356t.356-.143h3.2q-.78-1.496-2.197-2.364Q13.78 6 12.077 6q-2.5 0-4.25 1.75T6.077 12t1.75 4.25t4.25 1.75q1.787 0 3.271-.968q1.485-.969 2.202-2.573q.085-.196.274-.275q.19-.08.388-.013q.211.067.28.275t-.015.404q-.833 1.885-2.56 3.017T12.077 19"/></svg>
            </Button>
          </Label>
          <Label className="text-muted-foreground">{lastUpdated}</Label>
        </div>
        <div className="absolute md:hidden top-8 right-8 text-muted-foreground">
          <Button onClick={onReload} variant={"ghost"} size={"icon"} className="p-1">
            <svg className="size-full" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M12.077 19q-2.931 0-4.966-2.033q-2.034-2.034-2.034-4.964t2.034-4.966T12.077 5q1.783 0 3.339.847q1.555.847 2.507 2.365V5.5q0-.213.144-.356T18.424 5t.356.144t.143.356v3.923q0 .343-.232.576t-.576.232h-3.923q-.212 0-.356-.144t-.144-.357t.144-.356t.356-.143h3.2q-.78-1.496-2.197-2.364Q13.78 6 12.077 6q-2.5 0-4.25 1.75T6.077 12t1.75 4.25t4.25 1.75q1.787 0 3.271-.968q1.485-.969 2.202-2.573q.085-.196.274-.275q.19-.08.388-.013q.211.067.28.275t-.015.404q-.833 1.885-2.56 3.017T12.077 19"/></svg>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

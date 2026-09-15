import { ReactNode } from "react"
import AppSidebar from "./AppSidebar"
import { Card, CardContent } from "../ui/card"

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <AppSidebar />
      {/* <main className="flex-1">
        <div className="flex flex-col gap-6 p-6">
          <div className="flex flex-row items-center gap-6">
            <Card className="w-full rounded-[14px] shadow-sm">
              <CardContent>
                <div className="h-[984px] w-full rounded-[14px] border border-border bg-background" >
                {children}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main> */}
      <main className="flex-1 min-w-0 overflow-auto">{children}</main>
    </div>
  )
}

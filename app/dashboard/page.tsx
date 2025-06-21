// import { AppSidebar } from "@/components/app-sidebar"
// import { ChartAreaInteractive } from "@/components/chart-area-interactive"
// import { DataTable } from "@/components/data-table"
// import data from "./data.json"
// import {
//   // SidebarInset,
//   // SidebarProvider,
// } from "@/components/ui/sidebar"
import { SectionCards } from "@/components/section-cards"
import { SiteHeader } from "@/components/site-header"


export default function Page() {
  return (
    <div className="flex flex-col min-h-screen bg-globally text-white">
      <SiteHeader />
      <div className="flex flex-1 flex-col bg-globally text-white">
        <div className="@container/main flex flex-1 flex-col gap-2 bg-globally text-white">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 mt-10">
            <SectionCards />
            <div className="px-4 lg:px-6 bg-globally text-white">
              {/* <ChartAreaInteractive /> */}
            </div>
            {/* <DataTable data={data} /> */}
          </div>
        </div>
      </div>
    </div>
  )
}

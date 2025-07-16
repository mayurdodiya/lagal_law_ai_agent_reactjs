import { lazy } from "react";
import { cn } from "@/lib/utils";
import { ChatHistory } from "@/components/ChatHistory";
const LeftSideBarOption = lazy(() => import("@/components/LeftSideBarOption"));
import { NavUser } from "@/components/NavUser";
import { LeftSideBarHeading } from "@/components/LeftSideBarHeading";
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail } from "@/components/ui/sidebar";
import { FaBalanceScale } from "react-icons/fa";

// This is sample data.
const dummyData = {
  teams: {
    name: "Legal Corp",
    logo: FaBalanceScale, // ⚖️ great for legal firms
    plan: "Enterprise",
  },
};

interface LeftSideBarProps {
  isCollapsed: boolean;
}

export function LeftSideBar({ isCollapsed }: LeftSideBarProps) {
  return (
    <Sidebar collapsible="icon" className={cn("h-screen bg-muted/40 flex flex-col justify-between transition-all duration-300 ease-in-out w-64")}>
      {/* header */}
      <SidebarHeader className="bg-background">
        <LeftSideBarHeading teams={dummyData?.teams} />
        <LeftSideBarOption />
      </SidebarHeader>

      {/* mid content ( hitory )*/}
      <SidebarContent>
        <ChatHistory />
      </SidebarContent>

      {/* footer */}
      <SidebarFooter className="bg-background w-full">
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

"use client";

import * as React from "react";
import { MdKeyboardDoubleArrowLeft } from "react-icons/md";
import { TbLayoutSidebarRightCollapse } from "react-icons/tb";
import { FiChevronUp, FiChevronDown, FiPlus } from "react-icons/fi";

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton, useSidebar } from "@/components/ui/sidebar";

interface Team {
  name: string;
  logo: React.ElementType;
  plan: string;
}

interface LeftSideBarHeadingProps {
  teams: Team;
}

export function LeftSideBarHeading({ teams }: LeftSideBarHeadingProps) {
  const { isMobile } = useSidebar();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton size="lg" className="!bg-transparent hover:!bg-sidebar-accent/50 transition-colors duration-200 data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
              <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-md shadow-sm">
                <teams.logo className="size-5" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight px-2">
                <span className="truncate font-semibold text-foreground">{teams.name}</span>
                <span className="truncate text-xs text-muted-foreground">{teams.plan}</span>
              </div>
              {/* <MdKeyboardDoubleArrowLeft className="ml-auto cursor-pointer"/> */}
            </SidebarMenuButton>
          </DropdownMenuTrigger>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { PanelRightOpen, PanelRightClose, Share2 } from "lucide-react";

// ✅ React-icons
import { FaGavel, FaBriefcase, FaBalanceScale, FaLeaf, FaLandmark, FaRegFileAlt } from "react-icons/fa";

// Icon map from react-icons
const iconMap: Record<string, React.ComponentType> = {
  gavel: FaGavel,
  briefcase: FaBriefcase,
  scale: FaBalanceScale,
  leaf: FaLeaf,
  landmark: FaLandmark,
  fileText: FaRegFileAlt,
};

// Dummy law list (replace with API later)
const dummyLaws = [
  { id: 1, name: "Criminal law", icon: "gavel" },
  { id: 2, name: "Labour law", icon: "briefcase" },
  { id: 3, name: "Civil law", icon: "scale" },
  { id: 4, name: "Environmental law", icon: "leaf" },
  { id: 5, name: "Constitutional law", icon: "landmark" },
  { id: 6, name: "Environmental law", icon: "fileText" },
  { id: 7, name: "Criminal law", icon: "gavel" },
  { id: 8, name: "Labour law", icon: "briefcase" },
  { id: 9, name: "Civil law", icon: "scale" },
  { id: 10, name: "Environmental law", icon: "leaf" },
  { id: 11, name: "Constitutional law", icon: "landmark" },
  { id: 12, name: "Environmental law", icon: "fileText" },
  { id: 13, name: "Family law", icon: "users" },
  { id: 14, name: "Corporate law", icon: "building" },
  { id: 15, name: "Intellectual Property law", icon: "lightbulb" },
  { id: 16, name: "Cyber law", icon: "cpu" },
  { id: 17, name: "Immigration law", icon: "plane" },
  { id: 18, name: "Banking and Finance law", icon: "creditCard" },
  { id: 19, name: "Health law", icon: "heart" },
  { id: 20, name: "Real Estate law", icon: "home" },
];

interface ChatScreenSiteHeaderProps {
  onToggleRightDrawer: () => void;
  isRightDrawerOpen: boolean;
}

export default function SiteHeader({ onToggleRightDrawer, isRightDrawerOpen }: ChatScreenSiteHeaderProps) {
  const [laws] = useState(dummyLaws);
  const [selectedLaw, setSelectedLaw] = useState("Criminal Law");
  const { toggleSidebar } = useSidebar();

  return (
    <header className="flex h-15 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-15">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mx-2 data-[orientation=vertical]:h-4" />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="text-base font-medium px-2">
              <div className="flex items-center gap-1">
                <span>{selectedLaw}</span>
                <span className="text-xs leading-none mt-[1px]">⌄</span>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-64 max-h-72 overflow-y-auto customScrollbar sidebar-scroll-thin">
            {laws.map((item) => {
              const Icon = iconMap[item.icon] || FaRegFileAlt;
              return (
                <DropdownMenuItem key={item.id} onClick={() => setSelectedLaw(item.name)}>
                  <Icon className="mr-2 h-4 w-4 shrink-0" />
                  {item.name}
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="ml-auto flex items-center gap-2">
          <Button variant="ghost" size="sm" className="hidden sm:flex items-center gap-1">
            <Share2 className="h-4 w-4" />
            Share
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              onToggleRightDrawer();
              toggleSidebar();
            }}
          >
            {isRightDrawerOpen ? <PanelRightClose className="h-5 w-5" /> : <PanelRightOpen className="h-5 w-5" />}
          </Button>
        </div>
      </div>
    </header>
  );
}

"use client";

import { FiCornerUpRight, FiFolder, FiMoreHorizontal, FiPlus, FiTrash2 } from "react-icons/fi";
import { MdAddComment } from "react-icons/md";
import { FiSearch } from "react-icons/fi";
import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuAction, SidebarMenuButton, SidebarMenuItem, useSidebar } from "@/components/ui/sidebar";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { addSelectedChatRoom, removeChatFeedData, removeSelectedChatRoom } from "@/store/slices/chatSlice";
import { useQuery } from "@tanstack/react-query";
import { fetchChatHistory, fetchChatHistoryWithSearch } from "@/helpers/api";
const options = [
  {
    name: "New Chat",
    url: "#",
    icon: MdAddComment,
    avatar: "/avatars/shadcn.jpg",
  },
  {
    name: "Search chats",
    url: "#",
    icon: FiSearch,
    avatar: "/avatars/shadcn.jpg",
  },
];

export default function LeftSideBarOption() {
  const { isMobile } = useSidebar();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const dispatch = useDispatch();

  // handle to open new chat
  const handleNewChat = () => {
    dispatch(removeSelectedChatRoom({}));
    dispatch(removeChatFeedData([]));
  };

  // search history api call
  const {
    data: searchHistoryData,
    error,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["chat-history-search", searchQuery],
    queryFn: () => fetchChatHistoryWithSearch(searchQuery),
  });

  // handle on search
  const handleSearchApiCall = (e: string) => {
    setSearchQuery(e);
    refetch();
  };

  useEffect(() => {
    if (searchHistoryData) {
      setSearchResult(searchHistoryData);
    }
  }, [searchHistoryData]);

  // if (isLoading) return <div>Loading...</div>;
  // if (error) return <div>Error: {error.message}</div>;

  return (
    <>
      <SidebarGroup className="group-data-[collapsible=icon]:hidden mt-2">
        <SidebarGroupLabel>Options</SidebarGroupLabel>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <a href="#" onClick={handleNewChat}>
                <MdAddComment />
                <span>New chat</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <a href="#" onClick={() => setIsSearchOpen(true)}>
                <FiSearch />
                <span>Search chats</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroup>

      {/* Search history modal */}
      <Dialog
        open={isSearchOpen}
        onOpenChange={(open) => {
          setIsSearchOpen(open);
          if (!open) {
            setSearchQuery("");
            setSearchResult([]);
          }
        }}
      >
        <DialogContent className="min-w-[310px] md:min-w-[410px] lg:min-w-[610px] xl:min-w-[810px]">
          <DialogHeader>
            <DialogTitle>Search Chats</DialogTitle>
          </DialogHeader>
          <Input placeholder="Search your chats..." onChange={(e) => handleSearchApiCall(e.target.value)} />
          {/* Add search results here */}
          <div className="mt-2 overflow-y-auto rounded-lg border border-input hover:border-input/70 p-2 min-h-[400px] min-w-[400px] max-h-[400px] cursor-pointer">
            {searchResult?.length > 0 &&
              searchResult.map((chat: any) => (
                <div
                  key={chat.id}
                  className="flex items-center gap-2 p-2 hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50 dark:hover:text-accent-foreground"
                  onClick={() => {
                    dispatch(addSelectedChatRoom(chat));
                    setIsSearchOpen(false);
                  }}
                >
                  <p>{chat.chat_title}</p>
                </div>
              ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

//         {/* More ... */}
//         {/* <SidebarMenuItem>
//         <SidebarMenuButton className="text-sidebar-foreground/70">
//           <FiMoreHorizontal className="text-sidebar-foreground/70" />
//           <span>More</span>
//         </SidebarMenuButton>
//       </SidebarMenuItem> */}

"use client";

import { FiMoreHorizontal, FiTrash2 } from "react-icons/fi";
import { RiShareForwardFill } from "react-icons/ri";
import { RiPencilFill } from "react-icons/ri";
import { FiEye } from "react-icons/fi";

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuAction, SidebarMenuButton, SidebarMenuItem, useSidebar } from "@/components/ui/sidebar";
import { useEffect } from "react";
import { fetchChatFeedHistory, fetchChatHistory } from "@/helpers/api";
import { useQuery } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { addSelectedChatRoom, fetchChatFeedData } from "@/store/slices/chatSlice";
import { fetchChatHistoryData } from "@/store/slices/chatSlice";
import { useSelector } from "react-redux";

export function ChatHistory() {
  const { isMobile } = useSidebar();
  const dispatch = useDispatch();
  const chatData = useSelector((state: any) => state.chat.chatHistoryData);
  const selectedChatRoom = useSelector((state: any) => state.chat.selectedChatRoom);

  // 1. Fetch the list of chat conversations (history)
  const {
    data: chatHistory,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["chat-history"],
    queryFn: fetchChatHistory,
  });

  // 2. When chat history is fetched, dispatch it to the store
  useEffect(() => {
    if (chatHistory) {
      dispatch(fetchChatHistoryData(chatHistory));
    }
  }, [chatHistory, dispatch]);

  // 3. fetch chat feed history
  useEffect(() => {
    const myFun = async () => {
      if (selectedChatRoom?.id) {
        const data = await fetchChatFeedHistory(selectedChatRoom?.id);
        if (data) {
          dispatch(fetchChatFeedData(data));
        }
      }
    };
    myFun();
  }, [selectedChatRoom, chatData]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>History</SidebarGroupLabel>
      <SidebarMenu>
        {/* chat history */}
        {chatData?.map((item: any) => (
          <SidebarMenuItem key={item.chat_title} className="cursor-pointer" onClick={() => dispatch(addSelectedChatRoom(item))}>
            <SidebarMenuButton asChild>
              <a href={item?.url}>
                {/* <item.icon className="mr-2" /> */}
                <span>{item.chat_title}</span>
              </a>
            </SidebarMenuButton>

            {/* history dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuAction showOnHover>
                  <FiMoreHorizontal />
                  <span className="sr-only">More</span>
                </SidebarMenuAction>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-48 rounded-lg" side={isMobile ? "bottom" : "right"} align={isMobile ? "end" : "start"}>
                <DropdownMenuItem>
                  <FiEye className="text-muted-foreground" />
                  <span>View Chat</span>
                </DropdownMenuItem>

                <DropdownMenuItem>
                  <RiShareForwardFill className="text-muted-foreground" />
                  <span>Share Chat</span>
                </DropdownMenuItem>

                <DropdownMenuItem>
                  <RiPencilFill className="text-muted-foreground" />
                  <span>Rename Chat</span>
                </DropdownMenuItem>

                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <FiTrash2 className="text-muted-foreground" />
                  <span>Delete Chat</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}

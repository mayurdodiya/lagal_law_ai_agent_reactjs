import React from 'react'
import { ThemeProvider } from "next-themes"
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import { ChatContextProvider } from '@/states/useChatContext'
import { PopupContextProvider } from '@/states/usePopupsContext'
import { WebSocketContextProvider } from '@/states/useWebSocketContext'
import type { ChildrenType } from '@/types'
import { SidebarProvider } from './ui/sidebar'

const queryClient = new QueryClient()

const AppProvidersWrapper = ({ children }: ChildrenType) => {
  return (
    <QueryClientProvider client={queryClient}>
      <ChatContextProvider>
        <WebSocketContextProvider>
          <ThemeProvider defaultTheme='system' /* defaultTheme="light" */ enableSystem attribute='class'>
            <SidebarProvider>
              <PopupContextProvider>
                {children}
              </PopupContextProvider>
            </SidebarProvider>
          </ThemeProvider>
        </WebSocketContextProvider>
      </ChatContextProvider>
    </QueryClientProvider>
  )
}

export default AppProvidersWrapper
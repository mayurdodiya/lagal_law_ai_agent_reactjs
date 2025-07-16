import React, { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useLocation, useNavigate } from 'react-router-dom'

import { deleteChatHistoryItem as deleteItemAPI, getAllChats } from '../helpers/api'
import { useToggle } from '../hooks/useToggle'
import type { ChildrenType } from '../types'
// import type { ChatContextType, ChatHistoryItem, ChatMessageType } from '../types/states'
import type { ChatContextType, ChatHistoryItem, ChatMessageType } from '../types/states'

const ChatContext = createContext<ChatContextType | undefined>(undefined)

export const useChatContext = () => {
  const context = useContext(ChatContext)
  if (!context) {
    throw new Error('useChatContext must be used inside of ChatContextProvider')
  }
  return context
}

export const ChatContextProvider = ({ children }: ChildrenType) => {

  const [activeChat, setActiveChat] = useState<ChatHistoryItem | undefined>()
  const [chatsHistory, setChatsHistory] = useState<Array<ChatHistoryItem>>([])
  const [selectedFiles, setSelectedFiles] = useState<string[]>([])
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([])
  const [promptTemperature, setPromptTemperature] = useState(0.2)
  const { pathname } = useLocation()
  const navigate = useNavigate()

  const { isTrue: isWaitingForResponse, setIsTrue: setIsWaitingForResponse } = useToggle()

  const { refetch: refetchAllChats } = useQuery({
    queryKey: ['get-all-chats'],
    queryFn: getAllChats,
    enabled: false
  })

  const changeActiveChat = useCallback((chatItem: ChatHistoryItem) => {
    setActiveChat(chatItem)
  }, [])

  const pushNewMessage = (newMessage: ChatMessageType) => {
    if (activeChat) setActiveChat((prevChat: ChatHistoryItem | undefined) => {
      if (prevChat && newMessage) return { ...prevChat, pastMessages: [...prevChat.pastMessages, newMessage] }
    })
  }

  const deleteChatHistoryItem = useCallback(async (chatItem: ChatHistoryItem) => {
    navigate('/')
    await deleteItemAPI(chatItem.id)
    refetchAllChats()
  }, [chatsHistory])

  const renameChatHistoryItem = useCallback((chatItem: ChatHistoryItem) => {
    // const newChatHistoryList = [...chatHistoryList]
    // setChatHistoryList(newChatHistoryList.map(item => chatItem.id === item.id ? chatItem : item))
    console.info('chat renamed', chatItem)
  }, [chatsHistory])

  const toggleStarredOnChatHistoryItem = useCallback((chatItem: ChatHistoryItem) => {
    // const newChatHistoryList = [...chatHistoryList]
    // setChatHistoryList(newChatHistoryList.map(item => item.id === chatItem.id ? { ...chatItem, starred: !chatItem.starred } : item))
    console.info('chat star toggled', chatItem)
  }, [chatsHistory])

  useEffect(() => {
    if (pathname === '/') setActiveChat(undefined)
    if (!!chatsHistory?.length && !activeChat && pathname.includes('/chats/')) {
      const chatId = pathname.split('/').pop()
      setActiveChat(chatsHistory.find((item: ChatHistoryItem) => chatId?.includes(item.id)))
    }
  }, [chatsHistory?.length, pathname])

  return (
    <ChatContext.Provider value={{
      activeChat,
      refetchAllChats,
      changeActiveChat,
      pushNewMessage,
      promptTemperature: {
        promptTemperature,
        setPromptTemperature,
      },
      responseWaiting: {
        isWaiting: isWaitingForResponse,
        setIsWaiting: setIsWaitingForResponse
      },
      chatsHistoryActions: {
        chatsHistory,
        setChatsHistory
      },
      uploadedFilesActions: {
        uploadedFiles,
        setUploadedFiles
      },
      filesFilterActions: {
        selectedFiles,
        setSelectedFiles
      },
      chatHistoryItemActions: {
        delete: deleteChatHistoryItem,
        rename: renameChatHistoryItem,
        toggleStar: toggleStarredOnChatHistoryItem,
      },
    }}>
      {children}
    </ChatContext.Provider>
  )
}
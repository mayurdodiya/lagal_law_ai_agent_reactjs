
import React, { createContext, startTransition, useCallback, useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid'

import { API_KEYS } from '@/assets/constants'
import type { ChildrenType } from '@/types'
import type { MessageItemType, RegenerationQueryType, SocketEventType, WebSocketContextType } from '@/types/states'
import { useChatContext } from './useChatContext'

type RegenerationMessageType = {
  message_id: string
  chat_id: string
  temperature: number
} & SocketEventType

const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined)

export const useWebSocketContext = () => {
  const context = useContext(WebSocketContext)
  if (!context) {
    throw new Error('useWebSocketContext must be used inside of WebSocketContext')
  }
  return context
}

// const connectSocket = (): WebSocket => {
//   return new WebSocket(API_KEYS.WS_BASE_URL)
// }
const socket = new WebSocket(API_KEYS.WS_BASE_URL)

export const WebSocketContextProvider = ({ children }: ChildrenType) => {

  const [socketConnection, setSocketConnection] = useState<WebSocket | undefined>()
  const { pushNewMessage, promptTemperature: { promptTemperature }, filesFilterActions: { selectedFiles }, activeChat, changeActiveChat, refetchAllChats, responseWaiting: { setIsWaiting } } = useChatContext()
  const navigate = useNavigate()

  socket.onopen = (event: Event) => {
    if (event.currentTarget) setSocketConnection(Object.getPrototypeOf(event))
  }

  socket.onclose = (event: CloseEvent) => {
    setSocketConnection(undefined)
    console.error('Connection closed', event)
  }

  socket.onmessage = (event: MessageEvent) => {
    const newMessage = event.data ? JSON.parse(event.data) : undefined
    if (newMessage) {
      if ((newMessage.data as SocketEventType['event']) === 'chat') {
        startTransition(() => {
          setIsWaiting(false)
        })
        pushNewMessage({ isAI: true, message: newMessage.message, id: newMessage.message_id, isGoodResponse: null })
      }
      else if ((newMessage.data as SocketEventType['event']) === 'regenerate') {
        pushNewMessage({ isAI: false, message: newMessage.user_message, isGoodResponse: null })
        startTransition(() => {
          pushNewMessage({ isAI: true, message: newMessage.bot_message, id: newMessage.message_id, isGoodResponse: null })
          setIsWaiting(false)
        })
      }
    }
  }

  const sendQuery = useCallback((newMessage: string) => {
    const chatId = activeChat?.id ?? uuidv4()
    const messageItem: MessageItemType & SocketEventType & { temperature: number } = { event: 'chat', message: newMessage, chat_id: chatId, temperature: promptTemperature }
    const newSelectedFiles = [...selectedFiles]

    if (!!newSelectedFiles.length) messageItem.selected_files = newSelectedFiles

    if (!activeChat) {
      const newTitle = newMessage.split("").splice(0, 50).join("")
      messageItem.title = newTitle
      navigate(`/chats/${chatId}`)
      changeActiveChat({ id: chatId, pastMessages: [], starred: false, title: newTitle })
      pushNewMessage({ isAI: false, message: newMessage, isGoodResponse: null })
      startTransition(() => {
        refetchAllChats()
      })
    }
    // if (selectedFiles.length) {
    //   startTransition(() => {
    //     setSelectedFiles([]) // unselecting all selected files
    //   })
    // }
    if (activeChat) {
      startTransition(() => {
        pushNewMessage({ isAI: false, message: newMessage, isGoodResponse: null })
      })
    }
    socket.send(JSON.stringify(messageItem))
  }, [socket, selectedFiles, activeChat, navigate, promptTemperature])

  const sendRegenerationQuery = ({ chatId, messageId }: RegenerationQueryType) => {
    const messageItem: RegenerationMessageType = { event: 'regenerate', message_id: messageId, chat_id: chatId, temperature: promptTemperature }
    socket.send(JSON.stringify(messageItem))
  }

  return (
    <WebSocketContext.Provider value={{
      isConnected: !!socketConnection,
      socket: socketConnection,
      sendQuery,
      sendRegenerationQuery
    }}>
      {children}
    </WebSocketContext.Provider>
  )
}
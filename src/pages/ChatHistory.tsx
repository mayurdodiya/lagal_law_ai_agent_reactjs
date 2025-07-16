
import React, { useEffect, useRef } from 'react'

import ChatMessageItem from '@/components/ChatMessageItem'
import { useChatContext } from '@/states/useChatContext'
import type { ChatHistoryItem, ChatMessageType } from '@/types/states'

type ChatHistoryProps = {
  chatItem: ChatHistoryItem
}

const ChatHistory = ({ chatItem }: ChatHistoryProps) => {

  const { activeChat, changeActiveChat } = useChatContext()

  const chatBottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (chatItem) changeActiveChat(chatItem)
  }, [chatItem])

  useEffect(() => {
    setTimeout(() => {
      chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, 250)
  }, [activeChat?.pastMessages.length, activeChat?.id])

  if (activeChat?.pastMessages && activeChat.pastMessages.length) {
    return activeChat.pastMessages.map((message: ChatMessageType, idx: number) => {
      return <ChatMessageItem key={message.id ?? idx} {...message} {...activeChat.pastMessages.length === (idx + 1) && { ref: chatBottomRef }} />
    })
  }
}

export default ChatHistory
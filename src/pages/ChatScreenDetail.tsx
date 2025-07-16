import { useQuery, type QueryFunctionContext } from '@tanstack/react-query'
import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import PageMeta from '@/components/PageMeta'
import { getAllChatMessagesById } from '@/helpers/api'
import type { ChatHistoryItem } from '@/types/states'
import ChatHistory from './ChatHistory'

type ParamsType = { id: string }

const ChatScreenDetail = () => {

  const params = useParams<ParamsType>()
  const navigate = useNavigate()

  if (!params.id) {
    navigate('/')
    return null
  }

  const { data: chatHistoryItem } = useQuery<ChatHistoryItem>({
    queryKey: ['get-chat-history-from-id', (params.id as string)],
    queryFn: ({ queryKey }: QueryFunctionContext) => getAllChatMessagesById((queryKey[1] as string))
  })

  return (
    <div className={"flex flex-col items-start flex-1 max-w-2xl gap-8 px-4 mx-auto max-h-[calc(100vh-134px)]"}>
      {chatHistoryItem && (
        <>
          <PageMeta title={chatHistoryItem.title} />
          <ChatHistory chatItem={chatHistoryItem} />
        </>
      )}
    </div >
  )
}

export default ChatScreenDetail

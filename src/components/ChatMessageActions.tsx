
import React, { useCallback, useEffect, useState } from 'react'
import { CgSpinner } from "react-icons/cg"
import { LuCheck, LuClipboard, LuRefreshCw, LuThumbsDown, LuThumbsUp } from 'react-icons/lu'
import { useMutation } from '@tanstack/react-query'

import { updateMessageFeedback } from '@/helpers/api'
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard'
import { useToggle } from '@/hooks/useToggle'
import { cn } from '@/lib/utils'
import { useChatContext } from '@/states/useChatContext'
import { Button } from './ui/button'
import type { ChatMessageItem } from '@/types/states'
import { useWebSocketContext } from '@/states/useWebSocketContext'
import { InlineSpinner } from './Spinner'

export const MessageActions = (props: ChatMessageItem) => {

  return (
    <div className="flex items-center gap-2 py-2 *:size-5 *:hover:bg-transparent *:dark:hover:bg-transparent">

      <CopyContentButton {...props} />

      {props.isAI && (
        <>
          <ResponseFeedbackButtons {...props} />

          <RegenerateResponseButton {...props} />
        </>
      )}
    </div>
  )
}

const CopyContentButton = ({ message: content }: ChatMessageItem) => {

  const [, copy] = useCopyToClipboard()

  const { isTrue: showCopiedIcon, toggle: toggleShowCopiedIcon } = useToggle()

  const handleCopy = useCallback(async () => {
    const response = await copy(content)
    if (response) {
      toggleShowCopiedIcon()
      setTimeout(() => toggleShowCopiedIcon(), 2500)
    }
  }, [content])

  return (
    <Button
      variant="ghost"
      size="icon"
      className="hover:text-tan-900 text-tan-700 dark:text-tan-400"
      onClick={handleCopy}
      disabled={showCopiedIcon}
    >
      {showCopiedIcon ? (
        <LuCheck className='stroke-green-600' />
      ) :
        <LuClipboard />
      }
    </Button>
  )
}

const ResponseFeedbackButtons = ({ isGoodResponse, id }: ChatMessageItem) => {

  const [responseType, setResponseType] = useState<ChatMessageItem['isGoodResponse']>(isGoodResponse)
  const { activeChat } = useChatContext()

  const { mutate, isPending } = useMutation({
    mutationKey: ['update-response-feedback'],
    mutationFn: updateMessageFeedback,
  })

  const handleResponseFeedback = useCallback((newFeedback: ChatMessageItem['isGoodResponse']) => {
    mutate({ chatId: activeChat?.id ?? '', isGoodResponse: newFeedback, messageId: id }, { onSuccess: () => setResponseType(newFeedback) })
  }, [activeChat, id])

  return (
    <>
      {isPending && <InlineSpinner />}

      {!isPending && (
        <>
          <Button
            variant="ghost"
            size="icon"
            className={cn("hover:text-tan-900 text-tan-700 dark:text-tan-400", { 'text-green-500 dark:text-green-500 hover:text-green-600 dark:hover:text-green-600': responseType })}
            onClick={() => handleResponseFeedback(responseType !== true ? true : null)}
          >
            <LuThumbsUp />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className={cn("hover:text-tan-900 text-tan-700 dark:text-tan-400", { 'text-red-500 dark:text-red-500 hover:text-red-600 dark:hover:text-red-600': responseType === false })}
            onClick={() => handleResponseFeedback(responseType !== false ? false : null)}
          >
            <LuThumbsDown />
          </Button>
        </>
      )}
    </>
  )
}

const RegenerateResponseButton = ({ id, message }: ChatMessageItem) => {

  const { isTrue: isRegenerating, setIsTrue: setIsRegenerating } = useToggle()
  const { activeChat, responseWaiting: { isWaiting, setIsWaiting } } = useChatContext()
  const { sendRegenerationQuery } = useWebSocketContext()

  const handleRegenerate = useCallback(() => {
    if (!isRegenerating && (id && activeChat?.id)) {
      setIsRegenerating(true)
      setIsWaiting(true)
      sendRegenerationQuery({ chatId: activeChat?.id, messageId: id })
    }
  }, [isRegenerating])

  useEffect(() => {
    if (!isWaiting) setIsRegenerating(false)
  }, [isWaiting])

  useEffect(() => {
    if (isRegenerating) setIsRegenerating(false)
  }, [message])

  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn("hover:text-tan-900 text-tan-700 dark:text-tan-400", { 'animate-spin': isRegenerating })}
      onClick={handleRegenerate}
      disabled={isWaiting}
    >
      <LuRefreshCw />
    </Button>
  )
}
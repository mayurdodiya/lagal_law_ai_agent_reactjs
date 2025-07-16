import Markdown from 'marked-react'
import React, { type Ref } from 'react'

import type { ChatMessageItem } from '@/types/states'
import { MessageActions } from './ChatMessageActions'
import { LogoImg } from './SVGs'
import { Avatar, AvatarFallback } from './ui/avatar'

type ChatMessageItemProps = ChatMessageItem & { ref?: Ref<HTMLDivElement> }

const ChatMessageItem = (props: ChatMessageItemProps) => {
  const { isAI, message, id } = props

  return (
    <div className="flex items-start gap-4" ref={props.ref} id={`message-${id}`}>
      <Avatar className="size-6 border">
        {isAI && <LogoImg />}
        <AvatarFallback>{isAI ? 'OE' : 'U'}</AvatarFallback>
      </Avatar>
      <div>
        <div className="font-bold">{isAI ? 'Owl Eyes' : 'You'}</div>
        <Markdown>{message}</Markdown>
        <MessageActions {...props} />
      </div>
    </div>
  )
}

export default ChatMessageItem

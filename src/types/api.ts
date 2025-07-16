
export type BareResponseType = {
  message: string
  status: boolean
  error: string
}

export type FetchAllFilesResponseType = {
  data: string[]
} & BareResponseType

export type FetchPageNumbersFromFileSearchResponseType = {
  data: Array<number>
} & BareResponseType

export type UploadFilesResponseType = {
  data: string[]
} & BareResponseType

export type FetchAllChatsResponseType = {
  data: {
    chat_id: string,
    title: string,
    is_starred: boolean
  }[]
} & BareResponseType

export type MessageResponseType = {
  message_id: string
  is_AI: boolean
  content: string
  is_good_response: null | boolean
}

export type ChatHistoryResponseType = {
  chat_id: string
  title: string
  is_starred: boolean
  messages: MessageResponseType[]
}

export type FetchAllChatMessagesType = {
  data: ChatHistoryResponseType
} & BareResponseType
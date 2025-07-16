import type { BelongsToType, FileWithPreview } from './index'

export type IdType = string

// useChatContext
export type ChatMessageType = {
  id?: string
  message: string
  isGoodResponse: null | boolean
} & BelongsToType

export type ChatMessageItem = ChatMessageType

export type ChatHistoryItem = {
  id: IdType
  title: string
  starred: boolean
  pastMessages: Array<ChatMessageType>
}

export type ChatHistoryItemActions = {
  toggleStar: (chatItem: ChatHistoryItem) => void
  rename: (chatItem: ChatHistoryItem) => void
  delete: (chatItem: ChatHistoryItem) => void
}

export type FilesFilterActionsType = {
  selectedFiles: Array<string>
  setSelectedFiles: (files: Array<string>) => void
}

export type UploadedFilesActionsType = {
  uploadedFiles: Array<string>
  setUploadedFiles: (files: Array<string>) => void
}

type ChatsHistoryActionType = {
  chatsHistory: ChatHistoryItem[]
  setChatsHistory: (chats: ChatHistoryItem[]) => void
}

type PromptTemperatureType = {
  promptTemperature: number
  setPromptTemperature: (chats: number) => void
}

type ResponseWaitActions = {
  isWaiting: boolean
  setIsWaiting: (value: boolean) => void
}

export type ChatContextType = {
  activeChat?: ChatHistoryItem
  responseWaiting: ResponseWaitActions
  filesFilterActions: FilesFilterActionsType
  uploadedFilesActions: UploadedFilesActionsType
  chatsHistoryActions: ChatsHistoryActionType
  chatHistoryItemActions: ChatHistoryItemActions
  promptTemperature: PromptTemperatureType

  refetchAllChats: () => void
  changeActiveChat: (chatItem: ChatHistoryItem) => void
  pushNewMessage: (newMessage: ChatMessageType) => void
}

// usePopupContext
export type PopupStateType = {
  isOpen: boolean
  toggleOpen: (newOpenChange: boolean) => void
}

export type PopupStatesType = {
  chatHistoryActions: {
    renameForm: {
      isOpen: boolean
      state?: ChatHistoryItem
    }
    deleteConfirm: {
      isOpen: boolean
      state?: ChatHistoryItem
    }
  }
  filePreview: {
    isOpen: boolean
    state?: FileWithPreview
  }
}

export type ChatHistoryItemActionType = PopupStateType & {
  open: (chatItem: ChatHistoryItem) => void
  state?: ChatHistoryItem
}

export type FilePreviewActionType = PopupStateType & {
  open: (file: FileWithPreview) => void
  state?: FileWithPreview
}

export type PopupContextType = {
  chatHistoryActions: {
    renameForm: ChatHistoryItemActionType
    deleteConfirm: ChatHistoryItemActionType
  }
  filePreview: FilePreviewActionType
}

// useWebSocketContext

export type WebSocketContextType = {
  isConnected: boolean
  socket: WebSocket | undefined
  sendQuery: (query: string) => void
  sendRegenerationQuery: (query: RegenerationQueryType) => void
}

export type MessageItemType = {
  message: string
  chat_id: string
  title?: string
  selected_files?: Array<string>
}

export type SocketEventType = {
  event: 'chat' | 'regenerate'
}

export type RegenerationQueryType = {
  chatId: NonNullable<ChatHistoryItem['id']>
  messageId: NonNullable<ChatMessageItem['id']>
}
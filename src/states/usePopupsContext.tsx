import { getCookie } from 'cookies-next/client'
import React, { createContext, useCallback, useContext, useState } from "react"

import { STORAGE_KEYS } from '../assets/constants'
import { ChildrenType, type FileWithPreview } from "@/types"
import type { ChatHistoryItem, PopupContextType, PopupStatesType } from '@/types/states'
import { useChatContext } from './useChatContext'

const PopupContext = createContext<PopupContextType | undefined>(undefined)

export const usePopupsContext = () => {
  const context = useContext(PopupContext)
  if (!context) {
    throw new Error('usePopupsContext must be used within PopupContextProvider')
  }
  return context
}

const initialPopupState: PopupStatesType = {
  chatHistoryActions: {
    renameForm: {
      isOpen: false
    },
    deleteConfirm: {
      isOpen: false
    }
  },
  filePreview: {
    isOpen: false
  }
}

export const PopupContextProvider = ({ children }: ChildrenType) => {

  const [popupStates, setPopupStates] = useState<PopupStatesType>(initialPopupState)
  const { chatHistoryItemActions: { delete: deleteChatHistory, } } = useChatContext()
  const _changePopupStates = useCallback((_newState: Partial<PopupStatesType>) => {
    setPopupStates({ ...popupStates, ..._newState })
  }, [popupStates])

  // Chat History Rename
  const openChatHistoryRename = useCallback((chatItem: ChatHistoryItem) => {
    _changePopupStates({ chatHistoryActions: { ...popupStates.chatHistoryActions, renameForm: { isOpen: true, state: chatItem } } })
  }, [])

  const toggleOpenChatHistoryRename = useCallback((newOpenChange: boolean) => {
    _changePopupStates({ chatHistoryActions: { ...popupStates.chatHistoryActions, renameForm: newOpenChange ? { ...popupStates.chatHistoryActions.renameForm, isOpen: newOpenChange } : { isOpen: newOpenChange } } })
  }, [])


  // Chat History Delete
  const openChatHistoryDeleteConfirm = useCallback((chatItem: ChatHistoryItem) => {
    const foundCookie = getCookie(STORAGE_KEYS.NO_DELETE_CONFIRM)
    if (foundCookie !== 'true') _changePopupStates({ chatHistoryActions: { ...popupStates.chatHistoryActions, deleteConfirm: { isOpen: true, state: chatItem } } })
    else deleteChatHistory(chatItem)
  }, [])

  const toggleOpenChatHistoryDeleteConfirm = useCallback((newOpenChange: boolean) => {
    _changePopupStates({ chatHistoryActions: { ...popupStates.chatHistoryActions, deleteConfirm: newOpenChange ? { ...popupStates.chatHistoryActions.deleteConfirm, isOpen: newOpenChange } : { isOpen: newOpenChange } } })
  }, [])


  // File Preview
  const openFilePreview = useCallback((newFile: FileWithPreview) => {
    _changePopupStates({ filePreview: { ...popupStates.filePreview, isOpen: true, state: newFile } })
  }, [])

  const toggleFilePreview = useCallback((newOpenChange: boolean) => {
    _changePopupStates({ filePreview: newOpenChange ? { ...popupStates.filePreview, isOpen: newOpenChange } : { isOpen: newOpenChange } })
  }, [])

  return (
    <PopupContext.Provider value={{
      chatHistoryActions: {
        deleteConfirm: {
          ...popupStates.chatHistoryActions.deleteConfirm,
          open: openChatHistoryDeleteConfirm,
          toggleOpen: toggleOpenChatHistoryDeleteConfirm
        },
        renameForm: {
          ...popupStates.chatHistoryActions.renameForm,
          open: openChatHistoryRename,
          toggleOpen: toggleOpenChatHistoryRename
        }
      },
      filePreview: {
        ...popupStates.filePreview,
        open: openFilePreview,
        toggleOpen: toggleFilePreview,
      }
    }}
    >
      {children}
    </PopupContext.Provider>
  )
}
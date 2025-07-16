import React, { lazy, Suspense } from 'react'

import { usePopupsContext } from '@/states/usePopupsContext'

const FilePreviewer = lazy(() => import('../dialogs/FilePreviewer'))
const ChatHistoryItemDeleteConfirm = lazy(() => import('../dialogs/ChatHistoryItemDeleteConfirm'))
const ChatHistoryItemRename = lazy(() => import('../dialogs/ChatHistoryItemRename'))

const PopupsWrapper = () => {
  const { chatHistoryActions: { deleteConfirm: { isOpen: isDeleteConfirmOpen }, renameForm: { isOpen: isRenameFormOpen } }, filePreview: { isOpen: isFilePreviewOpen } } = usePopupsContext()
  return (
    <>
      {isRenameFormOpen && (
        <Suspense>
          <ChatHistoryItemRename />
        </Suspense>
      )}
      {isDeleteConfirmOpen && (
        <Suspense>
          <ChatHistoryItemDeleteConfirm />
        </Suspense>
      )}
      {isFilePreviewOpen && (
        <Suspense>
          <FilePreviewer />
        </Suspense>
      )}
    </>
  )
}

export default PopupsWrapper

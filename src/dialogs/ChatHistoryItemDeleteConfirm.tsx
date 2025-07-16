import { setCookie } from 'cookies-next/client'
import React, { useCallback, type FormEvent } from 'react'

import { STORAGE_KEYS } from '@/assets/constants'
import { useToggle } from '@/hooks/useToggle'
import { useChatContext } from '@/states/useChatContext'
import { usePopupsContext } from '@/states/usePopupsContext'
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'

const ChatHistoryItemDeleteConfirm = () => {
  const { chatHistoryActions: { deleteConfirm: { isOpen, toggleOpen, state } } } = usePopupsContext()
  const { chatHistoryItemActions: { delete: deleteItem } } = useChatContext()

  const { isTrue: isChecked, toggle: toggleChecked } = useToggle()

  const handleSubmit = useCallback((e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (isChecked) setCookie(STORAGE_KEYS.NO_DELETE_CONFIRM, true, { maxAge: 31536000 })
    if (state) deleteItem(state)
    toggleOpen(false)
  }, [isChecked])

  return (
    <AlertDialog open={isOpen} onOpenChange={toggleOpen}>
      <AlertDialogContent asChild>
        <form onSubmit={handleSubmit}>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to permanently delete this chat?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete chat from the server.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex items-center space-x-2">
            <Checkbox id="do-not-ask-again" onCheckedChange={toggleChecked} checked={isChecked} />
            <label
              htmlFor="do-not-ask-again"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Do not ask me again
            </label>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <Button
              type='submit'
              className='text-white dark:text-white dark:bg-red-500 bg-red-500 hover:bg-red-600 dark:hover:bg-red-600'
            >
              Ok
            </Button>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default ChatHistoryItemDeleteConfirm

import { useMutation } from '@tanstack/react-query'
import React, { startTransition, useEffect, useState, type ChangeEvent, type FormEvent } from 'react'

import { updateChatHistoryItem } from '@/helpers/api'
import { useChatContext } from '@/states/useChatContext'
import { usePopupsContext } from '@/states/usePopupsContext'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const ChatHistoryItemRename = () => {

  const { chatHistoryActions: { renameForm: { isOpen, toggleOpen, state } } } = usePopupsContext()
  const [titleInputValue, setTitleInputValue] = useState<string>(state?.title ?? '')
  const { refetchAllChats } = useChatContext()

  const { mutate, data, status, isPending, isSuccess, reset } = useMutation({
    mutationKey: ['history-item-update'],
    mutationFn: updateChatHistoryItem,
    onSuccess: refetchAllChats
  })

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (state) mutate({ ...state, title: titleInputValue })
  }

  useEffect(() => {
    if (isSuccess) {
      reset()
      startTransition(() => {
        toggleOpen(false)
      })
    }
  }, [status])

  return (
    <Dialog open={isOpen} onOpenChange={toggleOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Rename</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="flex items-center gap-4">
            <Label htmlFor="history-item-title">Title</Label>
            <Input value={data?.title ?? titleInputValue} onChange={(e: ChangeEvent<HTMLInputElement>) => setTitleInputValue(e.target.value)} id="history-item-title"
            />
          </div>
          <DialogFooter className='mt-5'>
            <Button type="button" variant='secondary' onClick={() => toggleOpen(false)}>Cancel</Button>
            <Button disabled={!titleInputValue || isPending} type="submit">{isPending ? 'Renaming' : 'Ok'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default ChatHistoryItemRename
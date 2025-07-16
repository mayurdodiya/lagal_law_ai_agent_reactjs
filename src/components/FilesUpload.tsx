
import { useMutation, useQuery } from '@tanstack/react-query'
import React, { startTransition, Suspense, useCallback, useEffect, useState } from 'react'

import { getAllUploadedFiles, uploadFiles } from '@/helpers/api'
import { useChatContext } from '@/states/useChatContext'
import { Button } from './ui/button'
import FileUploader from './ui/file-uploader'
// import FileUploader from './file-uploader'

const FilesUpload = () => {

  const [selectedFiles, setSelectedFiles] = useState<File[] | undefined>()
  const { uploadedFilesActions: { setUploadedFiles } } = useChatContext()

  const { refetch } = useQuery({
    queryKey: ['get-uploaded-files-list'],
    queryFn: getAllUploadedFiles,
    enabled: false
  })

  const handleFileUploadMutation = useMutation({
    mutationFn: (formData: FormData) => {
      return uploadFiles(formData)
    },
    onSuccess: () => refetch()
  })

  const handleFileUpload = useCallback(() => {
    const formData = new FormData()
    if (selectedFiles) {
      for (const file of selectedFiles) {
        formData.append('files', file, file.name)
      }
    }
    handleFileUploadMutation.mutate(formData)
  }, [selectedFiles])

  const { data, status, isPending, isSuccess, reset } = handleFileUploadMutation

  useEffect(() => {
    if (isSuccess && !!selectedFiles?.length) {
      setUploadedFiles(data)
      startTransition(() => {
        setSelectedFiles([])
      })
      startTransition(() => {
        reset()
      })
    }
  }, [status])

  return (
    <div className='flex flex-col'>
      <Suspense>
        <FileUploader
          accept={{
            'application/pdf': ['.pdf']
          }}
          files={selectedFiles}
          setFiles={setSelectedFiles}
          maxFileCount={10}
          maxSize={1024 * 1024 * 10}
          // progresses={progresses}
          // onUpload={onUpload}
          disabled={isPending}
        />
      </Suspense>
      {!!selectedFiles?.length && <Button disabled={isPending} onClick={handleFileUpload} className='w-full mt-5 rounded-xl'>{isPending ? 'Uploading...' : 'Add to Library'}</Button>}
    </div>
  )
}

export default FilesUpload
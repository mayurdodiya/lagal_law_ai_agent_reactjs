
import { useAutoAnimate } from '@formkit/auto-animate/react'
import { useMutation, useQuery } from '@tanstack/react-query'
import React, { Fragment, useCallback, useMemo, useState, type ChangeEvent } from 'react'
import { LuTrash } from 'react-icons/lu'

import { deleteUploadedFile, getAllUploadedFiles } from '@/helpers/api'
import { useToggle } from '@/hooks/useToggle'
import { cn, extractFileNameFromPath, pdfURLtoBlobUrl } from '@/lib/utils'
import { Checkbox } from './ui/checkbox'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Separator } from './ui/separator'
import { Switch } from './ui/switch'
import { useChatContext } from '@/states/useChatContext'
import { Skeleton } from './ui/skeleton'
import { usePopupsContext } from '@/states/usePopupsContext'
import type { FileWithPreview } from '@/types'

type UploadedFileItemProps = {
  file: string
  uploadedFilesList: string[]
  index: number
  isSelectable: boolean
  files: string[]
  handleSelectedFileChange: (file: string) => void
  handleDeleteFile: (fileName: string) => void
}

type FileItemLabelProps = {
  previewFile: (fileName: string) => Promise<void>
  isLoading: boolean
  file: string
}

const FilesFilter = () => {

  const { filesFilterActions: { selectedFiles, setSelectedFiles } } = useChatContext()

  const { isTrue: isSelectable } = useToggle(true)

  const [searchQuery, setSearchQuery] = useState('')

  const [parent] = useAutoAnimate({ easing: 'ease-out' })

  const { data: uploadedFilesList, isPending, refetch } = useQuery({
    queryKey: ['get-uploaded-files-list'],
    queryFn: getAllUploadedFiles,
  })

  const { mutate, isPending: isDeleting } = useMutation({
    mutationKey: ['delete-uploaded-file'],
    mutationFn: deleteUploadedFile,
    onSettled: () => refetch()
  })

  const handleDelete = (fileName: string) => {
    mutate(fileName)
  }

  const allFilesNames: string[] | undefined = useMemo(() => {
    if (!!uploadedFilesList?.length) return uploadedFilesList?.map((item: string) => extractFileNameFromPath(item) ?? '')
  }, [uploadedFilesList])

  const files = useMemo(() => {
    if (!!allFilesNames?.length) return allFilesNames.filter((fileName: string) => (fileName.toLowerCase()).includes(searchQuery))
  }, [searchQuery, allFilesNames])

  const handleSelectedFileChange = useCallback((newFile: string) => {
    if (selectedFiles.includes(newFile)) setSelectedFiles(selectedFiles.filter((item: string) => item !== newFile))
    else if (selectedFiles.length < 2) setSelectedFiles([...selectedFiles, newFile])
  }, [selectedFiles])

  return (
    <div className='flex flex-col'>

      {!!uploadedFilesList?.length && (
        <>
          <Input
            name='search-files'
            onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchQuery((e.target.value).toLowerCase())}
            value={searchQuery}
            placeholder='Search for Document...'
            type='search'
            className='mb-4'
          />

          <Label className='text-center text-tan-950 dark:text-tan-200 mb-8'>Included Documents</Label>
          {/* <div className="flex items-center space-x-2 mb-4 mx-auto">
            <Label htmlFor="files-selection-mode" className={cn('text-tan-950 dark:text-tan-400', { 'dark:text-tan-50 text-tan-950': !isSelectable })}>All</Label>
            <Switch id="files-selection-mode" checked={isSelectable} onCheckedChange={(e: boolean) => {
              setIsSelectable(e)
              if (!e) setSelectedFiles([])
            }} />
            <Label htmlFor="files-selection-mode" className={cn('text-tan-950 dark:text-tan-400', { 'dark:text-tan-50 text-tan-950': isSelectable })} >Selected</Label>
          </div> */}
        </>
      )}

      <ul className={cn("max-h-48 rounded-xl border dark:border-tan-800 border-tan-300 bottom-5 p-4 list-none overflow-hidden overflow-y-auto text-tan-950 dark:text-tan-200 customScrollbar sidebar-scroll-thin", !files && 'top-0')} ref={parent}>
        {(isPending || isDeleting) ? (
          <UploadedFilesSkeleton />
        ) :
          ((uploadedFilesList?.length === 0 || uploadedFilesList === undefined) && !isPending) ? (
            <>No files uploaded</>
          ) : files?.length === 0 ? (
            <div>No Files Found</div>
          ) : (
            files?.map((file: string, idx: number) => {
              return uploadedFilesList && <UploadedFileItem key={file} file={file} index={idx} uploadedFilesList={uploadedFilesList} files={files} isSelectable={isSelectable} handleSelectedFileChange={handleSelectedFileChange} handleDeleteFile={handleDelete} />
            })
          )
        }
      </ul>
    </div>
  )
}

export default FilesFilter

const UploadedFileItem = ({ file, handleSelectedFileChange, uploadedFilesList, files, index, isSelectable, handleDeleteFile }: UploadedFileItemProps) => {
  const { filesFilterActions: { selectedFiles } } = useChatContext()
  const { filePreview: { open } } = usePopupsContext()

  const [isLoading, setIsLoading] = useState(false)

  const previewFile = async (fileName: string) => {
    const fileUrl: string | undefined = uploadedFilesList.find((uploadedFile: string) => uploadedFile.includes(fileName))
    if (fileUrl) {
      setIsLoading(true)
      const linkAsFile: FileWithPreview = await pdfURLtoBlobUrl(fileUrl.replace('http:', 'https:'))
      open(linkAsFile)
      setIsLoading(false)
    }
  }

  return (
    <Fragment>
      <li className="text-sm dark:text-tan-300 flex items-center justify-between space-x-2 group/file">
        {isSelectable ? (
          <>
            <Checkbox id={`${file}-uploaded`} checked={selectedFiles.includes(file)} onCheckedChange={() => handleSelectedFileChange(file)} />
            <FileItemLabel file={file} isLoading={isLoading} previewFile={previewFile} />
          </>
        ) : <FileItemLabel file={file} isLoading={isLoading} previewFile={previewFile} />
        }
        <LuTrash onClick={() => !isLoading && handleDeleteFile(file)} className='hidden group-hover/file:block text-red-500 min-w-4 text-right' role='button' size={16} />
      </li>
      {files.length - 1 !== index && <Separator className="my-2" />}
    </Fragment>
  )
}

const FileItemLabel = ({ isLoading, file, previewFile }: FileItemLabelProps) => {
  const fileName = isLoading ? 'Loading...' : file

  return <label aria-disabled={isLoading} onClick={() => !isLoading && previewFile(fileName)} htmlFor={`${fileName}-uploaded`} className='truncate !mr-auto' role='button'>{fileName}</label>
}

const UploadedFilesSkeleton = () => (
  <div className="flex flex-col">
    {Array.from(new Array(5)).map((_: unknown, idx: number) => (
      <Fragment key={idx} >
        <Skeleton className='h-5' />
        {idx !== 4 && <Separator className="my-2" />}
      </Fragment>
    ))}
  </div>
)
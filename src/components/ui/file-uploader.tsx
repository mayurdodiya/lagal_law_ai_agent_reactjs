
import React, { useCallback, useEffect } from 'react'
import Dropzone, {
  type DropzoneProps,
  type DropzoneState,
  type FileRejection,
} from "react-dropzone"
import { LuUpload, LuX } from "react-icons/lu"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn, formatBytes } from "@/lib/utils"
import { usePopupsContext } from '@/states/usePopupsContext'
import type { FileWithPreview } from '@/types'
import FileExtensionWithPreview from '../FileExtensionWithPreview'


type FileUploaderProps = React.HTMLAttributes<HTMLDivElement> & {
  /**
   * Value of the uploader.
   * @type File[]
   * @default undefined
   * @example value={files}
   */
  files?: File[]

  /**
   * Function to be called when the value changes.
   * @type (files: File[]) => void
   * @default undefined
   * @example onValueChange={(files) => setFiles(files)}
   */
  onValueChange?: (files: File[]) => void

  /**
   * Function to be called when files are uploaded.
   * @type (files: File[]) => Promise<void>
   * @default undefined
   * @example onUpload={(files) => uploadFiles(files)}
   */
  onUpload?: (files: File[]) => Promise<void>

  /**
   * Progress of the uploaded files.
   * @type Record<string, number> | undefined
   * @default undefined
   * @example progresses={{ "file1.png": 50 }}
   */
  progresses?: Record<string, number>

  /**
   * Accepted file types for the uploader.
   * @type { [key: string]: string[]}
   * @default
   * ```ts
   * { "image/*": [] }
   * ```
   * @example accept={["image/png", "image/jpeg"]}
   */
  accept?: DropzoneProps["accept"]

  /**
   * Maximum file size for the uploader.
   * @type number | undefined
   * @default 1024 * 1024 * 2 // 2MB
   * @example maxSize={1024 * 1024 * 2} // 2MB
   */
  maxSize?: DropzoneProps["maxSize"]

  /**
   * Maximum number of files for the uploader.
   * @type number | undefined
   * @default 1
   * @example maxFileCount={4}
   */
  maxFileCount?: DropzoneProps["maxFiles"]

  /**
   * Whether the uploader should accept multiple files.
   * @type boolean
   * @default false
   * @example multiple
   */
  multiple?: boolean

  /**
   * Whether the uploader is disabled.
   * @type boolean
   * @default false
   * @example disabled
   */
  disabled?: boolean

  /**
   * Sets the selected files to parent state.
   * @type File[] | undefined
   * @example {setSelectedFilesFn}
   */
  setFiles: (files: File[] | undefined) => void
}

type FileCardProps = {
  file: File
  onRemove: () => void
  progress?: number
}

const FileUploader = (props: FileUploaderProps) => {
  const {
    files,
    setFiles,
    onUpload,
    progresses,
    accept = {
      "image/*": [],
    },
    maxSize = 1024 * 1024 * 2,
    maxFileCount = 1,
    multiple = false,
    disabled = false,
    className,
    ...dropzoneProps
  } = props

  const onDrop = useCallback(
    (acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
      if (!multiple && maxFileCount === 1 && acceptedFiles.length > 1) {
        toast.error("Cannot upload more than 1 file at a time")
        return
      }

      if ((files?.length ?? 0) + acceptedFiles.length > maxFileCount) {
        toast.error(`Cannot upload more than ${maxFileCount} files`)
        return
      }

      const newFiles = acceptedFiles.map((file: File) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      )

      const updatedFiles = files ? [...files, ...newFiles] : newFiles

      setFiles(updatedFiles)

      if (rejectedFiles.length > 0) {
        rejectedFiles.forEach(({ file }: FileRejection) => {
          toast.error(`File ${file.name} was rejected`)
        })
      }

      if (
        onUpload &&
        updatedFiles.length > 0 &&
        updatedFiles.length <= maxFileCount
      ) {
        const target =
          updatedFiles.length > 0 ? `${updatedFiles.length} files` : `file`

        toast.promise(onUpload(updatedFiles), {
          loading: `Uploading ${target}...`,
          success: () => {
            setFiles([])
            return `${target} uploaded`
          },
          error: `Failed to upload ${target}`,
        })
      }
    },

    [files, maxFileCount, multiple, onUpload, setFiles]
  )

  function onRemove (index: number) {
    if (!files) return
    const newFiles = files.filter((_: File, i: number) => i !== index)
    setFiles(newFiles)
    // onValueChange?.(newFiles)
  }

  // Revoke preview url when component unmounts
  useEffect(() => {
    return () => {
      if (!files) return
      files.forEach((file) => {
        if (isFileWithPreview(file)) {
          URL.revokeObjectURL(file.preview)
        }
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const isDisabled = disabled || (files?.length ?? 0) >= maxFileCount

  return (
    <div className="relative flex flex-col gap-6 overflow-hidden">
      <Dropzone
        onDrop={onDrop}
        accept={accept}
        maxSize={maxSize}
        minSize={9}
        maxFiles={maxFileCount}
        multiple={maxFileCount > 1 || multiple}
        disabled={isDisabled}
      >
        {({ getRootProps, getInputProps, isDragActive }: DropzoneState) => (
          <div
            {...getRootProps()}
            className={cn(
              "group relative grid h-52 w-full cursor-pointer place-items-center rounded-lg border-2 border-dashed border-tan-700/50 dark:border-tan-300/25 px-5 py-2.5 text-center transition hover:bg-muted/25",
              "ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-3xl",
              isDragActive && "border-tan-300/50",
              isDisabled && "pointer-events-none opacity-60",
              className
            )}
            {...dropzoneProps}
          >
            <input {...getInputProps()} />
            {isDragActive ? (
              <div className="flex flex-col items-center justify-center gap-4 sm:px-5">
                <div className="rounded-full border border-dashed p-3 border-tan-700 dark:border-tan-300">
                  <LuUpload
                    className="size-7 text-tan-700 dark:text-tan-300"
                    aria-hidden="true"
                  />
                </div>
                <p className="font-medium text-tan-700 dark:text-tan-300">
                  Drop the files here
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center gap-4 sm:px-5">
                <div className="rounded-full border border-dashed p-3 border-tan-700 dark:border-tan-300 items-center flex flex-col dark:text-tan-300">
                  <LuUpload
                    className="size-7 text-tan-800 dark:text-tan-300"
                    aria-hidden="true"
                  />
                  Browse
                </div>
                <div className="flex flex-col gap-px">
                  <p className="font-medium text-tan-800 dark:text-tan-300">
                    {/* Drag {`'n'`} drop files here, or click to select files */}
                    {maxFileCount > 1 ? `or drag up to ${maxFileCount} PDFs here` : 'or drag PDF here'}
                  </p>
                  <p className="text-sm text-tan-800 dark:text-tan-300/70">
                    {maxFileCount > 1
                      ? `Each PDF must be under ${formatBytes(maxSize)}`
                      : `PDF must be under ${formatBytes(maxSize)}`}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </Dropzone>
      {files?.length ? (
        <ScrollArea className="h-fit w-full px-3">
          <div className="flex max-h-48 flex-col gap-4">
            {files?.map((file: File, index: number) => (
              <FileCard
                key={index}
                file={file}
                onRemove={() => onRemove(index)}
                progress={progresses?.[file.name]}
              />
            ))}
          </div>
        </ScrollArea>
      ) : null}
    </div>
  )
}

function FileCard ({ file, progress, onRemove }: FileCardProps) {
  return (
    <div className="relative flex items-center gap-2.5">
      <div className="flex flex-1 gap-2.5">
        {isFileWithPreview(file) && <FilePreview file={file} />}
        <div className="flex w-full flex-col gap-2">
          <div className="flex flex-col gap-px">
            <p className="line-clamp-1 text-sm font-medium text-tan-800/80 dark:text-tan-200/80">
              {file.name}
            </p>
            <p className="text-xs text-tan-600 dark:text-tan-400">
              {formatBytes(file.size)}
            </p>
          </div>
          {progress && <Progress value={progress} />}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="size-7 rounded-full"
          onClick={onRemove}
        >
          <LuX className="size-4 dark:text-tan-50" aria-hidden="true" />
          <span className="sr-only">Remove file</span>
        </Button>
      </div>
    </div>
  )
}

function isFileWithPreview (file: File): file is File & { preview: string } {
  return "preview" in file && typeof file.preview === "string"
}

export type FilePreviewProps = {
  file: FileWithPreview
}

function FilePreview ({ file }: FilePreviewProps) {

  const { filePreview: { open } } = usePopupsContext()

  if (file.type.startsWith("image/")) {
    return (
      <img
        src={file.preview}
        alt={file.name}
        width={48}
        height={48}
        loading="lazy"
        className="aspect-square shrink-0 rounded-md object-cover"
      />
    )
  }

  if (file.type === 'application/pdf') {
    return (
      <FileExtensionWithPreview extension={file.name.split('.').pop() ?? ''} onClick={() => open(file)} className='select-none cursor-pointer' />
    )
  }

  return (
    <>
      <FileExtensionWithPreview extension={file.name.split('.').pop() ?? ''} />
    </>
  )
}

export default FileUploader
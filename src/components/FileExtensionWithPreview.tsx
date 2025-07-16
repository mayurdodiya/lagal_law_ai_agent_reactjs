import React, { type SVGProps } from 'react'

const FileExtensionWithPreview = ({ extension, ...props }: SVGProps<SVGSVGElement> & { extension: string }) => {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M4 4C4 1.79086 5.79086 0 8 0H24L36 12V36C36 38.2091 34.2091 40 32 40H8C5.79086 40 4 38.2091 4 36V4Z" className='dark:fill-tan-800 fill-tan-200' />
      <path opacity="0.3" d="M24 0L36 12H28C25.7909 12 24 10.2091 24 8V0Z" className='fill-black dark:fill-white' />
      <text x="50%" y="70%" dominantBaseline="middle" textAnchor="middle" className='dark:fill-tan-100 fill-tan-900' fontSize="10" fontFamily="Arial, sans-serif">
        {extension.toUpperCase()}
      </text>
    </svg>
  )
}

export default FileExtensionWithPreview
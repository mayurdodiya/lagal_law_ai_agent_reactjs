import React from 'react'

import { APP_INFO } from '@/assets/constants'

type PageMetaProps = {
  title?: string
}

const PageMeta = ({ title }: PageMetaProps) => {
  return (
    <>
      <title>{title ? `${title} | ${APP_INFO.NAME}` : APP_INFO.NAME}</title>
    </>
  )
}

export default PageMeta
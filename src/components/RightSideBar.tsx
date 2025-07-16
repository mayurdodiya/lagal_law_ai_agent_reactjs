
import React, { lazy, Suspense } from 'react'

import FilesUpload from './FilesUpload'
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel } from './ui/sidebar'

const FilesFilter = lazy(() => import('./FilesFilter'))

const RightSideBar = () => {

  return (
    <Sidebar side='right'>
      <SidebarContent>


        <SidebarGroup>
          {/* <SidebarGroupLabel>Search Files</SidebarGroupLabel> */}
          <SidebarGroupContent>
            <Suspense>
              <FilesFilter />
            </Suspense>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarFooter className='mt-auto'>
          <SidebarGroupLabel className='flex justify-center items-center text-center'>Document Manager</SidebarGroupLabel>
          <SidebarGroupContent>
            <FilesUpload />
          </SidebarGroupContent>
        </SidebarFooter>
      </SidebarContent>
    </Sidebar>
  )
}

export default RightSideBar

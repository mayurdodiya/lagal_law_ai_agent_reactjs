import { useQuery, type QueryFunctionContext } from '@tanstack/react-query'
import React, { useCallback, useEffect, useState, type ChangeEvent, type FC, type FormEvent } from 'react'
import { LuSearch } from 'react-icons/lu'

import { InlineSpinner } from '@/components/Spinner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { getPageNumbersFromSearch } from '@/helpers/api'

export type PDFSearchProps = {
  toggleClose: () => void
  fileName: string
  setAvailablePageNumbers: (pages: Array<number>) => void
}

const PDFSearch: FC<PDFSearchProps> = ({ fileName, setAvailablePageNumbers }: PDFSearchProps) => {

  const [searchValue, setSearchValue] = useState('')

  const { data: pageNumbers, isSuccess, status, refetch, isFetching, } = useQuery({
    queryKey: ['get-pages-from-search', fileName, searchValue],
    queryFn: ({ queryKey }: QueryFunctionContext) => getPageNumbersFromSearch((queryKey[1] as string), (queryKey[2] as string)),
    enabled: false,
  })

  // set available page numbers to the parent state
  useEffect(() => {
    if (isSuccess) setAvailablePageNumbers(pageNumbers)
  }, [status, pageNumbers])

  // queries the backend to find the available page numbers based on search keyword
  const handleSubmit = useCallback((event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    refetch()
  }, [searchValue])

  // clears the limitation to the pages you can navigate to and input value
  const handleClear = () => {
    setAvailablePageNumbers([])
    setSearchValue('')
  }

  return (
    <form onSubmit={handleSubmit} className='flex items-center gap-3 pt-2 mx-1'>
      <Input className='flex flex-1' type='search' value={searchValue} onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchValue(e.target.value)} placeholder='Search...' autoFocus />
      <Button type='submit' size='icon' disabled={isFetching || (searchValue.length < 3)}>{isFetching ? <InlineSpinner /> : <LuSearch />} </Button>
      <Button type='reset' variant='secondary' onClick={handleClear}>Reset</Button>
    </form>
  )
}

export default PDFSearch
import type { PDFDocumentProxy } from 'pdfjs-dist'
import React, { lazy, Suspense, useCallback, useEffect, useMemo, useState, type FC } from 'react'
import { LuSearch } from 'react-icons/lu'
import { Document, Page, pdfjs } from 'react-pdf'

// import { InlineSpinner } from '@/components/ui/Spinner'
import { InlineSpinner } from '@/components/Spinner'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useStep } from '@/hooks/useStep'
import { useToggle } from '@/hooks/useToggle'
import { usePopupsContext } from '@/states/usePopupsContext'
import type { PDFSearchProps } from './PDFSearch'

const SearchThroughPDF = lazy(() => import('./PDFSearch')) satisfies FC<PDFSearchProps>

import 'react-pdf/dist/Page/TextLayer.css'

// pdfjs.GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/build/pdf.worker.min.mjs', import.meta.url).toString()
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString()

const FilePreviewer = () => {

  const [noOfPages, setNoOfPages] = useState(0)
  const [availablePageNumbers, setAvailablePageNumbers] = useState<Array<number>>([])
  const [currentStep, helpers] = useStep(noOfPages)
  const { goToNextStep, goToPrevStep, canGoToNextStep, canGoToPrevStep, setStep } = helpers
  const { filePreview: { isOpen, toggleOpen, state: file } } = usePopupsContext()
  const { isTrue: showSearchInput, toggle: toggleShowSearchInput } = useToggle(false)

  // checks if there currentStep is the last or first step amongst the available pages
  const { isLastAvailable, isFirstAvailable } = useMemo(() => {
    const newAvailablePageNumbers = [...availablePageNumbers]
    return {
      isFirstAvailable: currentStep !== newAvailablePageNumbers.shift(),
      isLastAvailable: currentStep !== newAvailablePageNumbers.pop(),
    }
  }, [noOfPages, availablePageNumbers, currentStep])

  // sets the available number of pages when PDF loads
  const handleLoadSuccess = useCallback((document: PDFDocumentProxy) => {
    setNoOfPages(document.numPages)
  }, [])

  // change the active page to the first index of the available pages
  useEffect(() => {
    if (availablePageNumbers.length) setStep(availablePageNumbers[0])
  }, [availablePageNumbers])

  // handles navigating to the previous page based on available pages if present
  const handlePreviousPage = useCallback(() => {
    if (!availablePageNumbers.length) {
      goToPrevStep()
    }
    else if (availablePageNumbers.length && isFirstAvailable) {
      const activePageIndex = availablePageNumbers.findIndex((page: number) => page === currentStep)
      setStep(availablePageNumbers[activePageIndex - 1])
    }
  }, [availablePageNumbers, noOfPages, currentStep])

  // handles navigating to the next page based on available pages if present
  const handleNextPage = useCallback(() => {
    if (!availablePageNumbers.length) {
      goToNextStep()
    }
    else if (availablePageNumbers.length && isLastAvailable) {
      const activePageIndex = availablePageNumbers.findIndex((page: number) => page === currentStep)
      setStep(availablePageNumbers[activePageIndex + 1])
    }
  }, [availablePageNumbers, noOfPages, currentStep])

  return (
    <>
      <Dialog open={isOpen} onOpenChange={toggleOpen}>
        {file && (
          <DialogContent className='size-fit group'>
            <DialogHeader>
              <DialogTitle className='flex gap-3'>
                {file.name} {!showSearchInput && <LuSearch onClick={() => toggleShowSearchInput()} className='flex' role='button' />}
              </DialogTitle>
              {showSearchInput && (
                <Suspense fallback={<InlineSpinner />}>
                  <SearchThroughPDF toggleClose={toggleShowSearchInput} fileName={file.name} setAvailablePageNumbers={setAvailablePageNumbers} />
                </Suspense>
              )}
            </DialogHeader>
            {file && (
              <Document file={file.preview} onLoadSuccess={handleLoadSuccess} onLoadError={console.error}>
                <Page
                  key={`page-${currentStep}`}
                  pageNumber={currentStep}
                  // scale={0.92}   // scale the Page
                  height={window.innerHeight * 0.80}
                  renderTextLayer={true}
                  renderAnnotationLayer={false}
                />
              </Document>
            )}
            {noOfPages && (
              <DialogFooter>
                <div className="absolute bottom-[2%] left-1/2 bg-white dark:text-tan-1000 opacity-0 transition-opacity -translate-x-1/2 shadow-2xl rounded-lg z-10 group-hover:opacity-100">
                  <button className="size-11 bg-white hover:bg-neutral-300 text-xl rounded-l-2xl" onClick={handlePreviousPage} disabled={!canGoToPrevStep || !isFirstAvailable} type="button">‹</button>
                  <span className='px-4'>{currentStep} of {noOfPages}</span>
                  <button className='size-11 bg-white hover:bg-neutral-300 text-xl rounded-r-2xl disabled:opacity-90' onClick={handleNextPage} disabled={!canGoToNextStep || !isLastAvailable} type="button">›</button>
                </div>
              </DialogFooter>
            )}
          </DialogContent>
        )}
      </Dialog>
    </>
  )
}

export default FilePreviewer

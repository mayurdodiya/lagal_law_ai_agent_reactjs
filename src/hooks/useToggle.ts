

import { useCallback, useState } from 'react'

export const useToggle = (defaultVal = false) => {
  const [isTrue, setIsTrue] = useState(defaultVal)

  const toggle = useCallback(() => {
    setIsTrue((preValue: boolean) => !preValue)
  }, [])

  return { isTrue, toggle, setIsTrue }
}
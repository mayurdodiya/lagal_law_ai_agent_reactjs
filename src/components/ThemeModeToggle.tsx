import React from 'react'
import { useTheme } from "next-themes"
import { LuMoon, LuSun } from "react-icons/lu"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from '@/lib/utils'

const ThemeModeToggle = () => {
  const { setTheme, theme } = useTheme()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <LuSun className="size-5 rotate-0 scale-100 transition-all dark:scale-0" />
          <LuMoon className="absolute size-5 scale-0 transition-all dark:scale-100 dark:stroke-white" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")} className={cn({ "bg-tan-100 dark:bg-tan-900": theme === 'light' })}>
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")} className={cn({ "bg-tan-100 dark:bg-tan-900": theme === 'dark' })}>
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")} className={cn({ "bg-tan-100 dark:bg-tan-900": theme === 'system' })}>
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default ThemeModeToggle
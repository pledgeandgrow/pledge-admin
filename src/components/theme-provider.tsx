"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider, ThemeProviderProps as NextThemeProviderProps } from "next-themes"

// Use the types from next-themes directly
type ThemeProviderProps = React.PropsWithChildren<NextThemeProviderProps>

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}

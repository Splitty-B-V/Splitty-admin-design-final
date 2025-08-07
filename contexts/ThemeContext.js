import { createContext, useContext, useState, useEffect } from 'react'

const ThemeContext = createContext()

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

export function ThemeProvider({ children }) {
  const [darkMode, setDarkMode] = useState(false)

  // Load theme on mount - Default to light mode
  useEffect(() => {
    const savedTheme = localStorage.getItem('splitty-theme')
    // Default to light mode if no saved preference
    const isDark = savedTheme ? savedTheme === 'dark' : false
    setDarkMode(isDark)
    applyTheme(isDark)
  }, [])

  const applyTheme = (isDark) => {
    if (typeof document !== 'undefined') {
      if (isDark) {
        document.body.classList.remove('light')
        document.body.classList.add('dark')
      } else {
        document.body.classList.remove('dark')
        document.body.classList.add('light')
      }
    }
  }

  const setTheme = (isDark) => {
    setDarkMode(isDark)
    applyTheme(isDark)
    localStorage.setItem('splitty-theme', isDark ? 'dark' : 'light')
  }

  const toggleTheme = () => {
    setTheme(!darkMode)
  }

  return (
    <ThemeContext.Provider value={{ darkMode, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}
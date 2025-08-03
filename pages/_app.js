import '../styles/globals.css'
import { useEffect } from 'react'
import { UsersProvider } from '../contexts/UsersContext'
import { RestaurantsProvider } from '../contexts/RestaurantsContext'

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    // Check for saved theme preference or OS dark mode preference
    try {
      const savedTheme = localStorage.getItem('splitty-theme')
      const systemDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches
      
      if (savedTheme === 'dark' || (!savedTheme && systemDarkMode)) {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    } catch (e) {
      console.error('Failed to restore dark mode preference:', e)
    }
  }, [])

  return (
    <RestaurantsProvider>
      <UsersProvider>
        <Component {...pageProps} />
      </UsersProvider>
    </RestaurantsProvider>
  )
}

export default MyApp
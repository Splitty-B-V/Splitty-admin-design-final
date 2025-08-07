import '../styles/globals.css'
import { UsersProvider } from '../contexts/UsersContext'
import { RestaurantsProvider } from '../contexts/RestaurantsContext'
import { ThemeProvider } from '../contexts/ThemeContext'

function MyApp({ Component, pageProps }) {
  return (
    <ThemeProvider>
      <RestaurantsProvider>
        <UsersProvider>
          <Component {...pageProps} />
        </UsersProvider>
      </RestaurantsProvider>
    </ThemeProvider>
  )
}

export default MyApp
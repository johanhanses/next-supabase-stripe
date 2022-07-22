import '../styles/globals.css'
import type { AppProps } from 'next/app'
import UserProvider from '../context/user'
import { Nav } from '../components/nav'
import Footer from '../components/Footer'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <UserProvider>
      <div className="flex flex-col min-h-screen justify-between">
        <div>
          <Nav />
          <Component {...pageProps} />
        </div>
        <Footer />
      </div>
    </UserProvider>
  )
}

export default MyApp

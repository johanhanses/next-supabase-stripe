import { useEffect } from 'react'
import { useUser } from '../context/user'

export default function Logout() {
  const { logout } = useUser()

  useEffect(() => {
    logout()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <main className="w-full max-w-3xl mx-auto my-16 px-2">
      <p>Logging out</p>
    </main>
  )
}

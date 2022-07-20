import { useEffect } from 'react'
import { useUser } from '../context/user'

export default function Login() {
  const { login } = useUser()

  useEffect(() => {
    login()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <main className="w-full max-w-3xl mx-auto my-16 px-2">
      <p>Logging in</p>
    </main>
  )
}

import Link from 'next/link'
import { useUser } from '../context/user'

export const Nav = () => {
  const { user, isLoading } = useUser()

  return (
    <nav className="flex py-4 px-6 border-b border-gray-200">
      <Link href="/">
        <a className="hover:text-gray-500">Home</a>
      </Link>
      {!!user && (
        <Link href="/dashboard">
          <a className="ml-2 hover:text-gray-500">Dashboard</a>
        </Link>
      )}
      <Link href="/pricing">
        <a className="ml-2 hover:text-gray-500">Pricing</a>
      </Link>
      <Link href="/about">
        <a className="ml-2 hover:text-gray-500">About</a>
      </Link>

      <div className="ml-auto">
        {user ? (
          <Link href="/logout">
            <a>Logout</a>
          </Link>
        ) : (
          <Link href="/login">
            <a>Login</a>
          </Link>
        )}
      </div>
    </nav>
  )
}

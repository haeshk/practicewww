import Link from 'next/link'
import { cookies } from 'next/headers'
import { logout } from '../actions/auth'

export default async function Header() {
  const cookieStore = await cookies()
  const isLoggedIn = cookieStore.has('session')

  return (
    <header className="bg-gray-900 border-b border-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        
        {/* Логотип */}
        <Link href="/" className="text-xl font-bold text-blue-500">
          Вояж
        </Link>

        {/* Навигация по центру */}
        <nav className="flex gap-6">
          <Link href="/" className="hover:text-blue-400 transition-colors">
            Общая коллекция
          </Link>
          <Link href="/my-collection" className="hover:text-blue-400 transition-colors">
            Моя коллекция
          </Link>
        </nav>

        {/* Кнопка входа/выхода справа */}
        <div>
          {isLoggedIn ? (
            <form action={logout}>
              <button type="submit" className="text-red-400 hover:text-red-300 font-medium">
                Выйти
              </button>
            </form>
          ) : (
            <Link href="/login" className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md font-medium transition-colors">
              Войти
            </Link>
          )}
        </div>

      </div>
    </header>
  )
}
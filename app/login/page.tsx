'use client'

import { useState } from 'react'
import { login } from '../actions/auth'
import Link from 'next/link'

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(formData: FormData) {
    const result = await login(formData)
    if (result?.error) {
      setError(result.error)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-96">
        <h1 className="text-2xl font-bold mb-6 text-center">Вход в систему</h1>
        
        {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}

        <form action={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input 
              type="email" 
              name="email" 
              required 
              className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:border-blue-500"
              placeholder="test@test.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Пароль</label>
            <input 
              type="password" 
              name="password" 
              required 
              className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:border-blue-500"
              placeholder="123456"
            />
          </div>
          <button 
            type="submit" 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors mt-2"
          >
            Войти
          </button>
        </form>

        <div className="mt-4 text-center text-sm text-gray-400">
          <p>Тестовый аккаунт: test@test.com / 123456</p>
          <Link href="/" className="text-blue-400 hover:underline mt-2 block">
            Вернуться на главную
          </Link>
        </div>
      </div>
    </div>
  )
}
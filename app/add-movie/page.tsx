'use client'

import { useState, useEffect } from 'react'
import { addNewMovie } from '../actions/auth'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function AddMoviePage() {
  const router = useRouter()
  const [genres, setGenres] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/genres').then(res => res.json()).then(data => setGenres(data))
  }, [])

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError(null)
    const result = await addNewMovie(formData)
    setLoading(false)
    
    if (result.success) {
      router.push('/')
      router.refresh()
    } else {
      setError(result.error || 'Что-то пошло не так')
    }
  }

  return (
    <main className="p-8 max-w-2xl mx-auto min-h-screen">
      <Link href="/" className="text-blue-400 hover:text-blue-300 mb-6 inline-block">← Назад</Link>
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg border border-gray-700">
        <h1 className="text-2xl font-bold text-white mb-6">Добавить новый фильм</h1>
        {error && <p className="text-red-400 mb-4">{error}</p>}
        
        <form action={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Название фильма *</label>
            <input type="text" name="title" required className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:border-blue-500 focus:outline-none" />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Год</label>
              <input type="number" name="year" className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:border-blue-500 focus:outline-none" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Рейтинг (1-10)</label>
              <input type="number" name="rating" min="1" max="10" className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:border-blue-500 focus:outline-none" />
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">Жанр *</label>
            <select name="genreId" required className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:border-blue-500 focus:outline-none">
              <option value="">Выберите жанр</option>
              {genres.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">Ссылка на постер (необязательно)</label>
            <input type="text" name="posterUrl" placeholder="/posters/matrix.jpg" className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:border-blue-500 focus:outline-none" />
          </div>

          <button type="submit" disabled={loading} className="mt-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded transition-colors disabled:opacity-50">
            {loading ? 'Сохранение...' : 'Добавить фильм'}
          </button>
        </form>
      </div>
    </main>
  )
}
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import MoviePickerModal from '../../components/MoviePickerModal'
import { removeMovieFromCollection } from '../../actions/auth'

export default function CollectionPage() {
  const params = useParams()
  const collectionId = parseInt(params.id as string)

  const [collection, setCollection] = useState<any>(null)
  const [allMovies, setAllMovies] = useState<any[]>([])
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    const loadData = async () => {
      const res = await fetch(`/api/collection/${collectionId}`)
      if (res.ok) {
        const data = await res.json()
        setCollection(data.collection)
        setAllMovies(data.allMovies)
      }
    }
    loadData()
  }, [collectionId])

  if (!collection) return <div className="text-white p-8">Загрузка...</div>

  return (
    <main className="p-8 max-w-7xl mx-auto min-h-screen">
      <div className="mb-8">
        <Link href="/my-collection" className="text-blue-400 hover:text-blue-300 mb-4 inline-block">
          ← Назад к коллекциям
        </Link>
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-white">📂 {collection.name}</h1>
          <button 
            onClick={() => setShowModal(true)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-md font-medium transition-colors"
          >
            + Добавить фильмы
          </button>
        </div>
        <p className="text-gray-400 mt-2">Фильмов в коллекции: {collection.movies.length}</p>
      </div>

      {collection.movies.length === 0 ? (
        <div className="text-center p-12 bg-gray-800 rounded-lg border border-gray-700">
          <p className="text-gray-400 mb-4">В этой коллекции пока нет фильмов.</p>
          <button 
            onClick={() => setShowModal(true)}
            className="text-blue-400 hover:text-blue-300 underline"
          >
            Добавить первый фильм
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {collection.movies.map((movie: any) => (
            <div key={movie.id} className="relative border border-gray-700 p-4 rounded-lg bg-gray-800 text-white flex flex-col shadow-lg">
              {movie.posterUrl ? (
                <img src={movie.posterUrl} alt={movie.title} className="w-full h-64 object-cover rounded-md mb-4" />
              ) : (
                <div className="w-full h-64 bg-gray-700 flex items-center justify-center rounded-md mb-4 text-gray-400">Нет постера</div>
              )}
              <button 
                onClick={async (e) => {
                  e.preventDefault();
                  if(confirm('Удалить из коллекции?')) {
                    await removeMovieFromCollection(movie.id);
                    window.location.reload();
                  }
                }}
                className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white p-1 rounded-full text-xs"
              >
                ✕
              </button>
              <h3 className="text-xl font-semibold mb-2">{movie.title} ({movie.year})</h3>
              <p className="text-gray-400 text-sm mb-1">Жанр: {movie.genre?.name || 'Не указан'}</p>
              <p className="text-gray-400 text-sm mb-3">Рейтинг: {movie.rating} / 10</p>
              <p className="mt-auto font-medium">{movie.watched ? 'Просмотрено' : ' Не просмотрено'}</p>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <MoviePickerModal 
          collectionId={collectionId} 
          allMovies={allMovies} 
          onClose={() => setShowModal(false)} 
        />
      )}
    </main>
  )
}
'use client'

import { useState } from 'react'
import { addMoviesToCollection } from '../actions/auth'

export default function MoviePickerModal({ 
  collectionId, 
  allMovies, 
  onClose 
}: { 
  collectionId: number, 
  allMovies: any[], 
  onClose: () => void 
}) {
  const [search, setSearch] = useState('')
  const [selectedIds, setSelectedIds] = useState<number[]>([])
  const [loading, setLoading] = useState(false)

  const filteredMovies = allMovies.filter(m => 
    m.title.toLowerCase().includes(search.toLowerCase())
  )

  const toggleSelect = (id: number) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(mid => mid !== id))
    } else {
      setSelectedIds([...selectedIds, id])
    }
  }

  const handleAdd = async () => {
    if (selectedIds.length === 0) return
    setLoading(true)
    const result = await addMoviesToCollection(collectionId, selectedIds)
    setLoading(false)
    
    if (result.success) {
      window.location.reload() // Перезагружаем страницу, чтобы увидеть новые фильмы
    } else {
      alert(result.error)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col border border-gray-700">
        
        
        <div className="p-6 border-b border-gray-700 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white">Выберите фильмы</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl leading-none">&times;</button>
        </div>

       
        <div className="p-4 border-b border-gray-700">
          <input 
            type="text" 
            placeholder="Поиск по названию..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full p-3 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-blue-500"
          />
        </div>

        
        <div className="p-6 overflow-y-auto flex-grow">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {filteredMovies.map(movie => {
              const isSelected = selectedIds.includes(movie.id)
              return (
                <div 
                  key={movie.id}
                  onClick={() => toggleSelect(movie.id)}
                  className={`cursor-pointer rounded-lg p-2 border-2 transition-all flex flex-col relative ${
                    isSelected ? 'border-blue-500 bg-gray-700' : 'border-transparent bg-gray-800 hover:bg-gray-700'
                  }`}
                >

                  {isSelected && (
                    <div className="absolute top-2 right-2 bg-blue-500 rounded-full p-1 z-10">
                      <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                  
                  {movie.posterUrl ? (
                    <img src={movie.posterUrl} alt={movie.title} className="w-full h-48 object-cover rounded-md mb-2" />
                  ) : (
                    <div className="w-full h-48 bg-gray-700 flex items-center justify-center rounded-md mb-2 text-gray-400 text-sm">Нет постера</div>
                  )}
                  <h3 className="text-white font-medium text-sm line-clamp-2">{movie.title}</h3>
                  <p className="text-gray-400 text-xs mt-auto">{movie.year}</p>
                </div>
              )
            })}
          </div>
          {filteredMovies.length === 0 && (
            <p className="text-center text-gray-400 mt-8">Ничего не найдено.</p>
          )}
        </div>

        <div className="p-4 border-t border-gray-700 flex justify-between items-center bg-gray-800">
          <p className="text-gray-400">Выбрано: {selectedIds.length}</p>
          <div className="flex gap-4">
            <button onClick={onClose} className="px-6 py-2 text-gray-400 hover:text-white transition-colors">
              Отмена
            </button>
            <button 
              onClick={handleAdd}
              disabled={selectedIds.length === 0 || loading}
              className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-2 rounded font-medium transition-colors"
            >
              {loading ? 'Добавление...' : 'Добавить выбранные'}
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}
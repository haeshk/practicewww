'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createCollection, deleteCollection, renameCollection } from '../actions/auth'
import { useRouter } from 'next/navigation'

export default function MyCollectionPage() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null)
  const [collections, setCollections] = useState<any[]>([])
  const router = useRouter()

  // Состояния для модальных окон
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showMenuId, setShowMenuId] = useState<number | null>(null) // Какое меню открыто
  const [showRenameModal, setShowRenameModal] = useState<{ id: number, name: string } | null>(null)

  useEffect(() => {
    const checkAuth = async () => {
      const res = await fetch('/api/check-auth')
      const data = await res.json()
      setIsLoggedIn(data.isLoggedIn)
      
      if (data.isLoggedIn) {
        const colRes = await fetch('/api/collections')
        const colData = await colRes.json()
        setCollections(colData)
      }
    }
    checkAuth()
  }, [])

  async function handleCreate(formData: FormData) {
    const result = await createCollection(formData)
    if (result.success) {
      setShowCreateModal(false)
      router.refresh()
      window.location.reload()
    } else {
      alert(result.error)
    }
  }

  async function handleDelete(id: number) {
    if (confirm('Вы уверены, что хотите удалить эту коллекцию?')) {
      const result = await deleteCollection(id)
      if (result.success) {
        setShowMenuId(null)
        window.location.reload()
      } else {
        alert(result.error)
      }
    }
  }

  async function handleRename(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!showRenameModal) return
    const formData = new FormData(e.currentTarget)
    const newName = formData.get('name') as string
    
    const result = await renameCollection(showRenameModal.id, newName)
    if (result.success) {
      setShowRenameModal(null)
      window.location.reload()
    } else {
      alert(result.error)
    }
  }

  if (isLoggedIn === null) return <div className="text-white text-center p-8">Загрузка...</div>

  return (
    <main className="p-8 max-w-7xl mx-auto min-h-screen" onClick={() => setShowMenuId(null)}>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">📁 Мои коллекции</h1>
        
        <button 
          onClick={() => setShowCreateModal(true)}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-md font-medium transition-colors"
        >
          + Создать коллекцию
        </button>
      </div>

      {collections.length === 0 ? (
        <p className="text-gray-400">У вас пока нет коллекций. Создайте первую!</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {collections.map((col) => (
            <div key={col.id} className="relative bg-gray-800 rounded-lg shadow-lg border border-gray-700 hover:bg-gray-700 transition-colors h-40 flex flex-col items-center justify-center">
              
              
              <Link href={`/my-collection/${col.id}`} className="flex flex-col items-center justify-center w-full h-full">
                <span className="text-4xl mb-2">📂</span>
                <h3 className="text-xl font-semibold text-white text-center px-4">{col.name}</h3>
              </Link>


              <div className="absolute top-2 right-2">
                <button 
                  onClick={(e) => {
                    e.preventDefault(); // Чтобы не переходить по ссылке карточки
                    e.stopPropagation(); // Чтобы не закрылось меню сразу
                    setShowMenuId(showMenuId === col.id ? null : col.id);
                  }}
                  className="p-1 text-gray-400 hover:text-white rounded-full hover:bg-gray-600"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                  </svg>
                </button>
              </div>


              {showMenuId === col.id && (
                <div className="absolute top-10 right-2 bg-gray-900 border border-gray-600 rounded-md shadow-xl z-10 w-40 overflow-hidden">
                  <button 
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setShowRenameModal({ id: col.id, name: col.name });
                      setShowMenuId(null);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
                  >
                    Изменить название
                  </button>
                  <button 
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleDelete(col.id);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-700 hover:text-red-300"
                  >
                    Удалить
                  </button>
                </div>
              )}

            </div>
          ))}
        </div>
      )}


      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={() => setShowCreateModal(false)}>
          <div className="bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-md border border-gray-700" onClick={e => e.stopPropagation()}>
            {!isLoggedIn ? (
              <div className="text-center">
                <h2 className="text-xl font-bold text-white mb-4">Требуется вход</h2>
                <div className="flex gap-4 justify-center">
                  <button onClick={() => setShowCreateModal(false)} className="text-gray-400 hover:text-white">Отмена</button>
                  <Link href="/login" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md">Войти</Link>
                </div>
              </div>
            ) : (
              <>
                <h2 className="text-xl font-bold text-white mb-4">Новая коллекция</h2>
                <form action={handleCreate} className="flex flex-col gap-4">
                  <input type="text" name="name" required placeholder="Название" className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-emerald-500" />
                  <div className="flex justify-end gap-2 mt-2">
                    <button type="button" onClick={() => setShowCreateModal(false)} className="px-4 py-2 text-gray-400 hover:text-white">Отмена</button>
                    <button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded">Создать</button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      )}


      {showRenameModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={() => setShowRenameModal(null)}>
          <div className="bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-md border border-gray-700" onClick={e => e.stopPropagation()}>
            <h2 className="text-xl font-bold text-white mb-4">Переименовать</h2>
            <form onSubmit={handleRename} className="flex flex-col gap-4">
              <input 
                type="text" 
                name="name" 
                defaultValue={showRenameModal.name} 
                required 
                className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-blue-500" 
              />
              <div className="flex justify-end gap-2 mt-2">
                <button type="button" onClick={() => setShowRenameModal(null)} className="px-4 py-2 text-gray-400 hover:text-white">Отмена</button>
                <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">Сохранить</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  )
}
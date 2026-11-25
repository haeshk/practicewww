import { PrismaClient } from '../generated/prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import Link from 'next/link';

const adapter = new PrismaBetterSqlite3({ url: 'file:./dev.db' });
const prisma = new PrismaClient({ adapter });

export default async function Home() {
  const movies = await prisma.movie.findMany({
    include: {
      genre: true,
    },
  });

  return (
    <main className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
  <h1 className="text-3xl font-bold text-white">Общая база фильмов</h1>
  <Link href="/add-movie" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors">
    + Добавить фильм
  </Link>
</div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {movies.map((movie) => (
          <div key={movie.id} className="border border-gray-700 p-4 rounded-lg bg-gray-800 text-white flex flex-col shadow-lg">
            
            {movie.posterUrl ? (
              <img 
                src={movie.posterUrl} 
                alt={movie.title} 
                className="w-full h-64 object-cover rounded-md mb-4" 
              />
            ) : (
              <div className="w-full h-64 bg-gray-700 flex items-center justify-center rounded-md mb-4 text-gray-400">
                Нет постера
              </div>
            )}

            <h2 className="text-xl font-semibold mb-2">{movie.title} ({movie.year})</h2>
            <p className="text-gray-400 text-sm mb-1">Жанр: {movie.genre?.name || 'Не указан'}</p>
            <p className="text-gray-400 text-sm mb-3">Рейтинг: {movie.rating} / 10</p>
            <p className="mt-auto font-medium">
              {movie.watched ? 'Просмотрено' : 'Не просмотрено'}
            </p>
          </div>
        ))}
      </div>
    </main>
  );
}
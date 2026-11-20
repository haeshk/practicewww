import { NextResponse } from 'next/server'
import { PrismaClient } from '../../../../generated/prisma/client'
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'

const adapter = new PrismaBetterSqlite3({ url: 'file:./dev.db' })
const prisma = new PrismaClient({ adapter })

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params
  const collectionId = parseInt(resolvedParams.id)

  const collection = await prisma.collection.findUnique({
    where: { id: collectionId },
    include: {
      movies: {
        include: { genre: true }
      }
    }
  })

  // Загружаем ВСЕ фильмы, которых ЕЩЕ НЕТ в этой коллекции
  const allMovies = await prisma.movie.findMany({
    where: {
      OR: [
        { collectionId: null },
        { collectionId: { not: collectionId } }
      ]
    }
  })

  return NextResponse.json({ collection, allMovies })
}
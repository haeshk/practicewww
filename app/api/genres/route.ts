import { NextResponse } from 'next/server'
import { PrismaClient } from '../../../generated/prisma/client'
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'

const adapter = new PrismaBetterSqlite3({ url: 'file:./dev.db' })
const prisma = new PrismaClient({ adapter })

export async function GET() {
  const genres = await prisma.genre.findMany()
  return NextResponse.json(genres)
}
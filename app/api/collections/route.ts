import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { PrismaClient } from '../../../generated/prisma/client'
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'
import { jwtVerify } from 'jose'

const adapter = new PrismaBetterSqlite3({ url: 'file:./dev.db' })
const prisma = new PrismaClient({ adapter })
const JWT_SECRET = new TextEncoder().encode('super-secret-key-for-study')

export async function GET() {
  const cookieStore = await cookies()
  const token = cookieStore.get('session')?.value
  
  if (!token) return NextResponse.json([])

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET)
    const userId = payload.userId as number
    const collections = await prisma.collection.findMany({ where: { userId } })
    return NextResponse.json(collections)
  } catch {
    return NextResponse.json([])
  }
}
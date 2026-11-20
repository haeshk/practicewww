'use server'

import { cookies } from 'next/headers'
import { PrismaClient } from '../../generated/prisma/client'
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'
import { redirect } from 'next/navigation'
import { SignJWT, jwtVerify } from 'jose'
import { revalidatePath } from 'next/cache'

const adapter = new PrismaBetterSqlite3({ url: 'file:./dev.db' })
const prisma = new PrismaClient({ adapter })

const JWT_SECRET = new TextEncoder().encode('super-secret-key-for-study')

// 1. Вход
export async function login(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const user = await prisma.user.findUnique({
    where: { email },
  })

  if (!user || user.passwordHash !== password) {
    return { error: 'Неверный email или пароль' }
  }

  const token = await new SignJWT({ userId: user.id, email: user.email })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('1d')
    .sign(JWT_SECRET)

  const cookieStore = await cookies()
  cookieStore.set('session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24,
    path: '/',
  })

  redirect('/')
}

// 2. Выход
export async function logout() {
  const cookieStore = await cookies()
  cookieStore.delete('session')
  redirect('/login')
}

// 3. Создание коллекции
export async function createCollection(formData: FormData) {
  const name = formData.get('name') as string
  const cookieStore = await cookies()
  const token = cookieStore.get('session')?.value

  if (!token) return { error: 'Вы не авторизованы' }

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET)
    const userId = payload.userId as number

    await prisma.collection.create({
      data: {
        name: name,
        userId: userId,
      },
    })
    
    revalidatePath('/my-collection')
    return { success: true }
  } catch (error) {
    return { error: 'Ошибка при создании коллекции' }
  }
}

// 4. Удаление коллекции
export async function deleteCollection(id: number) {
  const cookieStore = await cookies()
  const token = cookieStore.get('session')?.value
  if (!token) return { error: 'Нет доступа' }

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET)
    const userId = payload.userId as number

    await prisma.collection.delete({
      where: { id, userId },
    })
    revalidatePath('/my-collection')
    return { success: true }
  } catch (error) {
    return { error: 'Ошибка при удалении' }
  }
}

// 5. Переименование коллекции
export async function renameCollection(id: number, newName: string) {
  const cookieStore = await cookies()
  const token = cookieStore.get('session')?.value
  if (!token) return { error: 'Нет доступа' }

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET)
    const userId = payload.userId as number

    await prisma.collection.update({
      where: { id, userId },
      data: { name: newName },
    })
    revalidatePath('/my-collection')
    return { success: true }
  } catch (error) {
    return { error: 'Ошибка при переименовании' }
  }
}

// 6. Добавление фильмов в коллекцию
export async function addMoviesToCollection(collectionId: number, movieIds: number[]) {
  const cookieStore = await cookies()
  const token = cookieStore.get('session')?.value
  if (!token) return { error: 'Нет доступа' }

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET)
    const userId = payload.userId as number

    // Проверяем, принадлежит ли коллекция пользователю
    const collection = await prisma.collection.findUnique({
      where: { id: collectionId, userId }
    })
    
    if (!collection) return { error: 'Коллекция не найдена' }

    // Привязываем фильмы к коллекции
    await prisma.movie.updateMany({
      where: { id: { in: movieIds } },
      data: { collectionId: collectionId }
    })

    revalidatePath(`/my-collection/${collectionId}`)
    return { success: true }
  } catch (error) {
    return { error: 'Ошибка при добавлении фильмов' }
  }
}
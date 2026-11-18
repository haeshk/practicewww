import { PrismaClient } from '../generated/prisma/client'
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'

const adapter = new PrismaBetterSqlite3({ url: 'file:./dev.db' })
const prisma = new PrismaClient({ adapter })

async function main() {
  // 1. Создаем тестового пользователя
  const user = await prisma.user.upsert({
    where: { email: 'test@test.com' },
    update: {},
    create: {
      email: 'test@test.com',
      passwordHash: '123456', // В реальном проекте тут должен быть хэш, но для учебы пока сойдет
    },
  })

  // 2. Создаем первую коллекцию для этого пользователя
  const collection = await prisma.collection.create({
    data: {
      name: 'Моя коллекция',
      userId: user.id,
    },
  })

  // 3. Создаем жанры
  const dystopia = await prisma.genre.upsert({
    where: { name: 'Антиутопия' },
    update: {},
    create: { name: 'Антиутопия' },
  })
  const horror = await prisma.genre.upsert({
    where: { name: 'Ужасы' },
    update: {},
    create: { name: 'Ужасы' },
  })
  const sciFi = await prisma.genre.upsert({
    where: { name: 'Фантастика' },
    update: {},
    create: { name: 'Фантастика' },
  })

  // 4. Создаем фильмы и сразу привязываем их к коллекции
  await prisma.movie.createMany({
    data: [
      { title: 'Матрица', year: 1999, rating: 9, watched: true, genreId: dystopia.id, posterUrl: '/posters/matrix.jpg', collectionId: collection.id },
      { title: 'Бегущий по лезвию 2049', year: 2017, rating: 8, watched: false, genreId: dystopia.id, posterUrl: '/posters/images.jpg', collectionId: collection.id },
      { title: 'Голодные игры', year: 2012, rating: 7, watched: true, genreId: dystopia.id, posterUrl: '/posters/The_Hunger_Games.jpg', collectionId: collection.id },
      { title: 'V — значит Вендетта', year: 2005, rating: 9, watched: true, genreId: dystopia.id, posterUrl: '/posters/images (1).jpg', collectionId: collection.id },
      { title: 'Дивергент', year: 2014, rating: 6, watched: false, genreId: dystopia.id, posterUrl: '/posters/Divergent.jpg', collectionId: collection.id },
      
      { title: 'Сияние', year: 1980, rating: 9, watched: true, genreId: horror.id, posterUrl: '/posters/The-Shining.jpg', collectionId: collection.id },
      { title: 'Оно', year: 2017, rating: 7, watched: false, genreId: horror.id, posterUrl: '/posters/it.jpg', collectionId: collection.id },
      { title: 'Звонок', year: 2002, rating: 8, watched: true, genreId: horror.id, posterUrl: '/posters/Rings.jpg', collectionId: collection.id },
      
      { title: 'Назад в будущее', year: 1985, rating: 9, watched: true, genreId: sciFi.id, posterUrl: '/posters/images (2).jpg', collectionId: collection.id },
      { title: 'Интерстеллар', year: 2014, rating: 9, watched: false, genreId: sciFi.id, posterUrl: '/posters/interstellar.jpg', collectionId: collection.id },
      { title: 'Терминатор 2', year: 1991, rating: 9, watched: true, genreId: sciFi.id, posterUrl: '/posters/tern.jpg', collectionId: collection.id },
    ],
  })
  
  console.log('База успешно наполнена тестовыми данными!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
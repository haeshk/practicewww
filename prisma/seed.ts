import { PrismaClient } from '../generated/prisma/client'
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'

const adapter = new PrismaBetterSqlite3({ url: 'file:./dev.db' })
const prisma = new PrismaClient({ adapter })

async function main() {
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

  await prisma.movie.createMany({
    data: [
      { title: 'Матрица', year: 1999, rating: 9, watched: true, genreId: dystopia.id, posterUrl: '/posters/matrix.jpg' },
      { title: 'Бегущий по лезвию 2049', year: 2017, rating: 8, watched: false, genreId: dystopia.id, posterUrl: '/posters/images.jpg' },
      { title: 'Голодные игры', year: 2012, rating: 7, watched: true, genreId: dystopia.id, posterUrl: '/posters/The_Hunger_Games.jpg' },
      { title: 'V — значит Вендетта', year: 2005, rating: 9, watched: true, genreId: dystopia.id, posterUrl: '/posters/images (1).jpg' },
      { title: 'Дивергент', year: 2014, rating: 6, watched: false, genreId: dystopia.id, posterUrl: '/posters/Divergent.jpg' },
      
      { title: 'Сияние', year: 1980, rating: 9, watched: true, genreId: horror.id, posterUrl: '/posters/The-Shining.jpg' },
      { title: 'Оно', year: 2017, rating: 7, watched: false, genreId: horror.id, posterUrl: '/posters/it.jpg' },
      { title: 'Звонок', year: 2002, rating: 8, watched: true, genreId: horror.id, posterUrl: '/posters/Rings.jpg' },
      
      { title: 'Назад в будущее', year: 1985, rating: 9, watched: true, genreId: sciFi.id, posterUrl: '/posters/images (2).jpg' },
      { title: 'Интерстеллар', year: 2014, rating: 9, watched: false, genreId: sciFi.id, posterUrl: '/posters/interstellar.jpg' },
      { title: 'Терминатор 2', year: 1991, rating: 9, watched: true, genreId: sciFi.id, posterUrl: '/posters/tern.jpg' },
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
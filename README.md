# База фильмов (Movie Collection)

Учебный проект по практике. Веб-приложение для создания личной коллекции фильмов.

## Технологии
- Next.js (App Router)
- TypeScript
- Tailwind CSS (стилизация)
- Prisma ORM
- SQLite (база данных)
- JWT + Cookies (авторизация)

## Запуск проекта

1. Клонируем:
   ```bash
   git clone -b develop https://github.com/haeshk/practicewww.git .

2. Примените миграции базы данных и сгенерируйте Prisma Client:
    ```bash
    npm install prisma@7 --save-dev
    npm install

3. Проверяем ветку.
    ```bash
    git checkout develop
    git reset --hard

4. 
    ```bash
    install @prisma/adapter-better-sqlite3 better-sqlite3

5. .env
    ```bash
    DATABASE_URL="file:./dev.db"

5. 
    ```bash
    npx prisma@7 db push

6. Наполните базу тестовыми данными (фильмы, жанры, тестовый пользователь):
    ```bash
    npm run db:seed

7. Запустите сервер разработки:
    ```bash
    npm run dev

8. Откройте http://localhost:3000 в браузере.

   # Тестовый аккаунт для входа
    Email: test@test.com
    Пароль: 123456

    ## Функционал
1. Просмотр общей базы фильмов.
2. Регистрация и авторизация (вход/выход).
3. Создание личных коллекций (папок).
4. Поиск фильмов и добавление их в свои коллекции.
5. Добавление новых фильмов в общую базу.
6. Удаление фильмов из коллекций.



import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
   datasource: {
    url: process.env["DATABASE_URL"],
    adapter: require('@prisma/adapter-better-sqlite3'),
  },
});

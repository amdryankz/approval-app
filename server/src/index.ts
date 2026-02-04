import 'dotenv/config'
import { PrismaClient } from '../prisma/generated/client'
import { PrismaPg } from '@prisma/adapter-pg'
import express from 'express'
import router from './routes'

const pool = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
export const prisma = new PrismaClient({ adapter: pool })

const app = express()

app.use(express.json())

app.use('/api', router)

app.listen(3000, () =>
  console.log(`
🚀 Server ready at: http://localhost:3000`),
)

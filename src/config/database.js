// src/config/database.js
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
console.log("✅ Prisma Client instance created successfully.");
export default prisma
import { PrismaClient } from '@prisma/client';

// Khởi tạo Prisma Client
export const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'], // Log ra các câu query SQL để dễ debug
});
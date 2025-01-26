import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler<T>(
  req: NextApiRequest, 
  res: NextApiResponse<T | { message: string }>,
  handler: (req: NextApiRequest, res: NextApiResponse<T>, prisma: PrismaClient) => Promise<void>
) {
  try {
    await handler(req, res, prisma);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  } finally {
    await prisma.$disconnect();
  }
}
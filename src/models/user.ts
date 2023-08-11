import { prisma } from '@/lib/prisma'

export const getUsers = async (
  where: { id?: number; email?: string },
  start = 0,
  end: number = start + 1,
) => {
  const users = await prisma.user.findMany({
    where: where,
    skip: start,
    take: end,
  })
  return users
}

export const addUser = async (email: string, password: string) => {
  const user = await prisma.user.create({
    data: { email: email, password: password },
  })
  return user
}

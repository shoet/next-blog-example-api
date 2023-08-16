import { User } from '@prisma/client'
import { prisma } from '@/lib/prisma'

export const getUsers = async (
  where: { id?: number; email?: string; name?: string },
  start = 0,
  end: number = start + 1,
): Promise<User[]> => {
  const users = await prisma.user.findMany({
    where: where,
    skip: start,
    take: end,
  })
  return users
}

export const addUser = async (
  email: string,
  password: string,
  name: string,
): Promise<User> => {
  const user = await prisma.user.create({
    data: { email: email, password: password, name: name },
  })
  return user
}

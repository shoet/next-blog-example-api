import * as userModel from '@/models/user'
import { withoutPassword } from '@/util/prisma'

type GetUserOptions = {
  id?: number
  email?: string
}

export const getUser = async ({ id, email }: GetUserOptions) => {
  const users = await userModel.getUsers({ id: id, email: email })
  if (users.length === 0) return undefined
  return withoutPassword(users[0])
}

export const getUserWithPassword = async ({ id, email }: GetUserOptions) => {
  const users = await userModel.getUsers({ id: id, email: email })
  if (users.length === 0) return undefined
  return users[0]
}

export const addUser = async (email: string, password: string) => {
  const user = await userModel.addUser(email, password)
  return withoutPassword(user)
}

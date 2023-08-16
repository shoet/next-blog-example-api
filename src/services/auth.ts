import { User } from '@prisma/client'
import { getUserWithPassword, addUser } from './user'
import { hashPass, compare } from '@/lib/bcrypt'
import { Unauthorized } from '@/type/error'

export type AuthedUser = Omit<User, 'password'>

export const signIn = async (
  email: string,
  password: string,
): Promise<AuthedUser> => {
  const user = await getUserWithPassword({ email: email })
  if (!user) {
    throw new Unauthorized()
  }

  const ret = await compare(password, user.password)
  if (!ret) {
    throw new Unauthorized()
  }

  // TODO: set cookie
  const { password: _, ...withoutPassword } = user
  return withoutPassword
}

export const signUp = async (
  email: string,
  password: string,
  name: string,
): Promise<void> => {
  // TODO: セキュリティからエラーレスポンスは返さない
  try {
    const hashedPassword = await hashPass(password)
    addUser(email, hashedPassword, name)
  } catch (err) {
    console.log(err)
  }
}

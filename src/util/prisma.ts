import { User } from '@prisma/client'

export const withoutPassword = (user: User) => {
  const { password, ...rest } = user
  return rest
}

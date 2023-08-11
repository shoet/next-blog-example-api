import * as bcrypt from 'bcrypt'

export async function hashPass(password: string) {
  const saltRounds = 10
  return await bcrypt.hash(password, saltRounds)
}

export * from 'bcrypt'

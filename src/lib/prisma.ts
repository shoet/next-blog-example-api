import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma =
  globalForPrisma.prisma ?? new PrismaClient({ log: ['query'] })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

// TODO: * 対応
const EXCLUDED_FIELDS = ['author']
export function parseFieldMask(
  fieldMask: string[] | undefined,
): Record<string, any> | undefined {
  if (fieldMask === undefined) return undefined

  const select: Record<string, any> = {}

  fieldMask.forEach((path) => {
    if (EXCLUDED_FIELDS.includes(path)) {
      throw new Error(`Field "${path}" is not allowed to be fetched.`)
    }

    const keys = path.split('.')
    let currentSelect = select

    keys.forEach((key, index) => {
      if (index === keys.length - 1) {
        currentSelect[key] = true
      } else {
        if (!currentSelect[key]) {
          currentSelect[key] = {}
        }
        currentSelect = currentSelect[key]
      }
    })
  })

  return select
}

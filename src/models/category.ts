import { prisma } from '@/lib/prisma'

export const selectAllCategories = async () => {
  const categories = await prisma.category.findMany({})
  return categories
}

export const insertCategory = async (name: string) => {
  const category = await prisma.category.create({
    data: { name: name },
  })
  return category
}

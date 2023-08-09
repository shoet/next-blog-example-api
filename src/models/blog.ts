import { prisma } from '@/lib/prisma'

export const getBlog = async (id: number) => {
  const blogs = await prisma.blog.findMany({ where: { id: id }, take: 1 })
  return blogs[0]
}

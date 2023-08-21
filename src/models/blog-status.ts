import { prisma } from '@/lib/prisma'

export const selectAllBlogStatuses = async () => {
  const statuses = await prisma.blogStatus.findMany({})
  return statuses
}

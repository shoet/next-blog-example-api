import { Prisma } from '@prisma/client'
import { prisma } from '@/lib/prisma'

export const getBlogs = async (
  where: { id?: number; title?: string; categoryId?: number; tag?: string },
  start = 0,
  end: number = start + 1,
) => {
  const blogs = await prisma.blog.findMany({
    where: where,
    skip: start,
    take: end,
  })
  return blogs
}

export const addBlog = async (data: Prisma.BlogCreateInput) => {
  const blog = await prisma.blog.create({ data: data })
  return blog
}

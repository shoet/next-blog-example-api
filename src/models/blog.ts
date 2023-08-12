import { Prisma } from '@prisma/client'
import { prisma } from '@/lib/prisma'

type BlogWhereProps = {
  where?: Prisma.BlogWhereInput
  start?: number
  end?: number
  select?: Prisma.BlogSelect
}

export const selectAllBlogIds = async () => {
  const blogIds = await prisma.blog.findMany({
    select: { id: true },
  })
  return blogIds
}

export const selectBlogs = async ({
  where,
  start = 0,
  end = start + 1,
  select,
}: BlogWhereProps) => {
  const blogs = await prisma.blog.findMany({
    where: where,
    skip: start,
    take: end,
    select: select,
  })
  return blogs
}

export const selectBlogCount = async ({ where }: BlogWhereProps) => {
  const count = await prisma.blog.count({ where: where })
  return count
}

export const insertBlog = async (data: Prisma.BlogCreateInput) => {
  const blog = await prisma.blog.create({ data: data })
  return blog
}
